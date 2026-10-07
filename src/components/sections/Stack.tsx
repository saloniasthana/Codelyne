"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { techStack } from "@/content/site";
import { useApp } from "@/components/Providers";
import { use3DQuality, useInView } from "@/components/three/useWebGL";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const OrbitScene = dynamic(() => import("@/components/three/OrbitScene"), { ssr: false });

export default function Stack() {
  const { theme } = useApp();
  const quality = use3DQuality();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box);

  return (
    <section id="stack" className="relative py-16 sm:py-20 md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHeading
            eyebrow="Tech stack"
            title="Modern tools, chosen for the job."
            text="We build on proven, open technology — so your product is fast today and easy to grow tomorrow. Hover a tool to see why we use it."
          />
          <Reveal delay={0.2}>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {techStack.slice(0, 6).map((t) => (
                <li key={t.name} className="rounded-2xl border border-line bg-surface px-4 py-3">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{t.note}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div ref={box} className="relative aspect-square w-full max-w-[44rem] justify-self-center">
          <div className="absolute inset-[15%] rounded-full bg-c2/20 blur-[90px]" />
          {quality && quality !== "off" ? (
            <OrbitScene items={techStack} theme={theme} active={inView} />
          ) : (
            quality === "off" && (
              <ul className="relative flex h-full flex-wrap content-center justify-center gap-3 p-6">
                {techStack.map((t) => (
                  <li key={t.name} title={t.note} className="glass rounded-full px-4 py-2 font-mono text-xs">
                    {t.name}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </section>
  );
}
