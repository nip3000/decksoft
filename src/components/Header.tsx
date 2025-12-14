import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenChat: () => void;
}

const Header = ({ onOpenChat }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">DeckSoft</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={scrollToFeatures}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Funcionalidades
          </button>
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
          <button
            onClick={scrollToFeatures}
            className="text-muted-foreground hover:text-foreground transition-colors text-left"
          >
            Funcionalidades
          </button>
          <Button onClick={() => { onOpenChat(); setMobileMenuOpen(false); }}>
            Converse conosco
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
