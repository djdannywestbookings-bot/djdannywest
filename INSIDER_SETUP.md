# Insider blog — setup

A members-only blog that lives at `/insider`. Access goes to:

- **Active subscribers** (`subscriptions.status = 'ACTIVE'`)
- **Confirmed booking clients** (`booking_inquiries.status` in `'booked'`, `'completed'`)
- **Admins** (always)

Everyone else hits a friendly gate that points them to `/subscribe` or `/book`. The pages are `noindex` so Google never sees them.

## One-time DB migrations

Open the **Supabase SQL editor** for the `djdannywest` project and run, in order:

1. `supabase/migrations/001_posts_insider.sql` — creates the `posts` table + RLS + `has_insider_access()` SQL function.
2. `supabase/migrations/002_insider_notification_pref.sql` — adds `insider_posts_email` column to `member_notification_prefs` (default `true`). Members can toggle this in `/account/notifications`.

Both migrations are idempotent (uses `if not exists` and `drop policy if exists` patterns) — re-run them any time without harm.

## Marking a booking as confirmed

Confirmed booking access checks against `booking_inquiries.status`. To grant a past client access to the Insider section, flip their row's `status` to `booked` or `completed` from the admin UI (`/admin/bookings`).

## Publishing a post

1. Go to `/admin/posts` (link added to the admin nav)
2. Fill in the **New post** form. Saves as a draft and drops you straight into the edit screen.
3. Write the body in Markdown (supports `##`/`###` headings, `**bold**`, `*italic*`, `[link](url)`, `> blockquote`, lists, code blocks). Raw HTML is escaped for safety.
4. Hit **Save changes** as you go.
5. When ready, click **Publish + email blast**.

Publishing fires an email blast via Resend to every active subscriber + every confirmed booking client (deduped by lowercase email). The subject line is `Insider · <Title>`. If `RESEND_API_KEY` isn't set the blast is skipped and logged to the server console.

## Subscriber sign-up flow already builds the audience

Anyone who subscribes through `/subscribe` is automatically eligible. Anyone whose booking gets marked `booked` or `completed` is automatically eligible. No allow-list to maintain.

## Roll back

```sql
drop function if exists public.has_insider_access(uuid);
drop table if exists public.posts;
```
