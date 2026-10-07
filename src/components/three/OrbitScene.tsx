"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

type Item = { name: string; note: string };

type Ring = { radius: number; tilt: [number, number, number]; speed: number };

const RINGS: Ring[] = [
  { radius: 2.3, tilt: [0.35, 0, 0.2], speed: 0.22 },
  { radius: 3.3, tilt: [-0.25, 0, -0.35], speed: -0.15 },
];

function OrbitItem({
  item,
  ring,
  angle,
  paused,
  onHover,
}: {
  item: Item;
  ring: Ring;
  angle: number;
  paused: React.RefObject<boolean>;
  onHover: (v: boolean) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const el = useRef<HTMLDivElement>(null);
  const a = useRef(angle);
  const world = useMemo(() => new THREE.Vector3(), []);
  const [hover, setHover] = useState(false);

  useFrame((_, delta) => {
    if (!paused.current) a.current += delta * ring.speed;
    const g = ref.current!;
    g.position.set(Math.cos(a.current) * ring.radius, 0, Math.sin(a.current) * ring.radius);
    // fade + shrink items on the far side of the orbit for depth
    g.getWorldPosition(world);
    const depth = THREE.MathUtils.clamp((world.z + ring.radius) / (ring.radius * 2), 0, 1);
    if (el.current) {
      el.current.style.opacity = String(0.25 + depth * 0.75);
      el.current.style.transform = `scale(${0.75 + depth * 0.3})`;
    }
  });

  return (
    <group ref={ref}>
      <Html center zIndexRange={[20, 0]}>
        <div ref={el} className="relative">
          <button
            onPointerEnter={() => {
              setHover(true);
              onHover(true);
            }}
            onPointerLeave={() => {
              setHover(false);
              onHover(false);
            }}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className="glass whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs text-fg shadow-lg shadow-black/10 transition-colors hover:border-c2"
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
      </Html>
    </group>
  );
}

function Orbits({ items, color }: { items: Item[]; color: string }) {
  const paused = useRef(false);
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
          {groups[r].map((item, i) => (
            <OrbitItem
              key={item.name}
              item={item}
              ring={ring}
              angle={(i / groups[r].length) * Math.PI * 2}
              paused={paused}
              onHover={(v) => (paused.current = v)}
            />
          ))}
        </group>
      ))}
    </group>
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
  return (
    <Canvas
      camera={{ position: [0, 1.2, 8.5], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true }}
    >
      <Orbits items={items} color={theme === "dark" ? "#5b8cff" : "#3466ff"} />
    </Canvas>
  );
}
