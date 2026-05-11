import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSquareClient, getSquareConfig } from "@/lib/square/client";

/**
 * Start a $20/mo subscription for the signed-in member.
 *
 * Client POSTs:
 *   { sourceId: string }  // card nonce from Square Web Payments SDK
 *
 * Server:
 *   1. Get the signed-in user.
 *   2. Create (or reuse) a Square Customer for them.
 *   3. Save the card on the customer.
 *   4. Start the subscription against SQUARE_PLAN_VARIATION_ID.
 *   5. Insert a subscriptions row with status PENDING; webhooks flip it to ACTIVE.
 *   6. Return { ok: true } or { error }.
 */
export async function POST(request: NextRequest) {
  const cfg = getSquareConfig();
  const sq = getSquareClient();
  if (!cfg || !sq) {
    return NextResponse.json(
      { error: "Square is not configured yet. Add Square credentials to Vercel env vars and try again." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  let body: { sourceId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const sourceId = body.sourceId;
  if (!sourceId) {
    return NextResponse.json({ error: "Missing card token" }, { status: 400 });
  }

  try {
    // 1. Create or reuse a Square customer for this member
    const admin = createAdminClient();
    const { data: existingSub } = await admin
      .from("subscriptions")
      .select("square_customer_id")
      .eq("member_id", user.id)
      .not("square_customer_id", "is", null)
      .limit(1)
      .maybeSingle();

    let customerId = existingSub?.square_customer_id as string | undefined;

    if (!customerId) {
      const customerResp = await sq.customers.create({
        emailAddress: user.email ?? undefined,
        givenName: (user.user_metadata?.name as string) ?? undefined,
        referenceId: user.id,
      });
      customerId = customerResp.customer?.id;
      if (!customerId) {
        return NextResponse.json(
          { error: "Couldn't create Square customer" },
          { status: 500 },
        );
      }
    }

    // 2. Attach card-on-file to customer
    const cardResp = await sq.cards.create({
      idempotencyKey: crypto.randomUUID(),
      sourceId,
      card: {
        customerId,
      },
    });
    const cardId = cardResp.card?.id;
    if (!cardId) {
      return NextResponse.json(
        { error: "Couldn't save card to customer" },
        { status: 500 },
      );
    }

    // 3. Start the subscription
    const subResp = await sq.subscriptions.create({
      idempotencyKey: crypto.randomUUID(),
      locationId: cfg.locationId,
      planVariationId: cfg.planVariationId,
      customerId,
      cardId,
    });
    const sub = subResp.subscription;
    if (!sub?.id) {
      return NextResponse.json(
        { error: "Couldn't start subscription" },
        { status: 500 },
      );
    }

    // 4. Persist locally — webhook will flip status to ACTIVE
    await admin.from("subscriptions").insert({
      member_id: user.id,
      square_customer_id: customerId,
      square_subscription_id: sub.id,
      square_plan_id: cfg.planVariationId,
      square_location_id: cfg.locationId,
      status: sub.status ?? "PENDING",
      amount_cents: 2000,
      currency: "USD",
      cadence: "MONTHLY",
      started_at: sub.startDate ? new Date(sub.startDate).toISOString() : null,
    });

    return NextResponse.json({ ok: true, subscriptionId: sub.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Square checkout endpoint live",
    configured: !!getSquareConfig(),
  });
}
