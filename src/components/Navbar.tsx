"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import Logo from "@/components/ui/Logo";
import Magnetic from "@/components/ui/Magnetic";
import SectionLink from "@/components/ui/SectionLink";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Lock page scroll while the mobile menu is open; close it if the screen grows to desktop
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => {
      root.style.overflow = "";
      mq.removeEventListener("change", close);
    };
  }, [open]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 400);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !open ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4"
      >
        <nav
          className={`container-x flex h-16 items-center justify-between rounded-2xl transition-all duration-500 ${
            scrolled ? "glass max-w-[min(72rem,calc(100%-1.5rem))] shadow-lg shadow-black/5" : ""
          }`}
        >
          <SectionLink href="#top" aria-label="Codelyne home">
            <Logo />
          </SectionLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <SectionLink
                  href={item.href as `#${string}`}
                  className="group relative rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                  <span className="bg-gradient-line absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </SectionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden sm:block">
              <Magnetic>
                <SectionLink
                  href="#contact"
                  className="bg-fg text-bg inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium transition hover:opacity-90"
                >
                  Start a project
                  <span aria-hidden>→</span>
                </SectionLink>
              </Magnetic>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="glass grid h-10 w-10 place-items-center rounded-full lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-fg transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-4 bg-fg transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg px-8 lg:hidden"
          >
            <ul className="space-y-2">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <SectionLink
                    href={item.href as `#${string}`}
                    onNavigate={() => setOpen(false)}
                    className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
                  >
                    {item.label}
                  </SectionLink>
                </motion.li>
              ))}
            </ul>
            <p className="eyebrow mt-12">{site.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
