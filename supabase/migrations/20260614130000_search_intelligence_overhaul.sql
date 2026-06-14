-- 1. Search pagination state
CREATE TABLE IF NOT EXISTS public.search_pagination_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  search_fingerprint TEXT NOT NULL,
  current_offset INTEGER DEFAULT 0,
  total_seen INTEGER DEFAULT 0,
  last_search_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, search_fingerprint)
);

-- 2. District rotation tracker
CREATE TABLE IF NOT EXISTS public.district_rotation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  city_key TEXT NOT NULL,
  category TEXT NOT NULL,
  last_district_index INTEGER DEFAULT 0,
  districts_searched TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, city_key, category)
);

-- 3. User seen leads tracker
CREATE TABLE IF NOT EXISTS public.user_seen_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ DEFAULT NOW(),
  action TEXT DEFAULT 'viewed' CHECK (
    action IN ('viewed', 'saved', 'dismissed', 'contacted')
  ),
  UNIQUE(user_id, lead_id)
);

-- 4. Lead engagement tracker
CREATE TABLE IF NOT EXISTS public.lead_engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'viewed', 'saved', 'contacted', 'dismissed',
    'ai_generated', 'phone_copied', 'whatsapp_clicked', 'won'
  )),
  dwell_time_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User preference profile
CREATE TABLE IF NOT EXISTS public.user_lead_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  preferred_business_types TEXT[] DEFAULT '{}',
  preferred_score_range INT4RANGE DEFAULT '[50,100]',
  preferred_has_website BOOLEAN,
  preferred_rating_min DECIMAL DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.search_pagination_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_rotation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_seen_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lead_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Drop first to avoid collision if run multiple times)
DROP POLICY IF EXISTS "Users manage own pagination" ON public.search_pagination_state;
CREATE POLICY "Users manage own pagination" ON public.search_pagination_state
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own rotation" ON public.district_rotation;
CREATE POLICY "Users manage own rotation" ON public.district_rotation
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own seen leads" ON public.user_seen_leads;
CREATE POLICY "Users manage own seen leads" ON public.user_seen_leads
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own engagement" ON public.lead_engagement;
CREATE POLICY "Users manage own engagement" ON public.lead_engagement
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own preferences" ON public.user_lead_preferences;
CREATE POLICY "Users manage own preferences" ON public.user_lead_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_pagination_lookup ON public.search_pagination_state(user_id, search_fingerprint);
CREATE INDEX IF NOT EXISTS idx_rotation_lookup ON public.district_rotation(user_id, city_key, category);
CREATE INDEX IF NOT EXISTS idx_seen_user ON public.user_seen_leads(user_id, action);
CREATE INDEX IF NOT EXISTS idx_engagement_user ON public.lead_engagement(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prefs_user ON public.user_lead_preferences(user_id);
