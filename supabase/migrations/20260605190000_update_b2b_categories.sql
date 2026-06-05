-- Add supplier_profile column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS supplier_profile JSONB;

-- Drop the existing check constraint on profiles.freelancer_category
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_freelancer_category_check;

-- Update existing profiles from deprecated 'corporate_training' to 'human_capital'
UPDATE public.profiles
SET freelancer_category = 'human_capital'
WHERE freelancer_category = 'corporate_training';

-- Add updated check constraint with all 18 categories
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_freelancer_category_check
  CHECK (
    freelancer_category IN (
      'web_dev', 'designer', 'copywriter', 'seo',
      'social_media', 'video', 'photography',
      'marketing', 'app_dev', 'va', 
      'tutor', 'parent_tutor',
      'african_food_export', 'restaurant_supplier', 'product_export', 'b2b_trade',
      'human_capital', 'training_recruitment',
      'other'
    )
  );

