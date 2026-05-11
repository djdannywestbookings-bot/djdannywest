import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient, getStripeConfig } from "@/lib/stripe/client";

/**
 * Create a Stripe Checkout Session in embedded mode for the signed-in member.
 *
 * The frontend mounts <EmbeddedCheckout> with the returned client_secret. The
 * checkout form lives inside our /subscribe page — no redirect to Stripe's
 * hosted page.
 *
 * On successful payment, Stripe redirects to /subscribe/success?session_id={CHECKOUT_SESSION_ID}.
 * The webhook (separate route) is the authoritative signal that flips the
 * subscription to ACTIVE.
 */
export async function POST(_request: NextRequest) {
  const cfg = getStripeConfig();
  const stripe = getStripeClient();
  if (!cfg || !stripe || !cfg.priceId) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
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
  const email = user.email ?? undefined;

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "subscription",
      line_items: [{ price: cfg.priceId, quantity: 1 }],
      customer_email: email,
      // Embed our internal member_id so the webhook can match the payment
      // back to a member without an extra API call.
      client_reference_id: user.id,
      subscription_data: {
        metadata: { member_id: user.id },
      },
      // After payment, Stripe redirects the embedded form to this URL with a session_id.
      return_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      allow_promotion_codes: false,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe checkout-session] failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
