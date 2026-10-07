import type { NextConfig } from "next";

// Static export: `npm run build` emits a plain `out/` folder that can be
// deployed for free on Cloudflare Pages, GitHub Pages or Netlify.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Pin the project root (a stray lockfile higher up would otherwise confuse Turbopack)
  turbopack: { root: process.cwd() },
};

export default nextConfig;
