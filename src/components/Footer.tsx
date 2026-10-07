import { site } from "@/content/site";
import Logo from "@/components/ui/Logo";
import SectionLink from "@/components/ui/SectionLink";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-muted">{site.description}</p>
          </div>
          <div>
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-3">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <SectionLink href={n.href as `#${string}`} className="text-muted transition-colors hover:text-fg">
                    {n.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5">Connect</p>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className="text-muted transition-colors hover:text-fg">
                  {site.email}
                </a>
              </li>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-fg">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-line py-8 text-sm text-muted md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <SectionLink href="#top" className="transition-colors hover:text-fg">
            Back to top ↑
          </SectionLink>
        </div>
      </div>

      <p
        aria-hidden
        className="font-display pointer-events-none select-none text-center text-[22vw] font-bold leading-[0.75] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--border)]"
      >
        codelyne
      </p>
    </footer>
  );
}
