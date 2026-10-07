"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { processSteps } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Scroll-driven story: Idea → Design → Build → Launch.
 * Desktop: the section pins and the steps scroll sideways while a glowing
 * line connects them. Mobile: a vertical timeline whose line draws as you scroll.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        tl.to(el, { x: () => -distance(), ease: "none" }, 0);
        tl.fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step, i, all) => {
          tl.fromTo(
            step.querySelector("[data-node]"),
            { scale: 0.4, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 0.08 },
            (i / all.length) * 0.9,
          );
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          "[data-vline]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} className="relative overflow-hidden py-28 lg:flex lg:h-screen lg:items-center lg:py-0">
      <div ref={track} className="lg:flex lg:w-max lg:items-center lg:gap-24 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-[20vw]">
        <div className="container-x lg:w-[30rem] lg:shrink-0 lg:px-0">
          <SectionHeading
            eyebrow="How we work"
            title="A clear line from idea to launch."
            text="Four steps, no black boxes. You see progress every week and always know what's next."
          />
        </div>

        <div data-steps className="container-x relative mt-16 lg:mt-0 lg:flex lg:w-auto lg:gap-16 lg:px-0">
          {/* connecting lines */}
          <div className="bg-line absolute left-[calc(1.25rem+1.25rem)] top-0 h-full w-px md:left-[calc(2.5rem+1.25rem)] lg:hidden">
            <div data-vline className="bg-gradient-line h-full w-full origin-top" />
          </div>
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-line lg:block">
            <div data-line className="bg-gradient-line h-full w-full origin-left shadow-[0_0_12px_var(--glow)]" />
          </div>

          {processSteps.map((s, i) => (
            <div key={s.title} data-step className="relative flex gap-6 pb-14 last:pb-0 lg:block lg:w-[22rem] lg:shrink-0 lg:pb-0">
              <span
                data-node
                className="bg-gradient-line relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold text-white shadow-[0_0_30px_var(--glow)]"
              >
                0{i + 1}
              </span>
              <div className="lg:mt-10">
                <h3 className="font-display text-3xl font-semibold tracking-tight lg:text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
