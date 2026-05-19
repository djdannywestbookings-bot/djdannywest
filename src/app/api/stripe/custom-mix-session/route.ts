import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient, getStripeConfig } from "@/lib/stripe/client";

const CUSTOM_MIX_PRICE_CENTS = 10000; // $100

/**
 * Create a Stripe one-time-payment Checkout Session for the Custom Mix
 * product ($100 USD).
 *
 * Flow:
 *   1. Member submits the brief on /account/custom-mix (form posts JSON
 *      here)
 *   2. We insert a `custom_mix_orders` row with status='pending_payment'
 *      capturing the full brief (vibe, length, songs, etc.)
 *   3. We create a Stripe one-time checkout session in embedded mode,
 *      stamping the order UUID into client_reference_id + metadata so the
 *      webhook can flip the order to 'paid' on completion.
 *   4. The frontend mounts <EmbeddedCheckout> with the returned client_secret.
 *
 * On successful payment, Stripe redirects to:
 *   /account/custom-mix/success?session_id={CHECKOUT_SESSION_ID}
 * and our webhook is the authoritative signal that flips the order to
 * 'paid' + fires the Danny + customer emails.
 */
export async function POST(request: NextRequest) {
  const cfg = getStripeConfig();
  const stripe = getStripeClient();
  if (!cfg || !stripe) {
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

  let body: {
    vibe?: string;
    target_length_minutes?: number;
    occasion?: string;
    explicit_ok?: boolean;
    dont_do?: string;
    notes_to_danny?: string;
    songs?: Array<{ title: string; artist?: string; url?: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const songs = Array.isArray(body.songs)
    ? body.songs.filter(
        (s) => s && typeof s.title === "string" && s.title.trim().length > 0,
      )
    : [];
  if (songs.length < 8) {
    return NextResponse.json(
      { error: "Send at least 8 songs to build the mix around." },
      { status: 400 },
    );
  }
  if (songs.length > 20) {
    return NextResponse.json(
      { error: "Cap is 20 songs per order — drop a few." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // Insert pending order
  const { data: order, error: insertErr } = await admin
    .from("custom_mix_orders")
    .insert({
      member_id: user.id,
      status: "pending_payment",
      amount_cents: CUSTOM_MIX_PRICE_CENTS,
      currency: "usd",
      vibe: body.vibe ?? null,
      target_length_minutes: body.target_length_minutes ?? null,
      occasion: body.occasion ?? null,
      explicit_ok: body.explicit_ok !== false,
      dont_do: body.dont_do ?? null,
      notes_to_danny: body.notes_to_danny ?? null,
      songs,
    })
    .select("id")
    .single();
  if (insertErr || !order) {
    console.error("[custom-mix order insert]", insertErr);
    return NextResponse.json(
      { error: "Could not save your brief — try again." },
      { status: 500 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: CUSTOM_MIX_PRICE_CENTS,
            product_data: {
              name: "Custom Mix — DJ Danny West",
              description:
                "One 60–90 minute custom mix built around your songs. 7-day turnaround.",
            },
          },
        },
      ],
      customer_email: user.email ?? undefined,
      client_reference_id: order.id,
      payment_intent_data: {
        metadata: {
          order_id: order.id,
          member_id: user.id,
          product: "custom_mix",
        },
      },
      metadata: {
        order_id: order.id,
        member_id: user.id,
        product: "custom_mix",
      },
      return_url: `${origin}/account/custom-mix/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Stash the Stripe session id so we can correlate even if the webhook lags
    await admin
      .from("custom_mix_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({
      clientSecret: session.client_secret,
      orderId: order.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[custom-mix Stripe session]", err);
    // Best effort: mark the order so admins know payment never happened
    await admin
      .from("custom_mix_orders")
      .update({ status: "pending_payment", notes_to_danny: `[checkout init failed: ${message}]` })
      .eq("id", order.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
