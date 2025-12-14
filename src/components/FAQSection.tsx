import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    question: "Como funciona o período de teste gratuito?",
    answer: "Oferecemos 14 dias de teste gratuito com acesso completo a todas as funcionalidades do módulo escolhido. Não é necessário cartão de crédito para iniciar o teste."
  },
  {
    question: "O sistema funciona offline?",
    answer: "Sim! Nosso sistema possui modo offline que permite continuar as operações mesmo sem internet. Quando a conexão for restabelecida, os dados são sincronizados automaticamente."
  },
  {
    question: "Como é feita a migração dos meus dados atuais?",
    answer: "Nossa equipe técnica realiza a migração completa dos seus dados do sistema anterior. O processo é acompanhado e validado para garantir que nenhuma informação seja perdida."
  },
  {
    question: "Qual o suporte oferecido?",
    answer: "Oferecemos suporte técnico via chat, telefone e e-mail. No plano Enterprise, você conta com um gerente de conta dedicado e suporte 24/7."
  },
  {
    question: "O sistema emite nota fiscal eletrônica?",
    answer: "Sim, todos os nossos módulos possuem integração completa com a SEFAZ para emissão de NF-e, NFC-e, CT-e e MDF-e, de acordo com o segmento de atuação."
  },
  {
    question: "Posso acessar o sistema de qualquer dispositivo?",
    answer: "Sim! O DeckSoft é 100% web e responsivo, funcionando em computadores, tablets e smartphones. Basta ter um navegador atualizado."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tire suas principais dúvidas sobre o DeckSoft ERP
          </p>
        </AnimatedSection>

        <AnimatedSection className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQSection;
