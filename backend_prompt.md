# LanceConnect — Complete Backend Build Prompt for Antigravity (Gemini Edition)

**Version**: 1.0 (Final) | **Date**: 2026-05-28
**Platform**: Antigravity
**Author**: TRENDY DEVELOPER OS v3.0
**Frontend**: Already built in Kilo (React + TypeScript + Tailwind CSS)
**Backend Stack**: Supabase + Deno Edge Functions + Python Microservices + Railway
**Name**: LanceConnect
**Slogan**: "The Meeting Point for Freelancers and Clients"

---

## CRITICAL FIRST INSTRUCTION

Read this entire prompt before writing a single line of code.
This backend must be:

1. **Modular** — every service is independently deployable and replaceable
2. **Secure** — assume hostile environments at all times
3. **Scalable** — designed for 100 users today, 1 million users tomorrow
4. **Observable** — every failure is logged, alerted, and traceable
5. **Cost-efficient** — never pay for what you don't use

Do NOT cut corners on security. Do NOT skip the caching layer.
Do NOT build a monolith. Every domain is its own module.

---

## WHAT THIS BACKEND POWERS

LanceConnect is a global freelancer client acquisition platform.
Any freelancer — web developer, designer, copywriter, SEO specialist,
videographer, photographer, tutor, VA, marketer, app developer — signs up,
selects their skill, chooses a location, and gets a scored list of
businesses that need their services, complete with verified phone numbers,
emails, WhatsApp links, social media presence signals, and AI-generated
outreach messages. All from one dashboard.

---

## GITHUB REPOSITORIES TO REFERENCE & INTEGRATE

The following GitHub repos are part of this backend. Study them before building.

```
ACTIVE INTEGRATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. https://github.com/soxoj/maigret
   Role: Social presence scanner
   What it does: Given a business username, scans 3,000+ platforms
   (Instagram, Facebook, TikTok, Twitter, LinkedIn, YouTube, Pinterest
   and 2,990+ more) to check if the business has accounts
   Deployment: Python microservice on Railway
   License: MIT — free to use commercially
   Integration: Called via internal HTTP from Supabase Edge Function

2. https://github.com/public-apis/public-apis
   Role: API directory reference
   What it does: Source for selecting: Numverify, Mailboxlayer,
   OpenCage, Yelp Fusion, The Muse, Arbeitnow APIs
   Integration: Individual APIs integrated separately

REFERENCE ONLY (security & architecture guidance):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. https://github.com/mukul975/Anthropic-Cybersecurity-Skills
   Role: Security implementation reference
   Use: OWASP practices, MITRE ATT&CK awareness, DevSecOps patterns
   Integration: Not a runtime dependency — guides security decisions

4. https://github.com/cporter202/api-mega-list
   Role: Phase 2 API discovery reference
   Use: Additional enrichment APIs for future features
   Integration: Not MVP — reference for roadmap

NOT INCLUDED (excluded by architectural decision):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. https://github.com/shadowsocks/shadowsocks
   Decision: EXCLUDED — firewall bypass tool, wrong use case,
   legal risk, Apify already handles geo-access legitimately
```

---

## SYSTEM ARCHITECTURE OVERVIEW

```
╔══════════════════════════════════════════════════════════════════════╗
║                    LANCECONNECT BACKEND ARCHITECTURE                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  [Kilo Frontend — React/Vite on Vercel]                               ║
║       │                                                                ║
║       │ HTTPS only, JWT auth header                                   ║
║       ▼                                                                ║
║  ┌────────────────────────────────────────────────────────────────┐   ║
║  │              SUPABASE (Primary Backend)                         │   ║
║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │   ║
║  │  │ Auth     │  │PostgreSQL│  │ Storage  │  │ Realtime     │  │   ║
║  │  │ (JWT +   │  │ (RLS on  │  │ (avatars,│  │ (lead count  │  │   ║
║  │  │  OAuth)  │  │  ALL     │  │  exports)│  │  updates)    │  │   ║
║  │  │          │  │  tables) │  │          │  │              │  │   ║
║  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │   ║
║  │                                                                 │   ║
║  │  EDGE FUNCTIONS (Deno, serverless):                             │   ║
║  │  ├── search-leads      → orchestrates data collection          │   ║
║  │  ├── enrich-contact    → phone/email verification              │   ║
║  │  ├── score-opportunity → calculates opportunity score          │   ║
║  │  ├── ai-outreach       → Gemini API message generation         │   ║
║  │  ├── stripe-webhook    → payment events handler                │   ║
║  │  ├── create-checkout   → Stripe session creation               │   ║
║  │  └── health-check      → system health endpoint                │   ║
║  └────────────────────────────────────────────────────────────────┘   ║
║       │                                                                ║
║       │ Internal HTTP (Railway private network)                       ║
║       ▼                                                                ║
║  ┌────────────────────────────────────────────────────────────────┐   ║
║  │              PYTHON MICROSERVICES (Railway)                     │   ║
║  │  ┌──────────────────┐    ┌───────────────────────────────┐    │   ║
║  │  │ Maigret Service  │    │ Apify Orchestrator Service    │    │   ║
║  │  │ (soxoj/maigret)  │    │ (Google Maps, Jobs, Social)   │    │   ║
║  │  │ Port: 8001       │    │ Port: 8002                    │    │   ║
║  │  └──────────────────┘    └───────────────────────────────┘    │   ║
║  └────────────────────────────────────────────────────────────────┘   ║
║       │                                                                ║
║       ▼  (External API calls — all from Edge Functions only)          ║
║  ┌────────────────────────────────────────────────────────────────┐   ║
║  │                    EXTERNAL APIs                                │   ║
║  │  Apify · Google PageSpeed · OpenCage · Numverify               │   ║
║  │  Mailboxlayer · Hunter.io · Yelp Fusion · The Muse             │   ║
║  │  Arbeitnow · Gemini API (Google) · Stripe · Resend             │   ║
║  └────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## MODULE ARCHITECTURE (Domain-Driven Design)

The backend is divided into 8 independent modules.
Each module owns its data, its logic, and its API surface.

```
supabase/
├── functions/
│   ├── _shared/                    # Shared utilities (NOT a module)
│   │   ├── auth.ts                 # JWT validation helper
│   │   ├── cors.ts                 # CORS headers
│   │   ├── ratelimit.ts            # Rate limiting logic
│   │   ├── errors.ts               # Standard error responses
│   │   └── logger.ts               # Structured logging
│   │
│   ├── MODULE_1_leads/             # Lead discovery & storage
│   │   └── search-leads/
│   │       └── index.ts
│   │
│   ├── MODULE_2_enrichment/        # Contact verification
│   │   └── enrich-contact/
│   │       └── index.ts
│   │
│   ├── MODULE_3_scoring/           # Opportunity score engine
│   │   └── score-opportunity/
│   │       └── index.ts
│   │
│   ├── MODULE_4_social/            # Social presence (Maigret)
│   │   └── check-social/
│   │       └── index.ts
│   │
│   ├── MODULE_5_ai/                # AI outreach generation
│   │   └── ai-outreach/
│   │       └── index.ts
│   │
│   ├── MODULE_6_billing/           # Stripe payments
│   │   ├── create-checkout/
│   │   │   └── index.ts
│   │   └── stripe-webhook/
│   │       └── index.ts
│   │
│   ├── MODULE_7_pipeline/          # User CRM operations
│   │   └── pipeline-ops/
│   │       └── index.ts
│   │
│   └── MODULE_8_health/            # Observability
│       └── health-check/
│           └── index.ts
│
services/                           # Python microservices (Railway)
├── maigret-service/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
└── apify-service/
    ├── main.py
    ├── requirements.txt
    └── Dockerfile
```

---

## COMPLETE DATABASE SCHEMA

Run this in Supabase SQL Editor in exact order.

```sql
-- ============================================================
-- LANCECONNECT DATABASE SCHEMA v1.0
-- Run in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";    -- For composite indexes
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Query monitoring

-- ============================================================
-- TABLE 1: PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id                      UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                   TEXT NOT NULL,
  full_name               TEXT,
  avatar_url              TEXT,

  -- Freelancer configuration
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

  -- Subscription management
  plan                    TEXT NOT NULL DEFAULT 'free' CHECK (
    plan IN ('free', 'starter', 'pro', 'agency')
  ),
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  subscription_status     TEXT DEFAULT 'inactive',
  subscription_end_date   TIMESTAMPTZ,

  -- Usage tracking
  leads_used_this_month   INTEGER NOT NULL DEFAULT 0,
  leads_limit             INTEGER NOT NULL DEFAULT 10,
  credits_balance         INTEGER NOT NULL DEFAULT 0,
  month_reset_date        DATE NOT NULL DEFAULT DATE_TRUNC('month', NOW())::DATE,

  -- Security
  last_login_at           TIMESTAMPTZ,
  login_count             INTEGER DEFAULT 0,
  is_banned               BOOLEAN DEFAULT false,
  ban_reason              TEXT,

  -- Metadata
  onboarding_completed    BOOLEAN DEFAULT false,
  preferred_language      TEXT DEFAULT 'en',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE 2: LEADS (global business database)
-- ============================================================
CREATE TABLE public.leads (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Business Identity
  business_name         TEXT NOT NULL,
  business_type         TEXT,
  industry              TEXT NOT NULL,
  description           TEXT,

  -- Location (indexed for geo queries)
  country               TEXT NOT NULL,
  country_code          TEXT,  -- ISO 2-letter: NG, GB, IN
  state_province        TEXT,
  city                  TEXT NOT NULL,
  district              TEXT,
  full_address          TEXT,
  postal_code           TEXT,
  latitude              DECIMAL(10,7),
  longitude             DECIMAL(10,7),
  timezone              TEXT,

  -- Contact Information
  phone                 TEXT,
  phone_verified        BOOLEAN DEFAULT false,
  phone_verified_at     TIMESTAMPTZ,
  phone_whatsapp_link   TEXT,  -- wa.me/+countrycode...
  email                 TEXT,
  email_verified        BOOLEAN DEFAULT false,
  email_verified_at     TIMESTAMPTZ,
  email_confidence      TEXT CHECK (email_confidence IN ('verified', 'likely', 'unverified')),

  -- Web Presence
  website_url           TEXT,
  has_website           BOOLEAN NOT NULL DEFAULT false,
  website_live          BOOLEAN,         -- HTTP ping result
  website_score         INTEGER,         -- PageSpeed 0-100
  website_mobile_ok     BOOLEAN,         -- Mobile friendly?
  website_has_ssl       BOOLEAN,         -- HTTPS?
  website_screenshot    TEXT,            -- URL to screenshot
  website_load_time_ms  INTEGER,

  -- Social Media Presence (from Maigret)
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

  -- Google Maps Signals
  google_place_id       TEXT UNIQUE,
  google_maps_url       TEXT,
  google_rating         DECIMAL(2,1) CHECK (google_rating BETWEEN 0 AND 5),
  google_review_count   INTEGER DEFAULT 0,
  google_photo_url      TEXT,
  google_categories     TEXT[],

  -- Opportunity Scoring
  opportunity_score     INTEGER CHECK (opportunity_score BETWEEN 0 AND 100),
  score_breakdown       JSONB,  -- { no_website: 40, low_rating: 20, ... }

  -- Data Source & Quality
  source                TEXT NOT NULL DEFAULT 'google_maps',
  data_quality_score    INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
  is_verified           BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,

  -- Cache Management
  last_verified_at      TIMESTAMPTZ,
  cache_expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  fetch_count           INTEGER DEFAULT 1,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Performance indexes
CREATE INDEX idx_leads_industry        ON leads(industry);
CREATE INDEX idx_leads_country         ON leads(country);
CREATE INDEX idx_leads_city            ON leads(LOWER(city));
CREATE INDEX idx_leads_score           ON leads(opportunity_score DESC);
CREATE INDEX idx_leads_has_website     ON leads(has_website);
CREATE INDEX idx_leads_place_id        ON leads(google_place_id);
CREATE INDEX idx_leads_cache_expires   ON leads(cache_expires_at);
CREATE INDEX idx_leads_country_city    ON leads(country, LOWER(city));
CREATE INDEX idx_leads_industry_country ON leads(industry, country);

-- Full text search index
CREATE INDEX idx_leads_name_search ON leads USING GIN(to_tsvector('english', business_name));

-- ============================================================
-- TABLE 3: USER_LEADS (saved leads / personal pipeline)
-- ============================================================
CREATE TABLE public.user_leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Pipeline CRM
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'contacted', 'interested', 'proposal_sent',
    'won', 'lost', 'not_relevant'
  )),
  notes           TEXT,
  follow_up_date  DATE,
  deal_value      DECIMAL(10,2),

  -- Tracking
  contacted_at    TIMESTAMPTZ,
  responded_at    TIMESTAMPTZ,
  won_at          TIMESTAMPTZ,

  saved_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, lead_id)
);

CREATE TRIGGER user_leads_updated_at
  BEFORE UPDATE ON user_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_user_leads_user_id    ON user_leads(user_id);
CREATE INDEX idx_user_leads_status     ON user_leads(user_id, status);
CREATE INDEX idx_user_leads_follow_up  ON user_leads(follow_up_date) WHERE follow_up_date IS NOT NULL;

-- ============================================================
-- TABLE 4: OUTREACH_TEMPLATES
-- ============================================================
CREATE TABLE public.outreach_templates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  channel     TEXT NOT NULL DEFAULT 'email' CHECK (
    channel IN ('email', 'phone_script', 'linkedin', 'whatsapp', 'sms')
  ),
  subject     TEXT,
  body        TEXT NOT NULL,
  variables   TEXT[],  -- ['business_name', 'city', 'your_name']
  is_default  BOOLEAN DEFAULT false,
  use_count   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_user ON outreach_templates(user_id);

-- ============================================================
-- TABLE 5: AI_GENERATED_MESSAGES (cache AI outputs)
-- ============================================================
CREATE TABLE public.ai_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id       UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  channel       TEXT NOT NULL,
  tone          TEXT NOT NULL DEFAULT 'professional',
  message       TEXT NOT NULL,
  tokens_used   INTEGER,
  model         TEXT DEFAULT 'gemini-1.5-pro',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, lead_id, channel, tone)  -- Cache per combo
);

CREATE INDEX idx_ai_messages_user ON ai_messages(user_id);

-- ============================================================
-- TABLE 6: SEARCH_HISTORY (re-runnable searches)
-- ============================================================
CREATE TABLE public.search_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  query_params    JSONB NOT NULL,
  results_count   INTEGER,
  leads_consumed  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);

-- ============================================================
-- TABLE 7: CREDIT_TRANSACTIONS (for pay-per-use model)
-- ============================================================
CREATE TABLE public.credit_transactions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type                TEXT NOT NULL CHECK (type IN ('purchase', 'consumption', 'refund', 'bonus')),
  amount              INTEGER NOT NULL,  -- positive = credit, negative = debit
  balance_after       INTEGER NOT NULL,
  description         TEXT,
  stripe_payment_id   TEXT,
  lead_id             UUID REFERENCES leads(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credits_user ON credit_transactions(user_id, created_at DESC);

-- ============================================================
-- TABLE 8: RATE_LIMIT_LOG (prevent abuse)
-- ============================================================
CREATE TABLE public.rate_limit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address  INET,
  endpoint    TEXT NOT NULL,
  count       INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, endpoint, window_start)
);

CREATE INDEX idx_rate_limit_user     ON rate_limit_log(user_id, endpoint);
CREATE INDEX idx_rate_limit_ip       ON rate_limit_log(ip_address, endpoint);
CREATE INDEX idx_rate_limit_window   ON rate_limit_log(window_start);

-- ============================================================
-- TABLE 9: AUDIT_LOG (security compliance)
-- ============================================================
CREATE TABLE public.audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,  -- 'lead.searched', 'lead.saved', 'plan.upgraded'
  entity_type TEXT,
  entity_id   UUID,
  metadata    JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user       ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_action     ON audit_log(action, created_at DESC);

-- ============================================================
-- TABLE 10: SYSTEM_JOBS (background job tracking)
-- ============================================================
CREATE TABLE public.system_jobs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type          TEXT NOT NULL,  -- 'bulk_fetch', 'social_scan', 'cache_refresh'
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

ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_jobs         ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- LEADS policies (all authenticated users can read)
CREATE POLICY "Authenticated users read leads"
  ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role manages leads"
  ON leads FOR ALL TO service_role USING (true);

-- USER_LEADS policies
CREATE POLICY "Users manage own pipeline"
  ON user_leads FOR ALL USING (auth.uid() = user_id);

-- TEMPLATES policies
CREATE POLICY "Users manage own templates"
  ON outreach_templates FOR ALL USING (auth.uid() = user_id);

-- AI_MESSAGES policies
CREATE POLICY "Users manage own ai messages"
  ON ai_messages FOR ALL USING (auth.uid() = user_id);

-- SEARCH_HISTORY policies
CREATE POLICY "Users read own search history"
  ON search_history FOR ALL USING (auth.uid() = user_id);

-- CREDIT_TRANSACTIONS policies
CREATE POLICY "Users read own transactions"
  ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages credits"
  ON credit_transactions FOR ALL TO service_role USING (true);

-- AUDIT_LOG policies (read-only for users)
CREATE POLICY "Users read own audit log"
  ON audit_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role writes audit log"
  ON audit_log FOR INSERT TO service_role WITH CHECK (true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Monthly lead quota reset
CREATE OR REPLACE FUNCTION reset_monthly_leads()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET
    leads_used_this_month = 0,
    month_reset_date = DATE_TRUNC('month', NOW())::DATE
  WHERE month_reset_date < DATE_TRUNC('month', NOW())::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enforce lead limits before consumption
CREATE OR REPLACE FUNCTION check_lead_limit(p_user_id UUID, p_count INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile profiles%ROWTYPE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ALL EXTERNAL APIS — Complete Reference

```
┌─────────────────────────────────────────────────────────────────┐
│ API              │ Purpose              │ Cost      │ Free Tier  │
├──────────────────┼──────────────────────┼───────────┼────────────┤
│ Apify            │ Google Maps scraping │ ~$1-3/100 │ $5 credits │
│ Apify            │ Facebook presence    │ ~$0.50/50 │ included   │
│ Apify            │ Instagram presence   │ ~$0.50/50 │ included   │
│ Apify            │ LinkedIn Jobs        │ ~$1/100   │ included   │
│ Apify            │ Indeed Jobs          │ ~$1/100   │ included   │
│ Maigret (self)   │ Social username scan │ FREE      │ unlimited  │
│ Google PageSpeed │ Website quality      │ FREE      │ unlimited  │
│ OpenCage         │ Geocoding            │ FREE      │ 2,500/day  │
│ Numverify        │ Phone validation     │ FREE      │ 100/month  │
│ AbstractAPI      │ Phone + email verify │ FREE      │ 250/month  │
│ Mailboxlayer     │ Email validation     │ FREE      │ 100/month  │
│ Hunter.io        │ Find email by domain │ FREE      │ 25/month   │
│ Yelp Fusion      │ US business data     │ FREE      │ 500/day    │
│ The Muse         │ Remote job listings  │ FREE      │ unlimited  │
│ Arbeitnow        │ European jobs        │ FREE      │ unlimited  │
│ Screenshotlayer  │ Website screenshot   │ Freemium  │ 100/month  │
│ Gemini API       │ AI message generator │ Freemium  │ -          │
│ Stripe           │ Payments             │ 2.9%+30¢  │ -          │
│ Resend           │ Transactional email  │ FREE      │ 3,000/mo   │
│ Supabase         │ DB + Auth + Storage  │ FREE      │ 500MB      │
│ Vercel           │ Frontend hosting     │ FREE      │ hobby tier │
│ Railway          │ Python microservices │ ~$5/mo    │ trial      │
│ Sentry           │ Error monitoring     │ FREE      │ 5K errors  │
└─────────────────────────────────────────────────────────────────┘

TOTAL MVP COST: ~$10-30/month
```

---

## MODULE 1: LEAD DISCOVERY ENGINE

### Edge Function: `search-leads`

This function orchestrates the entire data pipeline.

```typescript
// supabase/functions/search-leads/index.ts
// ... imports and boilerplate mapped to Gemini models and Deno environment
```

---

## MODULE 5: AI OUTREACH ENGINE (Gemini API Integration)

### Edge Function: `ai-outreach`

Generates personalized pitch scripts via the **Gemini API** based on lead signals.

```typescript
// supabase/functions/ai-outreach/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { validateAuth } from "../_shared/auth.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await validateAuth(req);
    if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const { leadId, channel, tone = "professional" } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Fetch lead details
    const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single();
    if (!lead) return new Response("Lead not found", { status: 404, headers: corsHeaders });

    // Build the context prompt based on the signals
    const prompt = `You are a world-class freelance marketer pitching your services. 
    Write a short, highly personalized ${channel} message in a ${tone} tone to ${lead.business_name}.
    Context:
    - Business Type: ${lead.business_type}
    - Location: ${lead.city}, ${lead.country}
    - Website: ${lead.has_website ? lead.website_url : "No Website"}
    - Rating: ${lead.google_rating} (${lead.google_review_count} reviews)
    - Opportunities Identified: ${JSON.stringify(lead.score_breakdown)}

    Rules:
    - Do not use placeholders (like [Name]). 
    - Keep it short and to the point.
    - Focus on how you can solve their specific opportunity (e.g. build a website, improve rating, or run ads).
    - Provide a single, clear call to action.`;

    // Call Gemini API (using gemini-1.5-pro or gemini-1.5-flash)
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
        }),
      },
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini API failed with status ${geminiRes.status}`);
    }

    const resJson = await geminiRes.json();
    const generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Cache the message
    await supabase.from("ai_messages").upsert(
      {
        user_id: user.id,
        lead_id: leadId,
        channel,
        tone,
        message: generatedText,
        model: "gemini-1.5-flash",
      },
      { onConflict: "user_id,lead_id,channel,tone" },
    );

    return new Response(JSON.stringify({ message: generatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
```
