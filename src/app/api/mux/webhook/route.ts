import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMuxWebhookSignature, getMuxConfig } from "@/lib/mux/client";

/**
 * Mux webhook endpoint.
 *
 * Configure in Mux Dashboard → Settings → Webhooks → Add:
 *   URL: https://djdannywest.com/api/mux/webhook
 *
 * Events we care about:
 *   video.asset.ready          — asset finished processing; we get playback_ids
 *   video.upload.asset_created — links an upload back to the new asset
 *   video.asset.errored        — flag the mix as needing attention
 */
export async function POST(request: NextRequest) {
  const cfg = getMuxConfig();
  if (!cfg) {
    return NextResponse.json({ error: "Mux not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("mux-signature");
  const valid = await verifyMuxWebhookSignature(rawBody, signature);

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    /* not JSON */
  }
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const type = payload?.type as string | undefined;
  const data = payload?.data as Record<string, unknown> | undefined;
  if (!data) return NextResponse.json({ ok: true });

  const admin = createAdminClient();

  try {
    // video.asset.ready  — we have a signed playback_id now
    if (type === "video.asset.ready") {
      const playbackIds = (data.playback_ids as Array<{ id: string; policy: string }>) ?? [];
      const signed = playbackIds.find((p) => p.policy === "signed") ?? playbackIds[0];
      const passthrough = data.passthrough as string | undefined;
      const durationSec = data.duration as number | undefined;
      if (signed?.id && passthrough) {
        // passthrough was set to the mix slug at upload time
        await admin
          .from("mixes")
          .update({
            mux_playback_id: signed.id,
            duration_seconds: durationSec ? Math.round(durationSec) : null,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", passthrough);
      }
    }

    // video.asset.errored — clear playback so the player doesn't try to load it
    if (type === "video.asset.errored") {
      const passthrough = data.passthrough as string | undefined;
      if (passthrough) {
        await admin
          .from("mixes")
          .update({
            mux_playback_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", passthrough);
      }
    }
  } catch (err) {
    console.error("[MUX WEBHOOK ERROR]", err);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    status: "Mux webhook endpoint live",
    configured: !!getMuxConfig(),
  });
}
