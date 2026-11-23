"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Theme = "dark" | "light";

type Ctx = {
  theme: Theme;
  toggleTheme: () => void;
  scrollTo: (target: string | number) => void;
};

const AppContext = createContext<Ctx>({
  theme: "dark",
  toggleTheme: () => {},
  scrollTo: () => {},
});

export const useApp = () => useContext(AppContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Pick up whatever the inline <head> script already applied
  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "light" || t === "dark") setTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  }, []);

  // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Re-measure scroll animations whenever the page height changes after load
  // (late images/fonts, content updates). Otherwise pinned sections like Process
  // keep stale start positions and pin on top of the section above them.
  useEffect(() => {
    let timer = 0;
    let lastHeight = document.body.scrollHeight;
    const refresh = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const ro = new ResizeObserver(() => {
      // ignore changes caused by ScrollTrigger's own pin spacers settling
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      refresh();
    });
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
      window.removeEventListener("load", refresh);
    };
  }, []);

  // On client-side navigation: jump to the top (or to "#section" when linking
  // into the home page) and let ScrollTrigger re-measure the new layout
  useEffect(() => {
    const lenis = lenisRef.current;
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (hash && document.querySelector(hash)) {
        if (lenis) lenis.scrollTo(hash, { offset: -80, immediate: true, force: true });
        else document.querySelector(hash)!.scrollIntoView();
      }
    }, 120);
    return () => clearTimeout(id);
  }, [pathname]);

  const scrollTo = useCallback((target: string | number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -80 });
    } else if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, scrollTo }}>{children}</AppContext.Provider>
  );
}
