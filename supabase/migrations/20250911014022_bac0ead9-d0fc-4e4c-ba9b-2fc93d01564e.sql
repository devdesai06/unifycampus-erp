-- Fix infinite recursion in profiles RLS by avoiding self-referential subqueries
-- 1) Create a SECURITY DEFINER helper to get current user's profile id
CREATE OR REPLACE FUNCTION public.get_profile_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.profiles WHERE user_id = user_uuid;
$$;

-- 2) Recreate the problematic policy using the helper instead of selecting from profiles
DROP POLICY IF EXISTS "Faculty can view student profiles in their classes" ON public.profiles;

CREATE POLICY "Faculty can view student profiles in their classes"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'faculty'::user_role)
  AND role = 'student'::user_role
  AND EXISTS (
    SELECT 1
    FROM enrollments e
    JOIN classes c ON e.class_id = c.id
    WHERE e.student_id = profiles.id
      AND c.faculty_id = public.get_profile_id(auth.uid())
  )
);

-- 3) Ensure profiles are auto-created on signup (trigger was missing)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();