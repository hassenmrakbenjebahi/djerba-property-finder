export interface Property {
  id: string;
  title: string;
  type: "villa" | "appartement" | "terrain" | "maison";
  zone: "Midoun" | "Houmt Souk" | "Ajim";
  price: number;
  surface: number;
  bedrooms?: number;
  description: string;
  features: string[];
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Villa Méditerranéenne avec piscine",
    type: "villa",
    zone: "Midoun",
    price: 650000,
    surface: 350,
    bedrooms: 4,
    description: "Magnifique villa avec vue mer, piscine privée et jardin paysager. Proche des plages.",
    features: ["Piscine", "Vue mer", "Jardin", "Garage"],
  },
  {
    id: "2",
    title: "Appartement moderne centre-ville",
    type: "appartement",
    zone: "Houmt Souk",
    price: 180000,
    surface: 120,
    bedrooms: 3,
    description: "Appartement rénové au cœur de Houmt Souk, proche de tous les commerces et du souk.",
    features: ["Terrasse", "Climatisation", "Ascenseur"],
  },
  {
    id: "3",
    title: "Terrain constructible vue mer",
    type: "terrain",
    zone: "Midoun",
    price: 120000,
    surface: 500,
    description: "Terrain plat avec vue dégagée sur la mer, idéal pour construire une villa de rêve.",
    features: ["Vue mer", "Viabilisé", "Route goudronnée"],
  },
  {
    id: "4",
    title: "Maison traditionnelle Houch",
    type: "maison",
    zone: "Houmt Souk",
    price: 280000,
    surface: 200,
    bedrooms: 3,
    description: "Authentique houch djerbien rénové avec patio intérieur et architecture traditionnelle.",
    features: ["Patio", "Architecture traditionnelle", "Rénové"],
  },
  {
    id: "5",
    title: "Villa pieds dans l'eau",
    type: "villa",
    zone: "Ajim",
    price: 850000,
    surface: 400,
    bedrooms: 5,
    description: "Villa exceptionnelle en front de mer avec accès direct à la plage. Coucher de soleil garanti.",
    features: ["Front de mer", "Piscine", "5 chambres", "Vue panoramique"],
  },
  {
    id: "6",
    title: "Terrain agricole avec oliviers",
    type: "terrain",
    zone: "Ajim",
    price: 85000,
    surface: 2000,
    description: "Grand terrain planté d'oliviers centenaires, parfait pour un projet agritouristique.",
    features: ["Oliviers", "Puits", "Accès facile"],
  },
  {
    id: "7",
    title: "Appartement touristique meublé",
    type: "appartement",
    zone: "Midoun",
    price: 220000,
    surface: 90,
    bedrooms: 2,
    description: "Appartement entièrement meublé, idéal pour la location saisonnière. À 5 min de la plage.",
    features: ["Meublé", "Proche plage", "Rendement locatif"],
  },
  {
    id: "8",
    title: "Villa de charme avec jardin tropical",
    type: "villa",
    zone: "Houmt Souk",
    price: 450000,
    surface: 280,
    bedrooms: 3,
    description: "Belle villa entourée d'un jardin tropical luxuriant. Calme et intimité assurés.",
    features: ["Jardin tropical", "Piscine", "Calme"],
  },
];

export function searchProperties(filters: {
  type?: string;
  zone?: string;
  maxPrice?: number;
  minBedrooms?: number;
}): Property[] {
  return properties.filter((p) => {
    if (filters.type && p.type !== filters.type) return false;
    if (filters.zone && p.zone !== filters.zone) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.minBedrooms && (p.bedrooms || 0) < filters.minBedrooms) return false;
    return true;
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 0,
  }).format(price);
}
