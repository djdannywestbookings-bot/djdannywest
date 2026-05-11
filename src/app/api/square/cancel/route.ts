import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSquareClient, getSquareConfig } from "@/lib/square/client";

/**
 * Cancel the signed-in member's active Square subscription.
 *
 * Implementation note: Square's API uses "cancel" to schedule cancellation
 * at the end of the current billing period. The subscription stays ACTIVE
 * until the period ends. Webhook flips status to CANCELED.
 */
export async function POST(_request: NextRequest) {
  const cfg = getSquareConfig();
  const sq = getSquareClient();
  if (!cfg || !sq) {
    return NextResponse.json({ error: "Square not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("id, square_subscription_id, status")
    .eq("member_id", user.id)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub?.square_subscription_id) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 },
    );
  }

  try {
    await sq.subscriptions.cancel({ subscriptionId: sub.square_subscription_id as string });
    await admin
      .from("subscriptions")
      .update({
        canceled_at: new Date().toISOString(),
        last_event: "manual.cancel",
        last_event_at: new Date().toISOString(),
      })
      .eq("id", sub.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
