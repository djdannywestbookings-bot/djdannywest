# DJ Danny West — Build Progress

Last touched: 2026-05-11

## Live at djdannywest.com

### Public pages
- **/** — hero (full-bleed promo video), credits marquee, manifesto, "where it's played" credits, footer
- **/mixes** — subscription pitch page with 3 pillars and Subscribe CTA → /subscribe
- **/mixes/library** — DB-backed series-shelf layout (gated to signed-in members)
- **/mixes/series/[slug]** — individual series detail
- **/mixes/[slug]** — per-mix detail with prev/next within series
- **/book** — editorial booking inquiry form; persists to DB + emails via Resend
- **/dj-dallas** + **/dj-fort-worth** — SEO-targeted city landing pages
- **/merchandise** — coming-soon page
- **/subscribe** — Square Web Payments SDK card form; gated to signed-in users
- **/login**, **/signup**, **/forgot-password**, **/reset-password** — auth flow

### Member-facing (signed-in)
- **/account** — dashboard with 5 action cards
- **/account/notifications** — email pref toggles (saved to DB)
- **/account/subscription** — view + cancel subscription
- **/account/request-mix** — submit a mix request, see past requests (1 per 30d)

### Admin (gated to djdannywestbookings@gmail.com)
- **/admin** — overview: 7 stat tiles + recent signups
- **/admin/members** — searchable, filterable members list
- **/admin/members/[id]** — full member detail: identity editor, activity, comp grant/revoke, private admin notes, password reset
- **/admin/series** — series CRUD (create/edit/publish/delete)
- **/admin/mixes** — mix list, publish/unpublish, series-assignment
- **/admin/requests** — mix request queue with status workflow + admin response
- **/admin/bookings** — booking inquiry queue with status workflow + private admin notes

### API routes
- **POST /api/square/checkout** — starts a Square subscription
- **POST /api/square/webhook** — receives Square events, syncs subscriptions table
- **POST /api/square/cancel** — cancels signed-in member's active subscription

## Database (Supabase)

### Tables (all with RLS)
- `profiles` — extends auth.users
- `series` — mix collections
- `mixes` — DB-backed catalog (19 SiriusXM mixes seeded)
- `member_plays` — play tracking (writes when Mux is wired)
- `member_mix_seen` — "new" badge tracking
- `member_followed_series` — series follows
- `member_notification_prefs` — email/SMS opt-ins
- `comp_grants` — free-access grants
- `admin_notes` — private notes per member
- `admin_users` — admin allowlist (Danny seeded)
- `subscriptions` — Square-backed sub state
- `square_webhook_events` — audit log
- `mix_requests` — member submissions, admin workflow
- `booking_inquiries` — persisted from /book form

### Functions
- `is_admin()` — checks admin_users
- `has_active_access(member_id)` — true if ACTIVE sub OR active comp grant

### Triggers
- `on_auth_user_created` — auto-creates profile + notification_prefs rows on signup

## Auth
- Email + password via Supabase Auth
- Email verification (Supabase sends from noreply@mail.app.supabase.io)
- Forgot/reset password flow
- Smart redirect: signed-in users hitting /login bounce to /account
- Friendly error messages via `humanise()` helper
- OAuth buttons (Google / Apple) disabled with "SOON" labels until providers configured

## What's wired but waiting on env vars in Vercel

### Square subscriptions
Code is shipped; checkout/webhook/cancel routes return 503 cleanly until configured.
See **SQUARE_SETUP.md** in your workspace folder for the 15-minute setup checklist.

Required env vars:
- `SQUARE_ACCESS_TOKEN`
- `SQUARE_LOCATION_ID`
- `SQUARE_PLAN_VARIATION_ID`
- `SQUARE_WEBHOOK_SIGNATURE_KEY`
- `SQUARE_ENVIRONMENT` (sandbox | production)
- `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
- `NEXT_PUBLIC_SQUARE_LOCATION_ID`
- `NEXT_PUBLIC_SQUARE_ENVIRONMENT`

### Resend booking emails
Already wired; sends from `onboarding@resend.dev` (default) until djdannywest.com is verified
on Resend.

## What's NOT yet built (next-session candidates)

1. **Mux audio player** — DB column `mux_playback_id` exists, but no upload UI, no
   gated playback URLs, no persistent mini-player, no play-tracking writes.
2. **New-mix email alerts** — notification prefs save to DB, but no trigger that
   sends "new mix uploaded" emails via Resend yet.
3. **Custom mix purchase ($100)** — Square one-time charge flow.
4. **Spotify playlist intake parsing** — playlist URLs save now, but no Spotify API
   integration to fetch tracks and surface admin-side trends.
5. **Member dashboard upgrades** — "continue listening" (resume-state), "new since
   last visit" badge in nav, "recommended for you" based on listening history.
6. **Library page polish** — currently slices to 8 mixes per shelf with "View all" link;
   could grow into "trending this week" / "in progress" / "never played" filters.
7. **Google OAuth** — Application + OAuth consent screen + Supabase provider config.
8. **Apple Sign-in** — requires $99/yr Apple Developer Program.

## Working rules
1. Be honest about what's real — don't claim something works that hasn't been tested
2. Scope discipline — don't refactor unrelated things
3. Stop at real blockers — flag what needs Danny vs what I can do solo
4. No hidden changes — every commit message describes what changed
5. Validate before claiming "done" — local tsc + next build before pushing
6. Drive autonomously — only ask Danny for things only Danny can do
7. Secrets never in chat — PATs generated via Chrome, stored in temp files, revoked
