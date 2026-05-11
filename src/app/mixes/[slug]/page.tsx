import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { MixDetail } from "@/components/mixes/MixDetail";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  adaptMix,
  getMixBySlug,
  getMixSiblings,
} from "@/lib/mixes/queries";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getMixBySlug(slug);
  if (!found) return { title: "Mix not found" };
  const { mix } = found;
  return {
    title: `${mix.title} · ${mix.subtitle ?? ""}`.trim(),
    description: `Subscribers-only mix from DJ Danny West.`,
  };
}

export default async function MixPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const found = await getMixBySlug(slug);
  if (!found) notFound();

  const { mix, series } = found;
  const siblings = await getMixSiblings(mix);

  const seriesTitle = series?.title;
  const adapted = adaptMix(mix, seriesTitle);
  const prev = siblings.prev ? adaptMix(siblings.prev, seriesTitle) : null;
  const next = siblings.next ? adaptMix(siblings.next, seriesTitle) : null;

  // Compute streaming access for this visitor.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let hasAccess = false;
  if (user) {
    const admin = createAdminClient();
    const { data: accessRow } = await admin.rpc("has_active_access", {
      p_member_id: user.id,
    });
    hasAccess = !!accessRow;
  }

  return (
    <main className="bg-night text-cream">
      <SiteNav active="mixes" />
      <MixDetail
        mix={adapted}
        prev={prev}
        next={next}
        muxPlaybackId={mix.mux_playback_id ?? null}
        hasAccess={hasAccess}
      />
      <Footer />
    </main>
  );
}
