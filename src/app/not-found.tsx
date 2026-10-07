import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404 · Broken link</p>
      <h1 className="font-display mt-6 text-[clamp(3rem,10vw,7rem)] font-semibold leading-none tracking-[-0.05em]">
        This line <span className="text-gradient">leads nowhere.</span>
      </h1>
      <Link href="/" className="bg-fg text-bg mt-10 inline-flex h-14 items-center rounded-full px-8 font-medium">
        ← Back home
      </Link>
    </main>
  );
}
