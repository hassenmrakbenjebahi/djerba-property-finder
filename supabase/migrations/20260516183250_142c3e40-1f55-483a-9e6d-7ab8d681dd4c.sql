-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix properties RLS: public read, authenticated write
DROP POLICY IF EXISTS "Anyone can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can update properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can delete properties" ON public.properties;

CREATE POLICY "Authenticated can insert properties"
ON public.properties FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update properties"
ON public.properties FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated can delete properties"
ON public.properties FOR DELETE
TO authenticated
USING (true);

-- Storage policies for property-images bucket
DROP POLICY IF EXISTS "Public can view property-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload property-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update property-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete property-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload property-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update property-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete property-images" ON storage.objects;

CREATE POLICY "Public can view property-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated can upload property-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Authenticated can update property-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated can delete property-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');