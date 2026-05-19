import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getStripeClient,
  verifyStripeWebhook,
  getStripeConfig,
} from "@/lib/stripe/client";
import { site } from "@/lib/site";

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
    // Custom-mix one-time payments come through checkout.session.completed
    // with mode='payment'. processSubscriptionEvent ignores those, so we
    // also fire processCustomMixPayment for them.
    if (event.type === "checkout.session.completed") {
      await processCustomMixPayment(admin, event);
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

/**
 * Handle one-time payment for the Custom Mix product.
 *
 * Fired by checkout.session.completed when mode='payment' and the
 * session metadata identifies this as a custom_mix order. Flips the
 * matching custom_mix_orders row to 'paid', stamps the payment intent
 * id, and fires confirmation emails to Danny + the customer.
 */
async function processCustomMixPayment(admin: AdminClient, event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== "payment") return;
  if ((session.metadata?.product ?? null) !== "custom_mix") return;
  const orderId =
    (session.client_reference_id as string | null) ??
    (session.metadata?.order_id as string | undefined) ??
    null;
  if (!orderId) {
    console.warn("[stripe custom-mix] no order id on session", session.id);
    return;
  }

  // Idempotency: skip if we've already flipped this order to paid.
  const { data: existing } = await admin
    .from("custom_mix_orders")
    .select("id, status, member_id, songs, vibe, target_length_minutes, occasion, dont_do, notes_to_danny")
    .eq("id", orderId)
    .maybeSingle();
  if (!existing) {
    console.warn("[stripe custom-mix] order not found", orderId);
    return;
  }
  if (existing.status !== "pending_payment") {
    return; // already handled
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  await admin
    .from("custom_mix_orders")
    .update({
      status: "paid",
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
    })
    .eq("id", orderId);

  // Fire confirmation emails — best-effort, never throw out of the webhook
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const dannyEmail = process.env.BOOKING_NOTIFICATIONS_TO;
    if (apiKey && dannyEmail) {
      const resend = new Resend(apiKey);
      const customerEmail =
        (session.customer_details?.email ??
          session.customer_email ??
          null) as string | null;
      const customerName = session.customer_details?.name ?? "there";

      const songsList =
        (existing.songs as Array<{ title: string; artist?: string; url?: string }>)
          ?.map(
            (s, i) =>
              `<li>${i + 1}. ${escapeHtml(s.title)}${s.artist ? ` — ${escapeHtml(s.artist)}` : ""}${s.url ? ` <a href=\"${escapeHtml(s.url)}\">link</a>` : ""}</li>`,
          )
          .join("") ?? "";

      // To Danny — full brief + reply-to customer
      await resend.emails.send({
        from: "DJ Danny West <onboarding@resend.dev>",
        to: [dannyEmail],
        replyTo: customerEmail ?? undefined,
        subject: `Custom mix paid · ${customerName}`,
        html: `<!doctype html><html><body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
<table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="600" style="max-width:600px;background:#FFF;border:1px solid #E5DDD0;">
<tr><td style="padding:32px 36px 8px;">
<div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">Custom Mix · $100 · Paid</div>
<div style="font-family:Georgia,serif;font-size:28px;font-style:italic;color:#0A0907;margin-top:6px;">${escapeHtml(customerName ?? "Anonymous")}</div>
<div style="font-size:13px;color:#6E665D;margin-top:4px;">${escapeHtml(customerEmail ?? "(no email on session)")}</div>
</td></tr>
<tr><td style="padding:8px 36px 0;font-size:14px;line-height:1.6;color:#111;">
<hr style="border:0;border-top:1px solid #E5DDD0;margin:16px 0;" />
<p style="margin:10px 0;"><b>Vibe:</b> ${escapeHtml(existing.vibe ?? "—")}</p>
<p style="margin:10px 0;"><b>Length:</b> ${existing.target_length_minutes ?? "—"} min</p>
<p style="margin:10px 0;"><b>Occasion:</b> ${escapeHtml(existing.occasion ?? "—")}</p>
${existing.dont_do ? `<p style="margin:10px 0;"><b>Don&rsquo;t do:</b> ${escapeHtml(existing.dont_do)}</p>` : ""}
${existing.notes_to_danny ? `<p style="margin:10px 0;"><b>Notes:</b> ${escapeHtml(existing.notes_to_danny)}</p>` : ""}
<p style="margin:14px 0 6px;"><b>Songs (${(existing.songs as unknown[])?.length ?? 0}):</b></p>
<ol style="padding-left:20px;margin:6px 0;">${songsList}</ol>
</td></tr>
<tr><td style="padding:18px 36px 32px;">
<a href="${site.url}/admin/custom-mixes/${orderId}" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:12px 22px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Open in admin →</a>
</td></tr>
</table></td></tr></table></body></html>`,
      });

      // To customer — confirmation + ETA expectation
      if (customerEmail) {
        const firstName = (customerName || "").split(/\s+/)[0] || "there";
        await resend.emails.send({
          from: "DJ Danny West <onboarding@resend.dev>",
          to: [customerEmail],
          replyTo: dannyEmail,
          subject: "Your custom mix is in the queue — DJ Danny West",
          html: `<!doctype html><html><body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
<table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="560" style="max-width:560px;background:#FFF;border:1px solid #E5DDD0;">
<tr><td style="padding:36px 36px 0;">
<div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">Custom mix · $100 · Paid</div>
<h1 style="font-family:Georgia,serif;font-style:italic;font-weight:normal;font-size:32px;line-height:1.1;color:#0A0907;margin:14px 0 4px;">Thanks, ${escapeHtml(firstName)}.</h1>
<p style="font-size:15px;line-height:1.6;color:#111;margin:14px 0;">I got your brief and your payment. I&rsquo;ll personally listen to your songs, plan the flow, and start building — you&rsquo;ll get a delivery email within 7 days (usually 4-5).</p>
<p style="font-size:15px;line-height:1.6;color:#111;margin:14px 0;">If I need anything clarified, I&rsquo;ll reply directly to this email. You can also reply here any time.</p>
</td></tr>
<tr><td align="center" style="padding:18px 36px 36px;">
<a href="${site.url}/account/custom-mix" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:12px 22px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Track your order →</a>
</td></tr>
<tr><td style="padding:0 36px 28px;font-size:13px;color:#6E665D;line-height:1.55;">
— Danny<br/>
<span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9E948A;">DJ Danny West · Custom Mixes</span>
</td></tr>
</table></td></tr></table></body></html>`,
        });
      }
    }
  } catch (err) {
    console.error("[custom-mix confirmation emails]", err);
    // Don't rethrow — the webhook should still 200 so Stripe doesn't retry
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
