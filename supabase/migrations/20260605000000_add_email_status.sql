-- =============================================================
-- Migration: Add transactional email tracking to profiles
-- Safe to re-run (idempotent with ADD COLUMN IF NOT EXISTS)
-- =============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS quota_warning_sent BOOLEAN DEFAULT FALSE;
