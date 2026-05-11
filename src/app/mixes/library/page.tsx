import type { Metadata } from "next";
import mixesJson from "@/data/mixes.json";
import { MixesGrid } from "@/components/mixes/MixesGrid";
import type { Mix } from "@/components/mixes/MixCard";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Library — Member Archive",
  description:
    "Member library — full archive of DJ Danny West mixes. Streaming unlocks with an active subscription.",
  robots: { index: false, follow: false },
};

const mixes = mixesJson as Mix[];

export default function LibraryPage() {
  return (
    <main className="bg-night text-cream">
      <SiteNav active="mixes" />

      {/* Compact header — this is the member-facing browsing view */}
      <header className="relative overflow-hidden border-b border-line bg-night pb-14 pt-20 md:pb-16 md:pt-24">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-4">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Member library
            </div>
          </div>
          <div className="md:col-span-8">
            <h1 className="opsz-display font-display text-[14vw] font-light italic leading-[0.86] tracking-[-0.04em] text-cream md:text-[clamp(64px,8vw,128px)]">
              The archive.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/65 md:text-[16px]">
              Full audio unlocks with an active subscription. Until then,
              browse the catalog and queue up what you want to hear first.{" "}
              <a
                href="/mixes"
                className="text-ember underline decoration-ember/40 underline-offset-[5px] transition hover:text-cream hover:decoration-cream"
              >
                Subscribe →
              </a>
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-6 pb-32 pt-12 md:px-12 md:pb-40 md:pt-16">
        <MixesGrid mixes={mixes} />
      </section>

      <Footer />
    </main>
  );
}
