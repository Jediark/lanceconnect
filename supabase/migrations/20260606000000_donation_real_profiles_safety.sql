-- ============================================================
-- LANCECONNECT DATABASE SCHEMA UPDATE: DONATIONS, REAL PROFILES, SAFETY
-- ============================================================

-- 1. Add new columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_supporter BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS total_donated DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS website_verified BOOLEAN DEFAULT false;

-- 2. Update freelancer_category constraint (add 'mc_events')
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_freelancer_category_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_freelancer_category_check
  CHECK (
    freelancer_category IN (
      'web_dev', 'designer', 'copywriter', 'seo',
      'social_media', 'video', 'photography',
      'marketing', 'app_dev', 'va', 'tutor',
      'african_food_export', 'restaurant_supplier',
      'product_export', 'b2b_trade', 'human_capital',
      'training_recruitment', 'parent_tutor', 'mc_events', 'other'
    )
  );

-- 3. Recreate public.freelancer_directory view with new columns
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
  updated_at,
  is_verified,
  website_verified,
  is_supporter,
  is_featured,
  tagline,
  is_flagged
FROM public.profiles
WHERE is_public = true AND is_banned = false;

GRANT SELECT ON public.freelancer_directory TO anon, authenticated;

-- 4. Create public.donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_provider TEXT NOT NULL CHECK (
    payment_provider IN ('paystack', 'buymeacoffee', 'stripe')
  ),
  payment_reference TEXT,
  donor_name TEXT,
  show_on_wall BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert donations" ON public.donations;
CREATE POLICY "Anyone can insert donations"
  ON public.donations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view donations" ON public.donations;
CREATE POLICY "Anyone can view donations"
  ON public.donations FOR SELECT USING (true);

-- 5. Create public.reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'fake_profile', 'scam', 'harassment',
    'fake_business', 'spam', 'impersonation', 'other'
  )),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'investigating', 'resolved', 'dismissed')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can submit reports" ON public.reports;
CREATE POLICY "Users can submit reports"
  ON public.reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- 6. Add columns to leads table
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS suspicious_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false;

-- 7. Create public.lead_ratings table
CREATE TABLE IF NOT EXISTS public.lead_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  rating TEXT CHECK (rating IN ('genuine', 'suspicious')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lead_id)
);

ALTER TABLE public.lead_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own ratings" ON public.lead_ratings;
CREATE POLICY "Users manage own ratings"
  ON public.lead_ratings FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 8. Add trigger to auto-flag profile when 3+ reports received
CREATE OR REPLACE FUNCTION public.check_profile_reports()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reported_user_id IS NOT NULL THEN
    IF (SELECT COUNT(*) FROM public.reports WHERE reported_user_id = NEW.reported_user_id) >= 3 THEN
      UPDATE public.profiles
      SET is_flagged = true
      WHERE id = NEW.reported_user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_report_inserted ON public.reports;
CREATE TRIGGER on_report_inserted
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.check_profile_reports();

-- 9. Add trigger to auto-flag/delete lead based on suspicious ratings
CREATE OR REPLACE FUNCTION public.check_lead_ratings()
RETURNS TRIGGER AS $$
DECLARE
  v_lead_id UUID;
  v_suspicious_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_lead_id := OLD.lead_id;
  ELSE
    v_lead_id := NEW.lead_id;
  END IF;

  -- Count suspicious ratings for this lead
  SELECT COUNT(*) INTO v_suspicious_count
  FROM public.lead_ratings
  WHERE lead_id = v_lead_id AND rating = 'suspicious';

  -- Update suspicious_count and flags in leads table
  UPDATE public.leads
  SET 
    suspicious_count = v_suspicious_count,
    is_flagged = CASE WHEN v_suspicious_count >= 3 THEN true ELSE false END
  WHERE id = v_lead_id;

  -- Delete lead if 5+ suspicious votes
  IF v_suspicious_count >= 5 THEN
    DELETE FROM public.leads
    WHERE id = v_lead_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lead_rating_change ON public.lead_ratings;
CREATE TRIGGER on_lead_rating_change
  AFTER INSERT OR UPDATE OR DELETE ON public.lead_ratings
  FOR EACH ROW EXECUTE FUNCTION public.check_lead_ratings();

-- 10. Delete all duplicate or fake example seed profiles
DELETE FROM public.profiles
WHERE email LIKE '%example.com'
   OR email LIKE '%seed%'
   OR email LIKE '%@lanceconnect.com'
   OR full_name IN (
     'Anna Schmidt', 'Sakura Takahashi',
     'John Smith', 'Sarah Jenkins',
     'Elena Rostova', 'Marcus Thompson',
     'Kofi Mensah', 'Chloe Dupont',
     'Kenji Tanaka', 'Prof. Clara Vance',
     'Chinedu Okafor', 'Luigi Moretti',
     'Sophia Martinez', 'Rajesh Patel',
     'Dr. Amanda Ross', 'Wambui Kamau',
     'Kofi Osei', 'Paolo Reyes',
     'Thabo Ndlovu', 'Sofia Garcia',
     'Yasmine Hassan', 'Adebayo Williams'
   );

DELETE FROM auth.users
WHERE email LIKE '%example.com'
   OR email LIKE '%seed%'
   OR email LIKE '%@lanceconnect.com'
   OR raw_user_meta_data->>'full_name' IN (
     'Anna Schmidt', 'Sakura Takahashi',
     'John Smith', 'Sarah Jenkins',
     'Elena Rostova', 'Marcus Thompson',
     'Kofi Mensah', 'Chloe Dupont',
     'Kenji Tanaka', 'Prof. Clara Vance',
     'Chinedu Okafor', 'Luigi Moretti',
     'Sophia Martinez', 'Rajesh Patel',
     'Dr. Amanda Ross', 'Wambui Kamau',
     'Kofi Osei', 'Paolo Reyes',
     'Thabo Ndlovu', 'Sofia Garcia',
     'Yasmine Hassan', 'Adebayo Williams'
   );

-- 11. Seed Real verified profiles
DO $$
DECLARE
  v_user_id UUID;
BEGIN

  -- Akinola Olujobi — Web Designer
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'akinola.web@trendtacticsdigital.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'akinola.web@trendtacticsdigital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Akinola Olujobi'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'web_dev',
      bio = 'Award-winning web designer helping businesses establish powerful online presences through stunning, conversion-focused websites. Founder of Trendtactics Digital — delivering modern web design, branding and digital strategy to clients across Nigeria and globally. Passionate about turning business visions into beautiful digital realities.',
      website_url = 'https://trendtacticsdigital.com',
      country = 'Nigeria',
      city = 'Lagos',
      is_verified = true,
      website_verified = true,
      is_supporter = true,
      tagline = 'Building powerful online presences for businesses worldwide',
      hourly_rate = 45,
      is_featured = true,
      onboarding_completed = true,
      username = 'akinola-web',
      contact_email = 'akinola.web@trendtacticsdigital.com'
    WHERE id = v_user_id;
  END IF;

  -- Akinola Olujobi — MC & Events
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'akinola.mc@akinolaolujobi.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'akinola.mc@akinolaolujobi.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Akinola Olujobi'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'mc_events',
      bio = 'Professional Master of Ceremonies with extensive experience hosting corporate events, weddings, conferences, award ceremonies and social gatherings. Known for energy, eloquence and an innate ability to keep audiences engaged and events flowing seamlessly. Available for events across Nigeria and internationally.',
      website_url = 'https://akinolaolujobi.com',
      country = 'Nigeria',
      city = 'Lagos',
      is_verified = true,
      website_verified = true,
      is_supporter = true,
      tagline = 'Nigeria''s premium MC for corporate and social events',
      hourly_rate = 60,
      is_featured = true,
      onboarding_completed = true,
      username = 'akinola-mc',
      contact_email = 'akinola.mc@akinolaolujobi.com'
    WHERE id = v_user_id;
  END IF;

  -- Akinola Olujobi — Online Tutor
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'akinola.tutor@edvouralearninghub.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'akinola.tutor@edvouralearninghub.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Akinola Olujobi'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'tutor',
      bio = 'Experienced online educator and founder of Edvoura Learning Hub — a platform dedicated to making quality education accessible to everyone. Providing online tutoring, educational programs and e-learning solutions for students of all ages globally. Passionate about transforming lives through learning.',
      website_url = 'https://edvouralearninghub.com',
      country = 'Nigeria',
      city = 'Lagos',
      is_verified = true,
      website_verified = true,
      is_supporter = true,
      tagline = 'Empowering learners through quality online education',
      hourly_rate = 30,
      is_featured = true,
      onboarding_completed = true,
      username = 'akinola-tutor',
      contact_email = 'akinola.tutor@edvouralearninghub.com'
    WHERE id = v_user_id;
  END IF;

  -- Je'moorel UK
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'info@jemoorel.co.uk') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'info@jemoorel.co.uk',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Je''moorel UK'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'african_food_export',
      bio = 'Premium African food supplier and human capital development company based in the United Kingdom. Supplying palm oil, garri, ogbono, stockfish, crayfish and other authentic African food products to UK businesses, restaurants and wholesalers. Also provides workforce development and training programs for organisations seeking to develop their human capital.',
      website_url = 'https://jemoorel.co.uk',
      country = 'United Kingdom',
      city = 'London',
      is_verified = true,
      website_verified = true,
      is_supporter = true,
      tagline = 'Premium African food supplier to UK businesses',
      hourly_rate = 50,
      is_featured = true,
      onboarding_completed = true,
      username = 'jemoorel-uk',
      contact_email = 'info@jemoorel.co.uk'
    WHERE id = v_user_id;
  END IF;

  -- Emmanuel Edward — AI Web Dev Trainer
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'emmanuel@techfieldsdigital.com.ng') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'emmanuel@techfieldsdigital.com.ng',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Emmanuel Edward'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'web_dev',
      bio = 'Pioneer AI-powered web development trainer and digital solutions expert. Teaching individuals and businesses how to build professional websites using cutting-edge AI tools — making web development accessible to everyone regardless of technical background. Founder of TechFields Digital, empowering the next generation of digital creators across Nigeria and Africa.',
      website_url = 'https://www.techfieldsdigital.com.ng',
      country = 'Nigeria',
      city = 'Lagos',
      is_verified = true,
      website_verified = true,
      is_supporter = true,
      tagline = 'Teaching AI-powered web development to the next generation',
      hourly_rate = 40,
      is_featured = true,
      onboarding_completed = true,
      username = 'emmanuel-edward',
      contact_email = 'emmanuel@techfieldsdigital.com.ng'
    WHERE id = v_user_id;
  END IF;

END $$;
