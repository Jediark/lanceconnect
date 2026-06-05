-- Drop the existing check constraint on profiles.freelancer_category
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_freelancer_category_check;

-- Add updated check constraint with all existing and new categories
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_freelancer_category_check
  CHECK (
    freelancer_category IN (
      'web_dev', 'designer', 'copywriter', 'seo',
      'social_media', 'video', 'photography',
      'marketing', 'app_dev', 'va', 
      'tutor', 'african_food_export', 'restaurant_supplier', 'product_export', 'b2b_trade', 'corporate_training',
      'other'
    )
  );
