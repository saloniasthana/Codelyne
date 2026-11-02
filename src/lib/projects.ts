import data from "@/content/projects.json";

/** client = paid Codelyne work · demo = concept/sample build · employment = built in a job */
export type ProjectType = "client" | "demo" | "employment";

export const projectTypeLabel: Record<ProjectType, string> = {
  client: "Client project",
  demo: "Demo / Concept Project",
  employment: "Employment work",
};

/** Heading for the `client` fact on the case study */
export const clientFactLabel: Record<ProjectType, string> = {
  client: "Client",
  demo: "Concept for",
  employment: "Employer",
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  type: ProjectType;
  /** Leave "" to hide */
  year: string;
  category: string;
  summary: string;
  /** Two hex colours used for the generated cover art */
  colors: [string, string];
  /** Optional image in /public, e.g. "/projects/fleetfix.jpg" */
  cover: string;
  /** Optional CSS object-position for the cover, e.g. "left top" (default "center top") */
  coverPosition?: string;
  /** Optional live link */
  url: string;
  /** Exactly what I did on the project */
  role: string;
  stack: string[];
  challenge: string;
  solution: string;
  /** Key features, shown as a checklist on the case study */
  features?: string[];
  /** Headline numbers; leave [] to hide */
  results?: { value: string; label: string }[];
};

export const projects = data as Project[];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
