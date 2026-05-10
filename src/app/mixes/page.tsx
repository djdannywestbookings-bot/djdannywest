import type { Metadata } from "next";
import mixesJson from "@/data/mixes.json";
import { PageHeader } from "@/components/mixes/PageHeader";
import { MixesGrid } from "@/components/mixes/MixesGrid";
import type { Mix } from "@/components/mixes/MixCard";

export const metadata: Metadata = {
  title: "Mixes — DJ Danny West",
  description:
    "The full archive of DJ Danny West mixes. SiriusXM Pitbull Globalization, residencies, weddings, after-hours. Streaming locked to subscribers.",
};

const mixes = mixesJson as Mix[];

export default function MixesPage() {
  return (
    <main className="bg-night text-cream">
      {/* Same nav system as the homepage hero */}
      <header className="absolute left-0 right-0 top-0 z-30 mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <a href="/" className="flex items-center gap-3">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wordmark-white.png"
            alt="Danny West"
            width={1053}
            height={652}
            className="h-9 w-auto md:h-10"
          />
        </a>
        <nav className="hidden items-center gap-10 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/65 md:flex">
          <a href="/mixes" className="text-cream transition hover:text-cream">Mixes</a>
          <a href="/#book" className="transition hover:text-cream">Book</a>
          <a href="/#subscribe" className="transition hover:text-cream">Subscribe</a>
        </nav>
        <a
          href="/#subscribe"
          className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember transition hover:text-cream"
        >
          $20 / mo →
        </a>
      </header>

      <PageHeader />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 pt-16 md:px-12 md:pb-40 md:pt-20">
        <MixesGrid mixes={mixes} />
      </section>
    </main>
  );
}
