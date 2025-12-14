import { Star, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";

// Import user images
import user1 from "@/assets/testimonials/user-1.jpg";
import user2 from "@/assets/testimonials/user-2.jpg";
import user3 from "@/assets/testimonials/user-3.jpg";
import user4 from "@/assets/testimonials/user-4.jpg";
import user5 from "@/assets/testimonials/user-5.jpg";
import user6 from "@/assets/testimonials/user-6.jpg";
import user7 from "@/assets/testimonials/user-7.jpg";
import user8 from "@/assets/testimonials/user-8.jpg";
import user9 from "@/assets/testimonials/user-9.jpg";
import user10 from "@/assets/testimonials/user-10.jpg";
import user11 from "@/assets/testimonials/user-11.jpg";
import user12 from "@/assets/testimonials/user-12.jpg";
import user13 from "@/assets/testimonials/user-13.jpg";
import user14 from "@/assets/testimonials/user-14.jpg";
import user15 from "@/assets/testimonials/user-15.jpg";
import user16 from "@/assets/testimonials/user-16.jpg";
import user17 from "@/assets/testimonials/user-17.jpg";
import user18 from "@/assets/testimonials/user-18.jpg";
import user19 from "@/assets/testimonials/user-19.jpg";
import user20 from "@/assets/testimonials/user-20.jpg";

// Import system images
import heroBgConstruction from "@/assets/hero-bg-construction.jpg";
import heroBgAgro from "@/assets/hero-bg-agro.jpg";
import heroBgFuel from "@/assets/hero-bg-fuel.jpg";

type SystemType = "construction" | "agro" | "fuel";

const systemImages: Record<SystemType, string> = {
  construction: heroBgConstruction,
  agro: heroBgAgro,
  fuel: heroBgFuel,
};

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  photo: string;
  system: SystemType;
  clientSince: string;
}

const testimonialsRow1: Testimonial[] = [
  {
    name: "Carlos Silva",
    role: "Proprietário",
    company: "Depósito Silva Materiais",
    content: "O DeckSoft transformou a gestão do meu depósito. Antes perdia horas com controle de estoque, hoje tudo é automático!",
    rating: 5,
    photo: user1,
    system: "construction",
    clientSince: "2019",
  },
  {
    name: "Maria Santos",
    role: "Gerente",
    company: "Agro Centro Sul",
    content: "A integração com cooperativas e o controle de safras facilitaram muito nossa operação. Sistema muito intuitivo.",
    rating: 5,
    photo: user2,
    system: "agro",
    clientSince: "2020",
  },
  {
    name: "Roberto Oliveira",
    role: "Diretor",
    company: "Rede Combustível Norte",
    content: "Gerenciamos 12 postos com o DeckSoft. A integração com as bombas nos dá total tranquilidade fiscal.",
    rating: 5,
    photo: user3,
    system: "fuel",
    clientSince: "2018",
  },
  {
    name: "Helena Ferreira",
    role: "Sócia",
    company: "Constrular Materiais",
    content: "O controle de múltiplos depósitos ficou muito mais fácil. Recomendo para qualquer loja de materiais.",
    rating: 5,
    photo: user4,
    system: "construction",
    clientSince: "2021",
  },
  {
    name: "André Martins",
    role: "Gerente Comercial",
    company: "Agropecuária Martins",
    content: "O controle de crédito rural e a rastreabilidade dos produtos são diferenciais incríveis do sistema.",
    rating: 5,
    photo: user5,
    system: "agro",
    clientSince: "2020",
  },
  {
    name: "Juliana Costa",
    role: "Administradora",
    company: "Posto Costa",
    content: "O programa de fidelidade integrado aumentou nossas vendas em 30%. Clientes adoram!",
    rating: 5,
    photo: user6,
    system: "fuel",
    clientSince: "2022",
  },
  {
    name: "José Pereira",
    role: "Fundador",
    company: "Casa do Construtor",
    content: "Após 30 anos no mercado, encontrei no DeckSoft a solução perfeita para modernizar meu negócio.",
    rating: 5,
    photo: user7,
    system: "construction",
    clientSince: "2019",
  },
  {
    name: "Fernanda Lima",
    role: "Diretora Financeira",
    company: "Cooperativa AgroVida",
    content: "A gestão financeira integrada nos ajudou a reduzir inadimplência em 40%. Resultado impressionante!",
    rating: 5,
    photo: user8,
    system: "agro",
    clientSince: "2021",
  },
  {
    name: "Marcos Souza",
    role: "Proprietário",
    company: "Auto Posto Souza",
    content: "O controle de LMC automático me dá segurança total com a fiscalização. Zero preocupações.",
    rating: 5,
    photo: user9,
    system: "fuel",
    clientSince: "2020",
  },
  {
    name: "Patricia Alves",
    role: "Gerente Geral",
    company: "Mega Construções",
    content: "A emissão de notas fiscais ficou muito mais rápida. Nossos clientes agradecem a agilidade!",
    rating: 5,
    photo: user10,
    system: "construction",
    clientSince: "2022",
  },
];

const testimonialsRow2: Testimonial[] = [
  {
    name: "Lucas Mendes",
    role: "CEO",
    company: "Rede AgroBem",
    content: "Integração com sistemas de precisão transformou nossa operação. Dados em tempo real fazem toda diferença.",
    rating: 5,
    photo: user11,
    system: "agro",
    clientSince: "2019",
  },
  {
    name: "Camila Rodrigues",
    role: "Gerente de Operações",
    company: "Posto 24 Horas",
    content: "A gestão de frentistas ficou muito mais organizada. Controle total de abastecimentos e comissões.",
    rating: 5,
    photo: user12,
    system: "fuel",
    clientSince: "2021",
  },
  {
    name: "Ricardo Santos",
    role: "Diretor Executivo",
    company: "Construmat Rede",
    content: "Expandimos de 2 para 8 lojas com o DeckSoft. O sistema acompanhou nosso crescimento perfeitamente.",
    rating: 5,
    photo: user13,
    system: "construction",
    clientSince: "2018",
  },
  {
    name: "Amanda Vieira",
    role: "Coordenadora",
    company: "Agro Sul Insumos",
    content: "O controle de estoque por lote e validade nos ajudou a eliminar perdas. ROI em 6 meses!",
    rating: 5,
    photo: user14,
    system: "agro",
    clientSince: "2022",
  },
  {
    name: "Eduardo Gomes",
    role: "Proprietário",
    company: "Rede Petro Gomes",
    content: "Gestão de convênios com frotas automatizada. Fechamos contratos com grandes empresas da região.",
    rating: 5,
    photo: user15,
    system: "fuel",
    clientSince: "2020",
  },
  {
    name: "Beatriz Nascimento",
    role: "Sócia-Diretora",
    company: "Home Center BN",
    content: "O módulo de orçamentos agilizou muito nossas vendas. Clientes recebem propostas em minutos!",
    rating: 5,
    photo: user16,
    system: "construction",
    clientSince: "2021",
  },
  {
    name: "Thiago Ribeiro",
    role: "Gerente de TI",
    company: "Distribuidora AgroTech",
    content: "Integração fácil com nossos sistemas existentes. Suporte técnico sempre disponível e competente.",
    rating: 5,
    photo: user17,
    system: "agro",
    clientSince: "2020",
  },
  {
    name: "Rosana Campos",
    role: "Diretora Comercial",
    company: "Rede Posto Verde",
    content: "Relatórios gerenciais completos me dão visão total do negócio. Tomada de decisão muito mais assertiva.",
    rating: 5,
    photo: user18,
    system: "fuel",
    clientSince: "2019",
  },
  {
    name: "Paulo Henrique",
    role: "Fundador",
    company: "Depósito Central",
    content: "O sistema de entregas integrado otimizou nossa logística. Clientes mais satisfeitos, custos menores.",
    rating: 5,
    photo: user19,
    system: "construction",
    clientSince: "2022",
  },
  {
    name: "Isabela Cardoso",
    role: "Gerente Administrativa",
    company: "Cooperativa Grãos do Sul",
    content: "A gestão de crédito rural nunca foi tão simples. Documentação organizada e processos ágeis.",
    rating: 5,
    photo: user20,
    system: "agro",
    clientSince: "2021",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 w-[380px] bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 group">
    {/* System Image */}
    <div className="h-24 relative overflow-hidden">
      <img 
        src={systemImages[testimonial.system]} 
        alt={testimonial.system}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
    </div>
    
    <div className="p-5 -mt-8 relative">
      {/* User Photo */}
      <div className="flex items-end gap-4 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-card overflow-hidden shadow-lg">
          <img 
            src={testimonial.photo} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 pb-1">
          <Badge variant="secondary" className="text-xs gap-1 mb-1">
            <BadgeCheck className="w-3 h-3" />
            Cliente verificado
          </Badge>
          <p className="text-xs text-muted-foreground">Cliente desde {testimonial.clientSince}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>

      {/* Content */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">"{testimonial.content}"</p>

      {/* User Info */}
      <div>
        <p className="font-semibold text-card-foreground">{testimonial.name}</p>
        <p className="text-xs text-muted-foreground">{testimonial.role} - {testimonial.company}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-transparent" />
      
      <div className="relative z-10">
        <AnimatedSection className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empresas de todo o Brasil confiam no DeckSoft para gerenciar seus negócios
          </p>
        </AnimatedSection>

        {/* Row 1 - Left to Right */}
        <div className="mb-6 overflow-hidden">
          <div className="flex gap-6 animate-scroll-left">
            {[...testimonialsRow1, ...testimonialsRow1].map((testimonial, index) => (
              <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-scroll-right">
            {[...testimonialsRow2, ...testimonialsRow2].map((testimonial, index) => (
              <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
