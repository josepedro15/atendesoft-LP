import { useState, useEffect } from "react";
import { MessageCircle, LogIn } from "lucide-react";
import { events } from "@/lib/events";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

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

  const handleLogoClick = () => {
    events.navClick("home");
    if (router.pathname === "/") {
      // Se já estiver na home, scroll para o topo
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Se estiver em outra página, navegar para home
      router.push("/");
    }
  };

  const handleWhatsAppClick = () => {
    events.ctaWhatsappClick("navbar");
    window.open("https://wa.me/5531994959512?text=Quero%20uma%20demo%20com%20IA%20da%20AtendeSoft", "_blank");
  };

  const handleLoginClick = () => {
    events.navClick("login");
    router.push("/login");
  };


  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "navbar-glass shadow-lg" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center focus-ring hover:opacity-80 transition-opacity"
            aria-label="Ir para página inicial"
          >
            <Image 
              src="/LOGO HOME.svg" 
              alt="AtendeSoft" 
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </button>

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
              onClick={() => scrollToSection("faq")}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              FAQ
            </button>
            {user && (
              <button 
                onClick={() => router.push("/fluxogramas")}
                className="text-muted-foreground hover:text-foreground transition-colors focus-ring"
              >
                Fluxogramas
              </button>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-3">
            {!user && (
              <button 
                onClick={handleLoginClick}
                className="btn-secondary flex items-center space-x-2 focus-ring"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}
            
            <button 
              onClick={handleWhatsAppClick}
              className="btn-whatsapp flex items-center space-x-2 focus-ring"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;