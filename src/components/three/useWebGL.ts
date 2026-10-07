"use client";

import { useEffect, useState } from "react";

export type Quality = "high" | "low" | "off";

/**
 * Decides how much 3D a device should get:
 *  - "off"  → no WebGL or user prefers reduced motion (render a CSS fallback)
 *  - "low"  → phones / weak CPUs (fewer particles, no post-processing)
 *  - "high" → everything else
 * Returns null until it has run on the client.
 */
export function use3DQuality() {
  const [quality, setQuality] = useState<Quality | null>(null);

  useEffect(() => {
    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!gl || reduced) return setQuality("off");

    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setQuality(cores <= 4 || memory <= 2 || (coarse && window.innerWidth < 768) ? "low" : "high");
  }, []);

  return quality;
}

/** True while the element is (roughly) on screen — used to pause render loops. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, margin = "200px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}
