import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { MixesGrid } from "@/components/mixes/MixesGrid";
import {
  adaptMix,
  getMixesForSeries,
  getSeriesBySlug,
} from "@/lib/mixes/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);
  if (!series) return { title: "Series not found" };
  return {
    title: series.title,
    description: series.description ?? `${series.title} — DJ Danny West mix series.`,
    robots: { index: false, follow: false },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);
  if (!series) notFound();

  const rawMixes = await getMixesForSeries(series.id);
  const mixes = rawMixes.map((m) => adaptMix(m, series.title));

  return (
    <main className="bg-night text-cream">
      <SiteNav active="mixes" />

      <header className="relative overflow-hidden border-b border-line bg-night pb-14 pt-20 md:pb-16 md:pt-24">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-4">
            <Link
              href="/mixes/library"
              className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
            >
              ← All series
            </Link>
            <div className="mt-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Series · {mixes.length} {mixes.length === 1 ? "mix" : "mixes"}
            </div>
          </div>
          <div className="md:col-span-8">
            <h1 className="opsz-display font-display text-[12vw] font-light italic leading-[0.86] tracking-[-0.04em] text-cream md:text-[clamp(56px,7vw,112px)]">
              {series.title}
            </h1>
            {series.subtitle && (
              <p className="mt-4 font-sans text-[13px] uppercase tracking-[0.24em] text-cream/55">
                {series.subtitle}
              </p>
            )}
            {series.description && (
              <p className="mt-6 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/65 md:text-[16px]">
                {series.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-6 pb-32 pt-12 md:px-12 md:pb-40 md:pt-16">
        {mixes.length === 0 ? (
          <div className="border border-dashed border-line/60 p-8 font-sans text-[14px] text-cream/55">
            No mixes in this series yet.
          </div>
        ) : (
          <MixesGrid mixes={mixes} />
        )}
      </section>

      <Footer />
    </main>
  );
}
