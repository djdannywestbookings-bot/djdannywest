import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { publishMix, unpublishMix, updateMixSeries } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMixesPage() {
  const supabase = createAdminClient();

  const [{ data: mixes }, { data: series }] = await Promise.all([
    supabase
      .from("mixes")
      .select("id, slug, title, subtitle, volume, is_published, published_at, series_id, mux_playback_id")
      .order("series_id", { ascending: true })
      .order("volume", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("series").select("id, title, slug"),
  ]);

  const seriesById = new Map((series ?? []).map((s) => [s.id, s]));

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
            — Mixes
          </p>
          <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
            The <span className="italic text-ember">catalog.</span>
          </h1>
        </div>
        <Link
          href="/admin/mixes/new"
          className="bg-cream px-5 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
        >
          + Upload a mix
        </Link>
      </div>

      <div className="divide-y divide-line border-y border-line">
        {(mixes ?? []).map((m) => {
          const s = m.series_id ? seriesById.get(m.series_id) : null;
          return (
            <div key={m.id} className="grid grid-cols-12 items-center gap-4 py-4">
              <div className="col-span-12 md:col-span-5">
                <div className="font-serif text-[17px] text-cream">
                  {m.title}
                  {m.subtitle ? <span className="text-cream/55"> · {m.subtitle}</span> : null}
                </div>
                <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                  /mixes/{m.slug}
                  {m.mux_playback_id ? " · Mux ready" : " · Mux pending"}
                </div>
              </div>
              <form action={updateMixSeries} className="col-span-12 md:col-span-3 flex gap-2">
                <input type="hidden" name="id" value={m.id} />
                <select
                  name="series_id"
                  defaultValue={m.series_id ?? ""}
                  className="flex-1 border border-line bg-night/40 px-3 py-2 font-sans text-[12px] text-cream focus:border-cream focus:outline-none"
                >
                  <option value="">(no series)</option>
                  {(series ?? []).map((sx) => (
                    <option key={sx.id} value={sx.id}>
                      {sx.title}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="border border-line px-3 font-sans text-[10px] uppercase tracking-[0.22em] text-cream/65 transition hover:border-cream hover:text-cream"
                >
                  Set
                </button>
              </form>
              <div className="col-span-6 md:col-span-2">
                {m.is_published ? (
                  <span className="border border-cream/40 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.22em] text-cream/75">
                    Published
                  </span>
                ) : (
                  <span className="border border-line px-2 py-1 font-sans text-[9px] uppercase tracking-[0.22em] text-cream/50">
                    Draft
                  </span>
                )}
              </div>
              <div className="col-span-6 md:col-span-2 flex justify-end">
                <form action={m.is_published ? unpublishMix : publishMix}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/65 transition hover:text-cream"
                  >
                    {m.is_published ? "Unpublish" : "Publish →"}
                  </button>
                </form>
              </div>
              {s && (
                <div className="col-span-12 -mt-2 font-sans text-[10px] uppercase tracking-[0.22em] text-cream/40">
                  Series: <Link href="/admin/series" className="underline">{s.title}</Link>
                </div>
              )}
            </div>
          );
        })}
        {(!mixes || mixes.length === 0) && (
          <div className="py-6 font-sans text-[13px] text-cream/45">No mixes in the DB yet.</div>
        )}
      </div>
    </div>
  );
}
