import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planos que cabem no seu negócio
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para sua empresa. Todos incluem suporte e atualizações.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-card border rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                plan.highlighted
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
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
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onOpenChat}
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                Entrar em contato
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
