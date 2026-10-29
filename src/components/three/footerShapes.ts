import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type ShapeKind = {
  name: string;
  geometry: THREE.BufferGeometry;
  /** Physics stand-in: a perfect sphere for balls, a convex hull for everything else */
  collider: "ball" | "hull";
};

/**
 * The geometric toys that pile up in the footer. All are roughly the same
 * size (about 1.6 × s world units across) so the pile looks even. Segment counts
 * are kept low — they're small on screen and there are a lot of them.
 */
export function createShapes(s = 1): ShapeKind[] {
  return [
    { name: "ball", geometry: new THREE.SphereGeometry(0.8 * s, 28, 20), collider: "ball" },
    { name: "ring", geometry: new THREE.TorusGeometry(0.62 * s, 0.26 * s, 14, 32), collider: "hull" },
    { name: "pill", geometry: new THREE.CapsuleGeometry(0.42 * s, 0.9 * s, 6, 16), collider: "hull" },
    { name: "cube", geometry: new RoundedBoxGeometry(1.25 * s, 1.25 * s, 1.25 * s, 3, 0.22 * s), collider: "hull" },
    { name: "hexagon", geometry: new THREE.CylinderGeometry(0.82 * s, 0.82 * s, 0.62 * s, 6), collider: "hull" },
    { name: "cone", geometry: new THREE.ConeGeometry(0.8 * s, 1.35 * s, 20), collider: "hull" },
  ];
}

/**
 * Colour families, picked evenly (¼ each) so no single hue dominates.
 * Dark theme avoids near-black/navy (they read as holes on the dark background);
 * light theme avoids solid black (too heavy on the light background).
 */
export const PALETTES = {
  dark: {
    teal: ["#2de2c8", "#5eead4"],
    blue: ["#5b8cff", "#7aa2ff"],
    purple: ["#a26bff", "#c4a0ff"],
    grey: ["#e8ebf3", "#c3c9d8", "#9aa3b8"],
  },
  light: {
    teal: ["#0fae9a", "#2dd4bf"],
    blue: ["#3466ff", "#5b8cff"],
    purple: ["#7b3dff", "#a26bff"],
    grey: ["#ffffff", "#dfe3ec", "#b8bfcf"],
  },
} as const;

/** Small deterministic random so the pile looks the same on every visit */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
