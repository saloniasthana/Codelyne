const words = [
  "Websites",
  "Web Applications",
  "E-commerce",
  "UI/UX Design",
  "Dashboards",
  "Landing Pages",
  "APIs & Integrations",
  "3D & Motion",
];

export default function Marquee() {
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-line py-6" aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-10 hover:[animation-play-state:paused]">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl font-medium tracking-tight text-muted md:text-4xl">{w}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-c2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="4" cy="12" r="2.5" fill="currentColor" />
              <circle cx="20" cy="12" r="2.5" />
              <path d="M6.5 12h11" strokeDasharray="2 2" />
            </svg>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
