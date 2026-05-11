import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  verifyWebhookSignature,
  getSquareConfig,
  getCustomerEmail,
} from "@/lib/square/client";

/**
 * Square webhook endpoint.
 *
 * Square POSTs signed events here. We verify the signature, log every event
 * into square_webhook_events for audit, and on subscription.created/updated
 * we match the Square customer to a member by email (via Square Customers
 * API) and upsert the subscriptions row so has_active_access() returns true.
 *
 * Configure the URL in Square Developer Dashboard → Application → Webhooks:
 *   https://djdannywest.com/api/square/webhook
 *
 * Subscribed events:
 *   subscription.created
 *   subscription.updated
 *   invoice.payment_made
 */

export async function POST(request: NextRequest) {
  const cfg = getSquareConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Square webhook signing key not configured" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com"}/api/square/webhook`;

  const valid = await verifyWebhookSignature(rawBody, signature, url);

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    // not JSON — log and bail
  }

  const eventId = (payload?.event_id as string) ?? null;
  const eventType = (payload?.type as string) ?? null;

  const admin = createAdminClient();

  // Log every event (even invalid ones) for audit
  await admin.from("square_webhook_events").upsert(
    {
      event_id: eventId,
      event_type: eventType,
      signature_valid: valid,
      raw: payload,
      processed: false,
    },
    { onConflict: "event_id" },
  );

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Process subscription lifecycle events
  try {
    const dataObject = (payload?.data as { object?: Record<string, unknown> })
      ?.object;
    const sub = dataObject?.subscription as Record<string, unknown> | undefined;

    if (
      sub &&
      (eventType === "subscription.created" ||
        eventType === "subscription.updated")
    ) {
      const squareSubscriptionId = sub.id as string;
      const status = (sub.status as string) ?? "PENDING";
      const customerId = sub.customer_id as string | undefined;
      const planId = sub.plan_variation_id as string | undefined;
      const startDate = sub.start_date as string | undefined;
      const canceledDate = sub.canceled_date as string | undefined;

      // Look up existing row by square_subscription_id (idempotent updates)
      const { data: existing } = await admin
        .from("subscriptions")
        .select("id, member_id")
        .eq("square_subscription_id", squareSubscriptionId)
        .maybeSingle();

      // If no existing row, try to match to a member by Square customer email.
      // This is how Path B (hosted checkout) links a payment back to a member.
      let memberId: string | null = existing?.member_id ?? null;
      if (!memberId && customerId) {
        const email = await getCustomerEmail(customerId);
        if (email) {
          const adminAuth = admin.auth.admin;
          // Paginate through users to find one with this email.
          let page = 1;
          while (page <= 50) {
            const { data: list } = await adminAuth.listUsers({
              page,
              perPage: 200,
            });
            const match = (list?.users ?? []).find(
              (u) => u.email?.toLowerCase() === email.toLowerCase(),
            );
            if (match) {
              memberId = match.id;
              break;
            }
            if ((list?.users?.length ?? 0) < 200) break;
            page++;
          }
        }
      }

      const patch = {
        status,
        square_customer_id: customerId ?? null,
        square_plan_id: planId ?? null,
        square_subscription_id: squareSubscriptionId,
        started_at: startDate ? new Date(startDate).toISOString() : null,
        canceled_at: canceledDate ? new Date(canceledDate).toISOString() : null,
        last_event: eventType,
        last_event_at: new Date().toISOString(),
        raw: payload,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await admin.from("subscriptions").update(patch).eq("id", existing.id);
      } else if (memberId) {
        // Insert a new row tying this Square subscription to the member
        await admin.from("subscriptions").insert({
          member_id: memberId,
          ...patch,
          created_at: new Date().toISOString(),
        });
      }
      // If memberId is still null we leave the audit row but can't activate.
      // An admin can manually grant a comp via /admin/members.
    }

    await admin
      .from("square_webhook_events")
      .update({ processed: true })
      .eq("event_id", eventId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await admin
      .from("square_webhook_events")
      .update({ processed: false, error: message })
      .eq("event_id", eventId);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    status: "Square webhook endpoint live",
    configured: !!getSquareConfig(),
  });
}
