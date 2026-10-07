"use client";

import { motion, type Variants } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades + lifts its children into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};
const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease } },
};

/** Splits text into words that slide up from a mask, one after another. */
export function SplitText({
  text,
  className = "",
  wordClassName = "",
  stagger = 0.06,
  as: Tag = "h2",
  immediate = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string | ((word: string, i: number) => string);
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
  immediate?: boolean;
}) {
  const MotionTag = motion[Tag];
  const inView = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "-60px" } };

  return (
    <MotionTag className={className} initial="hidden" variants={container} custom={stagger} aria-label={text} {...inView}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            variants={word}
            className={`inline-block ${typeof wordClassName === "function" ? wordClassName(w, i) : wordClassName}`}
          >
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
