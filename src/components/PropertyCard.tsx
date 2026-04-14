import { Property, formatPrice } from "@/data/properties";
import { Home, MapPin, Maximize, BedDouble } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

const typeIcons: Record<string, string> = {
  villa: "🏡",
  appartement: "🏢",
  terrain: "🌿",
  maison: "🏠",
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{typeIcons[property.type]}</span>
        <span className="text-sm font-semibold text-primary">
          {formatPrice(property.price)}
        </span>
      </div>
      <h4 className="font-semibold text-card-foreground text-sm mb-1">
        {property.title}
      </h4>
      <p className="text-muted-foreground text-xs mb-3">{property.description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" /> {property.zone}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Maximize className="w-3 h-3" /> {property.surface} m²
        </span>
        {property.bedrooms && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <BedDouble className="w-3 h-3" /> {property.bedrooms} ch.
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {property.features.slice(0, 3).map((f) => (
          <span
            key={f}
            className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PropertyCard;
