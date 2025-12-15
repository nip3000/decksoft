import AnimatedSection from "@/components/AnimatedSection";
// Import partner logos
import logo1 from "@/assets/partners/logo-1.png";
import logo2 from "@/assets/partners/logo-2.png";
import logo3 from "@/assets/partners/logo-3.png";
import logo4 from "@/assets/partners/logo-4.png";
import logo5 from "@/assets/partners/logo-5.png";
import logo6 from "@/assets/partners/logo-6.png";
import logo7 from "@/assets/partners/logo-7.png";
import logo8 from "@/assets/partners/logo-8.png";
import logo9 from "@/assets/partners/logo-9.png";
import logo10 from "@/assets/partners/logo-10.png";
import logo11 from "@/assets/partners/logo-11.png";
import logo12 from "@/assets/partners/logo-12.png";
import logo13 from "@/assets/partners/logo-13.png";
import logo14 from "@/assets/partners/logo-14.png";
import logo15 from "@/assets/partners/logo-15.png";
import logo16 from "@/assets/partners/logo-16.png";
import logo17 from "@/assets/partners/logo-17.png";
import logo18 from "@/assets/partners/logo-18.png";
import logo19 from "@/assets/partners/logo-19.png";
import logo20 from "@/assets/partners/logo-20.png";
import logo21 from "@/assets/partners/logo-21.png";
import logo22 from "@/assets/partners/logo-22.png";
import logo23 from "@/assets/partners/logo-23.png";
import logo24 from "@/assets/partners/logo-24.png";

const partnersRow1 = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11, logo12];
const partnersRow2 = [logo13, logo14, logo15, logo16, logo17, logo18, logo19, logo20, logo21, logo22, logo23, logo24];

const PartnerLogo = ({ logo }: { logo: string }) => (
  <div className="flex-shrink-0 w-[140px] h-[70px] flex items-center justify-center">
    <img 
      src={logo} 
      alt="Partner logo"
      className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
    />
  </div>
);

const PartnersSection = () => {
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
        <div className="mb-4 overflow-hidden">
          <div className="flex gap-4 animate-scroll-left-fast">
            {[...partnersRow1, ...partnersRow1, ...partnersRow1].map((logo, index) => (
              <PartnerLogo key={`row1-${index}`} logo={logo} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll-right-fast">
            {[...partnersRow2, ...partnersRow2, ...partnersRow2].map((logo, index) => (
              <PartnerLogo key={`row2-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
