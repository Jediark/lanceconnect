-- =============================================================
-- Migration: Add Paystack & Flutterwave columns to profiles
-- Safe to re-run (all statements are idempotent with IF NOT EXISTS)
-- =============================================================

-- Payment gateway identifier (stripe | paystack | flutterwave)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS payment_gateway TEXT DEFAULT 'stripe';

-- Paystack columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS paystack_reference TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS paystack_subscription_code TEXT;

-- Flutterwave columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS flutterwave_tx_ref TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS flutterwave_tx_id TEXT;

-- Indexes for webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_paystack_customer_code
  ON public.profiles (paystack_customer_code)
  WHERE paystack_customer_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_flutterwave_tx_ref
  ON public.profiles (flutterwave_tx_ref)
  WHERE flutterwave_tx_ref IS NOT NULL;
