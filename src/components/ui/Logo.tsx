/**
 * Codelyne lockup: gradient "C" mark + serif wordmark.
 * The wordmark SVG is used as a mask so it takes the theme's text colour
 * (dark on light, light on dark) with the same soft fade as the brand file.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/brand/mark.svg" alt="" width={900} height={1008} className="h-9 w-auto" />
      <span
        role="img"
        aria-label="Codelyne"
        className="block h-[1.9rem] aspect-[2328/688]"
        style={{
          background: "linear-gradient(90deg, var(--fg) 35%, color-mix(in srgb, var(--fg) 60%, transparent))",
          WebkitMask: "url(/brand/wordmark.svg) center / contain no-repeat",
          mask: "url(/brand/wordmark.svg) center / contain no-repeat",
        }}
      />
    </span>
  );
}
