import { useState, useEffect } from "react";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatWidgetProps {
  onOpenChat: () => void;
  delayMs?: number;
}

const chatMessages = [
  "Olá! 👋 Seja bem-vindo(a) à DeckSoft!",
  "Estou aqui para entender seu negócio e identificar como posso ajudar a resolver seus desafios com nossas soluções.",
  "Clique no botão abaixo para iniciarmos nossa conversa! 👇"
];

const FloatingChatWidget = ({ onOpenChat, delayMs = 3000 }: FloatingChatWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
        playNotificationSound();
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, isDismissed]);

  // Sequential message animation
  useEffect(() => {
    if (!isAnimating) return;

    // Show first message immediately
    setVisibleMessages([0]);
    playNotificationSound();

    // Show second message after 2 seconds
    const timer1 = setTimeout(() => {
      setVisibleMessages([0, 1]);
      playNotificationSound();
    }, 2000);

    // Show third message after 4 seconds
    const timer2 = setTimeout(() => {
      setVisibleMessages([0, 1, 2]);
      playNotificationSound();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isAnimating]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
    }, 300);
  };

  const handleOpenChat = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onOpenChat();
    }, 200);
  };

  if (!isVisible && !isDismissed) return null;

  return (
    <div className="fixed bottom-0 right-4 z-50">
      {/* Chat bubble popup */}
      {isVisible && (
        <div 
          className={`bg-card border border-border rounded-t-2xl shadow-2xl shadow-primary/20 p-4 w-80 transition-all duration-500 ease-out ${
            isAnimating 
              ? "translate-y-0 opacity-100" 
              : "translate-y-full opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">DeckSoft</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ease-out ${
                  visibleMessages.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 h-0 overflow-hidden"
                }`}
              >
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-foreground max-w-[90%]">
                  {message}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button - only show after all messages */}
          <div className={`transition-all duration-500 ${
            visibleMessages.length === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            <Button 
              onClick={handleOpenChat}
              className="w-full group"
              size="sm"
            >
              Iniciar conversa
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating chat icon (visible after popup dismissed) */}
      {isDismissed && (
        <button
          onClick={handleOpenChat}
          className="mb-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform animate-fade-in"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingChatWidget;
