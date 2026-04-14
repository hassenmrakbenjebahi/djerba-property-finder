import ChatBot from "@/components/ChatBot";
import { MapPin, Phone, Mail, Home } from "lucide-react";
import heroImage from "@/assets/djerba-hero.jpg";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ImmoDjerba" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground leading-tight">ImmoDjerba</h1>
              <p className="text-xs text-muted-foreground">Votre agence à Djerba</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> +216 75 XXX XXX
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> contact@immodjerba.tn
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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
            Trouvez votre bien à Djerba
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
            Villas, appartements, terrains — votre assistant intelligent vous guide
          </p>
        </div>
      </section>

      {/* Chat Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="max-w-2xl mx-auto">
          <ChatBot />
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Pourquoi ImmoDjerba ?
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
                icon: Phone,
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

      {/* Footer */}
      <footer className="bg-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-background/70 text-sm">
            © 2026 ImmoDjerba — Agence immobilière à Djerba, Tunisie
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
