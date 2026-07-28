import { useState } from "react";
import { Property, formatPrice } from "@/context/PropertyContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize, BedDouble, Calendar, ChevronLeft, ChevronRight, Phone, MessageCircle } from "lucide-react";

const typeLabels: Record<string, string> = {
  villa: "Villa",
  appartement: "Appartement",
  terrain: "Terrain",
  maison: "Maison",
};

const WHATSAPP_NUMBER = "21650070477";

interface Props {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PropertyDetailDialog = ({ property, open, onOpenChange }: Props) => {
  const [idx, setIdx] = useState(0);

  if (!property) return null;

  const isRent = property.listing_type === "rent";
  const monthly = property.price_monthly ?? (isRent ? property.price : null);
  const nightly = property.price_nightly ?? null;
  const rentParts: string[] = [];
  if (monthly) rentParts.push(`${formatPrice(monthly)} / mois`);
  if (nightly) rentParts.push(`${formatPrice(nightly)} / nuit`);
  const priceLabel = isRent
    ? (rentParts.length ? rentParts.join(" • ") : formatPrice(property.price))
    : formatPrice(property.price);
  const gallery = (property.images && property.images.length > 0)
    ? property.images
    : (property.image_url ? [property.image_url] : []);
  const current = gallery[idx % Math.max(gallery.length, 1)];

  const next = () => setIdx((i) => (i + 1) % gallery.length);
  const prev = () => setIdx((i) => (i - 1 + gallery.length) % gallery.length);

  const waMsg = encodeURIComponent(`Bonjour, je suis intéressé par "${property.title}" (${priceLabel}). Pouvez-vous me donner plus d'informations ?`);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setIdx(0); }}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0">
        <div className="relative bg-muted">
          {current ? (
            <img src={current} alt={property.title} className="w-full h-72 md:h-96 object-cover" />
          ) : (
            <div className="w-full h-72 flex items-center justify-center text-6xl opacity-40">🏠</div>
          )}

          {gallery.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur text-xs px-2.5 py-1 rounded-full">
                {idx + 1} / {gallery.length}
              </div>
            </>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-primary/90 backdrop-blur text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
              {typeLabels[property.type] || property.type}
            </span>
            <span className={`backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full ${isRent ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {isRent ? "À louer" : "À vendre"}
            </span>
          </div>
        </div>

        {gallery.length > 1 && (
          <div className="flex gap-2 px-6 -mt-2 overflow-x-auto pb-1">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setIdx(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="px-6 pb-6 pt-2">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">{property.title}</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mt-3 mb-4">
            <span className="text-primary font-bold text-2xl">{priceLabel}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><MapPin className="w-3.5 h-3.5 text-primary" /> Zone</div>
              <div className="font-semibold text-sm">{property.zone}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Maximize className="w-3.5 h-3.5 text-primary" /> Surface</div>
              <div className="font-semibold text-sm">{property.surface} m²</div>
            </div>
            {property.bedrooms != null && (
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><BedDouble className="w-3.5 h-3.5 text-primary" /> Chambres</div>
                <div className="font-semibold text-sm">{property.bedrooms}</div>
              </div>
            )}
            {isRent && property.available_from && (
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Calendar className="w-3.5 h-3.5 text-primary" /> Disponible dès</div>
                <div className="font-semibold text-sm">{new Date(property.available_from).toLocaleDateString("fr-FR")}</div>
              </div>
            )}
          </div>

          <div className="mb-5">
            <h4 className="font-heading font-semibold mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{property.description || "Aucune description fournie."}</p>
          </div>

          {property.features.length > 0 && (
            <div className="mb-6">
              <h4 className="font-heading font-semibold mb-2">Caractéristiques</h4>
              <div className="flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <span key={f} className="bg-primary/5 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/10">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> Contacter sur WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href="tel:+21650070477">
                <Phone className="w-4 h-4 mr-2" /> Appeler l'agence
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailDialog;
