import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  { name: "Sonia B.", location: "Tunis", rating: 5, initials: "SB", text: "Service exceptionnel ! J'ai trouvé ma villa de rêve à Midoun en seulement 2 semaines. Équipe très professionnelle." },
  { name: "Karim M.", location: "Djerba", rating: 5, initials: "KM", text: "Accompagnement parfait de A à Z. Ils connaissent vraiment l'île et m'ont guidé vers le meilleur quartier." },
  { name: "Leila T.", location: "Sfax", rating: 5, initials: "LT", text: "Très réactifs sur WhatsApp, photos fidèles à la réalité. Je recommande vivement El Mey Djerba Immo !" },
  { name: "Mehdi K.", location: "France", rating: 5, initials: "MK", text: "Achat d'un terrain à distance, tout s'est passé sans souci. Confiance totale, équipe sérieuse." },
  { name: "Amel R.", location: "Houmt Souk", rating: 5, initials: "AR", text: "Location rapide d'un appartement vue mer. Prix juste et conseils précieux. Merci beaucoup !" },
  { name: "Yassine H.", location: "Allemagne", rating: 5, initials: "YH", text: "Agence sérieuse et transparente. Ils répondent à toutes les questions, même les plus pointues." },
  { name: "Ines D.", location: "Djerba", rating: 5, initials: "ID", text: "Très satisfaite de la vente de ma maison. Estimation juste et acheteur trouvé en un mois." },
  { name: "Nizar B.", location: "Italie", rating: 5, initials: "NB", text: "Professionnalisme et écoute. Ma famille adore notre nouvelle villa à El Mey. Mille mercis !" },
];

const Card = ({ t }: { t: Testimonial }) => (
  <article className="shrink-0 w-[320px] sm:w-[360px] bg-card border border-border rounded-2xl p-5 mx-3 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
        {t.initials}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-card-foreground text-sm truncate">{t.name}</p>
        <p className="text-xs text-muted-foreground truncate">{t.location}</p>
      </div>
      <div className="ml-auto flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
        ))}
      </div>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">"{t.text}"</p>
  </article>
);

const TestimonialsMarquee = () => {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="py-16 overflow-hidden bg-background">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
          Ils nous font confiance
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Découvrez les avis de nos clients satisfaits à Djerba et ailleurs
        </p>
      </div>

      <div
        className="relative group"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMarquee;
