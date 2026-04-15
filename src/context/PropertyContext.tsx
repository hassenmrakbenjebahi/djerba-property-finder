import { createContext, useContext, useState, ReactNode } from "react";
import { Property, properties as initialProperties } from "@/data/properties";

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, "id">) => void;
  updateProperty: (id: string, property: Omit<Property, "id">) => void;
  deleteProperty: (id: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem("immo-properties");
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const save = (props: Property[]) => {
    setProperties(props);
    localStorage.setItem("immo-properties", JSON.stringify(props));
  };

  const addProperty = (property: Omit<Property, "id">) => {
    const newProp = { ...property, id: Date.now().toString() } as Property;
    save([...properties, newProp]);
  };

  const updateProperty = (id: string, property: Omit<Property, "id">) => {
    save(properties.map((p) => (p.id === id ? { ...property, id } as Property : p)));
  };

  const deleteProperty = (id: string) => {
    save(properties.filter((p) => p.id !== id));
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, updateProperty, deleteProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useProperties must be used within PropertyProvider");
  return ctx;
};
