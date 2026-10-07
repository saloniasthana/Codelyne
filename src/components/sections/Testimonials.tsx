"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const t = testimonials[index];

  return (
    <section className="relative py-16 sm:py-20 md:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Client words" title="Trusted by the people we build for." />

        <div
          className="relative mt-12 overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:mt-16 sm:p-8 md:p-16"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-c3/20 blur-[80px]" />
          <svg viewBox="0 0 48 48" className="h-12 w-12 text-c2" fill="currentColor" aria-hidden>
            <path d="M14 34c-4.4 0-8-3.6-8-8 0-8.8 6.2-15.4 14-16v5c-4 .8-7 3.6-7.7 7.3.5-.2 1.1-.3 1.7-.3 3.9 0 7 3.1 7 6s-3.1 6-7 6zm20 0c-4.4 0-8-3.6-8-8 0-8.8 6.2-15.4 14-16v5c-4 .8-7 3.6-7.7 7.3.5-.2 1.1-.3 1.7-.3 3.9 0 7 3.1 7 6s-3.1 6-7 6z" />
          </svg>

          <div className="relative mt-8 min-h-[13rem] md:min-h-[11rem]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="font-display max-w-4xl text-xl font-medium leading-snug tracking-tight sm:text-2xl md:text-4xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="bg-gradient-line grid h-11 w-11 place-items-center rounded-full font-semibold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className="relative h-1.5 w-10 overflow-hidden rounded-full bg-line"
              >
                {i === index && (
                  <motion.span
                    key={`${index}-${paused}`}
                    className="bg-gradient-line absolute inset-y-0 left-0"
                    initial={{ width: paused ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: paused ? 0 : 6, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
