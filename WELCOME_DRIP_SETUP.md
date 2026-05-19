# Welcome drip — 5-email sequence for booking inquiries

When anyone submits a booking inquiry (from `/book`, `/wedding-dj-guide`, or
city/service pages), they automatically get a 5-email welcome sequence
over 14 days. Built for lead retention — keeps the conversation warm
while Danny replies + recovers leads who go quiet.

## Schedule

| Step | Offset | Subject |
|---|---|---|
| 1 | 0 hours (next cron tick, within 1 hour) | "Got it, [name] — here's what happens next" |
| 2 | 48 hours | "While you wait — who I usually play for" |
| 3 | 120 hours (5 days) | "Venue notes — for [event type]" |
| 4 | 216 hours (9 days) | "One story from a wedding last fall" |
| 5 | 336 hours (14 days) | "Still thinking it over? (No pressure)" |

Schedule offsets are in `DRIP_SCHEDULE_HOURS` (src/lib/notifications/inquiry-drip.ts).

## One-time DB migration

Run in the **Supabase SQL editor** (browser, not your terminal):

`supabase/migrations/004_inquiry_drips.sql`

Creates the `inquiry_drips` queue table with RLS (server-only). Idempotent.

## One-time Vercel setup

### 1. Enable the cron job

`vercel.json` declares the cron schedule: `/api/cron/send-welcome-emails`
runs at the top of every hour. Vercel picks this up automatically on
the next deploy — nothing manual to wire up beyond the file.

### 2. Add `CRON_SECRET`

In Vercel → your project → Settings → Environment Variables, add:

- **Name**: `CRON_SECRET`
- **Value**: any long random string (e.g. `openssl rand -base64 32` output)
- **Environment**: Production

Vercel automatically passes this as `Authorization: Bearer ${CRON_SECRET}`
on real cron runs. Random visitors hitting the endpoint without this
secret get a 401.

### 3. (Optional) `BOOKING_REPLY_TO`

If not set, replies from drip emails go to `BOOKING_NOTIFICATIONS_TO`
(same as inquiry alerts). Set this if you want a separate inbox for
drip replies.

## Testing locally

You can hit the cron endpoint manually with a secret:

```
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://djdannywest.com/api/cron/send-welcome-emails
```

Or via the query-param shortcut (also locked down):

```
https://djdannywest.com/api/cron/send-welcome-emails?secret=YOUR_CRON_SECRET
```

The response tells you how many were processed:

```json
{ "processed": 3, "sent": 3, "failed": 0, "failures": [] }
```

## Canceling a drip

When a booking is confirmed or you want to manually stop a sequence, you
have two options:

1. **Programmatic**: import `cancelInquiryDrips(inquiryId)` from
   `src/lib/notifications/inquiry-drip-queue.ts` and call it (e.g. when
   you mark a booking status as `booked`/`completed` in the admin UI).
2. **Manual** (Supabase SQL editor):
   ```sql
   update public.inquiry_drips
     set status = 'canceled'
     where inquiry_id = '<the uuid>' and status = 'queued';
   ```

Optional follow-up: hook step 2 (`booked`/`completed`) into the admin
bookings page so canceling happens automatically — currently it doesn't.

## Email caveats

All drip emails:
- Send from the existing Resend `onboarding@resend.dev` sender (until
  djdannywest.com is verified as a sending domain).
- Have `reply-to: BOOKING_REPLY_TO ?? BOOKING_NOTIFICATIONS_TO` so
  replies route to Danny.
- Include an implicit unsubscribe line — recipients can reply "stop" to
  opt out (no automated handling yet — Danny manually cancels via SQL
  or the queue helper).

## When to expand

Real list-management features (true unsubscribe links, segmented sends,
A/B testing) are out of scope right now. If volume grows, consider
moving the templates into Resend Audiences or a tool like Loops/Customer.io.
