import { useState } from "react";
import { Building2, Wheat, Fuel } from "lucide-react";
import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import PartnersSection from "@/components/PartnersSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import FullScreenChat from "@/components/FullScreenChat";
import AnimatedSection from "@/components/AnimatedSection";

// Hero background images
import heroBgDefault from "@/assets/hero-bg-default.jpg";
import heroBgConstruction from "@/assets/hero-bg-construction.jpg";
import heroBgAgro from "@/assets/hero-bg-agro.jpg";
import heroBgFuel from "@/assets/hero-bg-fuel.jpg";
import ctaHandshake from "@/assets/cta-handshake.jpg";

// Configure your n8n webhook URL here
const N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/decksoft-chat";

type ModuleKey = "construction" | "agro" | "fuel" | null;

const heroBackgrounds: Record<ModuleKey | "default", string> = {
  default: heroBgDefault,
  construction: heroBgConstruction,
  agro: heroBgAgro,
  fuel: heroBgFuel,
};

const modules = [
  {
    key: "construction" as ModuleKey,
    icon: <Building2 className="w-6 h-6" />,
    title: "Materiais de Construção",
    shortDescription: "Gestão completa para lojas de materiais",
    fullDescription: "Sistema completo para gestão de lojas de materiais de construção. Controle de estoque com múltiplos depósitos, gestão de vendas no balcão e por orçamento, emissão de notas fiscais, controle financeiro integrado, gestão de entregas e muito mais. Ideal para depósitos, home centers e lojas especializadas."
  },
  {
    key: "agro" as ModuleKey,
    icon: <Wheat className="w-6 h-6" />,
    title: "Agronegócios",
    shortDescription: "Soluções para o setor agro",
    fullDescription: "Solução especializada para o agronegócio. Gestão de vendas de insumos agrícolas, controle de safras, integração com cooperativas, gestão de crédito rural, controle de estoque por lote e validade, rastreabilidade completa e integração com sistemas de precisão. Atende revendas, cooperativas e distribuidoras."
  },
  {
    key: "fuel" as ModuleKey,
    icon: <Fuel className="w-6 h-6" />,
    title: "Combustíveis",
    shortDescription: "Controle de postos e distribuidoras",
    fullDescription: "Sistema especializado para postos de combustíveis e distribuidoras. Integração com bombas e tanques, controle de LMC, gestão de frentistas, controle de abastecimentos, programa de fidelidade, gestão de convênios com frotas, controle fiscal completo e integração com sistemas de pagamento."
  }
];

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>(undefined);
  const [hoveredModule, setHoveredModule] = useState<ModuleKey>(null);

  const openChat = () => {
    setInitialChatMessage(undefined);
    setIsChatOpen(true);
  };

  const openChatWithMessage = (message: string) => {
    setInitialChatMessage(message);
    setIsChatOpen(true);
  };

  const heroTitles: Record<ModuleKey | "default", string> = {
    default: "Hub de Soluções DeckSoft",
    construction: "ERP para Materiais de Construção",
    agro: "ERP para Agronegócios",
    fuel: "ERP para Postos de Combustíveis",
  };

  const heroSubtitles: Record<ModuleKey | "default", string> = {
    default: "Soluções completas de gestão empresarial para diversos segmentos",
    construction: "Gestão completa para depósitos, home centers e lojas especializadas",
    agro: "Soluções para revendas, cooperativas e distribuidoras do agronegócio",
    fuel: "Sistema especializado para postos e distribuidoras de combustíveis",
  };

  const currentTitle = hoveredModule ? heroTitles[hoveredModule] : heroTitles.default;
  const currentBackground = hoveredModule ? heroBackgrounds[hoveredModule] : heroBackgrounds.default;

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenChat={openChat} />

      {/* Hero Section */}
      <main className="pt-24 pb-16 relative overflow-hidden">
        {/* Dynamic Background Images with Crossfade */}
        {Object.entries(heroBackgrounds).map(([key, bgImage]) => (
          <div 
            key={key}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: (hoveredModule === key || (key === 'default' && !hoveredModule)) ? 0.35 : 0,
            }}
          />
        ))}
        
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/80 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-12">
            <div className="relative min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center">
              {Object.entries(heroTitles).map(([key, title]) => (
                <h1 
                  key={key}
                  className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-foreground transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: (hoveredModule === key || (key === 'default' && !hoveredModule)) ? 1 : 0,
                  }}
                >
                  {title}
                </h1>
              ))}
            </div>
            <div className="relative min-h-[1.5rem] md:min-h-[2rem] flex items-center justify-center mt-4">
              {Object.entries(heroSubtitles).map(([key, subtitle]) => (
                <p 
                  key={key}
                  className="absolute inset-0 flex items-center justify-center text-muted-foreground text-lg md:text-xl transition-opacity duration-700 ease-in-out max-w-2xl mx-auto"
                  style={{
                    opacity: (hoveredModule === key || (key === 'default' && !hoveredModule)) ? 1 : 0,
                  }}
                >
                  {subtitle}
                </p>
              ))}
            </div>
          </AnimatedSection>

          {/* Module Cards */}
          <section id="features" className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {modules.map((module, index) => (
                <AnimatedSection key={module.title} delay={index * 150} animation="scale" className="h-full">
                  <ModuleCard 
                    icon={module.icon}
                    title={module.title}
                    shortDescription={module.shortDescription}
                    fullDescription={module.fullDescription}
                    onLearnMore={openChatWithMessage}
                    onHover={(isHovering) => setHoveredModule(isHovering ? module.key : null)}
                  />
                </AnimatedSection>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <AnimatedSection animation="fade-up">
        <TestimonialsSection />
      </AnimatedSection>

      {/* Partners Section */}
      <AnimatedSection animation="fade-up">
        <PartnersSection />
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection animation="fade-up">
        <PricingSection onOpenChat={openChat} />
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${ctaHandshake})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Converse com nosso assistente virtual e descubra qual solução é ideal para você.
            </p>
            <button 
              onClick={openChat} 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              Iniciar conversa agora
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <AnimatedSection animation="fade-up">
        <FAQSection />
      </AnimatedSection>

      {/* Footer */}
      <Footer />

      {/* Full Screen Chat */}
      <FullScreenChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        webhookUrl={N8N_WEBHOOK_URL} 
        initialMessage={initialChatMessage}
      />
    </div>
  );
};

export default Index;
