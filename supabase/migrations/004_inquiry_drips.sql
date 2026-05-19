-- ============================================================
-- Migration: Welcome-drip queue for booking inquiries
-- Run this in the Supabase SQL editor once. Idempotent.
-- ============================================================

-- Why this exists:
--   When a visitor submits a booking inquiry, we want to fire a 5-email
--   welcome sequence over ~14 days to build trust while Danny replies.
--   Resend doesn't have built-in long-delay scheduling, so we queue each
--   email in a row with a send_after timestamp, then a Vercel cron job
--   polls hourly and sends what's due.

create table if not exists public.inquiry_drips (
  id              uuid primary key default gen_random_uuid(),
  inquiry_id      uuid references public.booking_inquiries(id) on delete cascade,

  -- Recipient identity at enqueue-time (frozen so a renamed/deleted
  -- booking_inquiry doesn't break the send)
  contact_email   text not null,
  contact_name    text,
  event_type      text,
  event_date      date,

  -- Sequence step (1..5)
  step            integer not null check (step between 1 and 10),

  -- When this row becomes due
  send_after      timestamptz not null,

  -- Lifecycle
  --   queued → sent  (happy path)
  --   queued → canceled  (manually canceled, e.g. inquiry got a real reply
  --                       and we don't want to keep automating)
  --   queued → failed  (Resend rejected; we keep the row + error for retry)
  status          text not null default 'queued'
    check (status in ('queued', 'sent', 'canceled', 'failed')),

  sent_at         timestamptz,
  error           text,
  resend_id       text,

  created_at      timestamptz not null default now()
);

create index if not exists inquiry_drips_due_idx
  on public.inquiry_drips (status, send_after)
  where status = 'queued';

create index if not exists inquiry_drips_inquiry_idx
  on public.inquiry_drips (inquiry_id);

-- ============================================================
-- RLS: keep this server-only. Admin client (service role) is the
-- only legitimate writer/reader. No public access.
-- ============================================================
alter table public.inquiry_drips enable row level security;

-- Admins can read for debugging
drop policy if exists inquiry_drips_admin_all on public.inquiry_drips;
create policy inquiry_drips_admin_all on public.inquiry_drips
  for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- ============================================================
-- Done. To roll back:
--   drop table if exists public.inquiry_drips;
-- ============================================================
