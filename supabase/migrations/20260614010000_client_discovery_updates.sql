-- ============================================================
-- CLIENT DISCOVERY SEARCH IMPROVEMENTS
-- Safe to re-run in Supabase SQL Editor
-- ============================================================

-- 1. Add seen_lead_ids column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seen_lead_ids UUID[] DEFAULT '{}';

-- 2. Create RPC function to report/flag a lead
CREATE OR REPLACE FUNCTION public.report_lead(p_lead_id UUID, p_reason TEXT)
RETURNS VOID AS $$
BEGIN
  -- Increment suspicious_count and flag if threshold reached
  UPDATE public.leads
  SET suspicious_count = COALESCE(suspicious_count, 0) + 1,
      is_flagged = CASE WHEN COALESCE(suspicious_count, 0) + 1 >= 3 THEN true ELSE is_flagged END
  WHERE id = p_lead_id;

  -- Insert into audit_log
  INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    'lead.reported',
    'lead',
    p_lead_id,
    jsonb_build_object('reason', p_reason)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
