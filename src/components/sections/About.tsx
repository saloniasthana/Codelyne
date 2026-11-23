import { about } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export default function About() {
  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-24">
      <div className="container-x">
        {/* Introduction */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading eyebrow="About Codelyne" title={about.title} />
          <div className="lg:pt-12">
            {about.intro.map((para, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className={`text-lg leading-relaxed ${i === 0 ? "text-fg" : "mt-5 text-muted"}`}>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mission & vision */}
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2">
          {[
            { label: "Our mission", text: about.mission },
            { label: "Our vision", text: about.vision },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08} className="h-full">
              <div className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-9">
                <div
                  aria-hidden
                  className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${i === 0 ? "bg-c1/15" : "bg-c3/15"}`}
                />
                <p className="eyebrow relative flex items-center gap-3">
                  <span className="bg-gradient-line inline-block h-px w-8" />
                  {item.label}
                </p>
                <p className="font-display relative mt-5 text-xl leading-snug tracking-tight sm:text-2xl">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* What makes us different */}
        <div className="mt-14 md:mt-20">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">What makes us different?</h3>
          </Reveal>
          <ul className="mt-8 grid gap-x-10 gap-y-2 md:grid-cols-2">
            {about.different.map((d, i) => (
              <li key={d.title}>
                <Reveal delay={(i % 2) * 0.08}>
                  <div className="flex gap-4 border-t border-line py-6">
                    <span className="bg-gradient-line mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] text-white">
                      ✓
                    </span>
                    <div>
                      <p className="font-medium">{d.title}</p>
                      <p className="mt-1.5 leading-relaxed text-muted">{d.text}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Closing statement */}
        <Reveal className="mt-14 md:mt-20">
          <div className="border-t border-line pt-12">
            <p className="font-display max-w-4xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl md:text-4xl">
              {about.closing.lead} <span className="text-gradient">{about.closing.highlight}</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
