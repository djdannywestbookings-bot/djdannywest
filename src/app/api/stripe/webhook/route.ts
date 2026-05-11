import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getStripeClient,
  verifyStripeWebhook,
  getStripeConfig,
} from "@/lib/stripe/client";

/**
 * Stripe webhook endpoint.
 *
 * Subscribed events:
 *   checkout.session.completed       — fires when an embedded checkout finishes
 *   customer.subscription.created    — new sub started
 *   customer.subscription.updated    — status / period change (incl. cancellation scheduling)
 *   customer.subscription.deleted    — sub ended
 *   invoice.payment_succeeded        — recurring charge succeeded
 *   invoice.payment_failed           — recurring charge failed (downgrade etc.)
 *
 * Member matching:
 *   Subscriptions created by Embedded Checkout carry the member's UUID in
 *   subscription.metadata.member_id (set when we created the session). That's
 *   the primary match. Fallback: customer.email + auth.users lookup.
 */

const SUB_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: NextRequest) {
  const cfg = getStripeConfig();
  if (!cfg?.webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  const event = await verifyStripeWebhook(rawBody, signature);

  const admin = createAdminClient();

  // Log every webhook attempt (even invalid ones) for audit.
  await admin.from("stripe_webhook_events").upsert(
    {
      event_id: event?.id ?? `invalid-${Date.now()}`,
      event_type: event?.type ?? "invalid",
      signature_valid: !!event,
      raw: event ? (event as unknown as Record<string, unknown>) : { rawBody: rawBody.slice(0, 500) },
      processed: false,
    },
    { onConflict: "event_id" },
  );

  if (!event) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    if (SUB_EVENTS.has(event.type)) {
      await processSubscriptionEvent(admin, event);
    }

    await admin
      .from("stripe_webhook_events")
      .update({ processed: true })
      .eq("event_id", event.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook]", event.type, message);
    await admin
      .from("stripe_webhook_events")
      .update({ processed: false, error: message })
      .eq("event_id", event.id);
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  const cfg = getStripeConfig();
  return NextResponse.json({
    status: "Stripe webhook endpoint live",
    configured: !!cfg?.webhookSecret,
  });
}

/* ------------ helpers ------------ */

type AdminClient = ReturnType<typeof createAdminClient>;

async function processSubscriptionEvent(
  admin: AdminClient,
  event: Stripe.Event,
) {
  const stripe = getStripeClient();
  if (!stripe) throw new Error("Stripe client not configured");

  // Resolve to the Stripe Subscription object.
  let subscription: Stripe.Subscription | null = null;
  let memberId: string | null = null;
  let customerEmail: string | null = null;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    memberId = (session.client_reference_id as string | null) ?? null;
    customerEmail = (session.customer_details?.email ??
      session.customer_email ??
      null) as string | null;
    if (typeof session.subscription === "string") {
      subscription = await stripe.subscriptions.retrieve(session.subscription);
    } else if (session.subscription) {
      subscription = session.subscription as Stripe.Subscription;
    }
  } else {
    subscription = event.data.object as Stripe.Subscription;
    memberId =
      ((subscription.metadata?.member_id as string | undefined) ?? null) ||
      null;
    if (typeof subscription.customer === "string") {
      try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        if ("email" in customer && customer.email) {
          customerEmail = customer.email;
        }
      } catch {
        /* ignore */
      }
    }
  }

  if (!subscription) return; // nothing to write

  // Fallback: match by email if no member_id was carried through.
  if (!memberId && customerEmail) {
    const adminAuth = admin.auth.admin;
    let page = 1;
    while (page <= 50) {
      const { data: list } = await adminAuth.listUsers({
        page,
        perPage: 200,
      });
      const users = list?.users ?? [];
      const match = users.find(
        (u) => u.email?.toLowerCase() === customerEmail!.toLowerCase(),
      );
      if (match) {
        memberId = match.id;
        break;
      }
      if (users.length < 200) break;
      page++;
    }
  }

  if (!memberId) {
    console.warn(
      "[stripe webhook] could not match member for subscription",
      subscription.id,
      "email:",
      customerEmail,
    );
    return; // audit row still logged
  }

  // Map Stripe status → our normalized status. We use ACTIVE for both
  // active and trialing; everything else is CANCELED / PAUSED / etc.
  const stripeStatus = subscription.status;
  const normalizedStatus =
    stripeStatus === "active" || stripeStatus === "trialing"
      ? "ACTIVE"
      : stripeStatus === "canceled"
        ? "CANCELED"
        : stripeStatus.toUpperCase();

  const priceId =
    subscription.items?.data?.[0]?.price?.id ?? null;

  const startedAt = subscription.start_date
    ? new Date(subscription.start_date * 1000).toISOString()
    : null;
  const canceledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000).toISOString()
    : null;

  const patch = {
    status: normalizedStatus,
    stripe_subscription_id: subscription.id,
    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    stripe_price_id: priceId,
    started_at: startedAt,
    canceled_at: canceledAt,
    last_event: event.type,
    last_event_at: new Date().toISOString(),
    raw: event as unknown as Record<string, unknown>,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (existing) {
    await admin.from("subscriptions").update(patch).eq("id", existing.id);
  } else {
    await admin.from("subscriptions").insert({
      member_id: memberId,
      ...patch,
      created_at: new Date().toISOString(),
    });
  }
}
