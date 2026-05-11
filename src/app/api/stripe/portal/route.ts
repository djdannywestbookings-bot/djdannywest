import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/client";

/**
 * Create a Stripe Customer Portal session and redirect the member there.
 *
 * Members use the portal to:
 *   - cancel their subscription
 *   - update card on file
 *   - download invoices
 *
 * Stripe hosts the portal UI. After they're done, Stripe sends them back
 * to /account/subscription via the return_url.
 */
export async function POST(_request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Look up the member's Stripe customer ID from their most recent subscription.
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("member_id", user.id)
    .not("stripe_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No Stripe customer found for this account" },
      { status: 404 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${origin}/account/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe portal] failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
