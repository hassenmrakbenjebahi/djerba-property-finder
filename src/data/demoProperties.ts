import type { Property } from "@/context/PropertyContext";

import villa1_1 from "@/assets/properties/villa1-1.jpg";
import villa1_2 from "@/assets/properties/villa1-2.jpg";
import villa1_3 from "@/assets/properties/villa1-3.jpg";
import villa1_4 from "@/assets/properties/villa1-4.jpg";
import apt1_1 from "@/assets/properties/apt1-1.jpg";
import apt1_2 from "@/assets/properties/apt1-2.jpg";
import apt1_3 from "@/assets/properties/apt1-3.jpg";
import terrain1 from "@/assets/properties/terrain1.jpg";
import maison1_1 from "@/assets/properties/maison1-1.jpg";
import maison1_2 from "@/assets/properties/maison1-2.jpg";
import villa2_1 from "@/assets/properties/villa2-1.jpg";
import villa2_2 from "@/assets/properties/villa2-2.jpg";
import villa2_3 from "@/assets/properties/villa2-3.jpg";
import terrain2 from "@/assets/properties/terrain2.jpg";
import apt2_1 from "@/assets/properties/apt2-1.jpg";
import apt2_2 from "@/assets/properties/apt2-2.jpg";
import apt2_3 from "@/assets/properties/apt2-3.jpg";
import villa3 from "@/assets/properties/villa3.jpg";

const now = new Date().toISOString();

const make = (p: Omit<Property, "created_at" | "updated_at" | "images" | "available_from"> & { images?: string[]; available_from?: string | null }): Property => ({
  ...p,
  images: p.images && p.images.length ? p.images : (p.image_url ? [p.image_url] : []),
  available_from: p.available_from ?? null,
  created_at: now,
  updated_at: now,
});

// Static demo properties — used as fallback when the database is empty.
export const demoProperties: Property[] = [
  make({
    id: "demo-1",
    title: "Villa Méditerranéenne avec piscine",
    type: "villa",
    zone: "Midoun",
    price: 650000,
    surface: 350,
    bedrooms: 4,
    listing_type: "sale",
    description: "Magnifique villa avec vue mer, piscine privée et jardin paysager. Proche des plages.",
    features: ["Piscine", "Vue mer", "Jardin", "Garage"],
    image_url: villa1_1,
    images: [villa1_1, villa1_2, villa1_3, villa1_4],
  }),
  make({
    id: "demo-2",
    title: "Appartement moderne centre-ville",
    type: "appartement",
    zone: "Houmt Souk",
    price: 180000,
    surface: 120,
    bedrooms: 3,
    listing_type: "sale",
    description: "Appartement rénové au cœur de Houmt Souk, proche de tous les commerces et du souk.",
    features: ["Terrasse", "Climatisation", "Ascenseur"],
    image_url: apt1_1,
    images: [apt1_1, apt1_2, apt1_3],
  }),
  make({
    id: "demo-3",
    title: "Terrain constructible vue mer",
    type: "terrain",
    zone: "Midoun",
    price: 120000,
    surface: 500,
    bedrooms: null,
    listing_type: "sale",
    description: "Terrain plat avec vue dégagée sur la mer, idéal pour construire une villa de rêve.",
    features: ["Vue mer", "Viabilisé", "Route goudronnée"],
    image_url: terrain1,
  }),
  make({
    id: "demo-4",
    title: "Maison traditionnelle Houch",
    type: "maison",
    zone: "Houmt Souk",
    price: 280000,
    surface: 200,
    bedrooms: 3,
    listing_type: "sale",
    description: "Authentique houch djerbien rénové avec patio intérieur et architecture traditionnelle.",
    features: ["Patio", "Architecture traditionnelle", "Rénové"],
    image_url: maison1_1,
    images: [maison1_1, maison1_2],
  }),
  make({
    id: "demo-5",
    title: "Villa pieds dans l'eau — Location",
    type: "villa",
    zone: "Ajim",
    price: 3500,
    surface: 400,
    bedrooms: 5,
    listing_type: "rent",
    available_from: "2026-06-01",
    description: "Villa exceptionnelle en front de mer à louer à la semaine. Idéal vacances de rêve à Djerba.",
    features: ["Front de mer", "Piscine", "5 chambres", "Vue panoramique"],
    image_url: villa2_1,
    images: [villa2_1, villa2_2, villa2_3],
  }),
  make({
    id: "demo-6",
    title: "Terrain agricole avec oliviers",
    type: "terrain",
    zone: "Ajim",
    price: 85000,
    surface: 2000,
    bedrooms: null,
    listing_type: "sale",
    description: "Grand terrain planté d'oliviers centenaires, parfait pour un projet agritouristique.",
    features: ["Oliviers", "Puits", "Accès facile"],
    image_url: terrain2,
  }),
  make({
    id: "demo-7",
    title: "Appartement meublé à louer",
    type: "appartement",
    zone: "Midoun",
    price: 1200,
    surface: 90,
    bedrooms: 2,
    listing_type: "rent",
    available_from: "2026-05-15",
    description: "Appartement entièrement meublé, location mensuelle ou saisonnière. À 5 min de la plage.",
    features: ["Meublé", "Proche plage", "WiFi"],
    image_url: apt2_1,
    images: [apt2_1, apt2_2, apt2_3],
  }),
  make({
    id: "demo-8",
    title: "Villa de charme avec jardin tropical",
    type: "villa",
    zone: "Houmt Souk",
    price: 450000,
    surface: 280,
    bedrooms: 3,
    listing_type: "sale",
    description: "Belle villa entourée d'un jardin tropical luxuriant. Calme et intimité assurés.",
    features: ["Jardin tropical", "Piscine", "Calme"],
    image_url: villa3,
  }),
];
