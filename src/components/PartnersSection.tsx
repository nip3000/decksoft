import { Building2, Wheat, Fuel } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface Partner {
  name: string;
  segment: "construction" | "agro" | "fuel";
}

const partners: Partner[] = [
  // Materiais de Construção
  { name: "Depósito Silva", segment: "construction" },
  { name: "Constrular", segment: "construction" },
  { name: "Casa do Construtor", segment: "construction" },
  { name: "Mega Construções", segment: "construction" },
  { name: "Home Center BN", segment: "construction" },
  { name: "Depósito Central", segment: "construction" },
  { name: "Construmat Rede", segment: "construction" },
  { name: "Material Express", segment: "construction" },
  // Agronegócios
  { name: "Agro Centro Sul", segment: "agro" },
  { name: "Cooperativa AgroVida", segment: "agro" },
  { name: "Agropecuária Martins", segment: "agro" },
  { name: "Rede AgroBem", segment: "agro" },
  { name: "Agro Sul Insumos", segment: "agro" },
  { name: "Distribuidora AgroTech", segment: "agro" },
  { name: "Grãos do Sul", segment: "agro" },
  { name: "AgroForte", segment: "agro" },
  // Combustíveis
  { name: "Rede Combustível Norte", segment: "fuel" },
  { name: "Posto Costa", segment: "fuel" },
  { name: "Auto Posto Souza", segment: "fuel" },
  { name: "Posto 24 Horas", segment: "fuel" },
  { name: "Rede Petro Gomes", segment: "fuel" },
  { name: "Rede Posto Verde", segment: "fuel" },
  { name: "Petro Center", segment: "fuel" },
  { name: "Combustível Express", segment: "fuel" },
];

const segmentConfig = {
  construction: {
    icon: Building2,
    label: "Materiais de Construção",
    color: "from-orange-500/20 to-orange-500/5",
    iconColor: "text-orange-500",
  },
  agro: {
    icon: Wheat,
    label: "Agronegócios",
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
  },
  fuel: {
    icon: Fuel,
    label: "Combustíveis",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
  },
};

const PartnerCard = ({ partner }: { partner: Partner }) => {
  const config = segmentConfig[partner.segment];
  const Icon = config.icon;

  return (
    <div className="flex-shrink-0 w-[200px] bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
      <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-105`}>
        <Icon className={`w-6 h-6 ${config.iconColor}`} />
      </div>
      <p className="text-sm font-medium text-card-foreground text-center truncate">{partner.name}</p>
      <p className="text-xs text-muted-foreground text-center">{config.label}</p>
    </div>
  );
};

const PartnersSection = () => {
  const row1 = partners.slice(0, 12);
  const row2 = partners.slice(12, 24);

  return (
    <section className="py-16 relative overflow-hidden bg-muted/20">
      <div className="relative z-10">
        <AnimatedSection className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Empresas que confiam no DeckSoft
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mais de 500 empresas em todo o Brasil utilizam nossas soluções para gerenciar seus negócios
          </p>
        </AnimatedSection>

        {/* Row 1 - Left to Right */}
        <div className="mb-6 overflow-hidden">
          <div className="flex gap-4 animate-scroll-left-fast">
            {[...row1, ...row1, ...row1].map((partner, index) => (
              <PartnerCard key={`row1-${index}`} partner={partner} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll-right-fast">
            {[...row2, ...row2, ...row2].map((partner, index) => (
              <PartnerCard key={`row2-${index}`} partner={partner} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <AnimatedSection className="mt-12 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Empresas ativas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">27</p>
              <p className="text-sm text-muted-foreground">Estados atendidos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">Anos no mercado</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Satisfação</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PartnersSection;
