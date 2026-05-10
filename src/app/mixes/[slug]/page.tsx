import type { Metadata } from "next";
import { notFound } from "next/navigation";
import mixesJson from "@/data/mixes.json";
import type { Mix } from "@/components/mixes/MixCard";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { MixDetail } from "@/components/mixes/MixDetail";

const mixes = mixesJson as Mix[];

type Params = { slug: string };

export function generateStaticParams() {
  return mixes.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mix = mixes.find((m) => m.slug === slug);
  if (!mix) return { title: "Mix not found — DJ Danny West" };
  return {
    title: `${mix.title} · ${mix.subtitle} — DJ Danny West`,
    description: `Subscribers-only mix from DJ Danny West. ${mix.source}, ${mix.duration} run-time.`,
  };
}

export default async function MixPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const mixIndex = mixes.findIndex((m) => m.slug === slug);
  if (mixIndex === -1) notFound();

  const mix = mixes[mixIndex];
  // Sort newest-first so prev/next match the user's mental model on the index page
  const byVolDesc = [...mixes].sort((a, b) => b.vol - a.vol);
  const orderIndex = byVolDesc.findIndex((m) => m.slug === slug);
  const prev = byVolDesc[orderIndex - 1] ?? null; // newer
  const next = byVolDesc[orderIndex + 1] ?? null; // older

  return (
    <main className="bg-night text-cream">
      <SiteNav active="mixes" />
      <MixDetail mix={mix} prev={prev} next={next} />
      <Footer />
    </main>
  );
}
