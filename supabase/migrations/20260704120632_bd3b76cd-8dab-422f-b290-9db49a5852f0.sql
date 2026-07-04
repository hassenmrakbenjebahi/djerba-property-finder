-- Reset weak default admin password ('admin123') to a strong random value.
-- The new password is shown once in the migration output.
DO $$
DECLARE
  new_pwd text := encode(extensions.gen_random_bytes(18), 'base64');
BEGIN
  UPDATE public.admin_credentials
  SET password_hash = extensions.crypt(new_pwd, extensions.gen_salt('bf', 10)),
      updated_at = now()
  WHERE id = true;
  RAISE NOTICE 'NEW ADMIN PASSWORD (change it immediately after login): %', new_pwd;
END $$;

-- Lock down property-images storage bucket: deny all writes from anon/authenticated.
-- All uploads must go through the admin-upload-image edge function (service role).
DROP POLICY IF EXISTS "property_images_no_anon_insert" ON storage.objects;
DROP POLICY IF EXISTS "property_images_no_anon_update" ON storage.objects;
DROP POLICY IF EXISTS "property_images_no_anon_delete" ON storage.objects;
DROP POLICY IF EXISTS "property_images_public_read" ON storage.objects;

CREATE POLICY "property_images_public_read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'property-images');

-- No INSERT/UPDATE/DELETE policies for anon/authenticated on this bucket =>
-- writes are denied by default. Service role bypasses RLS.
