import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";

interface PricingSectionProps {
  onOpenChat: () => void;
}

const plans = [
  {
    name: "Essencial",
    description: "Ideal para pequenas empresas",
    priceMonthly: 297,
    priceAnnual: 249,
    features: [
      "1 módulo à escolha",
      "Até 2 usuários simultâneos",
      "Suporte por e-mail",
      "Atualizações inclusas",
      "Backup diário automático",
      "Acesso web e mobile",
    ],
    highlighted: false,
  },
  {
    name: "Profissional",
    description: "Para empresas em crescimento",
    priceMonthly: 597,
    priceAnnual: 497,
    features: [
      "2 módulos à escolha",
      "Até 10 usuários simultâneos",
      "Suporte prioritário",
      "Atualizações inclusas",
      "Backup em tempo real",
      "Integrações avançadas",
      "Relatórios personalizados",
      "Treinamento online incluso",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Soluções sob medida",
    priceMonthly: null,
    priceAnnual: null,
    features: [
      "Todos os módulos inclusos",
      "Usuários ilimitados",
      "Suporte 24/7 dedicado",
      "Gerente de conta exclusivo",
      "Personalização completa",
      "API exclusiva",
      "Treinamento presencial",
      "SLA garantido",
    ],
    highlighted: false,
  },
];

const PricingSection = ({ onOpenChat }: PricingSectionProps) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-transparent to-muted/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planos que cabem no seu negócio
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Escolha o plano ideal para sua empresa. Todos incluem suporte e atualizações.
          </p>

          {/* Toggle Mensal/Anual */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mensal
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                Economize até 20%
              </Badge>
            )}
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <AnimatedSection 
              key={plan.name} 
              delay={index * 150} 
              animation="scale"
              className="h-full"
            >
              <div
                className={`group relative bg-card border rounded-xl p-6 transition-all duration-300 overflow-hidden h-full flex flex-col ${
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

                <div className="relative z-10 flex flex-col h-full">
                  {plan.highlighted && (
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-4 shadow-lg shadow-primary/30">
                      Mais popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-card-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    {plan.priceMonthly !== null ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-foreground">
                            R$ {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                          </span>
                          <span className="text-muted-foreground text-sm">/mês</span>
                        </div>
                        {isAnnual && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Cobrado anualmente (R$ {(plan.priceAnnual! * 12).toLocaleString('pt-BR')}/ano)
                          </p>
                        )}
                        {!isAnnual && plan.priceAnnual && (
                          <p className="text-xs text-primary mt-1">
                            Economize R$ {(plan.priceMonthly - plan.priceAnnual) * 12}/ano no plano anual
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">Sob consulta</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
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
                    className={`w-full transition-all duration-300 mt-auto ${
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

        {/* Additional info */}
        <AnimatedSection className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            Todos os planos incluem 14 dias de teste grátis. Sem necessidade de cartão de crédito.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PricingSection;
