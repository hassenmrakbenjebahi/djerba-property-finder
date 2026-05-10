ALTER TABLE public.properties
ADD COLUMN listing_type TEXT NOT NULL DEFAULT 'sale' CHECK (listing_type IN ('sale','rent'));