"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { projects } from "@/lib/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import ProjectCover from "@/components/ui/ProjectCover";

export default function Work() {
  const root = useRef<HTMLElement>(null);

  // Parallax: each cover drifts inside its frame while scrolling
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className="relative py-16 sm:py-20 md:py-24">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Client projects, built to perform."
            text="A few of the products we've designed and engineered. Each one started as an idea in a client's head."
          />
          <Reveal delay={0.2}>
            <span className="font-mono text-sm text-muted">
              ({String(projects.length).padStart(2, "0")}) projects
            </span>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.1} className={i % 2 ? "md:mt-32" : ""}>
              <Link href={`/work/${p.slug}/`} data-cursor="View" className="block">
                <TiltCard max={5} className="overflow-hidden rounded-[2rem] border border-line">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
                      <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                        <ProjectCover project={p} />
                      </div>
                    </div>
                    <span className="glass absolute right-5 top-5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>
                </TiltCard>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{p.title}</h3>
                    <p className="mt-2 max-w-md text-muted">{p.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.stack.slice(0, 4).map((s) => (
                        <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {p.year && <span className="font-mono text-sm text-muted">{p.year}</span>}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
