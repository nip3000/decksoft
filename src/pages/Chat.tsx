import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, ArrowUp, MessageCircle, Check, CheckCheck, User, Mic, Square, X, Star } from "lucide-react";
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
import AudioPlayer from "@/components/AudioPlayer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string in Brasilia timezone (not displayed)
  status?: "sent" | "read"; // For user messages only
  audioData?: string; // Base64 audio data for voice messages
  audioDuration?: number; // Duration in seconds for audio messages
  isAudio?: boolean; // Flag to identify audio messages
}

interface LeadInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

function TypingIndicator({ avatarSrc }: { avatarSrc: string }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={cn(
        "flex justify-start transition-all duration-500 ease-out",
        entered
          ? "opacity-100 translate-y-0 blur-0 scale-100"
          : "opacity-0 translate-y-2 blur-sm scale-[0.98]"
      )}
    >
      <img
        src={avatarSrc}
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
  );
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
  
  const [pendingResponses, setPendingResponses] = useState(0);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const isTyping = pendingResponses > 0 && showTypingIndicator;
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showEndChatDialog, setShowEndChatDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const pendingResponsesRef = useRef(0);
  const typingIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    pendingResponsesRef.current = pendingResponses;
  }, [pendingResponses]);

  useEffect(() => {
    return () => {
      if (typingIndicatorTimerRef.current) {
        clearTimeout(typingIndicatorTimerRef.current);
      }
    };
  }, []);

  const scheduleTypingIndicator = () => {
    if (typingIndicatorTimerRef.current) {
      clearTimeout(typingIndicatorTimerRef.current);
    }

    typingIndicatorTimerRef.current = setTimeout(() => {
      if (pendingResponsesRef.current > 0) {
        setShowTypingIndicator(true);
      }
    }, 2000);
  };

  // Audio recording
  const audioRecorder = useAudioRecorder({
    maxDuration: 120,
    onError: (error) => toast.error(error),
  });

  const handleMicClick = async () => {
    if (audioRecorder.state === "idle") {
      await audioRecorder.startRecording();
    } else if (audioRecorder.state === "recording") {
      // Cancelar gravação sem enviar
      audioRecorder.cancelRecording();
    }
  };

  const handleSendAudio = async () => {
    if (audioRecorder.state === "recording") {
      const recordedDuration = audioRecorder.duration;
      const audioBase64 = await audioRecorder.stopRecording();
      if (audioBase64) {
        sendAudioMessage(audioBase64, recordedDuration);
      }
    }
  };

  const sendAudioMessage = async (audioBase64: string, recordedDuration: number) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: "🎤 Mensagem de voz",
      timestamp: getBrasiliaTimestamp(),
      status: "sent",
      audioData: audioBase64,
      audioDuration: recordedDuration,
      isAudio: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsUploadingAudio(true);

    // Mark message as read after 800ms, then show typing indicator 2s later
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => (msg.id === userMessage.id ? { ...msg, status: "read" } : msg))
      );
      scheduleTypingIndicator();
    }, 800);

    setPendingResponses(prev => prev + 1);

    try {
      // Converter Base64 para Blob binário
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: "audio/webm" });

      // Criar FormData com arquivo binário
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      formData.append("messageType", "audio");
      formData.append("format", "webm");
      formData.append("timestamp", userMessage.timestamp);
      formData.append("history", JSON.stringify(messages));
      formData.append("lead", JSON.stringify(leadInfo));

      const response = await fetchWithoutTimeout(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      setIsUploadingAudio(false);

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
      setIsUploadingAudio(false);
      // Silently handle errors for parallel messages - don't show in chat
      setTimeout(() => inputRef.current?.focus(), 100);
    } finally {
      setPendingResponses(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          if (typingIndicatorTimerRef.current) {
            clearTimeout(typingIndicatorTimerRef.current);
            typingIndicatorTimerRef.current = null;
          }
          setShowTypingIndicator(false);
        }
        return next;
      });
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
      // Build natural intro with lead info
      const namePart = leadInfo.name.trim();
      const companyPart = leadInfo.company.trim() ? ` da ${leadInfo.company.trim()}` : "";
      
      // Combine contact info naturally
      const contacts = [leadInfo.phone.trim(), leadInfo.email.trim()].filter(Boolean);
      const contactPart = contacts.length > 0 ? ` (${contacts.join(" | ")})` : "";
      
      const intro = `Oi Ana, tudo bem? Sou o ${namePart}${companyPart}${contactPart}`;
      
      // If user wrote a custom message, prepend the intro
      const customMessage = leadInfo.message.trim() || initialMessage;
      const messageToSend = customMessage 
        ? `${intro}. ${customMessage}`
        : `${intro}, gostaria de mais informações sobre os serviços de vocês.`;
      
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

    // Mark message as read after 800ms, then show typing indicator 2s later
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => (msg.id === userMessage.id ? { ...msg, status: "read" } : msg))
      );
      scheduleTypingIndicator();
    }, 800);

    setPendingResponses(prev => prev + 1);

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
            messageType: "text",
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
      // Silently handle errors for parallel messages - don't show in chat
      setTimeout(() => inputRef.current?.focus(), 100);
    } finally {
      setPendingResponses(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          if (typingIndicatorTimerRef.current) {
            clearTimeout(typingIndicatorTimerRef.current);
            typingIndicatorTimerRef.current = null;
          }
          setShowTypingIndicator(false);
        }
        return next;
      });
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
                    {message.isAudio && message.audioData ? (
                      <AudioPlayer audioData={message.audioData} initialDuration={message.audioDuration} />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
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

            {isTyping && <TypingIndicator avatarSrc={chatAvatar} />}
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
        {/* Upload progress indicator */}
        {isUploadingAudio && (
          <div className="max-w-3xl mx-auto mb-3">
            <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-md border border-primary/30">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-primary">Enviando áudio...</span>
              <div className="flex-1 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse w-full" style={{ animation: 'pulse 1s ease-in-out infinite, slide 2s ease-in-out infinite' }}></div>
              </div>
            </div>
          </div>
        )}
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
              disabled={audioRecorder.state === "processing" || isUploadingAudio}
              className="flex-1"
            />
          )}
          <Button
            variant={audioRecorder.state === "recording" ? "destructive" : "outline"}
            size="icon"
            onClick={handleMicClick}
            disabled={audioRecorder.state === "processing" || isUploadingAudio}
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
            onClick={audioRecorder.state === "recording" ? handleSendAudio : sendMessage} 
            disabled={(audioRecorder.state === "idle" && !input.trim()) || isUploadingAudio}
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowEndChatDialog(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Finalizar</span>
          </Button>
        </div>
      </div>

      {/* End Chat Rating Dialog */}
      <AlertDialog open={showEndChatDialog} onOpenChange={setShowEndChatDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Como você avalia seu atendimento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground hover:text-yellow-400"
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Deixe um comentário (opcional)"
            className="resize-none"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setRating(0); setRatingComment(""); }}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/")}
              disabled={rating === 0}
              className={cn(rating === 0 && "opacity-50 cursor-not-allowed")}
            >
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chat;
