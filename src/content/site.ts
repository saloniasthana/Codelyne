// Everything a visitor reads about Codelyne lives here (except projects,
// which are in projects.json). Edit this file to update the site.

export const site = {
  name: "Codelyne",
  url: "https://codelyne.in", // TODO: your real domain (used for SEO metadata)
  tagline: "Where ideas connect to code.",
  description:
    "Codelyne transforms business ideas into modern websites, web applications and digital solutions — designed with care, engineered to perform.",

  // TODO: replace with your real contact details
  email: "hello@codelyne.in",
  whatsapp: "918303909018", // country code (91) + number, digits only
  location: "India · Working with clients worldwide",

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],

  nav: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
  ],
};

export const services = [
  {
    no: "01",
    title: "Business Websites",
    text: "Fast, SEO-ready marketing sites and landing pages that turn visitors into enquiries.",
    points: ["Next.js & React", "CMS integration", "Core Web Vitals tuned"],
  },
  {
    no: "02",
    title: "Web Applications",
    text: "Dashboards, portals and SaaS products built on a solid MERN / Next.js foundation.",
    points: ["Auth & roles", "REST / realtime APIs", "MongoDB & SQL"],
  },
  {
    no: "03",
    title: "E-commerce",
    text: "Storefronts with smooth checkout, payment gateways and inventory you can actually manage.",
    points: ["Razorpay / Stripe", "Admin panels", "Order automation"],
  },
  {
    no: "04",
    title: "UI/UX & Digital Solutions",
    text: "From wireframe to polished interface — plus the integrations and automations behind it.",
    points: ["Figma design", "3D & motion", "Third-party integrations"],
  },
];

export const processSteps = [
  {
    title: "Idea",
    text: "We start with your business goal, users and constraints — and turn them into a clear, scoped plan.",
  },
  {
    title: "Design",
    text: "Wireframes become an interface your users understand at a glance, reviewed with you at every step.",
  },
  {
    title: "Build",
    text: "Clean, typed, tested code shipped in short cycles, so you see working software every week.",
  },
  {
    title: "Launch & Grow",
    text: "Deployment, analytics and ongoing support — the line between your idea and your users stays live.",
  },
];

// "What We Deliver" strip
export const deliverables = [
  { title: "Modern UI", text: "Clean, professional & business-focused designs" },
  { title: "Responsive First", text: "Seamless experience across mobile, tablet & desktop" },
  { title: "Full-Stack Solutions", text: "Frontend, backend, database & API integration" },
  { title: "Built for Growth", text: "Scalable websites designed around your business goals" },
];

// TODO: replace with real client testimonials before launch
export const testimonials = [
  {
    quote:
      "Codelyne understood what we needed before we could fully explain it. The new site loads instantly and our enquiries doubled within two months.",
    name: "Client Name",
    role: "Founder, Company",
  },
  {
    quote:
      "Clear communication, weekly demos and zero surprises at launch. Our team actually enjoys using the dashboard they built.",
    name: "Client Name",
    role: "Operations Head, Company",
  },
  {
    quote:
      "They took a rough idea on a whiteboard and turned it into a product our customers pay for. Highly recommended.",
    name: "Client Name",
    role: "CEO, Startup",
  },
];

// Shown in the 3D tech-stack orbit and the marquee
export const techStack = [
  { name: "React", note: "Component-driven interfaces" },
  { name: "Next.js", note: "SEO-friendly, fast by default" },
  { name: "TypeScript", note: "Safer code, fewer bugs" },
  { name: "Node.js", note: "Scalable APIs & services" },
  { name: "Express", note: "Lean REST backends" },
  { name: "MongoDB", note: "Flexible document data" },
  { name: "Tailwind", note: "Consistent, rapid styling" },
  { name: "Three.js", note: "3D & WebGL experiences" },
  { name: "GSAP", note: "Scroll storytelling" },
  { name: "Figma", note: "Design & prototyping" },
  { name: "PostgreSQL", note: "Relational data at scale" },
  { name: "Git", note: "Versioned, reviewable work" },
];
