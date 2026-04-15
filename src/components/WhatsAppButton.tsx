import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WHATSAPP_NUMBER = "21675000000"; // Replace with real number

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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
        aria-label="Contacter via WhatsApp"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Form popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card rounded-2xl border border-border shadow-2xl animate-fade-in overflow-hidden">
          <div className="bg-[#25D366] px-5 py-4">
            <h3 className="text-white font-semibold text-sm">💬 Contactez-nous sur WhatsApp</h3>
            <p className="text-white/80 text-xs mt-0.5">Réponse rapide garantie</p>
          </div>
          <div className="p-4 space-y-3">
            <Input
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
            <Textarea
              placeholder="Votre message... (ex: Je cherche une villa à Midoun)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="rounded-xl resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white"
            >
              <Send className="w-4 h-4 mr-2" /> Envoyer sur WhatsApp
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
