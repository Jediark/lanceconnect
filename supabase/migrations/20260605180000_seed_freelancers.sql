-- Seed script to populate profiles table with realistic freelancer profiles
-- These will automatically show up in the public freelancers directory.

DO $$
DECLARE
  v_user_id UUID;
BEGIN

  -- 1. Adebayo Williams (web_dev)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'adebayo@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'adebayo@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Adebayo Williams'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'web_dev',
      bio = 'Full-stack Next.js and React developer. Specialized in SaaS building, responsive web apps, and Postgres database optimization.',
      country = 'Nigeria',
      city = 'Lagos',
      hourly_rate = 35,
      username = 'adebayo_dev',
      contact_email = 'adebayo@lanceconnect.com',
      portfolio_projects = '[{"title": "E-Commerce Gateway", "description": "High-performance checkout platform for African merchants."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 2. Sarah Jenkins (web_dev)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sarah@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'sarah@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Sarah Jenkins'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'web_dev',
      bio = 'Senior front-end engineer specializing in beautiful UI design systems, Tailwind CSS, and headless Shopify development.',
      country = 'United Kingdom',
      city = 'London',
      hourly_rate = 65,
      username = 'sarah_codes',
      contact_email = 'sarah@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 3. Elena Rostova (designer)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'elena@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'elena@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Elena Rostova'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'designer',
      bio = 'Brand designer and illustrator. I create unique visual identities, custom vector logos, and premium marketing collateral.',
      country = 'Germany',
      city = 'Berlin',
      hourly_rate = 45,
      username = 'elena_design',
      contact_email = 'elena@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 4. Marcus Thompson (copywriter)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marcus@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'marcus@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Marcus Thompson'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'copywriter',
      bio = 'Conversion-focused copywriter. I write landing page copy, email sequences, and blog posts that convert visitors into paying clients.',
      country = 'United States',
      city = 'New York',
      hourly_rate = 55,
      username = 'marcus_writes',
      contact_email = 'marcus@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 5. Kofi Mensah (seo)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kofi@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'kofi@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Kofi Mensah'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'seo',
      bio = 'Technical SEO specialist. Help local businesses double their organic traffic and rank #1 for local searches.',
      country = 'Ghana',
      city = 'Accra',
      hourly_rate = 40,
      username = 'kofi_seo',
      contact_email = 'kofi@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 6. Chloe Dupont (social_media)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'chloe@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'chloe@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Chloe Dupont'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'social_media',
      bio = 'Social media manager and content creator. I grow Instagram and TikTok audiences for lifestyle and e-commerce brands.',
      country = 'France',
      city = 'Paris',
      hourly_rate = 30,
      username = 'chloe_social',
      contact_email = 'chloe@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 7. Kenji Tanaka (video)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kenji@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'kenji@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Kenji Tanaka'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'video',
      bio = 'Video editor and motion designer. Specialized in engaging YouTube edits, social media reels, and high-impact promo videos.',
      country = 'Japan',
      city = 'Tokyo',
      hourly_rate = 50,
      username = 'kenji_films',
      contact_email = 'kenji@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 8. Prof. Clara Vance (tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'clara@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'clara@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Prof. Clara Vance'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'tutor',
      bio = 'Experienced online tutor specializing in high school mathematics, AP Calculus, and university-level physics prep.',
      country = 'Canada',
      city = 'Toronto',
      hourly_rate = 40,
      username = 'clara_tutors',
      contact_email = 'clara@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 9. Chinedu Okafor (african_food_export)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'chinedu@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'chinedu@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Chinedu Okafor'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'african_food_export',
      bio = 'B2B exporter of premium dried spices, yam flour, and palm oil. Certified supplier with complete FDA import compliance documents.',
      country = 'Nigeria',
      city = 'Lagos',
      hourly_rate = 25,
      username = 'chinedu_exports',
      contact_email = 'chinedu@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 10. Luigi Moretti (restaurant_supplier)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'luigi@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'luigi@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Luigi Moretti'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'restaurant_supplier',
      bio = 'Supplier of authentic San Marzano tomatoes, organic olive oil, and premium double-zero flour directly to pizzerias worldwide.',
      country = 'Italy',
      city = 'Naples',
      hourly_rate = 50,
      username = 'luigi_supplies',
      contact_email = 'luigi@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 11. Sophia Martinez (product_export)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sophia@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'sophia@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Sophia Martinez'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'product_export',
      bio = 'Sourcing agent and trade broker for South American agricultural products, leather goods, and bulk wine exports.',
      country = 'Argentina',
      city = 'Buenos Aires',
      hourly_rate = 45,
      username = 'sophia_trade',
      contact_email = 'sophia@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 12. Rajesh Patel (b2b_trade)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rajesh@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'rajesh@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Rajesh Patel'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'b2b_trade',
      bio = 'Bulk trade supplier of industrial chemical intermediates, textiles, and packaging materials for international buyers.',
      country = 'India',
      city = 'Mumbai',
      hourly_rate = 60,
      username = 'rajesh_trade',
      contact_email = 'rajesh@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 13. Dr. Amanda Ross (corporate_training)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'amanda@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'amanda@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Dr. Amanda Ross'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'corporate_training',
      bio = 'Leadership coach and corporate trainer. I design custom workshop programs for executive alignment and soft-skills development.',
      country = 'United States',
      city = 'Chicago',
      hourly_rate = 120,
      username = 'amanda_trains',
      contact_email = 'amanda@lanceconnect.com',
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

END $$;
