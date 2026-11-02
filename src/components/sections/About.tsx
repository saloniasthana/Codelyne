import { founder } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export default function About() {
  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <SectionHeading eyebrow="Who's behind Codelyne" title="Where ideas become websites." />

        <div>
          {founder.bio.map((para, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <p className={`text-lg leading-relaxed ${i === 0 ? "text-fg" : "mt-5 text-muted"}`}>{para}</p>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8">
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">{founder.name}</p>
                <p className="text-sm text-muted">{founder.role} · Founder, Codelyne</p>
              </div>
              <a
                href={founder.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:border-c2/50"
              >
                View my personal portfolio ↗
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
