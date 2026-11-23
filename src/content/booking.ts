// Everything a visitor reads on /book-a-call lives here.

/**
 * Public Calendly event link, e.g. "https://calendly.com/codelyne/discovery-call".
 * Set NEXT_PUBLIC_CALENDLY_URL in .env.local (and in your host's env settings).
 * This is a public link, not a secret — Calendly keeps all credentials on its side.
 */
export const CALENDLY_URL = (process.env.NEXT_PUBLIC_CALENDLY_URL ?? "").trim();
export const calendlyConfigured = /^https:\/\/calendly\.com\/[^/\s]+\/[^/\s]+/.test(CALENDLY_URL);

export const booking = {
  title: "Let's discuss your next big idea.",
  subtitle:
    "Schedule a free discovery call with our team. Tell us about your business, goals and project requirements, and let's explore how we can bring your vision to life.",
  highlights: [
    "Free 30-minute consultation",
    "Online meeting via Google Meet",
    "No obligation to proceed",
    "Available for clients worldwide",
  ],
  durationMinutes: 30,
  platform: "Google Meet",
  services: [
    "Website Development",
    "E-commerce Development",
    "Custom Web Application",
    "UI/UX Design",
    "Website Redesign",
    "SEO & Website Optimization",
    "Other",
  ],
  budgets: ["Under $500", "$500–$1,000", "$1,000–$3,000", "$3,000–$5,000", "$5,000+", "Not Decided Yet"],
  confirmation: {
    title: "Your discovery call is scheduled!",
    message:
      "Thank you for choosing Codelyne. We're excited to learn more about your project. A meeting confirmation and Google Meet details will be sent to your email.",
  },
};
