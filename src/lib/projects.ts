import data from "@/content/projects.json";

export type Project = {
  slug: string;
  title: string;
  client: string;
  /** Leave "" to hide */
  year: string;
  category: string;
  summary: string;
  /** Two hex colours used for the generated cover art */
  colors: [string, string];
  /** Optional image in /public, e.g. "/projects/fleetfix.jpg" */
  cover: string;
  /** Optional live link */
  url: string;
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
