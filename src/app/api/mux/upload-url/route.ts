import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";
import { getMuxClient } from "@/lib/mux/client";

/**
 * Create a Mux direct-upload URL. Admin-only.
 *
 * Client uses this URL with the Mux uploader to send the audio file straight
 * to Mux without it ever touching Vercel's edge. When Mux finishes processing,
 * we get a `video.asset.ready` webhook which sets mux_playback_id on the mix.
 *
 * The client passes a "passthrough" string (the mix slug) so the webhook can
 * look up which mix to attach the asset to.
 */
export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mux = getMuxClient();
  if (!mux) {
    return NextResponse.json({ error: "Mux not configured" }, { status: 503 });
  }

  let body: { mixSlug?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* empty body OK */
  }
  const mixSlug = body.mixSlug ?? null;

  try {
    const upload = await mux.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com",
      new_asset_settings: {
        playback_policies: ["signed"],
        // Audio-only: skip generating standard video resolutions.
        max_resolution_tier: "1080p",
        passthrough: mixSlug ?? undefined,
      },
    });
    return NextResponse.json({ ok: true, uploadUrl: upload.url, uploadId: upload.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
