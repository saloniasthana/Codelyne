"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { metrics } from "@/content/site";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function Metrics() {
  return (
    <section className="py-10">
      <div className="container-x">
        <div className="grid grid-cols-2 overflow-hidden rounded-[2rem] border border-line bg-surface lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`relative p-8 md:p-10 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <p className="font-display text-gradient text-5xl font-semibold tracking-tight md:text-6xl">
                <Counter value={m.value} suffix={m.suffix} />
              </p>
              <p className="mt-3 text-sm text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
