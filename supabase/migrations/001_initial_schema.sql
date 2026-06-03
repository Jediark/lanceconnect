-- =============================================
-- Supabase Database Schema for LanceConnect
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS / PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  freelancer_category TEXT NOT NULL,
  bio TEXT,
  website_url TEXT,
  country TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  leads_used_this_month INTEGER DEFAULT 0,
  leads_limit INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BUSINESS LEADS
-- =============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  business_name TEXT NOT NULL,
  business_type TEXT,
  industry TEXT NOT NULL,
  
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  state_province TEXT,
  full_address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  
  phone TEXT,
  email TEXT,
  website_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  google_maps_url TEXT,
  
  has_website BOOLEAN DEFAULT false,
  website_score INTEGER,
  google_rating DECIMAL(2,1),
  google_review_count INTEGER,
  opportunity_score INTEGER CHECK (opportunity_score BETWEEN 1 AND 100),
  
  source TEXT DEFAULT 'google_places',
  google_place_id TEXT UNIQUE,
  
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_industry ON leads(industry);
CREATE INDEX IF NOT EXISTS idx_leads_country ON leads(country);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_has_website ON leads(has_website);
CREATE INDEX IF NOT EXISTS idx_leads_opportunity_score ON leads(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_google_place_id ON leads(google_place_id);

-- =============================================
-- USER SAVED LEADS (CRM-lite)
-- =============================================
CREATE TABLE IF NOT EXISTS user_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new', 'contacted', 'interested', 'proposal_sent', 'won', 'lost', 'not_relevant'
  )),
  notes TEXT,
  follow_up_date DATE,
  
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, lead_id)
);

CREATE INDEX IF NOT EXISTS idx_user_leads_user_id ON user_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_leads_status ON user_leads(status);

-- =============================================
-- OUTREACH TEMPLATES
-- =============================================
CREATE TABLE IF NOT EXISTS outreach_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'phone_script', 'linkedin', 'sms')),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEARCH HISTORY
-- =============================================
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query_params JSONB NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Profiles: users manage their own
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Leads: everyone can read (it's the product), only service role can insert
CREATE POLICY IF NOT EXISTS "Authenticated users can view leads" ON leads FOR SELECT TO authenticated USING (true);

-- User leads: users manage their own pipeline
CREATE POLICY IF NOT EXISTS "Users manage own pipeline" ON user_leads FOR ALL USING (auth.uid() = user_id);

-- Templates: users manage their own
CREATE POLICY IF NOT EXISTS "Users manage own templates" ON outreach_templates FOR ALL USING (auth.uid() = user_id);

-- Search history: users see their own
CREATE POLICY IF NOT EXISTS "Users see own search history" ON search_history FOR ALL USING (auth.uid() = user_id);