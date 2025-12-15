import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, ArrowUp, MessageCircle, Check, CheckCheck, User, Mic, Square } from "lucide-react";
import { useAudioRecorder, formatDuration } from "@/hooks/use-audio-recorder";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import chatAvatar from "@/assets/chat-avatar.jpg";
import AudioWaveform from "@/components/AudioWaveform";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string in Brasilia timezone (not displayed)
  status?: "sent" | "read"; // For user messages only
}

interface LeadInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

const WEBHOOK_URL = "https://repetiva-n8n.hfnc82.easypanel.host/webhook/240b36f9-9d6d-4946-864b-8b681f3ec906";

// Greeting messages removed - chat now starts directly with lead's message

// Simple fetch without timeout - waits for webhook response
const fetchWithoutTimeout = async (
  url: string, 
  options: RequestInit
): Promise<Response> => {
  return await fetch(url, options);
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return "Sem conexão com a internet. Verifique sua conexão e tente novamente.";
    }
  }
  return "Desculpe, ocorreu um erro. Tente novamente em alguns instantes.";
};

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
};

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : "";
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

// Get current timestamp in Brasilia timezone (UTC-3)
const getBrasiliaTimestamp = (): string => {
  const now = new Date();
  const brasiliaOffset = -3 * 60; // UTC-3 in minutes
  const localOffset = now.getTimezoneOffset();
  const brasiliaTime = new Date(now.getTime() + (localOffset + brasiliaOffset) * 60000);
  return brasiliaTime.toISOString().replace('Z', '-03:00');
};

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message") || "";
  
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({ name: "", company: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // Audio recording
  const audioRecorder = useAudioRecorder({
    maxDuration: 120,
    onError: (error) => toast.error(error),
  });

  const handleMicClick = async () => {
    if (audioRecorder.state === "idle") {
      await audioRecorder.startRecording();
    } else if (audioRecorder.state === "recording") {
      const audioBase64 = await audioRecorder.stopRecording();
      if (audioBase64) {
        sendAudioMessage(audioBase64);
      }
    }
  };

  const sendAudioMessage = async (audioBase64: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: "🎤 Mensagem de voz",
      timestamp: getBrasiliaTimestamp(),
      status: "sent",
    };

    setMessages(prev => [...prev, userMessage]);

    // Mark message as read after a brief delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: "read" } : msg
      ));
    }, 800);

    setIsTyping(true);

    try {
      const response = await fetchWithoutTimeout(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "audio_message",
          audio: audioBase64,
          format: "webm",
          timestamp: userMessage.timestamp,
          history: messages,
          lead: leadInfo
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status >= 500) {
          throw new Error("Servidor temporariamente indisponível");
        } else if (status === 429) {
          throw new Error("Muitas requisições. Aguarde um momento.");
        } else {
          throw new Error("Erro na comunicação");
        }
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.text || data.response || data.message || "Desculpe, não consegui processar sua mensagem.",
        timestamp: getBrasiliaTimestamp(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Audio message error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: getErrorMessage(error),
        timestamp: getBrasiliaTimestamp(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } finally {
      setIsTyping(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; phone?: string } = {};
    
    if (!isValidEmail(leadInfo.email)) {
      newErrors.email = "Digite um e-mail válido";
    }
    if (!isValidPhone(leadInfo.phone)) {
      newErrors.phone = "Digite um telefone válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return leadInfo.name.trim().length > 0 && 
           isValidEmail(leadInfo.email) && 
           isValidPhone(leadInfo.phone);
  };

  const startChat = async () => {
    if (!validateForm() || !leadInfo.name.trim()) return;
    
    setIsSubmittingLead(true);
    
    try {
      // Send lead info to webhook with retry
      await fetchWithoutTimeout(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "lead_registration",
          lead: leadInfo,
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error("Error sending lead info:", error);
      // Continue to chat even if lead registration fails - we don't want to block the user
    }
    
    setIsSubmittingLead(false);
    setHasStartedChat(true);
  };

  // Send lead's initial message when chat starts
  useEffect(() => {
    if (!hasStartedChat || hasInitialized.current) return;
    hasInitialized.current = true;

    const sendInitialMessage = async () => {
      // Build the message to send
      // Priority: lead form message > URL message > default message with lead name/company
      const companyText = leadInfo.company.trim() ? `, da empresa ${leadInfo.company.trim()}` : "";
      const defaultMessage = `Oi Ana, tudo bem? Sou o ${leadInfo.name}${companyText}, gostaria de mais informações sobre os serviços de vocês.`;
      const messageToSend = leadInfo.message.trim() || initialMessage || defaultMessage;
      
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
      sendMessageWithContent(messageToSend);
    };

    sendInitialMessage();
  }, [hasStartedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 200);
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const sendMessageWithContent = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: getBrasiliaTimestamp(),
      status: "sent",
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Mark message as read after a brief delay (simulating server acknowledgment)
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: "read" } : msg
      ));
    }, 800);

    setIsTyping(true);

    try {
      if (!WEBHOOK_URL) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Obrigado pelo seu interesse! No momento, nosso chat está sendo configurado. Em breve, nossa equipe entrará em contato. Enquanto isso, você pode explorar nosso site para conhecer melhor nossas soluções.",
          timestamp: getBrasiliaTimestamp(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const response = await fetchWithoutTimeout(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: userMessage.content,
            timestamp: userMessage.timestamp,
            history: messages,
            lead: leadInfo
          }),
        });

        if (!response.ok) {
          const status = response.status;
          if (status >= 500) {
            throw new Error("Servidor temporariamente indisponível");
          } else if (status === 429) {
            throw new Error("Muitas requisições. Aguarde um momento.");
          } else {
            throw new Error("Erro na comunicação");
          }
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.text || data.response || data.message || "Desculpe, não consegui processar sua mensagem.",
          timestamp: getBrasiliaTimestamp(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        // Focus input after receiving response
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: getErrorMessage(error),
        timestamp: getBrasiliaTimestamp(),
      };
      setMessages(prev => [...prev, errorMessage]);
      // Focus input after error message
      setTimeout(() => inputRef.current?.focus(), 100);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = () => sendMessageWithContent(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeadKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormValid()) {
      e.preventDefault();
      startChat();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setLeadInfo(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeadInfo(prev => ({ ...prev, email: e.target.value }));
    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
  };

  // Lead form view
  if (!hasStartedChat) {
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

        {/* Lead Form */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border my-4">
            <div className="text-center mb-8">
              <img 
                src={chatAvatar} 
                alt="Ana" 
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 mx-auto mb-4 shadow-lg" 
              />
              <h1 className="text-2xl font-bold text-foreground">Olá! Sou a Ana</h1>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Para iniciar nossa conversa, por favor me conte um pouco sobre você e como posso ajudar.
              </p>
            </div>

            <div className="space-y-4">
              {/* Two columns for Name and Company on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={leadInfo.name}
                    onChange={(e) => setLeadInfo(prev => ({ ...prev, name: e.target.value }))}
                    onKeyDown={handleLeadKeyDown}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                  <Input
                    id="company"
                    placeholder="Nome da sua empresa"
                    value={leadInfo.company}
                    onChange={(e) => setLeadInfo(prev => ({ ...prev, company: e.target.value }))}
                    onKeyDown={handleLeadKeyDown}
                  />
                </div>
              </div>

              {/* Two columns for Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={leadInfo.email}
                    onChange={handleEmailChange}
                    onKeyDown={handleLeadKeyDown}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={leadInfo.phone}
                    onChange={handlePhoneChange}
                    onKeyDown={handleLeadKeyDown}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Message field - full width */}
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Textarea
                  id="message"
                  placeholder="Como posso ajudá-lo hoje? Conte-me sobre seu negócio ou dúvida..."
                  value={leadInfo.message}
                  onChange={(e) => setLeadInfo(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              <Button 
                onClick={startChat} 
                disabled={!isFormValid() || isSubmittingLead}
                className="w-full mt-4"
                size="lg"
              >
                {isSubmittingLead ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <MessageCircle className="w-4 h-4 mr-2" />
                )}
                Conversar com a Ana
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
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
      <div className="flex-1 overflow-hidden relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto p-4 pb-6"
        >
          <div className="max-w-3xl mx-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-2 animate-fade-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <img 
                    src={chatAvatar} 
                    alt="Atendente" 
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5" 
                  />
                )}
                <div className={cn(
                  "flex flex-col",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
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
                  {message.role === "user" && (
                    <div className="flex items-center gap-1 mt-1 mr-1 relative h-4">
                      <Check 
                        className={cn(
                          "w-4 h-4 absolute transition-all duration-300",
                          message.status === "read" 
                            ? "opacity-0 scale-75" 
                            : "opacity-100 scale-100 text-muted-foreground"
                        )} 
                      />
                      <CheckCheck 
                        className={cn(
                          "w-4 h-4 absolute transition-all duration-300",
                          message.status === "read" 
                            ? "opacity-100 scale-100 text-primary" 
                            : "opacity-0 scale-75"
                        )} 
                      />
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <img 
                  src={chatAvatar} 
                  alt="Ana" 
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2 mt-1 ring-2 ring-primary/20" 
                />
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-medium">Ana está digitando</span>
                    <div className="flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showScrollTop && (
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 rounded-full shadow-lg animate-fade-in"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 shrink-0 bg-card">
        <div className="max-w-3xl mx-auto flex gap-2">
          {audioRecorder.state === "recording" ? (
            <div className="flex-1 flex items-center justify-between gap-3 px-4 py-2 bg-destructive/10 rounded-md border border-destructive/30">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-destructive rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-destructive">
                  Gravando...
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AudioWaveform barCount={5} />
                <span className="text-sm font-mono text-destructive/80">
                  {formatDuration(audioRecorder.duration)}
                </span>
              </div>
            </div>
          ) : (
          <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={isTyping || audioRecorder.state === "processing"}
              className="flex-1"
            />
          )}
          <Button
            variant={audioRecorder.state === "recording" ? "destructive" : "outline"}
            size="icon"
            onClick={handleMicClick}
            disabled={isTyping || audioRecorder.state === "processing"}
            className={audioRecorder.state === "recording" ? "animate-pulse" : ""}
          >
            {audioRecorder.state === "processing" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : audioRecorder.state === "recording" ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button 
            onClick={sendMessage} 
            disabled={isTyping || !input.trim() || audioRecorder.state !== "idle"}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
