import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "./PropertyCard";
import TypingIndicator from "./TypingIndicator";
import { Property, useProperties, formatPrice } from "@/context/PropertyContext";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  properties?: Property[];
}

const quickActions = [
  "🏡 Voir les villas",
  "🏢 Appartements disponibles",
  "🌿 Terrains à vendre",
  "📍 Biens à Midoun",
  "💰 Budget < 300 000 TND",
  "📞 Contacter l'agence",
];

function getBotResponse(input: string, allProperties: Property[]): { text: string; properties?: Property[] } {
  const lower = input.toLowerCase();

  const search = (filters: { type?: string; zone?: string; maxPrice?: number }) => {
    return allProperties.filter((p) => {
      if (filters.type && p.type !== filters.type) return false;
      if (filters.zone && p.zone !== filters.zone) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    });
  };

  if (lower.includes("contacter") || lower.includes("contact") || lower.includes("téléphone") || lower.includes("appeler")) {
    return {
      text: "📞 Vous pouvez nous contacter :\n\n• **Téléphone / WhatsApp** : +216 50 070 477\n• **Email** : errighioussema@gmail.com\n• **Adresse** : Houmt Souk, Djerba\n\nNos horaires : Lun-Sam 9h-18h. N'hésitez pas à nous appeler pour une visite gratuite ! 🏠",
    };
  }

  if (lower.includes("visite") || lower.includes("réserver") || lower.includes("visiter")) {
    return {
      text: "📅 Super ! Pour réserver une visite :\n\n1. Dites-moi quel bien vous intéresse\n2. Choisissez une date et heure\n3. On vous confirme par SMS/WhatsApp\n\n**Les visites sont gratuites et sans engagement.** Quel bien souhaitez-vous visiter ?",
    };
  }

  if (lower.includes("villa")) {
    const results = search({ type: "villa" });
    return { text: `🏡 Voici nos **${results.length} villas** disponibles à Djerba !`, properties: results };
  }

  if (lower.includes("appartement")) {
    const results = search({ type: "appartement" });
    return { text: `🏢 Nous avons **${results.length} appartements** disponibles.`, properties: results };
  }

  if (lower.includes("terrain")) {
    const results = search({ type: "terrain" });
    return { text: `🌿 **${results.length} terrains** à saisir !`, properties: results };
  }

  if (lower.includes("maison") || lower.includes("houch")) {
    const results = search({ type: "maison" });
    return { text: `🏠 Découvrez nos **maisons traditionnelles** !`, properties: results };
  }

  if (lower.includes("midoun")) {
    const results = search({ zone: "Midoun" });
    return { text: `📍 **Midoun** — zone touristique par excellence !`, properties: results };
  }

  if (lower.includes("houmt") || lower.includes("souk")) {
    const results = search({ zone: "Houmt Souk" });
    return { text: `📍 **Houmt Souk**, le cœur historique de Djerba.`, properties: results };
  }

  if (lower.includes("ajim")) {
    const results = search({ zone: "Ajim" });
    return { text: `📍 **Ajim**, le calme face à la mer.`, properties: results };
  }

  if (lower.includes("budget") || lower.includes("300") || lower.includes("moins")) {
    const results = search({ maxPrice: 300000 });
    return { text: `💰 Voici les biens sous **300 000 TND** !`, properties: results };
  }

  if (lower.includes("bonjour") || lower.includes("salut") || lower.includes("hello") || lower.includes("bonsoir")) {
    return {
      text: "Bonjour et bienvenue chez **Immo Rêve Djerba** ! 🌴\n\nJe suis votre assistant immobilier. Comment puis-je vous aider ?",
    };
  }

  if (lower.includes("prix") || lower.includes("marché") || lower.includes("cher")) {
    return {
      text: "📊 **Aperçu du marché** :\n\n• **Villas** : 300 000 - 900 000 TND\n• **Appartements** : 150 000 - 250 000 TND\n• **Terrains** : 80 - 200 TND/m²\n\nQuel est votre budget ?",
    };
  }

  return {
    text: "Je n'ai pas bien compris. 😊 Essayez : *\"Villas à Midoun\"* ou *\"Budget moins de 300 000\"*",
  };
}

const ChatBot = () => {
  const { properties } = useProperties();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Bienvenue chez **Immo Rêve Djerba** ! 🌴🏠\n\nJe suis votre assistant immobilier. Que recherchez-vous ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text, properties);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: response.text,
        properties: response.properties,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
      <div className="bg-primary px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-primary-foreground text-sm">Assistant Immo Rêve Djerba</h3>
          <p className="text-primary-foreground/70 text-xs">En ligne • Réponse instantanée</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-chat-user" : "bg-muted"}`}>
                {msg.role === "user" ? <User className="w-3.5 h-3.5 text-chat-user-foreground" /> : <Bot className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>
              <div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-chat-user text-chat-user-foreground rounded-br-md" : "bg-chat-bot text-chat-bot-foreground rounded-bl-md"}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />
                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.properties.map((p) => (
                      <PropertyCard key={p.id} property={p} compact />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="bg-chat-bot rounded-2xl rounded-bl-md">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button key={action} onClick={() => sendMessage(action)} className="text-xs bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full transition-colors">
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-border flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tapez votre message..." className="flex-1 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary" />
        <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim() || isTyping}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
