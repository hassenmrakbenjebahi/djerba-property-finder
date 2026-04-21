import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { demoProperties } from "@/data/demoProperties";

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
    if (!error && data && data.length > 0) {
      setProperties(data);
    } else {
      // Fallback: show demo properties when DB is empty (or unreachable)
      setProperties(demoProperties);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: PropertyInsert) => {
    const { error } = await supabase.from("properties").insert(property);
    if (!error) await fetchProperties();
    else throw error;
  };

  const updateProperty = async (id: string, property: Partial<TablesUpdate<"properties">>) => {
    const { error } = await supabase.from("properties").update(property).eq("id", id);
    if (!error) await fetchProperties();
    else throw error;
  };

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) await fetchProperties();
    else throw error;
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
