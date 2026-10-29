import { whyChoose } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import SectionLink from "@/components/ui/SectionLink";

// One icon per item, in the same order as `whyChoose`
const icons = [
  // Clear communication: chat bubble
  <path key="cc" d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12zM8.5 11h7M8.5 14h4" />,
  // Customized solutions: sliders
  <path
    key="cs"
    d="M4 6h9M17 6h3M17 6a2 2 0 1 1-4 0a2 2 0 1 1 4 0M4 12h3M11 12h9M11 12a2 2 0 1 1-4 0a2 2 0 1 1 4 0M4 18h11M19 18h1M19 18a2 2 0 1 1-4 0a2 2 0 1 1 4 0"
  />,
  // Responsive by design: monitor + phone
  <path key="rd" d="M3 5h12v9H3zM6.5 18h5M9 14v4M17 8h4v11h-4zM19 16.5h.01" />,
  // Project-focused development: target
  <path key="pf" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01" />,
];

export default function WhyChoose() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Why Codelyne"
            title="Why choose Codelyne?"
            text="We keep things simple: understand your goals, build exactly what your project needs, and keep you in the loop from first call to launch."
          />
          <Reveal delay={0.2}>
            <Magnetic className="mt-10">
              <SectionLink
                href="#contact"
                className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-8 font-medium text-white shadow-[0_10px_40px_-10px_var(--glow)]"
              >
                <span className="bg-gradient-line absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
                <span className="relative">Start a project</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
              </SectionLink>
            </Magnetic>
          </Reveal>
        </div>

        <ul className="border-b border-line">
          {whyChoose.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 0.08}>
                <div className="group relative flex gap-5 border-t border-line py-8 sm:gap-7 sm:py-10">
                  {/* accent bar on hover */}
                  <span className="bg-gradient-line absolute left-0 top-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-surface transition-transform duration-500 group-hover:-translate-y-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke={`url(#why-grad-${i})`}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <defs>
                        <linearGradient id={`why-grad-${i}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="var(--c1)" />
                          <stop offset=".5" stopColor="var(--c2)" />
                          <stop offset="1" stopColor="var(--c3)" />
                        </linearGradient>
                      </defs>
                      {icons[i]}
                    </svg>
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{item.title}</h3>
                      <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    </div>
                    <p className="mt-3 max-w-lg leading-relaxed text-muted">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
