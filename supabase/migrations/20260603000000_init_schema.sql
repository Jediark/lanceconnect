-- ============================================================
-- LANCECONNECT DATABASE SCHEMA v1.1 (Idempotent)
-- Safe to re-run in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================================
-- TABLE 1: PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                      UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                   TEXT NOT NULL,
  full_name               TEXT,
  avatar_url              TEXT,
  freelancer_category     TEXT NOT NULL DEFAULT 'web_dev' CHECK (
    freelancer_category IN (
      'web_dev', 'designer', 'copywriter', 'seo',
      'social_media', 'video', 'photography',
      'marketing', 'app_dev', 'va', 'tutor', 'other'
    )
  ),
  bio                     TEXT,
  website_url             TEXT,
  country                 TEXT,
  city                    TEXT,
  plan                    TEXT NOT NULL DEFAULT 'free' CHECK (
    plan IN ('free', 'starter', 'pro', 'agency')
  ),
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  subscription_status     TEXT DEFAULT 'inactive',
  subscription_end_date   TIMESTAMPTZ,
  leads_used_this_month   INTEGER NOT NULL DEFAULT 0,
  leads_limit             INTEGER NOT NULL DEFAULT 10,
  credits_balance         INTEGER NOT NULL DEFAULT 0,
  month_reset_date        DATE NOT NULL DEFAULT DATE_TRUNC('month', NOW())::DATE,
  last_login_at           TIMESTAMPTZ,
  login_count             INTEGER DEFAULT 0,
  is_banned               BOOLEAN DEFAULT false,
  ban_reason              TEXT,
  onboarding_completed    BOOLEAN DEFAULT false,
  preferred_language      TEXT DEFAULT 'en',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- TABLE 2: LEADS (global business database)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name         TEXT NOT NULL,
  business_type         TEXT,
  industry              TEXT NOT NULL,
  description           TEXT,
  country               TEXT NOT NULL,
  country_code          TEXT,
  state_province        TEXT,
  city                  TEXT NOT NULL,
  district              TEXT,
  full_address          TEXT,
  postal_code           TEXT,
  latitude              DECIMAL(10,7),
  longitude             DECIMAL(10,7),
  timezone              TEXT,
  phone                 TEXT,
  phone_verified        BOOLEAN DEFAULT false,
  phone_verified_at     TIMESTAMPTZ,
  phone_whatsapp_link   TEXT,
  email                 TEXT,
  email_verified        BOOLEAN DEFAULT false,
  email_verified_at     TIMESTAMPTZ,
  email_confidence      TEXT CHECK (email_confidence IN ('verified', 'likely', 'unverified')),
  website_url           TEXT,
  has_website           BOOLEAN NOT NULL DEFAULT false,
  website_live          BOOLEAN,
  website_score         INTEGER,
  website_mobile_ok     BOOLEAN,
  website_has_ssl       BOOLEAN,
  website_screenshot    TEXT,
  website_load_time_ms  INTEGER,
  has_facebook          BOOLEAN DEFAULT false,
  facebook_url          TEXT,
  has_instagram         BOOLEAN DEFAULT false,
  instagram_url         TEXT,
  has_twitter           BOOLEAN DEFAULT false,
  twitter_url           TEXT,
  has_tiktok            BOOLEAN DEFAULT false,
  has_linkedin          BOOLEAN DEFAULT false,
  has_youtube           BOOLEAN DEFAULT false,
  social_scan_done      BOOLEAN DEFAULT false,
  social_scanned_at     TIMESTAMPTZ,
  google_place_id       TEXT UNIQUE,
  google_maps_url       TEXT,
  google_rating         DECIMAL(2,1) CHECK (google_rating BETWEEN 0 AND 5),
  google_review_count   INTEGER DEFAULT 0,
  google_photo_url      TEXT,
  google_categories     TEXT[],
  opportunity_score     INTEGER CHECK (opportunity_score BETWEEN 0 AND 100),
  score_breakdown       JSONB,
  source                TEXT NOT NULL DEFAULT 'google_maps',
  data_quality_score    INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
  is_verified           BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,
  last_verified_at      TIMESTAMPTZ,
  cache_expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  fetch_count           INTEGER DEFAULT 1,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_leads_industry        ON public.leads(industry);
CREATE INDEX IF NOT EXISTS idx_leads_country         ON public.leads(country);
CREATE INDEX IF NOT EXISTS idx_leads_city            ON public.leads(LOWER(city));
CREATE INDEX IF NOT EXISTS idx_leads_score           ON public.leads(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_has_website     ON public.leads(has_website);
CREATE INDEX IF NOT EXISTS idx_leads_place_id        ON public.leads(google_place_id);
CREATE INDEX IF NOT EXISTS idx_leads_cache_expires   ON public.leads(cache_expires_at);
CREATE INDEX IF NOT EXISTS idx_leads_country_city    ON public.leads(country, LOWER(city));
CREATE INDEX IF NOT EXISTS idx_leads_industry_country ON public.leads(industry, country);
CREATE INDEX IF NOT EXISTS idx_leads_name_search ON public.leads USING GIN(to_tsvector('english', business_name));

-- ============================================================
-- TABLE 3: USER_LEADS (saved leads / personal pipeline)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id         UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'contacted', 'interested', 'proposal_sent',
    'won', 'lost', 'not_relevant'
  )),
  notes           TEXT,
  follow_up_date  DATE,
  deal_value      DECIMAL(10,2),
  contacted_at    TIMESTAMPTZ,
  responded_at    TIMESTAMPTZ,
  won_at          TIMESTAMPTZ,
  saved_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lead_id)
);

DROP TRIGGER IF EXISTS user_leads_updated_at ON public.user_leads;
CREATE TRIGGER user_leads_updated_at
  BEFORE UPDATE ON public.user_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_user_leads_user_id    ON public.user_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_leads_status     ON public.user_leads(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_leads_follow_up  ON public.user_leads(follow_up_date) WHERE follow_up_date IS NOT NULL;

-- ============================================================
-- TABLE 4: OUTREACH_TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.outreach_templates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  channel     TEXT NOT NULL DEFAULT 'email' CHECK (
    channel IN ('email', 'phone_script', 'linkedin', 'whatsapp', 'sms')
  ),
  subject     TEXT,
  body        TEXT NOT NULL,
  variables   TEXT[],
  is_default  BOOLEAN DEFAULT false,
  use_count   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_user ON public.outreach_templates(user_id);

-- ============================================================
-- TABLE 5: AI_GENERATED_MESSAGES (cache AI outputs)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id       UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  channel       TEXT NOT NULL,
  tone          TEXT NOT NULL DEFAULT 'professional',
  message       TEXT NOT NULL,
  tokens_used   INTEGER,
  model         TEXT DEFAULT 'gemini-1.5-flash',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lead_id, channel, tone)
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_user ON public.ai_messages(user_id);

-- ============================================================
-- TABLE 6: SEARCH_HISTORY (re-runnable searches)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.search_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query_params    JSONB NOT NULL,
  results_count   INTEGER,
  leads_consumed  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON public.search_history(user_id, created_at DESC);

-- ============================================================
-- TABLE 7: CREDIT_TRANSACTIONS (for pay-per-use model)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type                TEXT NOT NULL CHECK (type IN ('purchase', 'consumption', 'refund', 'bonus')),
  amount              INTEGER NOT NULL,
  balance_after       INTEGER NOT NULL,
  description         TEXT,
  stripe_payment_id   TEXT,
  lead_id             UUID REFERENCES public.leads(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credits_user ON public.credit_transactions(user_id, created_at DESC);

-- ============================================================
-- TABLE 8: RATE_LIMIT_LOG (prevent abuse)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address  INET,
  endpoint    TEXT NOT NULL,
  count       INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, endpoint, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_user     ON public.rate_limit_log(user_id, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip       ON public.rate_limit_log(ip_address, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limit_window   ON public.rate_limit_log(window_start);

-- ============================================================
-- TABLE 9: AUDIT_LOG (security compliance)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  metadata    JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user       ON public.audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action     ON public.audit_log(action, created_at DESC);

-- ============================================================
-- TABLE 10: SYSTEM_JOBS (background job tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.system_jobs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'completed', 'failed')
  ),
  params        JSONB,
  result        JSONB,
  error_message TEXT,
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY — Enable on ALL tables
-- ============================================================

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_jobs         ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES (drop first to make idempotent)
-- ============================================================

-- PROFILES policies
DROP POLICY IF EXISTS "Users read own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile"  ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile"  ON public.profiles;

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- LEADS policies
DROP POLICY IF EXISTS "Authenticated users read leads" ON public.leads;
DROP POLICY IF EXISTS "Service role manages leads"     ON public.leads;

CREATE POLICY "Authenticated users read leads"
  ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role manages leads"
  ON public.leads FOR ALL TO service_role USING (true);

-- USER_LEADS policies
DROP POLICY IF EXISTS "Users manage own pipeline" ON public.user_leads;

CREATE POLICY "Users manage own pipeline"
  ON public.user_leads FOR ALL USING (auth.uid() = user_id);

-- TEMPLATES policies
DROP POLICY IF EXISTS "Users manage own templates" ON public.outreach_templates;

CREATE POLICY "Users manage own templates"
  ON public.outreach_templates FOR ALL USING (auth.uid() = user_id);

-- AI_MESSAGES policies
DROP POLICY IF EXISTS "Users manage own ai messages" ON public.ai_messages;

CREATE POLICY "Users manage own ai messages"
  ON public.ai_messages FOR ALL USING (auth.uid() = user_id);

-- SEARCH_HISTORY policies
DROP POLICY IF EXISTS "Users read own search history" ON public.search_history;

CREATE POLICY "Users read own search history"
  ON public.search_history FOR ALL USING (auth.uid() = user_id);

-- CREDIT_TRANSACTIONS policies
DROP POLICY IF EXISTS "Users read own transactions"   ON public.credit_transactions;
DROP POLICY IF EXISTS "Service role manages credits"  ON public.credit_transactions;

CREATE POLICY "Users read own transactions"
  ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages credits"
  ON public.credit_transactions FOR ALL TO service_role USING (true);

-- AUDIT_LOG policies
DROP POLICY IF EXISTS "Users read own audit log"      ON public.audit_log;
DROP POLICY IF EXISTS "Service role writes audit log"  ON public.audit_log;

CREATE POLICY "Users read own audit log"
  ON public.audit_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role writes audit log"
  ON public.audit_log FOR INSERT TO service_role WITH CHECK (true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Monthly lead quota reset
CREATE OR REPLACE FUNCTION public.reset_monthly_leads()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET
    leads_used_this_month = 0,
    month_reset_date = DATE_TRUNC('month', NOW())::DATE
  WHERE month_reset_date < DATE_TRUNC('month', NOW())::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enforce lead limits before consumption
CREATE OR REPLACE FUNCTION public.check_lead_limit(p_user_id UUID, p_count INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;

  -- Reset monthly if needed
  IF v_profile.month_reset_date < DATE_TRUNC('month', NOW())::DATE THEN
    UPDATE public.profiles SET leads_used_this_month = 0,
      month_reset_date = DATE_TRUNC('month', NOW())::DATE
    WHERE id = p_user_id;
    v_profile.leads_used_this_month := 0;
  END IF;

  -- Check subscription limit
  IF v_profile.leads_used_this_month + p_count <= v_profile.leads_limit THEN
    RETURN TRUE;
  END IF;

  -- Check credits balance
  IF v_profile.credits_balance >= p_count THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Consume leads (deduct from limit or credits)
CREATE OR REPLACE FUNCTION public.consume_leads(p_user_id UUID, p_count INTEGER DEFAULT 1)
RETURNS VOID AS $$
DECLARE
  v_profile public.profiles%ROWTYPE;
  v_remaining_limit INTEGER;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;

  v_remaining_limit := v_profile.leads_limit - v_profile.leads_used_this_month;

  IF v_remaining_limit >= p_count THEN
    -- Consume from monthly limit
    UPDATE public.profiles
    SET leads_used_this_month = leads_used_this_month + p_count
    WHERE id = p_user_id;
  ELSE
    -- Consume remainder from limit, rest from credits
    UPDATE public.profiles
    SET leads_used_this_month = leads_limit,
        credits_balance = credits_balance - (p_count - v_remaining_limit)
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
