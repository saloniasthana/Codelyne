"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { Quality } from "./useWebGL";

type Palette = {
  node: string;
  line: string;
  pulse: string;
  core: string;
  ring: string;
  lineOpacity: number;
  blending: THREE.Blending;
  bloom: number;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    node: "#9fc0ff",
    line: "#5b8cff",
    pulse: "#2de2c8",
    core: "#7b4dff",
    ring: "#5b8cff",
    lineOpacity: 0.22,
    blending: THREE.AdditiveBlending,
    bloom: 1.1,
  },
  light: {
    node: "#3466ff",
    line: "#3466ff",
    pulse: "#0fae9a",
    core: "#7b3dff",
    ring: "#7b3dff",
    lineOpacity: 0.28,
    blending: THREE.NormalBlending,
    bloom: 0.25,
  },
};

// Shared mouse position in normalised [-1, 1] coords. Tracked on window so
// the overlaid hero text doesn't block it.
const mouse = { x: 0, y: 0 };

/** Soft round sprite so points render as glowing dots instead of squares. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function NeuralSphere({ palette, count }: { palette: Palette; count: number }) {
  const group = useRef<THREE.Group>(null);
  const pulseGeo = useRef<THREE.BufferGeometry>(null);
  const dot = useDotTexture();
  const { viewport } = useThree();

  // Nodes on a slightly noisy Fibonacci sphere + edges between near neighbours
  const { nodes, nodePositions, edgePositions, edges } = useMemo(() => {
    const R = 2.2;
    const nodes: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const jitter = 1 + (Math.random() - 0.5) * 0.14;
      nodes.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(R * jitter));
    }

    const maxDist = count > 150 ? 0.62 : 0.85;
    const edges: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (nodes[i].distanceTo(nodes[j]) < maxDist) edges.push([i, j]);
      }
    }

    const nodePositions = new Float32Array(count * 3);
    nodes.forEach((n, i) => n.toArray(nodePositions, i * 3));
    const edgePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(edgePositions, i * 6);
      nodes[b].toArray(edgePositions, i * 6 + 3);
    });
    return { nodes, nodePositions, edgePositions, edges };
  }, [count]);

  // Pulses: bright dots that travel along random edges
  const pulseCount = Math.round(count / 6);
  const pulses = useMemo(
    () =>
      Array.from({ length: pulseCount }, () => ({
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.4 + Math.random() * 0.8,
      })),
    [pulseCount, edges.length],
  );
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);

    // Follow the mouse, slowly spin, and drift away as the user scrolls
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, t * 0.08 + mouse.x * 0.5 + scroll * 1.2, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -mouse.y * 0.3 + scroll * 0.3, 3, delta);
    const wide = viewport.width > 8;
    g.position.x = THREE.MathUtils.damp(g.position.x, wide ? viewport.width * 0.25 : 0, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, (wide ? 0 : viewport.height * 0.3) + scroll * 1.6, 4, delta);
    const s = (wide ? 1 : 0.65) * (1 - scroll * 0.15);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, delta));

    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.t += delta * p.speed;
      if (p.t >= 1) {
        // hop onto a connected edge so pulses look like signals moving through a network
        const [, end] = edges[p.edge];
        const next = edges.findIndex((e, k) => k !== p.edge && (e[0] === end || e[1] === end));
        p.edge = next >= 0 && Math.random() > 0.2 ? next : Math.floor(Math.random() * edges.length);
        p.t = 0;
      }
      const [a, b] = edges[p.edge];
      tmp.lerpVectors(nodes[a], nodes[b], p.t).toArray(pulsePositions, i * 3);
    }
    if (pulseGeo.current) pulseGeo.current.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          map={dot}
          color={palette.node}
          transparent
          depthWrite={false}
          blending={palette.blending}
          sizeAttenuation
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.line}
          transparent
          opacity={palette.lineOpacity}
          depthWrite={false}
          blending={palette.blending}
        />
      </lineSegments>

      <points>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={dot}
          color={palette.pulse}
          transparent
          depthWrite={false}
          blending={palette.blending}
          sizeAttenuation
        />
      </points>

      <Core palette={palette} />
      <Rings palette={palette} />
    </group>
  );
}

function Core({ palette }: { palette: Palette }) {
  const wire = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (wire.current) {
      wire.current.rotation.x += d * 0.15;
      wire.current.rotation.y -= d * 0.2;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh>
        <icosahedronGeometry args={[0.62, 12]} />
        <MeshDistortMaterial
          color={palette.core}
          emissive={palette.core}
          emissiveIntensity={palette.blending === THREE.AdditiveBlending ? 0.45 : 0.2}
          roughness={0.25}
          metalness={0.2}
          distort={0.38}
          speed={2.2}
        />
      </mesh>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={palette.line} wireframe transparent opacity={0.35} />
      </mesh>
    </Float>
  );
}

function Rings({ palette }: { palette: Palette }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (a.current) a.current.rotation.z += d * 0.25;
    if (b.current) b.current.rotation.z -= d * 0.18;
  });
  return (
    <>
      <mesh ref={a} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.9, 0.006, 8, 200]} />
        <meshBasicMaterial color={palette.ring} transparent opacity={0.5} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 1.7, -0.4, 0]}>
        <torusGeometry args={[3.25, 0.004, 8, 200]} />
        <meshBasicMaterial color={palette.pulse} transparent opacity={0.35} />
      </mesh>
    </>
  );
}

export default function HeroScene({
  theme,
  quality,
  active,
}: {
  theme: "dark" | "light";
  quality: Exclude<Quality, "off">;
  active: boolean;
}) {
  const palette = PALETTES[theme];
  const [dpr, setDpr] = useState(quality === "high" ? 1.75 : 1.25);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, dpr]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={[theme === "dark" ? "#06070c" : "#f5f6fb"]} />
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ambientLight intensity={theme === "dark" ? 0.4 : 1.2} />
      <pointLight position={[4, 3, 4]} intensity={theme === "dark" ? 30 : 15} color="#5b8cff" />
      <pointLight position={[-4, -2, 2]} intensity={theme === "dark" ? 20 : 10} color="#2de2c8" />

      <NeuralSphere palette={palette} count={quality === "high" ? 220 : 120} />
      <Sparkles
        count={quality === "high" ? 80 : 30}
        scale={[14, 8, 6]}
        size={2.2}
        speed={0.3}
        opacity={theme === "dark" ? 0.6 : 0.35}
        color={palette.pulse}
      />

      {quality === "high" && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={palette.bloom} luminanceThreshold={0.2} luminanceSmoothing={0.3} />
          <Vignette eskil={false} offset={0.2} darkness={theme === "dark" ? 0.6 : 0.15} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
