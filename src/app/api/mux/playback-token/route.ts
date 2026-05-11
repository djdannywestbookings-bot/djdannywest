import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePlaybackToken, getMuxConfig } from "@/lib/mux/client";

/**
 * Issue a signed JWT for Mux playback of a specific mix.
 *
 * Client passes `?playbackId=...`. We verify the signed-in member has an
 * active subscription or comp via has_active_access(), then return a JWT
 * Mux Player will use to fetch the manifest.
 *
 * Tokens are short-lived (4h). Never cached publicly.
 */
export async function GET(request: NextRequest) {
  const cfg = getMuxConfig();
  if (!cfg) return NextResponse.json({ error: "Mux not configured" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const playbackId = searchParams.get("playbackId");
  if (!playbackId) {
    return NextResponse.json({ error: "Missing playbackId" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  // Gate via has_active_access SQL function
  const admin = createAdminClient();
  const { data: accessRow } = await admin.rpc("has_active_access", {
    p_member_id: user.id,
  });
  if (!accessRow) {
    return NextResponse.json({ error: "Subscribe to listen" }, { status: 402 });
  }

  const token = generatePlaybackToken(playbackId, "video");
  if (!token) return NextResponse.json({ error: "Token signing failed" }, { status: 500 });

  return NextResponse.json(
    { ok: true, token },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
