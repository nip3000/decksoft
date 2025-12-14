import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import chatAvatar from "@/assets/chat-avatar.jpg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WEBHOOK_URL = ""; // Configure your n8n webhook URL here

const greetingMessages = [
  "Olá! 👋 Seja bem-vindo(a) à DeckSoft!",
  "Estou aqui para entender seu negócio e identificar como posso ajudar a resolver seus desafios com nossas soluções.",
  "Como posso ajudá-lo(a) hoje?"
];

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message") || "";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // Show greeting messages sequentially
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const showGreetings = async () => {
      for (let i = 0; i < greetingMessages.length; i++) {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: greetingMessages[i]
        }]);
        setGreetingIndex(i + 1);
        
        if (i < greetingMessages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      setIsTyping(false);
      
      // If there's an initial message from URL, send it after greetings
      if (initialMessage) {
        await new Promise(resolve => setTimeout(resolve, 500));
        sendMessageWithContent(initialMessage);
      }
    };

    showGreetings();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessageWithContent = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (!WEBHOOK_URL) {
        // Simulated response when no webhook is configured
        await new Promise(resolve => setTimeout(resolve, 1500));
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Obrigado pelo seu interesse! No momento, nosso chat está sendo configurado. Em breve, nossa equipe entrará em contato. Enquanto isso, você pode explorar nosso site para conhecer melhor nossas soluções.",
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.content, history: messages }),
        });

        if (!response.ok) throw new Error("Erro na comunicação");

        const data = await response.json();
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response || data.message || "Desculpe, não consegui processar sua mensagem.",
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro. Tente novamente mais tarde.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => sendMessageWithContent(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img 
            src={chatAvatar} 
            alt="Atendente DeckSoft" 
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" 
          />
          <div>
            <h2 className="font-semibold text-foreground">Ana • Atendente</h2>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <img 
                  src={chatAvatar} 
                  alt="Atendente" 
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2 mt-1" 
                />
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {(isTyping || isLoading) && (
            <div className="flex justify-start">
              <img 
                src={chatAvatar} 
                alt="Atendente" 
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2 mt-1" 
              />
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 shrink-0 bg-card">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={isLoading || isTyping}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || isTyping || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
