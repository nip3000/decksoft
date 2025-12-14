import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

interface PricingSectionProps {
  onOpenChat: () => void;
}

const plans = [
  {
    name: "Essencial",
    description: "Ideal para pequenas empresas",
    features: [
      "1 módulo à escolha",
      "Até 2 usuários",
      "Suporte por e-mail",
      "Atualizações inclusas",
      "Backup diário",
    ],
    highlighted: false,
  },
  {
    name: "Profissional",
    description: "Para empresas em crescimento",
    features: [
      "2 módulos à escolha",
      "Até 10 usuários",
      "Suporte prioritário",
      "Atualizações inclusas",
      "Backup em tempo real",
      "Integrações avançadas",
      "Relatórios personalizados",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Soluções sob medida",
    features: [
      "Todos os módulos",
      "Usuários ilimitados",
      "Suporte 24/7",
      "Gerente de conta dedicado",
      "Personalização completa",
      "API exclusiva",
      "Treinamento presencial",
    ],
    highlighted: false,
  },
];

const PricingSection = ({ onOpenChat }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-transparent to-muted/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planos que cabem no seu negócio
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para sua empresa. Todos incluem suporte e atualizações.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <AnimatedSection 
              key={plan.name} 
              delay={index * 150} 
              animation="scale"
            >
              <div
                className={`group relative bg-card border rounded-xl p-6 transition-all duration-300 overflow-hidden h-full ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/20 md:scale-105 z-10"
                    : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                }`}
              >
                {/* Gradient overlay for highlighted */}
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                )}
                
                {/* Hover gradient for non-highlighted */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {plan.highlighted && (
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-4 shadow-lg shadow-primary/30">
                      Mais popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-card-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={onOpenChat}
                    className={`w-full transition-all duration-300 ${
                      plan.highlighted 
                        ? "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40" 
                        : "hover:shadow-md"
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Entrar em contato
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
