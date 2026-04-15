
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('villa', 'appartement', 'terrain', 'maison')),
  zone TEXT NOT NULL CHECK (zone IN ('Midoun', 'Houmt Souk', 'Ajim')),
  price NUMERIC NOT NULL,
  surface NUMERIC NOT NULL,
  bedrooms INTEGER,
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Everyone can view properties
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);

-- Authenticated users can manage properties (admin)
CREATE POLICY "Authenticated users can insert properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update properties" ON public.properties FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete properties" ON public.properties FOR DELETE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data with Unsplash images
INSERT INTO public.properties (title, type, zone, price, surface, bedrooms, description, features, image_url) VALUES
('Villa Méditerranéenne avec piscine', 'villa', 'Midoun', 650000, 350, 4, 'Magnifique villa avec vue mer, piscine privée et jardin paysager. Proche des plages.', ARRAY['Piscine', 'Vue mer', 'Jardin', 'Garage'], 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'),
('Appartement moderne centre-ville', 'appartement', 'Houmt Souk', 180000, 120, 3, 'Appartement rénové au cœur de Houmt Souk, proche de tous les commerces et du souk.', ARRAY['Terrasse', 'Climatisation', 'Ascenseur'], 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'),
('Terrain constructible vue mer', 'terrain', 'Midoun', 120000, 500, NULL, 'Terrain plat avec vue dégagée sur la mer, idéal pour construire une villa de rêve.', ARRAY['Vue mer', 'Viabilisé', 'Route goudronnée'], 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'),
('Maison traditionnelle Houch', 'maison', 'Houmt Souk', 280000, 200, 3, 'Authentique houch djerbien rénové avec patio intérieur et architecture traditionnelle.', ARRAY['Patio', 'Architecture traditionnelle', 'Rénové'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'),
('Villa pieds dans l''eau', 'villa', 'Ajim', 850000, 400, 5, 'Villa exceptionnelle en front de mer avec accès direct à la plage. Coucher de soleil garanti.', ARRAY['Front de mer', 'Piscine', '5 chambres', 'Vue panoramique'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'),
('Terrain agricole avec oliviers', 'terrain', 'Ajim', 85000, 2000, NULL, 'Grand terrain planté d''oliviers centenaires, parfait pour un projet agritouristique.', ARRAY['Oliviers', 'Puits', 'Accès facile'], 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80'),
('Appartement touristique meublé', 'appartement', 'Midoun', 220000, 90, 2, 'Appartement entièrement meublé, idéal pour la location saisonnière. À 5 min de la plage.', ARRAY['Meublé', 'Proche plage', 'Rendement locatif'], 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'),
('Villa de charme avec jardin tropical', 'villa', 'Houmt Souk', 450000, 280, 3, 'Belle villa entourée d''un jardin tropical luxuriant. Calme et intimité assurés.', ARRAY['Jardin tropical', 'Piscine', 'Calme'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80');
