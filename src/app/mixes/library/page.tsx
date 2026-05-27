import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { LibraryAccordion, type Shelf } from "@/components/library/LibraryAccordion";
import { getCurrentUser } from "@/lib/supabase/getUser";
import { getAllSeries, getMixesForSeries } from "@/lib/mixes/queries";
import { createAdminClient } from "@/lib/supabase/admin";

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

  // Subscription gate — checked server-side on every request so the page
  // reflects the current truth. The /api/mux/playback-token endpoint
  // also re-checks this, so even a stale page can't replay if the sub
  // has lapsed since the page was loaded.
  const admin = createAdminClient();
  const { data: accessRow } = await admin.rpc("has_active_access", {
    p_member_id: user.id,
  });
  const hasAccess = !!accessRow;

  const seriesList = await getAllSeries();
  const shelves: Shelf[] = await Promise.all(
    seriesList.map(async (s) => {
      const mixes = await getMixesForSeries(s.id);
      return {
        series: {
          id: s.id,
          slug: s.slug,
          title: s.title,
          subtitle: s.subtitle,
          cover_url: s.cover_url,
        },
        mixes: mixes.map((m) => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          subtitle: m.subtitle,
          volume: m.volume,
          cover_url: m.cover_url,
          mux_playback_id: m.mux_playback_id,
          duration_seconds: m.duration_seconds,
          published_at: m.published_at,
        })),
      };
    }),
  );

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
            <h1 className="opsz-display font-display text-[10vw] font-light italic leading-[0.92] tracking-[-0.035em] text-cream md:text-[clamp(48px,6vw,96px)]">
              DJ Danny West Mixes
            </h1>
            <p className="mt-6 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/65 md:text-[16px]">
              Tap a series to expand. Click any cover to start streaming.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 pb-32 pt-10 md:px-12 md:pb-40 md:pt-14">
        <LibraryAccordion shelves={shelves} hasAccess={hasAccess} />
      </div>

      <Footer />
    </main>
  );
}
