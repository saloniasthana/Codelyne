"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { booking, CALENDLY_URL, calendlyConfigured } from "@/content/booking";
import { site } from "@/content/site";
import { useApp } from "@/components/Providers";

type Details = {
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  service: string;
  budget: string;
  description: string;
};

type Step = "details" | "review" | "schedule" | "done";

const EMPTY: Details = {
  name: "",
  email: "",
  company: "",
  country: "",
  phone: "",
  service: booking.services[0],
  budget: booking.budgets[booking.budgets.length - 1],
  description: "",
};

const STEPS: { id: Exclude<Step, "done">; label: string }[] = [
  { id: "details", label: "Your details" },
  { id: "review", label: "Review" },
  { id: "schedule", label: "Date & time" },
];

const field =
  "w-full rounded-xl border border-line bg-bg-soft px-4 py-3 text-base outline-none transition-colors placeholder:text-muted/60 focus:border-c2";

/**
 * Every country name the browser knows, sorted (no hard-coded list to maintain).
 * Built after mount: the build server's ICU data can name countries differently
 * from the browser, which would otherwise cause a hydration mismatch.
 */
function useCountries() {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    try {
      const names = new Intl.DisplayNames(["en"], { type: "region" });
      const out = new Set<string>();
      for (let i = 0; i < 26; i++)
        for (let j = 0; j < 26; j++) {
          const code = String.fromCharCode(65 + i, 65 + j);
          const n = names.of(code);
          // skip unassigned codes and groupings like "European Union" / "world"
          if (!n || n === code || /union|world|unknown|outlying|pseudo|nations|eurozone/i.test(n)) continue;
          out.add(n);
        }
      setList([...out].sort((a, b) => a.localeCompare(b)));
    } catch {
      setList([]);
    }
  }, []);
  return list;
}

/** "Asia/Kolkata (GMT+5:30)" */
function useTimezone() {
  const [tz, setTz] = useState("");
  useEffect(() => {
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset =
        new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "shortOffset" })
          .formatToParts(new Date())
          .find((p) => p.type === "timeZoneName")?.value ?? "";
      setTz(`${zone.replace(/_/g, " ")}${offset ? ` (${offset})` : ""}`);
    } catch {
      setTz("Your local timezone");
    }
  }, []);
  return tz;
}

function validate(d: Details) {
  const e: Partial<Record<keyof Details, string>> = {};
  if (d.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Please enter a valid email address.";
  if (!d.country) e.country = "Please select your country.";
  if (d.phone && !/^[+\d][\d\s()-]{6,}$/.test(d.phone.trim())) e.phone = "Please enter a valid phone number.";
  return e;
}

/** All project details in one block, passed to Calendly's first custom question (a1) */
function projectSummary(d: Details) {
  return [
    `Company: ${d.company || "—"}`,
    `Country: ${d.country}`,
    `Phone: ${d.phone || "—"}`,
    `Service: ${d.service}`,
    `Budget: ${d.budget}`,
    "",
    d.description.trim() || "(No description given)",
  ].join("\n");
}

function StepBar({ step }: { step: Step }) {
  const current = step === "done" ? STEPS.length : STEPS.findIndex((s) => s.id === step);
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Booking progress">
      {STEPS.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-3" aria-current={state === "current" ? "step" : undefined}>
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs transition-colors ${
                state === "todo" ? "border border-line text-muted" : "bg-gradient-line text-white"
              }`}
            >
              {state === "done" ? "✓" : `0${i + 1}`}
            </span>
            <span className={`hidden text-sm sm:block ${state === "todo" ? "text-muted" : "text-fg"}`}>{s.label}</span>
            {i < STEPS.length - 1 && <span className={`h-px flex-1 ${i < current ? "bg-gradient-line" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label,
  required,
  error,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label} {required ? <span className="text-c2">*</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="group relative inline-flex h-13 items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-medium text-white shadow-[0_10px_40px_-10px_var(--glow)] disabled:opacity-60"
    >
      <span className="bg-gradient-line absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
      <span className="relative">{children}</span>
      <span className="relative transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-medium transition hover:border-c2/50"
    />
  );
}

/** Calendly inline widget, prefilled from the form; reports back when the visitor books */
function CalendlyEmbed({ details, onScheduled }: { details: Details; onScheduled: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState(720);
  const [failed, setFailed] = useState(false);

  const src = useMemo(() => {
    const u = new URL(CALENDLY_URL);
    const params: Record<string, string> = {
      embed_domain: typeof window !== "undefined" ? window.location.host : "",
      embed_type: "Inline",
      hide_gdpr_banner: "1",
      name: details.name.trim(),
      email: details.email.trim(),
      a1: projectSummary(details),
      // Calendly's page around the card is always white, so the card stays light in
      // both themes (a dark card inside a white frame looks broken); brand blue accents
      background_color: "ffffff",
      text_color: "0b0e18",
      primary_color: "3466ff",
    };
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
  }, [details]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com" || typeof e.data !== "object" || !e.data) return;
      const { event, payload } = e.data as { event?: string; payload?: { height?: string } };
      if (event === "calendly.page_height" && payload?.height) {
        const h = parseInt(payload.height, 10);
        if (h > 300) setHeight(h);
      }
      if (event === "calendly.event_scheduled") onScheduled();
    };
    window.addEventListener("message", onMessage);
    // If the widget hasn't loaded after 15s (blocked network / ad blocker), say so
    const t = setTimeout(() => setFailed((f) => f || !loaded), 15000);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(t);
    };
  }, [onScheduled, loaded]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center" role="status">
          <div className="flex flex-col items-center gap-3 text-[#5a6078]">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-c2" />
            <span className="text-sm">Loading available times…</span>
          </div>
        </div>
      )}
      {failed && !loaded && (
        <p className="relative z-10 p-6 text-sm text-red-400">
          The booking calendar is taking too long to load. Please check your connection or disable any content blocker, then
          refresh the page — or reach us on WhatsApp below.
        </p>
      )}
      <iframe
        key={src}
        src={src}
        title="Select a date and time for your discovery call"
        onLoad={() => setLoaded(true)}
        style={{ height }}
        className={`block w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="rounded-3xl border border-dashed border-c2/50 bg-surface p-7 sm:p-9">
      <p className="eyebrow text-c2">Setup required</p>
      <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight">Booking calendar not configured yet</h3>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        Live availability, Google Meet links and confirmation emails come from Calendly, which hasn&apos;t been connected
        to this site yet. No times are shown until it is, so nothing here is a placeholder.
      </p>
      <p className="mt-6 text-sm text-muted">
        <strong className="text-fg">For the site owner:</strong> add your Calendly event link as{" "}
        <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_CALENDLY_URL</code> in{" "}
        <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-xs">.env.local</code> and in your hosting
        environment variables, then rebuild.
      </p>
    </div>
  );
}

export default function BookingFlow() {
  const [step, setStep] = useState<Step>("details");
  const [d, setD] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const countries = useCountries();
  const timezone = useTimezone();
  const top = useRef<HTMLDivElement>(null);
  const { scrollTo } = useApp();

  const set = (k: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setD((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const go = (next: Step) => {
    setStep(next);
    if (top.current) scrollTo(top.current.getBoundingClientRect().top + window.scrollY - 100);
  };

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(d);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`bk-${first}`)?.focus();
      return;
    }
    go("review");
  };

  const whatsapp = `https://wa.me/${booking.whatsapp || site.whatsapp}?text=${encodeURIComponent("Hi Codelyne! I'd like to book a discovery call.")}`;

  const summary = [
    { label: "Meeting", value: `Discovery call · ${booking.durationMinutes} minutes` },
    { label: "Platform", value: booking.platform },
    { label: "Your timezone", value: timezone },
    { label: "Name", value: d.name },
    { label: "Email", value: d.email },
    { label: "Company", value: d.company || "—" },
    { label: "Country", value: d.country },
    { label: "Phone", value: d.phone || "—" },
    { label: "Service", value: d.service },
    { label: "Budget", value: d.budget },
  ];

  return (
    <div ref={top} className="scroll-mt-28">
      {step !== "done" && (
        <div className="mb-10">
          <StepBar step={step} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === "details" && (
            <form onSubmit={submitDetails} noValidate className="rounded-3xl border border-line bg-surface p-6 sm:p-9">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Tell us about your project</h2>
              <p className="mt-2 text-muted">You&apos;ll pick a date and time in the next steps.</p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Field label="Full name" required error={errors.name} htmlFor="bk-name">
                  <input id="bk-name" autoComplete="name" value={d.name} onChange={set("name")} className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "bk-name-error" : undefined} />
                </Field>
                <Field label="Work email" required error={errors.email} htmlFor="bk-email">
                  <input id="bk-email" type="email" autoComplete="email" value={d.email} onChange={set("email")} className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "bk-email-error" : undefined} />
                </Field>
                <Field label="Company / business name" htmlFor="bk-company">
                  <input id="bk-company" autoComplete="organization" value={d.company} onChange={set("company")} className={field} />
                </Field>
                <Field label="Country" required error={errors.country} htmlFor="bk-country">
                  <select id="bk-country" autoComplete="country-name" value={d.country} onChange={set("country")} className={field} aria-invalid={!!errors.country} aria-describedby={errors.country ? "bk-country-error" : undefined}>
                    <option value="">Select your country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Phone number" error={errors.phone} htmlFor="bk-phone">
                  <input id="bk-phone" type="tel" autoComplete="tel" placeholder="+1 555 123 4567" value={d.phone} onChange={set("phone")} className={field} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "bk-phone-error" : undefined} />
                </Field>
                <Field label="Service required" required htmlFor="bk-service">
                  <select id="bk-service" value={d.service} onChange={set("service")} className={field}>
                    {booking.services.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <p className="mb-2 block text-sm font-medium">Project budget</p>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project budget">
                    {booking.budgets.map((b) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={d.budget === b}
                        key={b}
                        onClick={() => setD((prev) => ({ ...prev, budget: b }))}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          d.budget === b ? "border-transparent bg-fg text-bg" : "border-line text-muted hover:border-c2/60 hover:text-fg"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Field label="Project description" htmlFor="bk-description">
                    <textarea
                      id="bk-description"
                      rows={5}
                      value={d.description}
                      onChange={set("description")}
                      placeholder="What are you building, who is it for, and what does success look like?"
                      className={`${field} resize-none`}
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-2 block text-sm font-medium">Meeting platform</p>
                  <p className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg-soft px-4 py-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-c1" /> {booking.platform}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <PrimaryButton type="submit">Continue to review</PrimaryButton>
              </div>
            </form>
          )}

          {step === "review" && (
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-9">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Review your details</h2>
              <p className="mt-2 text-muted">Check everything looks right. You&apos;ll choose your date and time next.</p>
              <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {summary.map((row) => (
                  <div key={row.label} className="border-b border-line pb-4">
                    <dt className="eyebrow">{row.label}</dt>
                    <dd className="mt-1.5 break-words font-medium">{row.value}</dd>
                  </div>
                ))}
                <div className="border-b border-line pb-4 sm:col-span-2">
                  <dt className="eyebrow">Project description</dt>
                  <dd className="mt-1.5 whitespace-pre-line leading-relaxed text-muted">{d.description.trim() || "—"}</dd>
                </div>
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                <PrimaryButton type="button" onClick={() => go("schedule")}>
                  Choose date & time
                </PrimaryButton>
                <GhostButton onClick={() => go("details")}>← Edit details</GhostButton>
              </div>
            </div>
          )}

          {step === "schedule" && (
            <div>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">Pick a date & time</h2>
                  <p className="mt-2 text-muted">
                    Times are shown in your timezone{timezone ? ` — ${timezone}` : ""}. Your details are already filled in;
                    confirm your booking on the final screen.
                  </p>
                </div>
                <GhostButton onClick={() => go("review")}>← Back</GhostButton>
              </div>
              {calendlyConfigured ? <CalendlyEmbed details={d} onScheduled={() => go("done")} /> : <NotConfigured />}
              <p className="mt-6 text-sm text-muted">
                Having trouble?{" "}
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-c2 underline-offset-4 hover:underline">
                  Message us on WhatsApp
                </a>{" "}
                or email{" "}
                <a href={`mailto:${site.email}`} className="text-c2 underline-offset-4 hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </div>
          )}

          {step === "done" && (
            <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-7 text-center sm:p-12">
              <div aria-hidden className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-c2/20 blur-[100px]" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15 }}
                className="bg-gradient-line relative mx-auto grid h-16 w-16 place-items-center rounded-full text-2xl text-white"
              >
                ✓
              </motion.span>
              <h2 className="font-display relative mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{booking.confirmation.title}</h2>
              <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-muted">{booking.confirmation.message}</p>

              <dl className="relative mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
                {[
                  { label: "Duration", value: `${booking.durationMinutes} minutes` },
                  { label: "Platform", value: booking.platform },
                  { label: "Timezone", value: timezone },
                ].map((r) => (
                  <div key={r.label} className="rounded-2xl border border-line bg-bg-soft p-4">
                    <dt className="eyebrow">{r.label}</dt>
                    <dd className="mt-1.5 font-medium">{r.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="relative mx-auto mt-8 max-w-2xl rounded-2xl border border-line bg-bg-soft p-5 text-left">
                <p className="font-medium">Check your inbox ({d.email})</p>
                <p className="mt-1 text-sm text-muted">Calendly&apos;s confirmation email includes:</p>
                <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  {["Your meeting date & time", "Your Google Meet link", "Add to Google Calendar", "Reschedule or cancel links"].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <span className="bg-gradient-line grid h-4 w-4 place-items-center rounded-full text-[9px] text-white">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="relative mt-8 text-sm text-muted">
                Didn&apos;t get the email after a few minutes? Check your spam folder or{" "}
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-c2 underline-offset-4 hover:underline">
                  message us on WhatsApp
                </a>
                .
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
