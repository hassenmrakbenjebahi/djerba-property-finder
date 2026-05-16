
-- Create public bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Public can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow uploads (admin uses password-gated frontend, no Supabase auth yet)
CREATE POLICY "Anyone can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Anyone can update property images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images');

CREATE POLICY "Anyone can delete property images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images');

-- Make properties table writable without Supabase auth (frontend password gate)
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can update properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can delete properties" ON public.properties;

CREATE POLICY "Anyone can insert properties"
ON public.properties FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update properties"
ON public.properties FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete properties"
ON public.properties FOR DELETE
USING (true);
