import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

type AuthMode = "login" | "signup";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    company: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Placeholder - authentication will be implemented with Supabase
    setTimeout(() => {
      setIsLoading(false);
      // For now, just show that the form was submitted
      console.log("Form submitted:", { mode, ...formData });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-card">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
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
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {mode === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
              </h1>
              <p className="text-muted-foreground">
                {mode === "login" 
                  ? "Entre para acessar sua conta DeckSoft" 
                  : "Comece seu teste gratuito de 14 dias"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa (opcional)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Nome da empresa"
                        value={formData.company}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {mode === "login" && (
                <div className="text-right">
                  <button 
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading 
                  ? "Carregando..." 
                  : mode === "login" 
                    ? "Entrar" 
                    : "Criar conta"}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {mode === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary hover:underline font-medium"
              >
                {mode === "login" ? "Cadastre-se" : "Entrar"}
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:underline">Termos de Uso</a>
            {" "}e{" "}
            <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
