import { useState } from "react";
import { Building2, Wheat, Fuel } from "lucide-react";
import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import FullScreenChat from "@/components/FullScreenChat";

// Configure your n8n webhook URL here
const N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/decksoft-chat";

const modules = [
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Materiais de Construção",
    shortDescription: "Gestão completa para lojas de materiais",
    fullDescription:
      "Sistema completo para gestão de lojas de materiais de construção. Controle de estoque com múltiplos depósitos, gestão de vendas no balcão e por orçamento, emissão de notas fiscais, controle financeiro integrado, gestão de entregas e muito mais. Ideal para depósitos, home centers e lojas especializadas.",
  },
  {
    icon: <Wheat className="w-6 h-6" />,
    title: "Agronegócios",
    shortDescription: "Soluções para o setor agro",
    fullDescription:
      "Solução especializada para o agronegócio. Gestão de vendas de insumos agrícolas, controle de safras, integração com cooperativas, gestão de crédito rural, controle de estoque por lote e validade, rastreabilidade completa e integração com sistemas de precisão. Atende revendas, cooperativas e distribuidoras.",
  },
  {
    icon: <Fuel className="w-6 h-6" />,
    title: "Combustíveis",
    shortDescription: "Controle de postos e distribuidoras",
    fullDescription:
      "Sistema especializado para postos de combustíveis e distribuidoras. Integração com bombas e tanques, controle de LMC, gestão de frentistas, controle de abastecimentos, programa de fidelidade, gestão de convênios com frotas, controle fiscal completo e integração com sistemas de pagamento.",
  },
];

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenChat={openChat} />

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ERP completo para seu negócio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soluções especializadas em gestão empresarial para os segmentos que mais crescem no Brasil
            </p>
          </div>

          {/* Module Cards */}
          <section id="features" className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {modules.map((module) => (
                <ModuleCard key={module.title} {...module} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection onOpenChat={openChat} />

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Converse com nosso assistente virtual e descubra qual solução é ideal para você.
          </p>
          <button
            onClick={openChat}
            className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
          >
            Iniciar conversa agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Full Screen Chat */}
      <FullScreenChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        webhookUrl={N8N_WEBHOOK_URL}
      />
    </div>
  );
};

export default Index;
