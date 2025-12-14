import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import chatAvatar from "@/assets/chat-avatar.jpg";
interface FloatingChatWidgetProps {
  onOpenChat: () => void;
  delayMs?: number;
}
const chatMessages = ["Olá! 👋 Seja bem-vindo(a) à DeckSoft!", "Estou aqui para entender seu negócio e identificar como posso ajudar a resolver seus desafios com nossas soluções.", "Clique no botão abaixo para iniciarmos nossa conversa! 👇"];
const TypingIndicator = () => <div className="flex items-end gap-2">
    <img src={chatAvatar} alt="Atendente" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[60px] flex gap-1 items-center">
      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]"></span>
      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]"></span>
      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]"></span>
    </div>
  </div>;
const FloatingChatWidget = ({
  onOpenChat,
  delayMs = 3000
}: FloatingChatWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
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

  // Sequential message animation with typing indicator
  useEffect(() => {
    if (!isAnimating) return;
    const showMessage = (index: number) => {
      setIsTyping(false);
      setVisibleMessages(prev => [...prev, index]);
      playNotificationSound();
      setTimeout(scrollToBottom, 100);
    };
    const showTyping = () => {
      setIsTyping(true);
      setTimeout(scrollToBottom, 100);
    };

    // Show typing then first message
    showTyping();
    const timer0 = setTimeout(() => showMessage(0), 1000);

    // Show typing then second message
    const timer1a = setTimeout(showTyping, 2500);
    const timer1b = setTimeout(() => showMessage(1), 4000);

    // Show typing then third message
    const timer2a = setTimeout(showTyping, 5500);
    const timer2b = setTimeout(() => showMessage(2), 7000);
    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1a);
      clearTimeout(timer1b);
      clearTimeout(timer2a);
      clearTimeout(timer2b);
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
  return <div className="fixed bottom-0 right-4 z-50">
      {/* Chat bubble popup */}
      {isVisible && <div className={`bg-card border border-border rounded-t-2xl shadow-2xl shadow-primary/20 p-4 w-80 transition-all duration-500 ease-out ${isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={chatAvatar} alt="Atendente DeckSoft" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
              <div>
                <span className="text-sm font-semibold text-foreground">DeckSoft</span>
                <span className="text-xs text-muted-foreground block -mt-0.5">Ana • Atendente</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Fechar">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scroll-smooth">
            {chatMessages.map((message, index) => <div key={index} className={`transition-all duration-500 ease-out ${visibleMessages.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 h-0 overflow-hidden"}`}>
                <div className="flex items-end gap-2">
                  <img src={chatAvatar} alt="Atendente" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-foreground max-w-[85%]">
                    {message}
                  </div>
                </div>
              </div>)}
            
            {/* Typing indicator */}
            {isTyping && <div className="animate-fade-in">
                <TypingIndicator />
              </div>}
            
            <div ref={messagesEndRef} />
          </div>

          {/* CTA Button - only show after all messages */}
          <div className={`transition-all duration-500 ${visibleMessages.length === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Button onClick={handleOpenChat} className="w-full group" size="sm">
              Iniciar conversa
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>}

      {/* Floating chat icon (visible after popup dismissed) */}
      {isDismissed && <button onClick={handleOpenChat} className="mb-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform animate-fade-in" aria-label="Abrir chat">
          <MessageCircle className="w-6 h-6" />
        </button>}
    </div>;
};
export default FloatingChatWidget;