import type { Project } from "@/lib/projects";

/**
 * Cover art for a project. Uses `project.cover` if set, otherwise generates an
 * abstract "connected nodes" artwork from the project's two colours, so the
 * site looks finished before you have screenshots.
 */
export default function ProjectCover({
  project,
  className = "",
  large = false,
}: {
  project: Project;
  className?: string;
  large?: boolean;
}) {
  const [a, b] = project.colors;

  if (project.cover) {
    return (
      <img
        src={project.cover}
        alt={`${project.title} preview`}
        className={`h-full w-full object-cover object-top ${className}`}
        loading="lazy"
      />
    );
  }

  // Deterministic pseudo-random points from the slug so each cover is unique but stable
  let seed = [...project.slug].reduce((s, c) => s + c.charCodeAt(0) * 31, 7);
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const pts = Array.from({ length: 14 }, () => [10 + rand() * 380, 10 + rand() * 230] as const);
  const links: [number, number][] = [];
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 110) links.push([i, j]);
    }),
  );
  const id = `cv-${project.slug}`;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 0% 0%, ${a}55, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${b}66, transparent 55%), var(--bg-soft)`,
      }}
    >
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
        {links.map(([i, j], k) => (
          <line
            key={k}
            x1={pts[i][0]}
            y1={pts[i][1]}
            x2={pts[j][0]}
            y2={pts[j][1]}
            stroke={`url(#${id})`}
            strokeOpacity="0.45"
            strokeWidth="0.8"
          />
        ))}
        {pts.map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={k % 4 === 0 ? 3.2 : 1.8} fill={k % 2 ? a : b} />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <span
          className={`font-display font-semibold tracking-[-0.04em] text-fg/90 ${
            large ? "text-[clamp(3rem,10vw,8rem)]" : "text-5xl md:text-6xl"
          } leading-none`}
        >
          {project.title}
        </span>
      </div>
    </div>
  );
}
