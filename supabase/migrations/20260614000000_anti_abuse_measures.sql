-- ============================================================
-- ANTI-ABUSE MEASURES: EMAIL NORMALIZATION & DEVICE FINGERPRINTING
-- Safe to re-run in Supabase SQL Editor
-- ============================================================

-- 1. Helper function to normalize Gmail addresses and standard email addresses
CREATE OR REPLACE FUNCTION public.normalize_email(p_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
  v_user TEXT;
  v_domain TEXT;
  v_parts TEXT[];
BEGIN
  v_email := LOWER(TRIM(p_email));
  v_parts := regexp_split_to_array(v_email, '@');
  
  IF array_length(v_parts, 1) != 2 THEN
    RETURN v_email;
  END IF;
  
  v_user := v_parts[1];
  v_domain := v_parts[2];
  
  -- Normalize Gmail/Googlemail domains
  IF v_domain = 'gmail.com' OR v_domain = 'googlemail.com' THEN
    -- Remove everything after '+' in username
    v_user := split_part(v_user, '+', 1);
    -- Remove all dots
    v_user := replace(v_user, '.', '');
    v_domain := 'gmail.com';
  END IF;
  
  RETURN v_user || '@' || v_domain;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Helper function to identify disposable/temporary emails
CREATE OR REPLACE FUNCTION public.is_disposable_email(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_domain TEXT;
BEGIN
  v_domain := split_part(LOWER(TRIM(p_email)), '@', 2);
  RETURN v_domain IN (
    'yopmail.com', 'mailinator.com', 'tempmail.com', '10minutemail.com',
    'throwawaymail.com', 'sharklasers.com', 'guerrillamail.com',
    'dispostable.com', 'maildrop.cc', 'getairmail.com', 'temp-mail.org',
    'boun.cr', 'chacuo.net', 'crazymailing.com', 'decoymail.com',
    'drdrb.net', 'emailondeck.com', 'harakirimail.com', 'mailnesia.com',
    'mailspammer.com', 'mytrashmail.com', 'safetymail.info',
    'sendspaminator.com', 'spamgourmet.com', 'trashmail.com',
    'wetfish.de', 'guerrillamailblock.com', 'guerrillamail.net',
    'guerrillamail.org', 'guerrillamail.biz', 'grr.la', 'guerrillamail.de',
    'tempmailaddress.com', 'tempmail.net', 'tempmail.co', 'tempmail.us',
    'disposablemail.com', 'spam4.me', 'discard.email', 'discardmail.com',
    'discardmail.de', 'spambox.us', 'spambox.org', 'fakeinbox.com',
    'getairmail.com', 'zippymail.in', 'inboxkitten.com'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Add columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS normalized_email TEXT;

-- 4. Backfill normalized_email for existing profiles
UPDATE public.profiles p
SET normalized_email = public.normalize_email(email)
WHERE normalized_email IS NULL;

-- 5. Resolve duplicate normalized_emails before applying unique constraint
UPDATE public.profiles p1
SET normalized_email = normalized_email || '-dup-' || substring(id::text from 1 for 8)
WHERE id IN (
  SELECT id FROM (
    SELECT id, row_number() OVER (PARTITION BY normalized_email ORDER BY created_at ASC) as rn
    FROM public.profiles
  ) t WHERE rn > 1
);

-- 6. Add unique constraint to normalized_email
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_normalized_email_key;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_normalized_email_key UNIQUE (normalized_email);

-- 7. Update handle_new_user trigger to handle validations, normalized_email, and fingerprint
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_normalized TEXT;
BEGIN
  -- Block disposable emails
  IF public.is_disposable_email(NEW.email) THEN
    RAISE EXCEPTION 'Registration rejected: Temporary or disposable email addresses are not allowed.'
      USING ERRCODE = 'check_violation';
  END IF;

  -- Normalize the email
  v_normalized := public.normalize_email(NEW.email);

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    email,
    normalized_email,
    full_name,
    avatar_url,
    device_fingerprint
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_normalized,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'device_fingerprint'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
