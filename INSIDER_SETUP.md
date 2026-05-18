# Insider blog — setup

A members-only blog that lives at `/insider`. Access goes to:

- **Active subscribers** (`subscriptions.status = 'ACTIVE'`)
- **Confirmed booking clients** (`booking_inquiries.status` in `'booked'`, `'completed'`)
- **Admins** (always)

Everyone else hits a friendly gate that points them to `/subscribe` or `/book`. The pages are `noindex` so Google never sees them.

## One-time DB migration

Open the **Supabase SQL editor** for the `djdannywest` project and run the contents of `supabase/migrations/001_posts_insider.sql`. It:

1. Creates the `posts` table (slug, title, excerpt, cover, body_markdown, status, published_at, timestamps)
2. Adds an `updated_at` trigger
3. Creates `has_insider_access(user_id)` SQL function (the same access rules the app uses)
4. Enables RLS on `posts` with two policies:
   - `posts_read_published` — published posts visible only to users who pass `has_insider_access()`
   - `posts_admin_all` — admins have full CRUD

The migration is idempotent (uses `if not exists` and `drop policy if exists` patterns) — re-run it any time without harm.

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
