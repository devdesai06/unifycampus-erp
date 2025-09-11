-- Remove recursive policies and replace with JWT-based admin policy to prevent recursion

-- 1) Drop problematic policies on profiles
DROP POLICY IF EXISTS "Faculty can view student profiles in their classes" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2) Create JWT-based helper that does NOT query profiles
CREATE OR REPLACE FUNCTION public.is_admin_jwt()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'), false);
$$;

-- 3) Recreate admin view policy without touching profiles table
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin_jwt());