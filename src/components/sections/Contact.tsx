"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

const SERVICES = ["Website", "Web App", "E-commerce", "UI/UX", "Something else"];
const BUDGETS = ["Under ₹10K", "₹10K – ₹25K", "₹25K – ₹50K", "₹50K – ₹1L", "₹1L+"];
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "whatsapp" | "error";

/** wa.me link that opens a chat with Codelyne, message already typed */
const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

function enquiryText(data: FormData) {
  return [
    "Hi Codelyne! New project enquiry from the website:",
    "",
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Service: ${data.get("service")}`,
    `Budget: ${data.get("budget")}`,
    "",
    `${data.get("message")}`,
  ].join("\n");
}

function Chips({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button
          type="button"
          role="radio"
          aria-checked={value === o}
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            value === o ? "border-transparent bg-fg text-bg" : "border-line text-muted hover:border-c2/60 hover:text-fg"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** New tab on desktop (keeps the site open); falls back to same tab if popups are blocked */
function openWhatsApp(url: string) {
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
  else window.location.href = url;
}

const field =
  "w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted/60 focus:border-c2";

export default function Contact() {
  const [service, setService] = useState(SERVICES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("service", service);
    data.set("budget", budget);

    const url = waLink(enquiryText(data));
    setWaUrl(url);

    // No Web3Forms key → send the enquiry to Codelyne's WhatsApp, already typed out
    if (!ACCESS_KEY) {
      openWhatsApp(url);
      setStatus("whatsapp");
      return;
    }

    setStatus("sending");
    data.set("access_key", ACCESS_KEY);
    data.set("subject", `New project enquiry from ${data.get("name")}`);
    data.set("from_name", "Codelyne website");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const whatsapp = waLink("Hi Codelyne! I'd like to book a call about a project.");

  return (
    <section id="contact" className="relative overflow-hidden py-16 sm:py-20 md:py-24">
      <div className="absolute left-1/2 top-0 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-c2/15 blur-[140px]" />
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            eyebrow="Start a project"
            title="Have an idea? Let's connect it to code."
            text="Tell us a little about what you're building. We reply within one working day with next steps — no sales pitch."
          />
          <Reveal delay={0.2}>
            <div className="mt-12 space-y-4">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-line bg-surface p-5 transition hover:border-c1/60"
              >
                <span>
                  <span className="eyebrow block">Book a call</span>
                  <span className="mt-1 block text-lg font-medium">Chat on WhatsApp</span>
                </span>
                <span className="text-xl transition-transform group-hover:translate-x-1">↗</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center justify-between rounded-2xl border border-line bg-surface p-5 transition hover:border-c2/60"
              >
                <span>
                  <span className="eyebrow block">Email</span>
                  <span className="mt-1 block text-lg font-medium">{site.email}</span>
                </span>
                <span className="text-xl transition-transform group-hover:translate-x-1">↗</span>
              </a>
              <p className="pt-2 text-sm text-muted">{site.location}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="glass relative rounded-[2rem] p-7 md:p-10">
            <AnimatePresence>
              {status === "sent" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2rem] bg-surface p-10 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="bg-gradient-line grid h-16 w-16 place-items-center rounded-full text-2xl text-white"
                  >
                    ✓
                  </motion.span>
                  <h3 className="font-display mt-6 text-3xl font-semibold">Message received.</h3>
                  <p className="mt-3 max-w-sm text-muted">Thanks for reaching out — we&apos;ll get back to you within one working day.</p>
                  <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm text-c2 underline-offset-4 hover:underline">
                    Send another message
                  </button>
                </motion.div>
              )}
              {status === "whatsapp" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2rem] bg-surface p-8 text-center sm:p-10"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-[#25D366] text-white"
                  >
                    <WhatsAppIcon className="h-8 w-8" />
                  </motion.span>
                  <h3 className="font-display mt-6 text-3xl font-semibold">Almost done!</h3>
                  <p className="mt-3 max-w-sm text-muted">
                    We&apos;ve opened WhatsApp with your enquiry ready. Just tap <strong className="text-fg">Send</strong> and
                    we&apos;ll get back to you within one working day.
                  </p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp didn&apos;t open? Tap here
                  </a>
                  <button type="button" onClick={() => setStatus("idle")} className="mt-5 text-sm text-c2 underline-offset-4 hover:underline">
                    Back to the form
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* honeypot for bots */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="space-y-8">
              <div>
                <p className="eyebrow mb-4">I need</p>
                <Chips name="Service" options={SERVICES} value={service} onChange={setService} />
              </div>
              <div>
                <p className="eyebrow mb-4">Budget</p>
                <Chips name="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <label className="block">
                  <span className="sr-only">Your name</span>
                  <input name="name" required placeholder="Your name" className={field} />
                </label>
                <label className="block">
                  <span className="sr-only">Email</span>
                  <input name="email" type="email" required placeholder="Email address" className={field} />
                </label>
              </div>
              <label className="block">
                <span className="sr-only">Project details</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your project, goals and timeline…"
                  className={`${field} resize-none`}
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full px-8 font-medium text-white disabled:opacity-60"
                  >
                    <span className="bg-gradient-line absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
                    {!ACCESS_KEY && <WhatsAppIcon className="relative h-5 w-5" />}
                    <span className="relative">
                      {status === "sending" ? "Sending…" : ACCESS_KEY ? "Send message" : "Send via WhatsApp"}
                    </span>
                    <span className="relative transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </Magnetic>
                {status === "error" && (
                  <p className="text-sm text-red-400">
                    Couldn&apos;t send right now.{" "}
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      Send it on WhatsApp instead
                    </a>
                  </p>
                )}
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.1 1.3 15.2.1 12 .1 5.5.1.1 5.4.1 12c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7c1.7.9 3.7 1.4 5.7 1.4 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.4z" />
    </svg>
  );
}
