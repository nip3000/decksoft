import { Menu, X, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenChat: () => void;
}

const Header = ({ onOpenChat }: HeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const navLinks = [
    { label: "Depoimentos", id: "testimonials" },
    { label: "Planos", id: "pricing" },
    { label: "FAQ", id: "faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => ({
        id: link.id,
        element: document.getElementById(link.id)
      }));

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            return;
          }
        }
      }
      setActiveSection(null);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={scrollToTop} className="hover:opacity-80 transition-opacity">
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={cn(
                "relative transition-all duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-300 after:ease-out",
                activeSection === link.id
                  ? "text-primary after:scale-x-100 after:opacity-100"
                  : "text-muted-foreground hover:text-foreground after:scale-x-0 after:opacity-0 after:origin-bottom-right hover:after:scale-x-100 hover:after:opacity-100 hover:after:origin-bottom-left"
              )}
            >
              {link.label}
            </button>
          ))}
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Entrar
          </Button>
          <Button onClick={onOpenChat}>Converse conosco</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <Menu 
            size={24} 
            className={cn(
              "absolute transition-all duration-300 ease-in-out",
              mobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
            )}
          />
          <X 
            size={24} 
            className={cn(
              "absolute transition-all duration-300 ease-in-out",
              mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
            )}
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav 
        className={cn(
          "md:hidden bg-background border-b border-border overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}
      >
        <div className={cn(
          "p-4 flex flex-col gap-4 transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "translate-y-0" : "-translate-y-4"
        )}>
          {navLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-all text-left",
                mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
              style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms" }}
            >
              {link.label}
            </button>
          ))}
          <Button 
            variant="outline"
            onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
            className={cn(
              "border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all",
              mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )}
            style={{ transitionDelay: mobileMenuOpen ? `${navLinks.length * 50}ms` : "0ms" }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Entrar
          </Button>
          <Button 
            onClick={() => { onOpenChat(); setMobileMenuOpen(false); }}
            className={cn(
              "transition-all",
              mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )}
            style={{ transitionDelay: mobileMenuOpen ? `${(navLinks.length + 1) * 50}ms` : "0ms" }}
          >
            Converse conosco
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
