# Custom Mix — $100 one-time product

Single SKU: a 60–90 minute custom DJ mix built around 8–15 songs the
member sends. $100 USD, 7-day turnaround. Stripe one-time payment via
embedded checkout, lives at `/account/custom-mix`.

## One-time DB migration

Run in the **Supabase SQL editor** (browser, not your terminal):

`supabase/migrations/003_custom_mix_orders.sql`

Creates the `custom_mix_orders` table, indexes, the `updated_at` trigger
reuse, and RLS policies. Idempotent.

## Stripe webhook events

The existing webhook at `/api/stripe/webhook` already handles this. It
now branches on the event payload:

- `mode='subscription'` → existing subscription flow (unchanged)
- `mode='payment'` with `metadata.product='custom_mix'` → flips the
  matching `custom_mix_orders` row to `paid`, stores the
  payment_intent id, and fires confirmation emails.

The same `STRIPE_WEBHOOK_SECRET` you already set in Vercel is what
verifies these requests — no new env var.

## Customer flow

1. Logged-in member opens `/account/custom-mix`.
2. Fills the brief: vibe, target length, occasion, song list (8–15),
   don't-do, optional notes.
3. Clicks **Continue to checkout — $100**.
4. Browser POSTs the brief to `/api/stripe/custom-mix-session`. That
   route inserts a `custom_mix_orders` row with `status='pending_payment'`
   and creates a Stripe embedded session. Stripe `client_secret` flows
   back to the page.
5. `<EmbeddedCheckout>` renders. Member pays.
6. Stripe redirects to `/account/custom-mix/success?session_id=...`.
7. Stripe webhook fires `checkout.session.completed` → our handler
   flips the order to `paid` and sends Danny + the customer
   confirmation emails.

## Admin flow

1. Danny opens `/admin/custom-mixes` (now in the admin nav).
2. Paid + in-progress orders sort to the top. Click any to open the
   full brief.
3. **Mark in progress** flips status (visible to the member as
   "Building it now").
4. **Deliver mix** opens an inline form — paste a delivery URL
   (Dropbox / Drive / Mux stream / etc.) → status flips to `delivered`
   and a **delivery email** fires to the member with the link.
5. **Move back to queue** is the escape hatch if Danny clicked
   "Mark in progress" by mistake.

## Member-side tracking

The same `/account/custom-mix` page that holds the order form ALSO
lists every past order this member has placed with current status
+ delivery link when ready.

## What's NOT in this round

- Refund flow (manual via Stripe dashboard for now)
- Multi-revision flow (one revision is *implied* in the delivery
  email but not tracked as a separate state)
- Member-facing admin queue (members already see their own orders
  via the dashboard)
- Mux upload UI for the delivery file (Danny pastes a URL for now
  — could be expanded later to upload to Mux + store playback ID)

## Pricing knob

If you ever want to change the price, search for
`CUSTOM_MIX_PRICE_CENTS = 10000` in
`/src/app/api/stripe/custom-mix-session/route.ts`. Existing pending
orders keep their old amount (we snapshot price into the row), so a
price change won't break in-flight orders.
