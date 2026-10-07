import { services } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const icons = [
  // website
  <path key="w" d="M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01" />,
  // web app
  <path key="a" d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
  // e-commerce
  <path key="e" d="M3 4h2l2.4 11h11L21 7H7M9 20h.01M18 20h.01" />,
  // ui/ux
  <path key="u" d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
];

export default function Services() {
  return (
    <section id="services" className="relative py-16 sm:py-20 md:py-24">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="Everything between the idea and the launch."
          />
          <Reveal delay={0.2} className="max-w-sm">
            <p className="text-muted">
              One team for strategy, design and engineering — so nothing gets lost in translation between
              your vision and the final product.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.08} className="h-full">
              <TiltCard className="overflow-hidden rounded-3xl border border-line bg-surface p-7">
                <div className="flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-bg-soft text-c2 transition-colors group-hover:text-c1">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                      {icons[i]}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-muted">{s.no}</span>
                </div>
                <h3 className="font-display mt-10 text-2xl font-semibold tracking-tight" style={{ transform: "translateZ(20px)" }}>
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                <ul className="mt-6 space-y-2 border-t border-line pt-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm">
                      <span className="bg-gradient-line h-1 w-1 rounded-full" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="bg-gradient-line absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
