-- Add is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Helper function to check if user is admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing admin policies if they exist, to ensure idempotence
DROP POLICY IF EXISTS "Admins can select all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can select all search history" ON public.search_history;
DROP POLICY IF EXISTS "Admins can select all reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can update all reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;

-- Admin policies for profiles
CREATE POLICY "Admins can select all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete all profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- Admin policies for search_history
CREATE POLICY "Admins can select all search history" ON public.search_history FOR SELECT USING (public.is_admin());

-- Admin policies for reports
CREATE POLICY "Admins can select all reports" ON public.reports FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all reports" ON public.reports FOR UPDATE USING (public.is_admin());

-- Admin policies for leads (delete leads)
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE USING (public.is_admin());

-- Promote seed accounts to Admin
UPDATE public.profiles SET is_admin = true WHERE email IN ('akinola.web@trendtacticsdigital.com', 'akinola.mc@akinolaolujobi.com');
