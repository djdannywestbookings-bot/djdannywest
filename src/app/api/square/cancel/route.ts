import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSquareClient } from "@/lib/square/client";

/**
 * Cancel the signed-in member's active Square subscription.
 *
 * With Path B (hosted checkout link), this still works as long as
 * SQUARE_ACCESS_TOKEN is configured — Square's SDK accepts cancel calls
 * regardless of whether the subscription was created via API or hosted link.
 */
export async function POST(_request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const sq = getSquareClient();
  if (!sq) {
    return NextResponse.json(
      {
        error: "Square not configured for API access",
        message:
          "Cancel requires SQUARE_ACCESS_TOKEN. Contact support to cancel manually.",
      },
      { status: 503 },
    );
  }

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("id, square_subscription_id, status")
    .eq("member_id", user.id)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (!sub?.square_subscription_id) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 },
    );
  }

  try {
    await sq.subscriptions.cancel({ subscriptionId: sub.square_subscription_id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "POST to cancel current subscription" });
}
