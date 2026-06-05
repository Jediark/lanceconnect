-- ============================================================
-- LANCECONNECT DATABASE SCHEMA v1.2: PUBLIC DIRECTORY
-- ============================================================

-- Add directory columns to public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS portfolio_projects JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS dribbble_url TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url TEXT;

-- Constraint on username format: alphanumeric/dashes/underscores, 3 to 30 chars
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS username_format_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT username_format_check
  CHECK (username IS NULL OR (username ~* '^[a-zA-Z0-9_-]{3,30}$'));

-- Verify username is not a reserved keyword/route name
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS username_reserved_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT username_reserved_check
  CHECK (
    username IS NULL OR (
      LOWER(username) NOT IN (
        'web-developers', 'designers', 'copywriters', 'seo-specialists', 
        'social-media', 'videographers', 'photographers', 'marketers', 
        'app-developers', 'virtual-assistants', 'index', 'admin', 
        'settings', 'dashboard', 'discover', 'login', 'register', 
        'about', 'pricing', 'contact', 'blog', 'portfolio', 'api', 
        'onboarding', 'privacy', 'terms', 'upgrade', 'changelog', 'freelancers'
      )
    )
  );

-- Create a policy allowing anyone to view public profiles directly
DROP POLICY IF EXISTS "Users read public profiles" ON public.profiles;
CREATE POLICY "Users read public profiles"
  ON public.profiles FOR SELECT USING (is_public = true);

-- Create a secure read-only view for public freelancer directory queries
CREATE OR REPLACE VIEW public.freelancer_directory AS
SELECT
  id,
  email,
  full_name,
  avatar_url,
  freelancer_category,
  bio,
  website_url,
  country,
  city,
  username,
  hourly_rate,
  portfolio_projects,
  contact_email,
  contact_phone,
  github_url,
  linkedin_url,
  dribbble_url,
  twitter_url,
  created_at,
  updated_at
FROM public.profiles
WHERE is_public = true AND is_banned = false;

-- Grant select permissions on the view to both anonymous and authenticated roles
GRANT SELECT ON public.freelancer_directory TO anon, authenticated;
