import { Reveal, SplitText } from "@/components/ui/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  className = "",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Reveal>
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="bg-gradient-line inline-block h-px w-8" />
          {eyebrow}
        </p>
      </Reveal>
      <SplitText
        text={title}
        className="font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
      />
      {text && (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{text}</p>
        </Reveal>
      )}
    </div>
  );
}
