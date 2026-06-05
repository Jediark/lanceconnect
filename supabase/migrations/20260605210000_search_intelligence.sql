-- Search Intelligence table for tracking and analyzing user search behavior
CREATE TABLE IF NOT EXISTS public.search_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  search_query TEXT NOT NULL,
  category TEXT,
  country TEXT,
  city TEXT,
  product TEXT,
  results_count INTEGER,
  leads_saved INTEGER DEFAULT 0,
  session_id TEXT,
  ip_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_search_intelligence_query ON public.search_intelligence USING gin(to_tsvector('english', search_query));
CREATE INDEX IF NOT EXISTS idx_search_intelligence_category ON public.search_intelligence(category);
CREATE INDEX IF NOT EXISTS idx_search_intelligence_country ON public.search_intelligence(country);
CREATE INDEX IF NOT EXISTS idx_search_intelligence_created ON public.search_intelligence(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_intelligence_user ON public.search_intelligence(user_id);

-- RLS policies
ALTER TABLE public.search_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage search_intelligence"
  ON public.search_intelligence
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own search_intelligence"
  ON public.search_intelligence
  FOR SELECT
  USING (auth.uid() = user_id);
