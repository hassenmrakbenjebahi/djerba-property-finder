import { useState } from "react";
import { Property, formatPrice } from "@/context/PropertyContext";
import { MapPin, Maximize, BedDouble, ArrowUpRight, Images, Calendar } from "lucide-react";
import PropertyDetailDialog from "./PropertyDetailDialog";

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
  variant?: "grid" | "list";
}

const typeLabels: Record<string, string> = {
  villa: "Villa",
  appartement: "Appartement",
  terrain: "Terrain",
  maison: "Maison",
};

const PropertyCard = ({ property, compact, variant = "grid" }: PropertyCardProps) => {
  const [open, setOpen] = useState(false);
  const isRent = property.listing_type === "rent";
  const priceLabel = isRent ? `${formatPrice(property.price)} / mois` : formatPrice(property.price);
  const cover = (property.images && property.images.length > 0) ? property.images[0] : property.image_url;
  const photoCount = property.images?.length || (property.image_url ? 1 : 0);

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

  if (variant === "list") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group w-full text-left bg-card rounded-2xl border border-border overflow-hidden flex flex-col sm:flex-row hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <div className="relative sm:w-72 h-56 sm:h-auto shrink-0 overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-5xl opacity-50">🏠</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent sm:bg-gradient-to-r" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                {typeLabels[property.type] || property.type}
              </span>
              {isRent && (
                <span className="backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-accent-foreground">
                  À louer
                </span>
              )}
            </div>
            {photoCount > 1 && (
              <div className="absolute top-3 right-3 bg-background/80 backdrop-blur text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <Images className="w-3 h-3" /> {photoCount}
              </div>
            )}
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-heading font-semibold text-card-foreground text-lg line-clamp-1">
                  {property.title}
                </h4>
                <span className="text-primary font-bold text-lg whitespace-nowrap">
                  {priceLabel}
                </span>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-3">
                {property.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-muted-foreground">
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
                {isRent && property.available_from && (
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> dès {new Date(property.available_from).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {property.features.slice(0, 4).map((f) => (
                  <span
                    key={f}
                    className="bg-primary/5 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/10"
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ArrowUpRight className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
            </div>
          </div>
        </button>
        <PropertyDetailDialog property={property} open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="text-left w-full group bg-card rounded-2xl border border-border overflow-hidden animate-fade-in hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {cover ? (
          <img
            src={cover}
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
          {isRent && (
            <span className="backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-accent-foreground">
              À louer
            </span>
          )}
        </div>

        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-primary-foreground font-bold text-xl drop-shadow-lg">
            {priceLabel}
          </span>
        </div>

        {/* Photo count */}
        {photoCount > 1 && (
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Images className="w-3 h-3" /> {photoCount}
          </div>
        )}

        {/* Arrow icon */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          {isRent && property.available_from && (
            <span className="inline-flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-primary" /> dès {new Date(property.available_from).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
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
    </button>
    <PropertyDetailDialog property={property} open={open} onOpenChange={setOpen} />
    </>
  );
};

export default PropertyCard;
