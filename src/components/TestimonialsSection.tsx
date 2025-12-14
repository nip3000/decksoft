import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Proprietário - Depósito Silva Materiais",
    content:
      "O DeckSoft transformou a gestão do meu depósito. Antes perdia horas com controle de estoque, hoje tudo é automático. Recomendo demais!",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Gerente - Agro Centro Sul",
    content:
      "A integração com cooperativas e o controle de safras facilitaram muito nossa operação. Suporte excelente e sistema muito intuitivo.",
    rating: 5,
  },
  {
    name: "Roberto Oliveira",
    role: "Diretor - Rede Combustível Norte",
    content:
      "Gerenciamos 12 postos com o DeckSoft. A integração com as bombas e o controle de LMC nos dá total tranquilidade fiscal.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empresas de todo o Brasil confiam no DeckSoft para gerenciar seus negócios
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary transition-transform duration-300 group-hover:scale-110"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
