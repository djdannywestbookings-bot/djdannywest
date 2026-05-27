import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
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

  // Pull display name + email from the Supabase user so the sidebar can
  // show "Member · {Name}" / email. Falls back gracefully when metadata
  // is missing.
  const meta = (user.user_metadata ?? {}) as {
    display_name?: string;
    full_name?: string;
    name?: string;
  };
  const displayName =
    meta.display_name ||
    meta.full_name ||
    meta.name ||
    user.email?.split("@")[0] ||
    "Member";
  const email = user.email ?? "";

  return (
    <main className="min-h-screen bg-night text-cream">
      <AccountShell active="library" displayName={displayName} email={email}>
        <header className="mb-10 md:mb-14">
          <h1 className="opsz-display font-display text-[10vw] font-light italic leading-[0.92] tracking-[-0.035em] text-cream md:text-[clamp(48px,5.5vw,88px)]">
            DJ Danny West Mixes
          </h1>
          <p className="mt-5 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/65 md:text-[16px]">
            Tap a series to expand. Click any cover to start streaming.
          </p>
        </header>

        <LibraryAccordion shelves={shelves} hasAccess={hasAccess} />
      </AccountShell>
    </main>
  );
}
