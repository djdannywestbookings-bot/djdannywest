-- ============================================================
-- Migration: Insider posts + gating helper
-- Run this in the Supabase SQL editor (or via the CLI) once.
-- It's idempotent — safe to re-run.
-- ============================================================

-- 1. POSTS TABLE ----------------------------------------------
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  cover_image_url text,
  body_markdown text not null default '',
  status        text not null default 'draft' check (status in ('draft', 'published')),
  author_id     uuid references auth.users(id) on delete set null,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc nulls last);

create index if not exists posts_slug_idx on public.posts (slug);

-- 2. UPDATED_AT TRIGGER ---------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- 3. INSIDER-ACCESS HELPER -----------------------------------
-- Returns true if the given user is allowed to read /insider content.
-- Rules:
--   - admin allow-list  → true
--   - active subscriber → true
--   - confirmed booking → true (booking_inquiries.status in ('booked','completed')
--                               and the email matches the user's auth email)
--   - else              → false
create or replace function public.has_insider_access(p_member_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  if p_member_id is null then
    return false;
  end if;

  -- Admin always sees insider content.
  if exists (select 1 from public.admin_users where user_id = p_member_id) then
    return true;
  end if;

  -- Active subscription = access.
  if exists (
    select 1 from public.subscriptions
    where member_id = p_member_id and status = 'ACTIVE'
  ) then
    return true;
  end if;

  -- Confirmed booking client = access (status booked or completed, email match).
  select email into v_email from auth.users where id = p_member_id;
  if v_email is not null and exists (
    select 1 from public.booking_inquiries
    where lower(contact_email) = lower(v_email)
      and status in ('booked', 'completed')
  ) then
    return true;
  end if;

  return false;
end;
$$;

grant execute on function public.has_insider_access(uuid) to authenticated, anon;

-- 4. RLS POLICIES --------------------------------------------
alter table public.posts enable row level security;

-- Wipe and recreate (idempotent) — the policies are the source of truth.
drop policy if exists posts_read_published        on public.posts;
drop policy if exists posts_admin_all             on public.posts;

-- READ: published posts visible only to users who pass has_insider_access().
-- Server-side gating still belongs in the route — RLS is the safety net.
create policy posts_read_published on public.posts
  for select
  using (
    status = 'published'
    and public.has_insider_access(auth.uid())
  );

-- ALL: admins can do everything (read drafts, create, update, delete).
create policy posts_admin_all on public.posts
  for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- ============================================================
-- Done. To roll back:
--   drop function if exists public.has_insider_access(uuid);
--   drop table if exists public.posts;
-- ============================================================
