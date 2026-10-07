# Codelyne — studio portfolio

Animated 3D portfolio for Codelyne, built with Next.js (static export), Tailwind CSS,
React Three Fiber, GSAP ScrollTrigger, Motion and Lenis. Everything is free and open source;
there's no backend or paid API.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm start          # preview ./out locally
```
## Structure

```
src/
  app/                 layout, home page, /work/[slug] case studies, 404
  components/
    sections/          Hero, Services, Work, Process, Stack, Metrics, Testimonials, Contact
    three/             HeroScene (neural sphere), OrbitScene (tech orbit), device-quality checks
    ui/                cursor, magnetic button, tilt card, text reveal, logo, theme toggle
  content/             site.ts + projects.json  ← edit these
scripts/flatten-prefetch.mjs   post-build fix so link prefetching doesn't 404 on static hosts
```

## Performance notes

- Three.js loads only in the browser, after the page is interactive (`next/dynamic`, `ssr: false`).
- Phones and low-core devices get fewer particles and no post-processing. With reduced motion
  or no WebGL, a CSS gradient fallback is shown instead.
- 3D canvases pause rendering when scrolled off screen.
