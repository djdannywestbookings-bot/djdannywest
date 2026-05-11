import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { MixesGrid } from "@/components/mixes/MixesGrid";
import { getCurrentUser } from "@/lib/supabase/getUser";
import { adaptMix, getAllSeries, getMixesForSeries } from "@/lib/mixes/queries";

export const metadata: Metadata = {
  title: "Library — Member Archive",
  description:
    "Member library — full archive of DJ Danny West mixes. Streaming unlocks with an active subscription.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  // Gate behind sign-in. Anonymous visitors get bounced to the subscribe pitch.
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mixes/library");

  const seriesList = await getAllSeries();

  // Load mixes per series. Done sequentially to keep payloads sane; can be parallelised later.
  const shelves = await Promise.all(
    seriesList.map(async (s) => {
      const mixes = await getMixesForSeries(s.id);
      return { series: s, mixes };
    }),
  );

  const totalMixes = shelves.reduce((n, sh) => n + sh.mixes.length, 0);

  return (
    <main className="bg-night text-cream">
      <SiteNav active="mixes" />

      {/* Compact header */}
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
              {totalMixes} mixes across {shelves.length}{" "}
              {shelves.length === 1 ? "series" : "series"}. Audio unlocks with an active
              subscription —{" "}
              <Link
                href="/mixes"
                className="text-ember underline decoration-ember/40 underline-offset-[5px] transition hover:text-cream hover:decoration-cream"
              >
                Subscribe →
              </Link>{" "}
              to stream. Until then, browse and queue what you want to hear first.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 pb-32 pt-12 md:px-12 md:pb-40 md:pt-16">
        {shelves.length === 0 && (
          <div className="border border-dashed border-line/60 p-8 font-sans text-[14px] text-cream/55">
            No series yet. Check back soon.
          </div>
        )}

        {shelves.map(({ series, mixes }) => {
          if (mixes.length === 0) return null;
          const seriesTitle = series.title;
          const adapted = mixes.map((m) => adaptMix(m, seriesTitle));
          return (
            <section key={series.id} className="mb-24 last:mb-0">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line/60 pb-5">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
                    — Series
                  </p>
                  <h2 className="mt-2 font-serif text-[36px] leading-[0.95] tracking-[-0.01em] text-cream md:text-[44px]">
                    {series.title}
                  </h2>
                  {series.subtitle && (
                    <div className="mt-2 font-sans text-[12px] uppercase tracking-[0.22em] text-cream/55">
                      {series.subtitle}
                    </div>
                  )}
                </div>
                <Link
                  href={`/mixes/series/${series.slug}`}
                  className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 transition hover:text-cream"
                >
                  View all {mixes.length} →
                </Link>
              </div>
              {/* Show up to 8 newest per shelf — full list lives on /mixes/series/[slug] */}
              <MixesGrid mixes={adapted.slice(0, 8)} />
            </section>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
