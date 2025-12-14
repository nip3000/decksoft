import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface HeaderProps {
  onOpenChat: () => void;
}

const Header = ({ onOpenChat }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Funcionalidades", id: "features" },
    { label: "Depoimentos", id: "testimonials" },
    { label: "Planos", id: "pricing" },
  ];

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
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={onOpenChat}>Converse conosco</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-b border-border p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => { onOpenChat(); setMobileMenuOpen(false); }}>
            Converse conosco
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
