import { Property, formatPrice } from "@/context/PropertyContext";
import { MapPin, Maximize, BedDouble, ArrowUpRight } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  villa: "Villa",
  appartement: "Appartement",
  terrain: "Terrain",
  maison: "Maison",
};

const PropertyCard = ({ property, compact }: PropertyCardProps) => {
  const isRent = property.listing_type === "rent";
  const priceLabel = isRent ? `${formatPrice(property.price)} / mois` : formatPrice(property.price);

  if (compact) {
    return (
      <div className="bg-card rounded-lg border border-border p-3 animate-fade-in flex gap-3 items-center">
        {property.image_url && (
          <img src={property.image_url} alt={property.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
        )}
        <div className="min-w-0">
          <h4 className="font-semibold text-card-foreground text-sm truncate">{property.title}</h4>
          <p className="text-primary text-sm font-bold">{priceLabel}</p>
          <p className="text-muted-foreground text-xs">{property.zone} • {property.surface} m² • {isRent ? "À louer" : "À vendre"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden animate-fade-in hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {property.image_url ? (
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-5xl opacity-50">🏠</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Type + listing badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
            {typeLabels[property.type] || property.type}
          </span>
          <span className={`backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full ${isRent ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
            {isRent ? "À louer" : "À vendre"}
          </span>
        </div>

        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-primary-foreground font-bold text-xl drop-shadow-lg">
            {priceLabel}
          </span>
        </div>

        {/* Arrow icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-heading font-semibold text-card-foreground text-base mb-1.5 line-clamp-1">
          {property.title}
        </h4>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-primary" /> {property.zone}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Maximize className="w-3.5 h-3.5 text-primary" /> {property.surface} m²
          </span>
          {property.bedrooms && (
            <span className="inline-flex items-center gap-1.5 text-xs">
              <BedDouble className="w-3.5 h-3.5 text-primary" /> {property.bedrooms} ch.
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {property.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="bg-primary/5 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/10"
            >
              {f}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-muted-foreground text-xs px-2 py-1">
              +{property.features.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
