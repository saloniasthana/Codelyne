import { deliverables } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

// One icon per deliverable, in the same order as `deliverables`
const icons = [
  // Modern UI: layout
  <path key="ui" d="M4 5h16v14H4zM4 9h16M9 9v10" />,
  // Responsive First: monitor + phone
  <path key="rs" d="M3 5h12v9H3zM6.5 18h5M9 14v4M17 8h4v11h-4zM19 16.5h.01" />,
  // Full-Stack Solutions: database layers
  <path
    key="fs"
    d="M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"
  />,
  // Built for Growth: trending up
  <path key="gr" d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
];

export default function Deliver() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <SectionHeading eyebrow="What we deliver" title="Quality built into every project." />

        {/* gap-px over a line-coloured background draws even dividers at every column count */}
        <Reveal delay={0.1} className="mt-12">
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((d, i) => (
              <div
                key={d.title}
                className="group relative overflow-hidden bg-surface p-7 transition-colors duration-500 sm:p-8 lg:p-9"
              >
                {/* hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-c2/0 blur-3xl transition-colors duration-500 group-hover:bg-c2/20"
                />
                <span className="bg-gradient-line absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

                <div className="relative flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-bg-soft transition-transform duration-500 group-hover:-translate-y-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke={`url(#deliver-grad-${i})`}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <defs>
                        <linearGradient id={`deliver-grad-${i}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="var(--c1)" />
                          <stop offset=".5" stopColor="var(--c2)" />
                          <stop offset="1" stopColor="var(--c3)" />
                        </linearGradient>
                      </defs>
                      {icons[i]}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>

                <h3 className="font-display relative mt-10 text-xl font-semibold tracking-tight sm:text-2xl">{d.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">{d.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
