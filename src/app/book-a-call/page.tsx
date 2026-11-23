import type { Metadata } from "next";
import { booking } from "@/content/booking";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import BookingFlow from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description: "Schedule a free 30-minute discovery call with Codelyne over Google Meet. No obligation, available worldwide.",
};

export default function BookACall() {
  return (
    <main className="relative pb-24 pt-32 md:pt-40">
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-c2/15 blur-[140px]" />
      <div className="container-x">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="bg-gradient-line inline-block h-px w-8" />
              Book a discovery call
            </p>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            text={booking.title}
            className="font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-muted">{booking.subtitle}</p>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {booking.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4">
                <span className="bg-gradient-line grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] text-white">✓</span>
                <span className="text-sm font-medium">{h}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-14 md:mt-20">
          <BookingFlow />
        </div>
      </div>
    </main>
  );
}
