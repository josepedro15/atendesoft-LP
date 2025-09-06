import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { events } from "@/lib/events";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    events.navClick(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleWhatsAppClick = () => {
    events.ctaWhatsappClick("navbar");
    window.open("https://wa.me/5511999999999?text=Quero%20uma%20demo%20com%20IA%20da%20AtendeSoft", "_blank");
  };

  return (
    <nav 
      className={`transition-all duration-300 ${
        isScrolled ? "navbar-glass shadow-lg" : "bg-transparent"
      }`} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        width: '100%', 
        zIndex: 50,
        transform: 'none',
        willChange: 'auto'
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">AtendeSoft</span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("como-funciona")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection("produtos")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              Produtos
            </button>
            <button 
              onClick={() => scrollToSection("ferramentas")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              Ferramentas
            </button>
            <button 
              onClick={() => scrollToSection("demonstracao")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              Demonstração
            </button>
            <button 
              onClick={() => scrollToSection("cases")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              Casos
            </button>
            <button 
              onClick={() => scrollToSection("planos")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              Planos
            </button>
            <button 
              onClick={() => scrollToSection("faq")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              FAQ
            </button>
          </div>

          {/* WhatsApp CTA */}
          <button 
            onClick={handleWhatsAppClick}
            className="btn-whatsapp flex items-center space-x-2 focus-ring"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;