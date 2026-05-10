import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WHATSAPP_NUMBER = "21650070477";

const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const text = `Bonjour, je suis ${name || "un visiteur"}.\n\n${message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setOpen(false);
    setName("");
    setMessage("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Contacter l'agence"
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        )}
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-110 transition-all duration-300">
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </span>
      </button>

      {/* Form popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] bg-card rounded-3xl border border-border shadow-2xl animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="relative px-5 py-5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base leading-tight">Discutons de votre projet</h3>
                <p className="text-primary-foreground/80 text-xs mt-1">Réponse rapide • Conseils gratuits</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Votre nom</label>
              <Input
                placeholder="ex: Karim"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl bg-muted/50 border-border focus-visible:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Votre message</label>
              <Textarea
                placeholder="Je cherche une villa à louer à Midoun…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="rounded-xl bg-muted/50 border-border focus-visible:ring-primary resize-none"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full rounded-xl h-11 bg-gradient-to-r from-primary to-primary/80 hover:opacity-95 text-primary-foreground font-medium shadow-md shadow-primary/20"
            >
              <Send className="w-4 h-4 mr-2" /> Envoyer le message
            </Button>
            <p className="text-[10px] text-center text-muted-foreground pt-1">
              Vous serez redirigé vers WhatsApp
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
