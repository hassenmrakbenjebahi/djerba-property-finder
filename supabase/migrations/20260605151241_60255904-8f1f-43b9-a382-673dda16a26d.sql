-- 1. Properties: remove public write policies (reads stay public)
DROP POLICY IF EXISTS "Anyone can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can update properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can delete properties" ON public.properties;

-- 2. Storage: drop all policies on storage.objects scoped to property-images bucket.
-- The bucket stays public so getPublicUrl still works for image display.
-- All writes (and listing) must now go through the service role via edge functions.
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND (
        coalesce(qual, '') LIKE '%property-images%'
        OR coalesce(with_check, '') LIKE '%property-images%'
      )
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- 3. Revoke EXECUTE on admin auth functions from public roles.
-- They will now only be callable from edge functions (service_role).
REVOKE EXECUTE ON FUNCTION public.verify_admin_password(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.change_admin_password(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.change_admin_password(text, text) TO service_role;