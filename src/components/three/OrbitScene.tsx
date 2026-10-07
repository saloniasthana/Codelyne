"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

type Item = { name: string; note: string };

type Ring = { radius: number; tilt: [number, number, number]; speed: number };

const RINGS: Ring[] = [
  { radius: 2.3, tilt: [0.35, 0, 0.2], speed: 0.22 },
  { radius: 3.3, tilt: [-0.25, 0, -0.35], speed: -0.15 },
];

/**
 * An invisible point travelling around a ring. Each frame it projects itself
 * to screen space and moves its matching DOM label (rendered outside the
 * canvas), so labels stay normal page elements instead of separate React roots.
 */
function OrbitPoint({
  ring,
  angle,
  paused,
  label,
}: {
  ring: Ring;
  angle: number;
  paused: React.RefObject<boolean>;
  label: () => HTMLDivElement | null;
}) {
  const ref = useRef<THREE.Group>(null);
  const a = useRef(angle);
  const world = useMemo(() => new THREE.Vector3(), []);
  const screen = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }, delta) => {
    if (!paused.current) a.current += delta * ring.speed;
    const g = ref.current!;
    g.position.set(Math.cos(a.current) * ring.radius, 0, Math.sin(a.current) * ring.radius);

    const el = label();
    if (!el) return;
    g.getWorldPosition(world);
    screen.copy(world).project(camera);
    const x = ((screen.x + 1) / 2) * size.width;
    const y = ((1 - screen.y) / 2) * size.height;
    // fade + shrink items on the far side of the orbit for depth
    const depth = THREE.MathUtils.clamp((world.z + ring.radius) / (ring.radius * 2), 0, 1);
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${0.75 + depth * 0.3})`;
    el.style.opacity = String(0.25 + depth * 0.75);
    el.style.zIndex = String(Math.round(depth * 20));
  });

  return <group ref={ref} />;
}

/** Pulls the camera back on small canvases so the outer ring and its labels fit. */
function CameraFit() {
  useFrame(({ camera, size }) => {
    const z = size.width < 420 ? 11.5 : size.width < 600 ? 10 : 8.5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.1);
  });
  return null;
}

function Orbits({
  items,
  color,
  paused,
  labels,
}: {
  items: Item[];
  color: string;
  paused: React.RefObject<boolean>;
  labels: React.RefObject<(HTMLDivElement | null)[]>;
}) {
  const core = useRef<THREE.Mesh>(null);
  const split = Math.ceil(items.length * 0.4);
  const groups = [items.slice(0, split), items.slice(split)];

  useFrame((_, d) => {
    if (core.current) {
      core.current.rotation.y += d * 0.3;
      core.current.rotation.x += d * 0.1;
    }
  });

  return (
    <group rotation={[0.15, 0, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>

      {RINGS.map((ring, r) => (
        <group key={r} rotation={ring.tilt}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius, 0.005, 8, 180]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} />
          </mesh>
          {groups[r].map((item, i) => {
            const index = r === 0 ? i : split + i;
            return (
              <OrbitPoint
                key={item.name}
                ring={ring}
                angle={(i / groups[r].length) * Math.PI * 2}
                paused={paused}
                label={() => labels.current[index]}
              />
            );
          })}
        </group>
      ))}
    </group>
  );
}

function OrbitLabel({
  item,
  setRef,
  onHover,
}: {
  item: Item;
  setRef: (el: HTMLDivElement | null) => void;
  onHover: (v: boolean) => void;
}) {
  const [hover, setHover] = useState(false);
  const show = (v: boolean) => {
    setHover(v);
    onHover(v);
  };

  return (
    <div ref={setRef} className="absolute left-0 top-0 opacity-0 will-change-transform">
      <button
        onPointerEnter={() => show(true)}
        onPointerLeave={() => show(false)}
        onFocus={() => show(true)}
        onBlur={() => show(false)}
        className="glass pointer-events-auto whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs text-fg shadow-lg shadow-black/10 transition-colors hover:border-c2"
      >
        {item.name}
      </button>
      <span
        className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2.5 py-1 text-[11px] text-bg transition-all duration-200 ${
          hover ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        {item.note}
      </span>
    </div>
  );
}

export default function OrbitScene({
  items,
  theme,
  active,
}: {
  items: Item[];
  theme: "dark" | "light";
  active: boolean;
}) {
  const paused = useRef(false);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        className="absolute! inset-0"
        camera={{ position: [0, 1.2, 8.5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: true }}
      >
        <CameraFit />
        <Orbits items={items} color={theme === "dark" ? "#5b8cff" : "#3466ff"} paused={paused} labels={labels} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0">
        {items.map((item, i) => (
          <OrbitLabel
            key={item.name}
            item={item}
            setRef={(el) => {
              labels.current[i] = el;
            }}
            onHover={(v) => (paused.current = v)}
          />
        ))}
      </div>
    </div>
  );
}
