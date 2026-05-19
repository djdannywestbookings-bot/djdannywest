import { createClient } from "@/lib/supabase/server";
import type { Mix } from "@/components/mixes/MixCard";

export type DbMix = {
  id: string;
  slug: string;
  series_id: string | null;
  volume: number | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string | null;
  audio_url: string | null;
  mux_playback_id: string | null;
  duration_seconds: number | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
};

export type DbSeries = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string | null;
  sort_order: number;
  is_published: boolean;
};

/**
 * Format seconds as MM:SS or H:MM:SS.
 */
function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "—";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Adapt a DbMix row into the legacy Mix shape used by MixCard / MixDetail.
 */
export function adaptMix(row: DbMix, seriesTitle?: string): Mix {
  return {
    vol: row.volume ?? 0,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    source: seriesTitle ?? "Mix",
    series: seriesTitle ?? "",
    durationSec: row.duration_seconds ?? 0,
    duration: formatDuration(row.duration_seconds),
    isExplicit: false,
    coverArt: row.cover_url ?? "/cover-art/placeholder.svg",
    tags: row.tags ?? [],
  };
}

/**
 * Get all published series, sorted by sort_order then title.
 */
export async function getAllSeries(): Promise<DbSeries[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("series")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });
  return (data as DbSeries[]) ?? [];
}

/**
 * Get a single series by slug.
 */
export async function getSeriesBySlug(slug: string): Promise<DbSeries | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("series")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as DbSeries) ?? null;
}

/**
 * Get all published mixes for a series, newest-volume first.
 */
export async function getMixesForSeries(seriesId: string): Promise<DbMix[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mixes")
    .select("*")
    .eq("series_id", seriesId)
    .eq("is_published", true)
    .order("volume", { ascending: false })
    .order("published_at", { ascending: false });
  return (data as DbMix[]) ?? [];
}

/**
 * Get a single mix by slug, with its series info.
 */
export async function getMixBySlug(
  slug: string,
): Promise<{ mix: DbMix; series: DbSeries | null } | null> {
  const supabase = await createClient();
  const { data: mix } = await supabase
    .from("mixes")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!mix) return null;

  let series: DbSeries | null = null;
  if ((mix as DbMix).series_id) {
    const { data: s } = await supabase
      .from("series")
      .select("*")
      .eq("id", (mix as DbMix).series_id)
      .maybeSingle();
    series = (s as DbSeries) ?? null;
  }
  return { mix: mix as DbMix, series };
}

/**
 * Get the single most-recently published mix across all series. Used by
 * the member dashboard's "Just Dropped" hero.
 */
export async function getLatestMix(): Promise<DbMix | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mixes")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  return (data as DbMix) ?? null;
}

/**
 * For each published series, return the series + its newest mix (or null).
 * Used by the member dashboard's "Your Series" shelf.
 */
export async function getSeriesWithLatestMix(): Promise<
  Array<{ series: DbSeries; latest: DbMix | null }>
> {
  const supabase = await createClient();
  const seriesList = await getAllSeries();
  if (seriesList.length === 0) return [];

  const seriesIds = seriesList.map((s) => s.id);
  const { data: mixes } = await supabase
    .from("mixes")
    .select("*")
    .in("series_id", seriesIds)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  const latestBySeries = new Map<string, DbMix>();
  for (const m of (mixes as DbMix[]) ?? []) {
    if (!m.series_id) continue;
    if (!latestBySeries.has(m.series_id)) latestBySeries.set(m.series_id, m);
  }

  return seriesList.map((s) => ({
    series: s,
    latest: latestBySeries.get(s.id) ?? null,
  }));
}

/**
 * Get the prev/next mix within the same series for a given mix slug.
 * Newest-first ordering — "prev" = newer, "next" = older, matching the UX of the library page.
 */
export async function getMixSiblings(
  mix: DbMix,
): Promise<{ prev: DbMix | null; next: DbMix | null }> {
  if (!mix.series_id) return { prev: null, next: null };
  const supabase = await createClient();
  const { data } = await supabase
    .from("mixes")
    .select("*")
    .eq("series_id", mix.series_id)
    .eq("is_published", true)
    .order("volume", { ascending: false });
  const list = (data as DbMix[]) ?? [];
  const idx = list.findIndex((m) => m.slug === mix.slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: list[idx - 1] ?? null,
    next: list[idx + 1] ?? null,
  };
}
