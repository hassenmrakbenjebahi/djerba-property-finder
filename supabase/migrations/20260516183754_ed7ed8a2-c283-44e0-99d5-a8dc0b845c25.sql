-- Drop user-based auth setup
DROP TRIGGER IF EXISTS on_auth_user_created_bootstrap_admin ON auth.users;
DROP FUNCTION IF EXISTS public.bootstrap_first_admin();

DROP POLICY IF EXISTS "Admins can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can update properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;

DROP POLICY IF EXISTS "Admins can upload property-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update property-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete property-images" ON storage.objects;

DROP TABLE IF EXISTS public.user_roles;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP TYPE IF EXISTS public.app_role;

-- Restore public write access (protection via app password)
CREATE POLICY "Anyone can insert properties"
ON public.properties FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can update properties"
ON public.properties FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "Anyone can delete properties"
ON public.properties FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Anyone can upload property-images"
ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Anyone can update property-images"
ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'property-images');

CREATE POLICY "Anyone can delete property-images"
ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'property-images');

-- Admin password storage (hashed with pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.admin_credentials (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  password_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
-- No policies = no direct access. Only SECURITY DEFINER functions can read/write.

INSERT INTO public.admin_credentials (id, password_hash)
VALUES (true, crypt('admin123', gen_salt('bf', 10)))
ON CONFLICT (id) DO NOTHING;

-- Verify password
CREATE OR REPLACE FUNCTION public.verify_admin_password(_password text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT password_hash INTO stored_hash FROM public.admin_credentials WHERE id = true;
  IF stored_hash IS NULL THEN RETURN false; END IF;
  RETURN stored_hash = crypt(_password, stored_hash);
END;
$$;

-- Change password (requires old password)
CREATE OR REPLACE FUNCTION public.change_admin_password(_old_password text, _new_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF length(_new_password) < 6 THEN
    RAISE EXCEPTION 'Le nouveau mot de passe doit faire au moins 6 caractères';
  END IF;
  IF NOT public.verify_admin_password(_old_password) THEN
    RAISE EXCEPTION 'Mot de passe actuel incorrect';
  END IF;
  UPDATE public.admin_credentials
  SET password_hash = crypt(_new_password, gen_salt('bf', 10)),
      updated_at = now()
  WHERE id = true;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.verify_admin_password(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.change_admin_password(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_admin_password(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.change_admin_password(text, text) TO anon, authenticated;