import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { adminApi } from "@/lib/adminApi";


export type Property = Tables<"properties">;
export type PropertyInsert = TablesInsert<"properties">;

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: PropertyInsert) => Promise<void>;
  updateProperty: (id: string, property: Partial<TablesUpdate<"properties">>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setProperties(data);
    } else {
      setProperties([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: PropertyInsert) => {
    await adminApi.createProperty(property);
    await fetchProperties();
  };

  const updateProperty = async (id: string, property: Partial<TablesUpdate<"properties">>) => {
    await adminApi.updateProperty(id, property);
    await fetchProperties();
  };

  const deleteProperty = async (id: string) => {
    await adminApi.deleteProperty(id);
    await fetchProperties();
  };

  return (
    <PropertyContext.Provider value={{ properties, loading, addProperty, updateProperty, deleteProperty, refetch: fetchProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useProperties must be used within PropertyProvider");
  return ctx;
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 0,
  }).format(price);
}
