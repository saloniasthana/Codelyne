"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { services, site } from "@/content/site";
import { useApp } from "@/components/Providers";
import { use3DQuality, useInView } from "@/components/three/useWebGL";
import Logo from "@/components/ui/Logo";
import Magnetic from "@/components/ui/Magnetic";
import SectionLink from "@/components/ui/SectionLink";

// Physics + 3D are only downloaded once the visitor scrolls near the footer
const FooterPlayground = dynamic(() => import("@/components/three/FooterPlayground"), { ssr: false });

const linkClass = "text-muted transition-colors hover:text-fg";

/** "918303909018" → "+91 83039 09018" */
function formatPhone(digits: string) {
  const cc = digits.slice(0, digits.length - 10);
  const n = digits.slice(-10);
  return `+${cc} ${n.slice(0, 5)} ${n.slice(5)}`;
}

/**
 * Bottom stage: the big serif "Codelyne" wordmark sits behind a pile of 3D
 * shapes that the visitor can scatter with the mouse (or a tap on phones).
 */
function Playground() {
  const { theme } = useApp();
  const quality = use3DQuality();
  const stage = useRef<HTMLDivElement>(null);
  const near = useInView(stage, "400px");
  const visible = useInView(stage, "0px");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (near) setLoad(true);
  }, [near]);

  return (
    <div ref={stage} className="relative h-[clamp(220px,38vw,560px)] select-none overflow-hidden">
      {/* Layer 1: brand wordmark, uses the theme text colour with the same fade as the navbar logo */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[20%] mx-auto aspect-[2328/688] w-[min(92%,1500px)] md:bottom-[10%] lg:bottom-[6%]"
        style={{
          background: "linear-gradient(90deg, var(--fg) 35%, color-mix(in srgb, var(--fg) 55%, transparent))",
          WebkitMask: "url(/brand/wordmark.svg) center / contain no-repeat",
          mask: "url(/brand/wordmark.svg) center / contain no-repeat",
        }}
      />
      {/* Layer 2: interactive physics pile (skipped for reduced motion / no WebGL) */}
      {load && quality && quality !== "off" && <FooterPlayground theme={theme} quality={quality} active={visible} />}
    </div>
  );
}

export default function Footer() {
  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Codelyne! I'd like to discuss a project.")}`;

  return (
    <footer className="relative overflow-hidden border-t border-line">
      {/* Call-to-action strip */}
      <div className="container-x">
        <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-10 sm:px-10 md:mt-20 md:px-14 md:py-14 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-c2/20 blur-[90px]" />
          <div className="relative">
            <p className="eyebrow">Let&apos;s work together</p>
            <h2 className="font-display mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl">
              Have a project in mind?
            </h2>
            <p className="mt-4 max-w-lg text-muted">
              Tell us what you&apos;re planning — we&apos;ll help you shape it into a website that fits your business.
            </p>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Magnetic>
              <SectionLink
                href="#contact"
                className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-8 font-medium text-white shadow-[0_10px_40px_-10px_var(--glow)]"
              >
                <span className="bg-gradient-line absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
                <span className="relative">Discuss Your Project</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
              </SectionLink>
            </Magnetic>
            <Magnetic>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex h-14 items-center gap-2 rounded-full px-7 font-medium transition hover:border-c2/50"
              >
                Chat on WhatsApp ↗
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-muted">{site.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-3">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <SectionLink href={n.href as `#${string}`} className={linkClass}>
                    {n.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Services</p>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.title}>
                  <SectionLink href="#services" className={linkClass}>
                    {s.title}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp: {formatPhone(site.whatsapp)}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
              <li className="text-muted">{site.location}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive wordmark + physics stage */}
      <div className="mt-12 md:mt-16">
        <Playground />
      </div>

      <div className="container-x">
        <div className="flex flex-col justify-between gap-4 border-t border-line py-8 text-sm text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <SectionLink href="#top" className="transition-colors hover:text-fg">
            Back to top ↑
          </SectionLink>
        </div>
      </div>
    </footer>
  );
}
