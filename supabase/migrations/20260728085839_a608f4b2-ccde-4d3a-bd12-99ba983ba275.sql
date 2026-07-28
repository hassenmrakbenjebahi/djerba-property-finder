ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_monthly numeric,
  ADD COLUMN IF NOT EXISTS price_nightly numeric;