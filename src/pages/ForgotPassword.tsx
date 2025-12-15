import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Placeholder - password reset will be implemented with Supabase
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log("Password reset requested for:", email);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-card">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/login")}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Logo size="md" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {!isSubmitted ? (
              <>
                {/* Title */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Recuperar senha
                  </h1>
                  <p className="text-muted-foreground">
                    Digite seu e-mail e enviaremos instruções para redefinir sua senha
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar instruções"}
                  </Button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-primary hover:underline"
                  >
                    Voltar para o login
                  </button>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  E-mail enviado!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Verifique sua caixa de entrada em <strong className="text-foreground">{email}</strong>. 
                  Enviamos as instruções para redefinir sua senha.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Não recebeu o e-mail? Verifique a pasta de spam ou{" "}
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:underline"
                  >
                    tente novamente
                  </button>
                </p>
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  Voltar para o login
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
