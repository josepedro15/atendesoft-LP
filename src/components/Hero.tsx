import { ArrowRight, MessageCircle, Play } from "lucide-react";
import { events } from "@/lib/events";
import BlurText from "./BlurText";
import ParallaxBackground from "./ParallaxBackground";
import MagicBento from "./MagicBento";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar se é mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Otimização para mobile - reduzir scroll listener
    if (!isMobile) {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkMobile);
      };
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  const handleWhatsAppClick = () => {
    events.heroCtaClick("primary");
    events.ctaWhatsappClick("hero");
    window.open("https://wa.me/5531994959512?text=Quero%20uma%20demo%20com%20IA%20da%20AtendeSoft", "_blank");
  };

  const handleScrollToDemo = () => {
    events.heroCtaClick("secondary");
    const element = document.getElementById("como-funciona");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20" style={{ overflow: 'visible' }}>
      {/* Parallax Background with Circular Text - desabilitado no mobile */}
      {!isMobile && <ParallaxBackground />}
      

      <motion.div 
        className="container mx-auto px-6 text-center relative z-20"
        style={{
          y: isMobile ? 0 : scrollY * 0.3, // Sem parallax no mobile
        }}
      >
                {/* Main Headline */}
                <BlurText
                  text="Automação Comercial, Apps e Dashboards com IA"
                  delay={isMobile ? 50 : 100} // Delay menor no mobile
                  animateBy="words"
                  direction="top"
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
                  stepDuration={isMobile ? 0.2 : 0.3} // Animação mais rápida no mobile
                />

        {/* Subtitle */}
        <BlurText
          text="Fluxos de vendas e atendimento no WhatsApp, aplicativos com LLMs/RAG e BI com IA para decisões em minutos."
          delay={isMobile ? 75 : 150} // Delay menor no mobile
          animateBy="words"
          direction="top"
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
          stepDuration={isMobile ? 0.2 : 0.3} // Animação mais rápida no mobile
        />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={handleWhatsAppClick}
            className={`btn-whatsapp flex items-center space-x-3 focus-ring ${
              isMobile ? 'text-base px-6 py-3' : 'text-lg px-8 py-4'
            }`}
          >
            <MessageCircle size={isMobile ? 18 : 20} />
            <span>Falar no WhatsApp</span>
          </button>
          
          <button 
            onClick={handleScrollToDemo}
            className={`btn-secondary flex items-center space-x-3 focus-ring ${
              isMobile ? 'text-base px-6 py-3' : 'text-lg px-8 py-4'
            }`}
          >
            <Play size={isMobile ? 18 : 20} />
            <span>Ver como funciona</span>
            <ArrowRight size={isMobile ? 16 : 18} />
          </button>
        </div>

      </motion.div>
    </section>
  );
};

export default Hero;