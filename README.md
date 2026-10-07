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

## Edit content (no code needed)

| What | Where |
| --- | --- |
| Client projects / case studies | `src/content/projects.json`: add an object and a page is generated at `/work/<slug>/` |
| Project screenshots | put an image in `public/projects/` and set `"cover": "/projects/name.jpg"` (otherwise a generated artwork is used) |
| Email, WhatsApp, socials, services, process, metrics, testimonials, tech stack | `src/content/site.ts` |

Everything marked `TODO` in `site.ts` is placeholder content. Replace it before launch,
**especially the metrics and testimonials.** Project screenshots can be refreshed by re-capturing
the live sites at 1440×1080 and saving over the files in `public/projects/`.

## Contact form

Get a free access key at <https://web3forms.com>, then copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_WEB3FORMS_KEY`. Without a key, the form opens the visitor's email app instead.

## Deploy (free)

**Cloudflare Pages:** connect the repo, set build command `npm run build` and output directory `out`,
and add the env vars from `.env.example`. Netlify and GitHub Pages work the same way.

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
