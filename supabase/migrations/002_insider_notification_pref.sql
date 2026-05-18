-- ============================================================
-- Migration: Insider-posts email notification preference
-- Run this in the Supabase SQL editor (or via the CLI) once.
-- Idempotent — safe to re-run.
-- ============================================================

-- 1. Add the column to the prefs table. Default ON so existing members
--    keep getting Insider blasts until they actively opt out.
alter table public.member_notification_prefs
  add column if not exists insider_posts_email boolean not null default true;

-- ============================================================
-- Done. To roll back:
--   alter table public.member_notification_prefs drop column insider_posts_email;
-- ============================================================
