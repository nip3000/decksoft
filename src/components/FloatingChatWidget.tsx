import { useState, useEffect } from "react";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatWidgetProps {
  onOpenChat: () => void;
  delayMs?: number;
}

const FloatingChatWidget = ({ onOpenChat, delayMs = 3000 }: FloatingChatWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleOpenChat = () => {
    setIsVisible(false);
    onOpenChat();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      {/* Chat bubble popup */}
      <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/20 p-5 max-w-xs mb-4 relative">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">DeckSoft</span>
        </div>

        {/* Message content */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-foreground font-medium">
            Olá! 👋 Posso ajudar você?
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Identificamos os desafios do seu negócio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Propomos soluções personalizadas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Atendimento rápido e sem compromisso</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleOpenChat}
          className="w-full group"
          size="sm"
        >
          Iniciar conversa
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Floating chat icon (always visible after popup dismissed) */}
      {isDismissed && (
        <button
          onClick={handleOpenChat}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform animate-fade-in"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingChatWidget;
