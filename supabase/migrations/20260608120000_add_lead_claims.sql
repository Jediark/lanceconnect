-- Create a security definer function to check active claims for a list of lead IDs.
-- This bypasses Row Level Security on user_leads to aggregate lock statuses safely without exposing private notes or prices.
CREATE OR REPLACE FUNCTION public.get_lead_claims(lead_ids UUID[])
RETURNS TABLE(lead_id UUID, status TEXT, updated_at TIMESTAMPTZ, user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with creator (owner) privileges to read user_leads across all users
AS $$
BEGIN
  RETURN QUERY
  SELECT ul.lead_id, ul.status, ul.updated_at, ul.user_id
  FROM public.user_leads ul
  WHERE ul.lead_id = ANY(lead_ids)
    AND ul.status IN ('contacted', 'interested', 'proposal_sent', 'won');
END;
$$;

-- Grant execution permissions to both authenticated and anonymous roles
GRANT EXECUTE ON FUNCTION public.get_lead_claims(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_lead_claims(UUID[]) TO anon;
