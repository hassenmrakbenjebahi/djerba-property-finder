import ChatBot from "@/components/ChatBot";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import PropertyCard from "@/components/PropertyCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useProperties, formatPrice } from "@/context/PropertyContext";
import { MapPin, Phone, Mail, Home, Search, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/djerba-hero.jpg";
import logo from "@/assets/logo.png";
import { useState } from "react";

const AGENCY_NAME = "El May Djerba Immo";

const Index = () => {
  const { properties, loading } = useProperties();
  const [filterType, setFilterType] = useState<string>("all");
  const [listingFilter, setListingFilter] = useState<"all" | "sale" | "rent">("all");

  const filteredProperties = properties.filter((p) => {
    if (filterType !== "all" && p.type !== filterType) return false;
    if (listingFilter !== "all" && p.listing_type !== listingFilter) return false;
    return true;
  });
  const types = [
    { value: "all", label: "Tous" },
    { value: "villa", label: "Villas" },
    { value: "appartement", label: "Appartements" },
    { value: "terrain", label: "Terrains" },
    { value: "maison", label: "Maisons" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt={AGENCY_NAME} className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/30 ring-offset-2 ring-offset-background shadow-sm" />
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground leading-tight">{AGENCY_NAME}</h1>
              <p className="text-xs text-muted-foreground">Votre agence à Djerba</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#biens" className="text-muted-foreground hover:text-foreground transition-colors">Nos biens</a>
            <a href="#assistant" className="text-muted-foreground hover:text-foreground transition-colors">Assistant</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> +216 50 070 477
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Vue aérienne de Djerba, Tunisie"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 text-center px-4 animate-slide-up">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            Votre rêve immobilier à Djerba
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Villas, appartements, terrains — découvrez les meilleures offres de l'île
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" className="rounded-full" asChild>
              <a href="#biens"><Search className="w-4 h-4 mr-2" /> Voir les biens</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20" asChild>
              <a href="#assistant">💬 Parler à l'assistant</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="biens" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Nos biens à Djerba
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explorez notre sélection de propriétés dans les plus belles zones de l'île
          </p>
        </div>

        {/* Sale / Rent toggle */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex bg-muted rounded-full p-1">
            {([
              { value: "all", label: "Tous" },
              { value: "sale", label: "À vendre" },
              { value: "rent", label: "À louer" },
            ] as const).map((t) => (
              <button
                key={t.value}
                onClick={() => setListingFilter(t.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  listingFilter === t.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterType === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-in opacity-0"
                style={{ animationDelay: `${Math.min(i * 70, 600)}ms`, animationFillMode: "forwards" }}
              >
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        )}
        {!loading && filteredProperties.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucun bien trouvé pour cette catégorie.</p>
        )}
      </section>

      {/* Testimonials marquee */}
      <TestimonialsMarquee />

      {/* Chat Section */}
      <section id="assistant" className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
              Assistant Intelligent
            </h3>
            <p className="text-muted-foreground">
              Posez vos questions, notre assistant vous guide vers le bien idéal
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ChatBot />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Pourquoi {AGENCY_NAME} ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Home,
                title: "Expertise locale",
                desc: "Plus de 10 ans d'expérience sur le marché immobilier de Djerba.",
              },
              {
                icon: MapPin,
                title: "Toutes les zones",
                desc: "Midoun, Houmt Souk, Ajim — nous couvrons toute l'île.",
              },
              {
                icon: Shield,
                title: "Accompagnement complet",
                desc: "De la recherche à la signature, on vous accompagne à chaque étape.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
            Contactez-nous
          </h3>
          <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> +216 50 070 477
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> errighioussema@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> El Mey, Djerba
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/70 text-sm">
            © 2026 {AGENCY_NAME} — Agence immobilière à Djerba, Tunisie
          </p>
          <Link to="/admin" className="text-background/40 text-xs hover:text-background/60 transition-colors">
            Espace Admin
          </Link>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default Index;
