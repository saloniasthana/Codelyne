"use client";

import { createRef, Suspense, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  InstancedRigidBodies,
  Physics,
  RigidBody,
  type InstancedRigidBodyProps,
  type RapierRigidBody,
} from "@react-three/rapier";
import { createShapes, PALETTES, seeded, type ShapeKind } from "./footerShapes";
import type { Quality } from "./useWebGL";

/** Pointer state shared between the DOM listeners and the render loop */
type PointerState = { x: number; y: number; inside: boolean; burst: boolean };

const DEPTH = 1.5; // half-thickness of the slab the shapes live in (keeps the pile flat-ish)
const SHAPE_SCALE = 1.1;
const MAX_SHAPES = 250;
const PUSHER_RADIUS = 1.5;
const PUSHER_MAX_SPEED = 45; // world units / second — keeps the pusher from tunnelling into the pile
const MAX_BODY_SPEED = 32; // safety cap so nothing can be flung out of view
const FAR_AWAY = new THREE.Vector3(0, -200, 0);

function Walls({ w, h }: { w: number; h: number }) {
  // Tall side walls so shapes flicked upward still land back in view
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Thick floor so nothing can tunnel through it */}
      <CuboidCollider args={[w / 2 + 2, 5, DEPTH + 2]} position={[0, -h / 2 - 5, 0]} />
      <CuboidCollider args={[1, h * 4, DEPTH + 2]} position={[-w / 2 - 1, h * 2, 0]} />
      <CuboidCollider args={[1, h * 4, DEPTH + 2]} position={[w / 2 + 1, h * 2, 0]} />
      <CuboidCollider args={[w / 2 + 2, h * 4, 1]} position={[0, h * 2, -DEPTH - 1]} />
      <CuboidCollider args={[w / 2 + 2, h * 4, 1]} position={[0, h * 2, DEPTH + 1]} />
    </RigidBody>
  );
}

/** One instanced group (one draw call) for every copy of a single shape type */
function ShapeGroup({
  kind,
  instances,
  colors,
  shadows,
  bodiesRef,
}: {
  kind: ShapeKind;
  instances: InstancedRigidBodyProps[];
  colors: THREE.Color[];
  shadows: boolean;
  bodiesRef: RefObject<(RapierRigidBody | null)[] | null>;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    colors.forEach((c, i) => m.setColorAt(i, c));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [colors]);

  return (
    <InstancedRigidBodies
      ref={bodiesRef}
      instances={instances}
      colliders={kind.collider}
      restitution={0.35}
      friction={0.6}
      linearDamping={0.15}
      angularDamping={0.3}
      ccd
    >
      <instancedMesh
        ref={mesh}
        args={[kind.geometry, undefined, instances.length]}
        castShadow={shadows}
        receiveShadow={shadows}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.32} metalness={0.08} envMapIntensity={0.9} />
      </instancedMesh>
    </InstancedRigidBodies>
  );
}

function Scene({
  theme,
  quality,
  pointer,
}: {
  theme: "dark" | "light";
  quality: Exclude<Quality, "off">;
  pointer: React.RefObject<PointerState>;
}) {
  const { viewport, camera } = useThree();
  const w = viewport.width;
  const h = viewport.height;
  const shadows = quality === "high";

  const shapes = useMemo(() => createShapes(SHAPE_SCALE), []);

  // The bodies are created ONCE, from the size at mount. Rebuilding them on resize
  // would leave the render loop holding freed Rapier bodies (a WASM crash); on
  // resize only the walls move, and the pile settles into the new space.
  const [initial] = useState(() => ({ w, h }));

  // Shape count is proportional to the stage width on every device, so the pile
  // looks equally full on phones, laptops and wide screens (the camera keeps the
  // stage height fixed in world units, so shapes scale with it automatically).
  // Weaker devices save power through no shadows / lower resolution instead of fewer shapes.
  // 250 on wide desktop screens (the cap), proportionally fewer on narrower ones.
  const total = Math.round(THREE.MathUtils.clamp(initial.w * 4.8, 36, MAX_SHAPES));
  // Split as evenly as possible across the shape types (e.g. 250 → 42,42,42,42,41,41)
  const counts = shapes.map((_, k) => Math.floor(total / shapes.length) + (k < total % shapes.length ? 1 : 0));

  // Starting positions: scattered above the top edge so they rain down when the footer appears
  const [layout] = useState(() => {
    const rand = seeded(7);
    return shapes.map((kind, k) =>
      Array.from({ length: counts[k] }, (_, i): InstancedRigidBodyProps => ({
        key: `${kind.name}-${i}`,
        position: [
          (rand() - 0.5) * (initial.w - 2),
          initial.h / 2 + 2 + rand() * initial.h * 2.2,
          (rand() - 0.5) * (DEPTH * 2 - 1.2),
        ],
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
      })),
    );
  });

  // Per-instance colours: teal, blue, purple and soft grey, ¼ each
  const colors = useMemo(() => {
    const pal = PALETTES[theme];
    const families = [pal.teal, pal.blue, pal.purple, pal.grey];
    const rand = seeded(42);
    return shapes.map((_, k) =>
      Array.from({ length: counts[k] }, () => {
        const list = families[Math.floor(rand() * families.length)];
        return new THREE.Color(list[Math.floor(rand() * list.length)]);
      }),
    );
    // counts is fixed after mount (derived from the initial size)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes, theme]);

  // One ref per shape group (Rapier only accepts ref objects), so the scatter impulse can reach every body
  const groupRefs = useMemo(() => shapes.map(() => createRef<(RapierRigidBody | null)[]>()), [shapes]);

  const pusher = useRef<RapierRigidBody>(null);
  const prev = useRef(new THREE.Vector3().copy(FAR_AWAY));
  const wasInside = useRef(false);
  const tmp = useMemo(
    () => ({ ndc: new THREE.Vector3(), dir: new THREE.Vector3(), point: new THREE.Vector3(), away: new THREE.Vector3() }),
    [],
  );

  const target = useMemo(() => new THREE.Vector3(), []);
  const current = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = pointer.current;
    const body = pusher.current;
    if (!body) return;
    const dt = Math.min(delta, 1 / 30);

    // Safety: cap every shape's speed, and drop any shape that escaped the box back in from the top
    for (const ref of groupRefs) {
      for (const rb of ref.current ?? []) {
        if (!rb) continue;
        const pos = rb.translation();
        if (pos.y < -h / 2 - 2 || Math.abs(pos.x) > w / 2 + 2 || Math.abs(pos.z) > DEPTH + 2) {
          rb.setTranslation({ x: (Math.random() - 0.5) * (w - 3), y: h / 2 + 3, z: 0 }, true);
          rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
          continue;
        }
        const v = rb.linvel();
        const sp = Math.hypot(v.x, v.y, v.z);
        if (sp > MAX_BODY_SPEED) {
          const k = MAX_BODY_SPEED / sp;
          rb.setLinvel({ x: v.x * k, y: v.y * k, z: v.z * k }, true);
        }
      }
    }

    if (!p.inside) {
      if (wasInside.current) body.setTranslation(FAR_AWAY, false);
      wasInside.current = false;
      return;
    }

    // Screen position -> point on the z = 0 plane the shapes sit around
    tmp.ndc.set(p.x, p.y, 0.5).unproject(camera);
    tmp.dir.copy(tmp.ndc).sub(camera.position).normalize();
    const t = -camera.position.z / tmp.dir.z;
    target.copy(camera.position).addScaledVector(tmp.dir, t);
    // Never let the pusher crush shapes against the floor — keep a shape-sized gap so they escape sideways
    target.y = Math.max(target.y, -h / 2 + PUSHER_RADIUS + 1.6 * SHAPE_SCALE);

    if (!wasInside.current) {
      // Entering: appear ABOVE the pile (never inside it), then glide to the cursor
      current.set(target.x, h / 2 + PUSHER_RADIUS + 1, 0);
      body.setTranslation(current, true);
      prev.current.copy(current);
      wasInside.current = true;
      return;
    }

    // Move toward the cursor at a capped speed so the pusher shoves shapes instead of teleporting into them
    tmp.away.copy(target).sub(current);
    const maxStep = PUSHER_MAX_SPEED * dt;
    if (tmp.away.length() > maxStep) tmp.away.setLength(maxStep);
    current.add(tmp.away);
    body.setNextKinematicTranslation(current);

    // Extra "flick": faster mouse movement throws nearby shapes harder
    const speed = tmp.point.copy(current).sub(prev.current).length() / dt;
    prev.current.copy(current);
    const burst = p.burst;
    p.burst = false;
    if (speed < 6 && !burst) return;

    // A click/tap bursts at the cursor itself; a flick pushes around the moving pusher
    const center = burst ? target : current;
    const radius = burst ? 5.5 : 3.6;
    const strength = burst ? 18 : Math.min(speed, 45) * 0.3;
    for (const ref of groupRefs) {
      for (const rb of ref.current ?? []) {
        if (!rb) continue;
        const pos = rb.translation();
        tmp.away.set(pos.x - center.x, pos.y - center.y, 0);
        const dist = tmp.away.length();
        if (dist > radius) continue;
        const falloff = 1 - dist / radius;
        if (dist > 0.0001) tmp.away.divideScalar(dist);
        tmp.away.y = Math.abs(tmp.away.y) + 0.6; // always lift a little, like being kicked up
        tmp.away.normalize().multiplyScalar(strength * falloff * rb.mass());
        rb.applyImpulse(tmp.away, true);
      }
    }
  });

  return (
    <>
      <Walls w={w} h={h} />

      <RigidBody ref={pusher} type="kinematicPosition" colliders={false} position={FAR_AWAY.toArray()}>
        <BallCollider args={[PUSHER_RADIUS]} />
      </RigidBody>

      {shapes.map((kind, k) => (
        <ShapeGroup
          key={kind.name}
          kind={kind}
          instances={layout[k]}
          colors={colors[k]}
          shadows={shadows}
          bodiesRef={groupRefs[k]}
        />
      ))}
    </>
  );
}

export default function FooterPlayground({
  theme,
  quality,
  active,
}: {
  theme: "dark" | "light";
  quality: Exclude<Quality, "off">;
  active: boolean;
}) {
  const pointer = useRef<PointerState>({ x: 0, y: 0, inside: false, burst: false });
  const box = useRef<HTMLDivElement>(null);

  const update = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointer.current.inside = true;
  };

  return (
    <div
      ref={box}
      className="absolute inset-0 touch-pan-y"
      onPointerMove={update}
      onPointerEnter={update}
      onPointerDown={(e) => {
        update(e);
        pointer.current.burst = true;
      }}
      onPointerLeave={() => (pointer.current.inside = false)}
      onPointerCancel={() => (pointer.current.inside = false)}
    >
      <Canvas
        shadows={quality === "high"}
        camera={{ position: [0, 0, 30], fov: 30 }}
        dpr={[1, quality === "high" ? 1.75 : 1.25]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={theme === "dark" ? 0.55 : 0.9} />
        <directionalLight
          position={[12, 22, 18]}
          intensity={theme === "dark" ? 2.4 : 2}
          castShadow={quality === "high"}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        {/* Soft studio reflections, built locally (no HDR download) */}
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2} position={[0, 6, 8]} scale={[20, 6, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#5b8cff" position={[-10, 0, 4]} scale={[6, 10, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#a26bff" position={[10, 0, 4]} scale={[6, 10, 1]} />
        </Environment>

        <Suspense fallback={null}>
          <Physics gravity={[0, -28, 0]} paused={!active}>
            <Scene theme={theme} quality={quality} pointer={pointer} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
