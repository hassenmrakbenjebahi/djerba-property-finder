ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS available_from DATE;

-- Enforce max 10 images
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_images_max_10;
ALTER TABLE public.properties
  ADD CONSTRAINT properties_images_max_10 CHECK (array_length(images, 1) IS NULL OR array_length(images, 1) <= 10);