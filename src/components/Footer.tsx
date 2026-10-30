"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { services, site } from "@/content/site";
import { useApp } from "@/components/Providers";
import { use3DQuality, useInView } from "@/components/three/useWebGL";
import Logo from "@/components/ui/Logo";
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
      <div className="container-x">
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
