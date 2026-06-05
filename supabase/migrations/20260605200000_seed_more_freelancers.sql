-- Seed script to populate profiles table with 40+ additional realistic freelancer profiles
-- Covers all 18 categories to ensure rich search results

DO $$
DECLARE
  v_user_id UUID;
BEGIN

  -- 14. Amara Okonkwo (designer)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'amara_okonkwo_designer@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'amara_okonkwo_designer@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Amara Okonkwo'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'designer',
      bio = 'Creative brand designer with 5+ years of experience crafting modern logo marks, typography layouts, and complete brand identity packages for startups.',
      country = 'Nigeria',
      city = 'Lagos',
      hourly_rate = 45,
      username = 'amara_okonkwo_14',
      contact_email = 'amara_okonkwo_designer@lanceconnect.com',
      portfolio_projects = '[{"title": "FinTech Rebrand", "description": "Complete visual identity including logo, guidelines, and marketing templates."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 15. John Smith (designer)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'john_smith_designer@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'john_smith_designer@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'John Smith'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'designer',
      bio = 'Creative brand designer with 5+ years of experience crafting modern logo marks, typography layouts, and complete brand identity packages for startups.',
      country = 'United Kingdom',
      city = 'London',
      hourly_rate = 45,
      username = 'john_smith_15',
      contact_email = 'john_smith_designer@lanceconnect.com',
      portfolio_projects = '[{"title": "FinTech Rebrand", "description": "Complete visual identity including logo, guidelines, and marketing templates."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 16. Aarav Sharma (copywriter)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aarav_sharma_copywriter@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'aarav_sharma_copywriter@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Aarav Sharma'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'copywriter',
      bio = 'Conversion copywriter specializing in high-converting SaaS landing pages, automated email onboarding sequences, and engaging SEO-focused longform articles.',
      country = 'India',
      city = 'Mumbai',
      hourly_rate = 50,
      username = 'aarav_sharma_16',
      contact_email = 'aarav_sharma_copywriter@lanceconnect.com',
      portfolio_projects = '[{"title": "SaaS Launch Copy", "description": "High-converting copy for a B2B project management software launch page."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 17. Beatriz Silva (copywriter)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'beatriz_silva_copywriter@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'beatriz_silva_copywriter@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Beatriz Silva'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'copywriter',
      bio = 'Conversion copywriter specializing in high-converting SaaS landing pages, automated email onboarding sequences, and engaging SEO-focused longform articles.',
      country = 'Brazil',
      city = 'Sao Paulo',
      hourly_rate = 50,
      username = 'beatriz_silva_17',
      contact_email = 'beatriz_silva_copywriter@lanceconnect.com',
      portfolio_projects = '[{"title": "SaaS Launch Copy", "description": "High-converting copy for a B2B project management software launch page."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 18. David Miller (seo)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'david_miller_seo@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'david_miller_seo@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'David Miller'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'seo',
      bio = 'Technical SEO architect. Proven track record of improving organic search traffic by 150%+ through keyword intent mapping, page-speed optimizations, and high-quality backlink campaigns.',
      country = 'United States',
      city = 'San Francisco',
      hourly_rate = 55,
      username = 'david_miller_18',
      contact_email = 'david_miller_seo@lanceconnect.com',
      portfolio_projects = '[{"title": "E-Commerce SEO", "description": "Scale organic traffic from 5k to 50k monthly sessions in 6 months."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 19. Jane Wanjiku (seo)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jane_wanjiku_seo@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'jane_wanjiku_seo@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Jane Wanjiku'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'seo',
      bio = 'Technical SEO architect. Proven track record of improving organic search traffic by 150%+ through keyword intent mapping, page-speed optimizations, and high-quality backlink campaigns.',
      country = 'Kenya',
      city = 'Nairobi',
      hourly_rate = 55,
      username = 'jane_wanjiku_19',
      contact_email = 'jane_wanjiku_seo@lanceconnect.com',
      portfolio_projects = '[{"title": "E-Commerce SEO", "description": "Scale organic traffic from 5k to 50k monthly sessions in 6 months."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 20. Kwame Appiah (social_media)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kwame_appiah_social_media@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'kwame_appiah_social_media@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Kwame Appiah'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'social_media',
      bio = 'Social media strategist and short-form video creator. I help consumer brands scale their organic presence on TikTok, Instagram, and YouTube Shorts.',
      country = 'Ghana',
      city = 'Accra',
      hourly_rate = 35,
      username = 'kwame_appiah_20',
      contact_email = 'kwame_appiah_social_media@lanceconnect.com',
      portfolio_projects = '[{"title": "Viral TikTok Campaign", "description": "Generated 2M+ organic views for a sustainable fashion brand."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 21. Lukas Muller (social_media)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lukas_muller_social_media@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'lukas_muller_social_media@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Lukas Muller'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'social_media',
      bio = 'Social media strategist and short-form video creator. I help consumer brands scale their organic presence on TikTok, Instagram, and YouTube Shorts.',
      country = 'Germany',
      city = 'Berlin',
      hourly_rate = 35,
      username = 'lukas_muller_21',
      contact_email = 'lukas_muller_social_media@lanceconnect.com',
      portfolio_projects = '[{"title": "Viral TikTok Campaign", "description": "Generated 2M+ organic views for a sustainable fashion brand."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 22. Yuki Sato (video)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'yuki_sato_video@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'yuki_sato_video@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Yuki Sato'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'video',
      bio = 'Professional video editor and colorist. Specialized in cinematic commercial storytelling, corporate documentaries, and highly engaging YouTube/TikTok content edits.',
      country = 'Japan',
      city = 'Tokyo',
      hourly_rate = 40,
      username = 'yuki_sato_22',
      contact_email = 'yuki_sato_video@lanceconnect.com',
      portfolio_projects = '[{"title": "Product Launch Video", "description": "Cinematic promo video for a smart home device company."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 23. Maria Santos (video)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'maria_santos_video@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'maria_santos_video@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Maria Santos'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'video',
      bio = 'Professional video editor and colorist. Specialized in cinematic commercial storytelling, corporate documentaries, and highly engaging YouTube/TikTok content edits.',
      country = 'Philippines',
      city = 'Manila',
      hourly_rate = 40,
      username = 'maria_santos_23',
      contact_email = 'maria_santos_video@lanceconnect.com',
      portfolio_projects = '[{"title": "Product Launch Video", "description": "Cinematic promo video for a smart home device company."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 24. Sipho Dube (photography)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sipho_dube_photography@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'sipho_dube_photography@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Sipho Dube'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'photography',
      bio = 'Commercial food and architectural photographer. Creating stunning, high-resolution visuals that help restaurants, hotels, and real estate agencies stand out online.',
      country = 'South Africa',
      city = 'Johannesburg',
      hourly_rate = 60,
      username = 'sipho_dube_24',
      contact_email = 'sipho_dube_photography@lanceconnect.com',
      portfolio_projects = '[{"title": "Hotel Portfolio", "description": "High-end interior and exterior shots for a luxury boutique resort."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 25. Carlos Gomez (photography)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'carlos_gomez_photography@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'carlos_gomez_photography@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Carlos Gomez'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'photography',
      bio = 'Commercial food and architectural photographer. Creating stunning, high-resolution visuals that help restaurants, hotels, and real estate agencies stand out online.',
      country = 'Mexico',
      city = 'Mexico City',
      hourly_rate = 60,
      username = 'carlos_gomez_25',
      contact_email = 'carlos_gomez_photography@lanceconnect.com',
      portfolio_projects = '[{"title": "Hotel Portfolio", "description": "High-end interior and exterior shots for a luxury boutique resort."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 26. Fatima Ali (photography)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fatima_ali_photography@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'fatima_ali_photography@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Fatima Ali'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'photography',
      bio = 'Commercial food and architectural photographer. Creating stunning, high-resolution visuals that help restaurants, hotels, and real estate agencies stand out online.',
      country = 'Egypt',
      city = 'Cairo',
      hourly_rate = 60,
      username = 'fatima_ali_26',
      contact_email = 'fatima_ali_photography@lanceconnect.com',
      portfolio_projects = '[{"title": "Hotel Portfolio", "description": "High-end interior and exterior shots for a luxury boutique resort."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 27. Zayd Mansoor (marketing)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zayd_mansoor_marketing@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'zayd_mansoor_marketing@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Zayd Mansoor'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'marketing',
      bio = 'Growth marketer and PPC specialist. Designing and optimizing Facebook, Google, and LinkedIn ad campaigns to lower customer acquisition costs.',
      country = 'United Arab Emirates',
      city = 'Dubai',
      hourly_rate = 65,
      username = 'zayd_mansoor_27',
      contact_email = 'zayd_mansoor_marketing@lanceconnect.com',
      portfolio_projects = '[{"title": "Ad Account Recovery", "description": "Audited and rebuilt Facebook ad account, increasing ROI by 45%."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 28. Olumide Balogun (marketing)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'olumide_balogun_marketing@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'olumide_balogun_marketing@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Olumide Balogun'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'marketing',
      bio = 'Growth marketer and PPC specialist. Designing and optimizing Facebook, Google, and LinkedIn ad campaigns to lower customer acquisition costs.',
      country = 'Nigeria',
      city = 'Lagos',
      hourly_rate = 65,
      username = 'olumide_balogun_28',
      contact_email = 'olumide_balogun_marketing@lanceconnect.com',
      portfolio_projects = '[{"title": "Ad Account Recovery", "description": "Audited and rebuilt Facebook ad account, increasing ROI by 45%."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 29. Chloe Taylor (marketing)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'chloe_taylor_marketing@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'chloe_taylor_marketing@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Chloe Taylor'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'marketing',
      bio = 'Growth marketer and PPC specialist. Designing and optimizing Facebook, Google, and LinkedIn ad campaigns to lower customer acquisition costs.',
      country = 'United Kingdom',
      city = 'London',
      hourly_rate = 65,
      username = 'chloe_taylor_29',
      contact_email = 'chloe_taylor_marketing@lanceconnect.com',
      portfolio_projects = '[{"title": "Ad Account Recovery", "description": "Audited and rebuilt Facebook ad account, increasing ROI by 45%."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 30. Priya Patel (app_dev)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'priya_patel_app_dev@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'priya_patel_app_dev@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Priya Patel'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'app_dev',
      bio = 'Cross-platform mobile developer specializing in Flutter and React Native. Experienced in building offline-first apps, payment gateway integrations, and real-time features.',
      country = 'India',
      city = 'Mumbai',
      hourly_rate = 75,
      username = 'priya_patel_30',
      contact_email = 'priya_patel_app_dev@lanceconnect.com',
      portfolio_projects = '[{"title": "Delivery App", "description": "Real-time courier tracking and stripe checkout integration."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 31. Gabriel Souza (app_dev)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gabriel_souza_app_dev@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'gabriel_souza_app_dev@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Gabriel Souza'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'app_dev',
      bio = 'Cross-platform mobile developer specializing in Flutter and React Native. Experienced in building offline-first apps, payment gateway integrations, and real-time features.',
      country = 'Brazil',
      city = 'Sao Paulo',
      hourly_rate = 75,
      username = 'gabriel_souza_31',
      contact_email = 'gabriel_souza_app_dev@lanceconnect.com',
      portfolio_projects = '[{"title": "Delivery App", "description": "Real-time courier tracking and stripe checkout integration."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 32. Emma Johnson (app_dev)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'emma_johnson_app_dev@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'emma_johnson_app_dev@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Emma Johnson'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'app_dev',
      bio = 'Cross-platform mobile developer specializing in Flutter and React Native. Experienced in building offline-first apps, payment gateway integrations, and real-time features.',
      country = 'United States',
      city = 'San Francisco',
      hourly_rate = 75,
      username = 'emma_johnson_32',
      contact_email = 'emma_johnson_app_dev@lanceconnect.com',
      portfolio_projects = '[{"title": "Delivery App", "description": "Real-time courier tracking and stripe checkout integration."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 33. Njuguna Kariuki (va)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'njuguna_kariuki_va@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'njuguna_kariuki_va@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Njuguna Kariuki'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'va',
      bio = 'Executive virtual assistant providing high-level administrative support, calendar management, inbox triage, and CRM data entry for busy founders and executives.',
      country = 'Kenya',
      city = 'Nairobi',
      hourly_rate = 20,
      username = 'njuguna_kariuki_33',
      contact_email = 'njuguna_kariuki_va@lanceconnect.com',
      portfolio_projects = '[{"title": "Inbox Zero System", "description": "Designed automated email sorting and scheduling workflow for CEO."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 34. Akosua Agyei (va)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'akosua_agyei_va@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'akosua_agyei_va@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Akosua Agyei'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'va',
      bio = 'Executive virtual assistant providing high-level administrative support, calendar management, inbox triage, and CRM data entry for busy founders and executives.',
      country = 'Ghana',
      city = 'Accra',
      hourly_rate = 20,
      username = 'akosua_agyei_34',
      contact_email = 'akosua_agyei_va@lanceconnect.com',
      portfolio_projects = '[{"title": "Inbox Zero System", "description": "Designed automated email sorting and scheduling workflow for CEO."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 35. Sofia Weber (va)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sofia_weber_va@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'sofia_weber_va@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Sofia Weber'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'va',
      bio = 'Executive virtual assistant providing high-level administrative support, calendar management, inbox triage, and CRM data entry for busy founders and executives.',
      country = 'Germany',
      city = 'Berlin',
      hourly_rate = 20,
      username = 'sofia_weber_35',
      contact_email = 'sofia_weber_va@lanceconnect.com',
      portfolio_projects = '[{"title": "Inbox Zero System", "description": "Designed automated email sorting and scheduling workflow for CEO."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 36. Hiroto Watanabe (tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hiroto_watanabe_tutor@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'hiroto_watanabe_tutor@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Hiroto Watanabe'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'tutor',
      bio = 'Professional educator with 8+ years of teaching high school mathematics and physics. Dedicated to simplified concept delivery and exam preparation.',
      country = 'Japan',
      city = 'Tokyo',
      hourly_rate = 30,
      username = 'hiroto_watanabe_36',
      contact_email = 'hiroto_watanabe_tutor@lanceconnect.com',
      portfolio_projects = '[{"title": "SAT Math Masterclass", "description": "Developed curriculum helping 50+ students achieve top 5% scores."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 37. Jose Cruz (tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jose_cruz_tutor@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'jose_cruz_tutor@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Jose Cruz'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'tutor',
      bio = 'Professional educator with 8+ years of teaching high school mathematics and physics. Dedicated to simplified concept delivery and exam preparation.',
      country = 'Philippines',
      city = 'Manila',
      hourly_rate = 30,
      username = 'jose_cruz_37',
      contact_email = 'jose_cruz_tutor@lanceconnect.com',
      portfolio_projects = '[{"title": "SAT Math Masterclass", "description": "Developed curriculum helping 50+ students achieve top 5% scores."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 38. Lerato Mokoena (parent_tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lerato_mokoena_parent_tutor@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'lerato_mokoena_parent_tutor@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Lerato Mokoena'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'parent_tutor',
      bio = 'Specialized private tutor offering personalized home and online lessons for primary and middle school students. Expert in early childhood literacy and numeracy.',
      country = 'South Africa',
      city = 'Johannesburg',
      hourly_rate = 25,
      username = 'lerato_mokoena_38',
      contact_email = 'lerato_mokoena_parent_tutor@lanceconnect.com',
      portfolio_projects = '[{"title": "Dyslexia Support Program", "description": "Created personalized reading intervention plans for young learners."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 39. Alejandro Hernandez (parent_tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alejandro_hernandez_parent_tutor@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'alejandro_hernandez_parent_tutor@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Alejandro Hernandez'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'parent_tutor',
      bio = 'Specialized private tutor offering personalized home and online lessons for primary and middle school students. Expert in early childhood literacy and numeracy.',
      country = 'Mexico',
      city = 'Mexico City',
      hourly_rate = 25,
      username = 'alejandro_hernandez_39',
      contact_email = 'alejandro_hernandez_parent_tutor@lanceconnect.com',
      portfolio_projects = '[{"title": "Dyslexia Support Program", "description": "Created personalized reading intervention plans for young learners."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 40. Mona Mahmoud (parent_tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mona_mahmoud_parent_tutor@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'mona_mahmoud_parent_tutor@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Mona Mahmoud'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'parent_tutor',
      bio = 'Specialized private tutor offering personalized home and online lessons for primary and middle school students. Expert in early childhood literacy and numeracy.',
      country = 'Egypt',
      city = 'Cairo',
      hourly_rate = 25,
      username = 'mona_mahmoud_40',
      contact_email = 'mona_mahmoud_parent_tutor@lanceconnect.com',
      portfolio_projects = '[{"title": "Dyslexia Support Program", "description": "Created personalized reading intervention plans for young learners."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 41. Tariq Al-Maktoum (parent_tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tariq_al-maktoum_parent_tutor@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'tariq_al-maktoum_parent_tutor@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Tariq Al-Maktoum'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'parent_tutor',
      bio = 'Specialized private tutor offering personalized home and online lessons for primary and middle school students. Expert in early childhood literacy and numeracy.',
      country = 'United Arab Emirates',
      city = 'Dubai',
      hourly_rate = 25,
      username = 'tariq_al-maktoum_41',
      contact_email = 'tariq_al-maktoum_parent_tutor@lanceconnect.com',
      portfolio_projects = '[{"title": "Dyslexia Support Program", "description": "Created personalized reading intervention plans for young learners."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 42. Tobi Alabi (parent_tutor)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tobi_alabi_parent_tutor@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'tobi_alabi_parent_tutor@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Tobi Alabi'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'parent_tutor',
      bio = 'Specialized private tutor offering personalized home and online lessons for primary and middle school students. Expert in early childhood literacy and numeracy.',
      country = 'Nigeria',
      city = 'Lagos',
      hourly_rate = 25,
      username = 'tobi_alabi_42',
      contact_email = 'tobi_alabi_parent_tutor@lanceconnect.com',
      portfolio_projects = '[{"title": "Dyslexia Support Program", "description": "Created personalized reading intervention plans for young learners."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 43. Robert Jones (african_food_export)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'robert_jones_african_food_export@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'robert_jones_african_food_export@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Robert Jones'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'african_food_export',
      bio = 'Licensed exporter of premium organic African food products including raw palm oil, premium garri, dried spices, and egusi seeds. Bulk supply with global shipping.',
      country = 'United Kingdom',
      city = 'London',
      hourly_rate = 15,
      username = 'robert_jones_43',
      contact_email = 'robert_jones_african_food_export@lanceconnect.com',
      portfolio_projects = '[{"title": "Palm Oil Export", "description": "Shipped 15 tons of certified organic palm oil to UK distributors."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 44. Ananya Rao (african_food_export)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ananya_rao_african_food_export@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'ananya_rao_african_food_export@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Ananya Rao'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'african_food_export',
      bio = 'Licensed exporter of premium organic African food products including raw palm oil, premium garri, dried spices, and egusi seeds. Bulk supply with global shipping.',
      country = 'India',
      city = 'Mumbai',
      hourly_rate = 15,
      username = 'ananya_rao_44',
      contact_email = 'ananya_rao_african_food_export@lanceconnect.com',
      portfolio_projects = '[{"title": "Palm Oil Export", "description": "Shipped 15 tons of certified organic palm oil to UK distributors."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 45. Fernanda Lima (restaurant_supplier)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fernanda_lima_restaurant_supplier@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'fernanda_lima_restaurant_supplier@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Fernanda Lima'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'restaurant_supplier',
      bio = 'Wholesale food supplier connecting local organic farms directly to high-end restaurants. Providing daily fresh produce, meats, and specialty culinary ingredients.',
      country = 'Brazil',
      city = 'Sao Paulo',
      hourly_rate = 35,
      username = 'fernanda_lima_45',
      contact_email = 'fernanda_lima_restaurant_supplier@lanceconnect.com',
      portfolio_projects = '[{"title": "Fresh Farm Network", "description": "Supplied 20+ fine dining establishments with daily local harvest."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 46. Michael Brown (restaurant_supplier)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'michael_brown_restaurant_supplier@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'michael_brown_restaurant_supplier@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Michael Brown'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'restaurant_supplier',
      bio = 'Wholesale food supplier connecting local organic farms directly to high-end restaurants. Providing daily fresh produce, meats, and specialty culinary ingredients.',
      country = 'United States',
      city = 'San Francisco',
      hourly_rate = 35,
      username = 'michael_brown_46',
      contact_email = 'michael_brown_restaurant_supplier@lanceconnect.com',
      portfolio_projects = '[{"title": "Fresh Farm Network", "description": "Supplied 20+ fine dining establishments with daily local harvest."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 47. Wambui Kamau (product_export)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wambui_kamau_product_export@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'wambui_kamau_product_export@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Wambui Kamau'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'product_export',
      bio = 'Experienced trade broker and sourcing agent for agricultural commodities and hand-crafted consumer goods. Facilitating customs clearance and global logistics.',
      country = 'Kenya',
      city = 'Nairobi',
      hourly_rate = 40,
      username = 'wambui_kamau_47',
      contact_email = 'wambui_kamau_product_export@lanceconnect.com',
      portfolio_projects = '[{"title": "Sourcing Project", "description": "Sourced and shipped 5 containers of premium leather goods."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 48. Kofi Osei (product_export)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kofi_osei_product_export@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'kofi_osei_product_export@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Kofi Osei'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'product_export',
      bio = 'Experienced trade broker and sourcing agent for agricultural commodities and hand-crafted consumer goods. Facilitating customs clearance and global logistics.',
      country = 'Ghana',
      city = 'Accra',
      hourly_rate = 40,
      username = 'kofi_osei_48',
      contact_email = 'kofi_osei_product_export@lanceconnect.com',
      portfolio_projects = '[{"title": "Sourcing Project", "description": "Sourced and shipped 5 containers of premium leather goods."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 49. Anna Schmidt (b2b_trade)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'anna_schmidt_b2b_trade@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'anna_schmidt_b2b_trade@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Anna Schmidt'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'b2b_trade',
      bio = 'B2B trade facilitator specializing in industrial machinery parts, wholesale packaging materials, and bulk raw components sourcing for manufacturing plants.',
      country = 'Germany',
      city = 'Berlin',
      hourly_rate = 50,
      username = 'anna_schmidt_49',
      contact_email = 'anna_schmidt_b2b_trade@lanceconnect.com',
      portfolio_projects = '[{"title": "Packaging Supplier", "description": "Bulk eco-friendly box supply agreement with national logistics firm."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 50. Sakura Takahashi (b2b_trade)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sakura_takahashi_b2b_trade@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'sakura_takahashi_b2b_trade@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Sakura Takahashi'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'b2b_trade',
      bio = 'B2B trade facilitator specializing in industrial machinery parts, wholesale packaging materials, and bulk raw components sourcing for manufacturing plants.',
      country = 'Japan',
      city = 'Tokyo',
      hourly_rate = 50,
      username = 'sakura_takahashi_50',
      contact_email = 'sakura_takahashi_b2b_trade@lanceconnect.com',
      portfolio_projects = '[{"title": "Packaging Supplier", "description": "Bulk eco-friendly box supply agreement with national logistics firm."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 51. Paolo Reyes (human_capital)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'paolo_reyes_human_capital@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'paolo_reyes_human_capital@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Paolo Reyes'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'human_capital',
      bio = 'HR consultant specializing in talent planning, employee retention strategies, compensation benchmarking, and workplace culture development for scaling tech teams.',
      country = 'Philippines',
      city = 'Manila',
      hourly_rate = 85,
      username = 'paolo_reyes_51',
      contact_email = 'paolo_reyes_human_capital@lanceconnect.com',
      portfolio_projects = '[{"title": "Scale-Up HR Blueprint", "description": "Built onboarding and performance review systems for 100-person startup."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 52. Thabo Ndlovu (human_capital)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'thabo_ndlovu_human_capital@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'thabo_ndlovu_human_capital@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Thabo Ndlovu'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'human_capital',
      bio = 'HR consultant specializing in talent planning, employee retention strategies, compensation benchmarking, and workplace culture development for scaling tech teams.',
      country = 'South Africa',
      city = 'Johannesburg',
      hourly_rate = 85,
      username = 'thabo_ndlovu_52',
      contact_email = 'thabo_ndlovu_human_capital@lanceconnect.com',
      portfolio_projects = '[{"title": "Scale-Up HR Blueprint", "description": "Built onboarding and performance review systems for 100-person startup."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 53. Sofia Garcia (human_capital)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sofia_garcia_human_capital@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'sofia_garcia_human_capital@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Sofia Garcia'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'human_capital',
      bio = 'HR consultant specializing in talent planning, employee retention strategies, compensation benchmarking, and workplace culture development for scaling tech teams.',
      country = 'Mexico',
      city = 'Mexico City',
      hourly_rate = 85,
      username = 'sofia_garcia_53',
      contact_email = 'sofia_garcia_human_capital@lanceconnect.com',
      portfolio_projects = '[{"title": "Scale-Up HR Blueprint", "description": "Built onboarding and performance review systems for 100-person startup."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 54. Yasmine Hassan (human_capital)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'yasmine_hassan_human_capital@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'yasmine_hassan_human_capital@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Yasmine Hassan'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'human_capital',
      bio = 'HR consultant specializing in talent planning, employee retention strategies, compensation benchmarking, and workplace culture development for scaling tech teams.',
      country = 'Egypt',
      city = 'Cairo',
      hourly_rate = 85,
      username = 'yasmine_hassan_54',
      contact_email = 'yasmine_hassan_human_capital@lanceconnect.com',
      portfolio_projects = '[{"title": "Scale-Up HR Blueprint", "description": "Built onboarding and performance review systems for 100-person startup."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 55. Faisal Al-Suwaidi (human_capital)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'faisal_al-suwaidi_human_capital@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'faisal_al-suwaidi_human_capital@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Faisal Al-Suwaidi'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'human_capital',
      bio = 'HR consultant specializing in talent planning, employee retention strategies, compensation benchmarking, and workplace culture development for scaling tech teams.',
      country = 'United Arab Emirates',
      city = 'Dubai',
      hourly_rate = 85,
      username = 'faisal_al-suwaidi_55',
      contact_email = 'faisal_al-suwaidi_human_capital@lanceconnect.com',
      portfolio_projects = '[{"title": "Scale-Up HR Blueprint", "description": "Built onboarding and performance review systems for 100-person startup."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 56. Chioma Eze (training_recruitment)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'chioma_eze_training_recruitment@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'chioma_eze_training_recruitment@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Chioma Eze'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'training_recruitment',
      bio = 'Full-cycle technical recruiter and corporate trainer. Helping companies source top-tier engineering talent and design internal upskilling programs.',
      country = 'Nigeria',
      city = 'Lagos',
      hourly_rate = 80,
      username = 'chioma_eze_56',
      contact_email = 'chioma_eze_training_recruitment@lanceconnect.com',
      portfolio_projects = '[{"title": "Dev Academy", "description": "Designed and ran a 12-week internal engineering upskilling boot camp."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 57. James Wilson (training_recruitment)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'james_wilson_training_recruitment@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'james_wilson_training_recruitment@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'James Wilson'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'training_recruitment',
      bio = 'Full-cycle technical recruiter and corporate trainer. Helping companies source top-tier engineering talent and design internal upskilling programs.',
      country = 'United Kingdom',
      city = 'London',
      hourly_rate = 80,
      username = 'james_wilson_57',
      contact_email = 'james_wilson_training_recruitment@lanceconnect.com',
      portfolio_projects = '[{"title": "Dev Academy", "description": "Designed and ran a 12-week internal engineering upskilling boot camp."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 58. Rohan Mehta (training_recruitment)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rohan_mehta_training_recruitment@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'rohan_mehta_training_recruitment@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Rohan Mehta'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'training_recruitment',
      bio = 'Full-cycle technical recruiter and corporate trainer. Helping companies source top-tier engineering talent and design internal upskilling programs.',
      country = 'India',
      city = 'Mumbai',
      hourly_rate = 80,
      username = 'rohan_mehta_58',
      contact_email = 'rohan_mehta_training_recruitment@lanceconnect.com',
      portfolio_projects = '[{"title": "Dev Academy", "description": "Designed and ran a 12-week internal engineering upskilling boot camp."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 59. Amara Okonkwo (training_recruitment)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'amara_okonkwo_training_recruitment@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'amara_okonkwo_training_recruitment@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'Amara Okonkwo'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'training_recruitment',
      bio = 'Full-cycle technical recruiter and corporate trainer. Helping companies source top-tier engineering talent and design internal upskilling programs.',
      country = 'Brazil',
      city = 'Sao Paulo',
      hourly_rate = 80,
      username = 'amara_okonkwo_59',
      contact_email = 'amara_okonkwo_training_recruitment@lanceconnect.com',
      portfolio_projects = '[{"title": "Dev Academy", "description": "Designed and ran a 12-week internal engineering upskilling boot camp."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

  -- 60. John Smith (training_recruitment)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'john_smith_training_recruitment@lanceconnect.com') THEN
    v_user_id := uuid_generate_v4();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES (
      v_user_id,
      'john_smith_training_recruitment@lanceconnect.com',
      crypt('password123', gen_salt('bf')),
      now(),
      jsonb_build_object('full_name', 'John Smith'),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
    UPDATE public.profiles
    SET 
      is_public = true,
      freelancer_category = 'training_recruitment',
      bio = 'Full-cycle technical recruiter and corporate trainer. Helping companies source top-tier engineering talent and design internal upskilling programs.',
      country = 'United States',
      city = 'San Francisco',
      hourly_rate = 80,
      username = 'john_smith_60',
      contact_email = 'john_smith_training_recruitment@lanceconnect.com',
      portfolio_projects = '[{"title": "Dev Academy", "description": "Designed and ran a 12-week internal engineering upskilling boot camp."}]'::jsonb,
      onboarding_completed = true
    WHERE id = v_user_id;
  END IF;

END $$;