-- Drop the old constraint
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_email_confidence_check;

-- Recreate it to include 'manually_added'
ALTER TABLE public.leads ADD CONSTRAINT leads_email_confidence_check CHECK (email_confidence IN ('verified', 'likely', 'unverified', 'manually_added'));
