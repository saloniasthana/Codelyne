"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion } from "motion/react";
import { useApp } from "@/components/Providers";
import { use3DQuality, useInView } from "@/components/three/useWebGL";
import { SplitText } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import SectionLink from "@/components/ui/SectionLink";

// Three.js is only downloaded in the browser, after the page is interactive
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

function FallbackOrbs() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="animate-orb absolute right-[-10%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-c2/30 blur-[120px] md:right-[5%]" />
      <div className="animate-orb absolute right-[20%] top-[40%] h-[22rem] w-[22rem] rounded-full bg-c3/30 blur-[100px] [animation-delay:-3s]" />
      <div className="animate-orb absolute right-[5%] top-[30%] h-[16rem] w-[16rem] rounded-full bg-c1/25 blur-[90px] [animation-delay:-5s]" />
    </div>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { theme } = useApp();
  const quality = use3DQuality();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, "0px");

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden hero-wide:items-center">
      <div className="absolute inset-0 -z-10">
        {quality === "off" && <FallbackOrbs />}
        {quality && quality !== "off" && (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6 }}
          >
            <HeroScene theme={theme} quality={quality} active={inView} />
          </motion.div>
        )}
        {/* keep text readable over the scene */}
        <div className="hero-veil absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="container-x pb-16 pt-28 hero-wide:pb-24 hero-wide:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="glass mb-8 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-xs text-muted"
        >
          <span className="relative flex h-2 w-2 ml-1">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-c1 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-c1" />
          </span>
          Available for new projects
        </motion.div>

        <SplitText
          as="h1"
          immediate
          stagger={0.08}
          text="Where ideas connect to code."
          className="font-display max-w-4xl text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
          wordClassName={(w) => (w === "connect" || w === "code." ? "text-gradient" : "")}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
        >
          Codelyne turns business ideas into modern websites, web applications and digital solutions —
          designed with care and engineered to perform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <SectionLink
              href="#contact"
              className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-8 font-medium text-white shadow-[0_10px_40px_-10px_var(--glow)]"
            >
              <span className="bg-gradient-line absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
              <span className="relative">Start a project</span>
              <span className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
            </SectionLink>
          </Magnetic>
          <Magnetic>
            <SectionLink
              href="#work"
              className="glass inline-flex h-14 items-center gap-2 rounded-full px-8 font-medium transition hover:border-c2/50"
            >
              See our work
            </SectionLink>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 hero-wide-tall:flex"
      >
        <span className="eyebrow text-[10px]">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <motion.span
            className="bg-gradient-line absolute inset-x-0 top-0 h-1/2"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
