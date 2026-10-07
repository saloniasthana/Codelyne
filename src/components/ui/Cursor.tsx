"use client";

import { useEffect, useRef } from "react";

/**
 * Dot + trailing ring cursor. Grows over anything interactive and shows a
 * label for elements with `data-cursor="View"` etc. Disabled on touch devices.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("has-cursor");
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...mouse };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        dot.current!.style.opacity = ring.current!.style.opacity = "1";
      }
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor], input, textarea, select, label");
      const text = el?.dataset.cursor ?? "";
      targetScale = el ? (text ? 2.6 : 1.7) : 1;
      label.current!.textContent = text;
      ring.current!.dataset.active = el ? "true" : "false";
    };
    const onLeave = () => {
      visible = false;
      dot.current!.style.opacity = ring.current!.style.opacity = "0";
    };

    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      scale += (targetScale - scale) * 0.15;
      dot.current!.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      ring.current!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-fg opacity-0 transition-opacity"
      />
      <div
        ref={ring}
        data-active="false"
        className="fixed left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-fg/40 opacity-0 transition-[opacity,background-color,border-color] duration-300 data-[active=true]:border-transparent data-[active=true]:bg-c2/15 data-[active=true]:backdrop-blur-[2px]"
      >
        <span ref={label} className="font-mono text-[5px] uppercase tracking-widest text-fg" />
      </div>
    </div>
  );
}
