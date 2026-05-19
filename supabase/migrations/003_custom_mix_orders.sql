-- ============================================================
-- Migration: Custom mix orders ($100 one-time product)
-- Run this in the Supabase SQL editor once.
-- Idempotent — safe to re-run.
-- ============================================================

-- 1. ORDERS TABLE -------------------------------------------
create table if not exists public.custom_mix_orders (
  id                   uuid primary key default gen_random_uuid(),
  member_id            uuid not null references auth.users(id) on delete cascade,

  -- Stripe pointers
  stripe_session_id    text unique,
  stripe_payment_intent_id text,

  -- Lifecycle
  --   pending_payment → paid → in_progress → delivered
  --   refunded is terminal
  status               text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'in_progress', 'delivered', 'refunded')),

  -- Pricing snapshot at order time (in case the SKU price changes later)
  amount_cents         integer not null default 10000,
  currency             text not null default 'usd',

  -- Brief
  vibe                 text,            -- 'wedding' | 'gym' | 'peak-time' | 'chill' | etc.
  target_length_minutes integer,
  occasion             text,
  explicit_ok          boolean not null default true,
  dont_do              text,
  notes_to_danny       text,
  -- Song list as JSON: [{ title, artist?, url? }, ...]
  songs                jsonb not null default '[]'::jsonb,

  -- Delivery
  delivery_mix_url     text,            -- direct file URL (e.g. Mux MP4 download or signed CDN URL)
  delivery_playback_id text,            -- Mux playback ID if streaming via Mux too
  delivered_at         timestamptz,
  refunded_at          timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists custom_mix_orders_member_idx
  on public.custom_mix_orders (member_id, created_at desc);
create index if not exists custom_mix_orders_status_idx
  on public.custom_mix_orders (status, created_at desc);

-- 2. UPDATED_AT TRIGGER -------------------------------------
-- public.set_updated_at() was created in migration 001. Reuse it.
drop trigger if exists custom_mix_orders_set_updated_at on public.custom_mix_orders;
create trigger custom_mix_orders_set_updated_at
  before update on public.custom_mix_orders
  for each row execute function public.set_updated_at();

-- 3. RLS POLICIES -------------------------------------------
alter table public.custom_mix_orders enable row level security;

drop policy if exists custom_mix_orders_read_own       on public.custom_mix_orders;
drop policy if exists custom_mix_orders_admin_all      on public.custom_mix_orders;

-- Members can read their own orders.
create policy custom_mix_orders_read_own on public.custom_mix_orders
  for select
  using (auth.uid() = member_id);

-- Admins (admin_users allow-list) have full access.
create policy custom_mix_orders_admin_all on public.custom_mix_orders
  for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Note: inserts + updates from the server happen via service-role client
-- (createAdminClient()), which bypasses RLS. That's the only legitimate
-- path for setting status, attaching delivery URLs, and recording Stripe IDs.

-- ============================================================
-- Done. To roll back:
--   drop table if exists public.custom_mix_orders;
-- ============================================================
