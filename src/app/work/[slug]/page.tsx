import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/lib/projects";
import ProjectCover from "@/components/ui/ProjectCover";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import SectionLink from "@/components/ui/SectionLink";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: `${p.title} — ${p.category}`, description: p.summary } : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = getNextProject(slug);

  const facts = [
    { label: "Client", value: p.client },
    { label: "Year", value: p.year },
    { label: "Service", value: p.category },
    { label: "Our role", value: p.role },
  ].filter((f) => f.value);

  return (
    <main className="pt-36">
      <div className="container-x">
        <Reveal>
          <SectionLink href="#work" className="eyebrow inline-flex items-center gap-2 transition-colors hover:text-fg">
            ← All work
          </SectionLink>
        </Reveal>
        <SplitText
          as="h1"
          immediate
          text={p.title}
          className="font-display mt-8 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{p.summary}</p>
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-fg text-bg mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition hover:opacity-90"
            >
              Visit live site ↗
            </a>
          )}
        </Reveal>

        <Reveal delay={0.3}>
          <dl className="mt-14 grid grid-cols-2 gap-8 border-y border-line py-8 md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="eyebrow">{f.label}</dt>
                <dd className="mt-2 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="container-x mt-14">
        <div className="overflow-hidden rounded-[2rem] border border-line shadow-2xl shadow-black/20">
          {/* browser chrome so screenshots read as a live website */}
          <div className="flex items-center gap-2 border-b border-line bg-surface px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            {p.url && (
              <span className="ml-4 truncate rounded-md bg-bg-soft px-3 py-1 font-mono text-xs text-muted">
                {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            )}
          </div>
          <div className="aspect-[4/3] md:aspect-[16/10]">
            <ProjectCover project={p} large />
          </div>
        </div>
      </Reveal>

      <div className="container-x mt-28 grid gap-16 md:grid-cols-[1fr_2fr]">
        <Reveal>
          <p className="eyebrow">The challenge</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display text-2xl leading-snug tracking-tight md:text-3xl">{p.challenge}</p>
        </Reveal>
        <Reveal>
          <p className="eyebrow">What we built</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display text-2xl leading-snug tracking-tight md:text-3xl">{p.solution}</p>
        </Reveal>
        <Reveal>
          <p className="eyebrow">Tech stack</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="flex flex-wrap gap-3">
            {p.stack.map((s) => (
              <li key={s} className="glass rounded-full px-5 py-2.5 font-mono text-sm">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
        {p.features && p.features.length > 0 && (
          <>
            <Reveal>
              <p className="eyebrow">Key features</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 border-b border-line pb-4">
                    <span className="bg-gradient-line mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] text-white">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </>
        )}
      </div>

      {p.results && p.results.length > 0 && (
        <section className="container-x mt-28">
          <Reveal>
            <p className="eyebrow mb-8">Highlights</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {p.results.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.1}>
                <div className="rounded-3xl border border-line bg-surface p-8">
                  <p className="font-display text-gradient text-5xl font-semibold tracking-tight md:text-6xl">{r.value}</p>
                  <p className="mt-3 text-muted">{r.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Link
        href={`/work/${next.slug}/`}
        data-cursor="Next"
        className="group mt-32 block border-t border-line py-20 md:py-28"
      >
        <div className="container-x">
          <p className="eyebrow">Next project</p>
          <p className="font-display mt-4 text-[clamp(3rem,9vw,7rem)] font-semibold leading-none tracking-[-0.05em] transition-colors">
            <span className="group-hover:text-gradient">{next.title}</span>{" "}
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-4">→</span>
          </p>
        </div>
      </Link>
    </main>
  );
}
