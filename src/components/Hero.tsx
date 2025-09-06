import { ArrowRight, MessageCircle, Play } from "lucide-react";
import { events } from "@/lib/events";
import BlurText from "./BlurText";
import ParallaxBackground from "./ParallaxBackground";
import MagicBento from "./MagicBento";
import ShapeBlur from "./ShapeBlur";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    events.heroCtaClick("primary");
    events.ctaWhatsappClick("hero");
    window.open("https://wa.me/5511999999999?text=Quero%20uma%20demo%20com%20IA%20da%20AtendeSoft", "_blank");
  };

  const handleScrollToDemo = () => {
    events.heroCtaClick("secondary");
    const element = document.getElementById("como-funciona");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20" style={{ overflow: 'visible' }}>
      {/* Parallax Background with Circular Text */}
      <ParallaxBackground />
      

      <motion.div 
        className="container mx-auto px-6 text-center relative z-20"
        style={{
          y: scrollY * 0.3,
        }}
      >
                {/* Main Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                  Automação Comercial, Apps e Dashboards com IA
                </h1>

        {/* Subtitle */}
        <BlurText
          text="Fluxos de vendas e atendimento no WhatsApp, aplicativos com LLMs/RAG e BI com IA para decisões em minutos."
          delay={150}
          animateBy="words"
          direction="top"
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
        />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <div className="relative" style={{ overflow: 'visible' }}>
            <ShapeBlur 
              className="absolute inset-0 pointer-events-none"
              variation={0}
              shapeSize={1.2}
              roundness={0.4}
              borderSize={0.05}
              circleSize={0.3}
              circleEdge={0.5}
            />
            <button 
              onClick={handleWhatsAppClick}
              className="btn-whatsapp flex items-center space-x-3 text-lg px-8 py-4 focus-ring relative z-20"
            >
              <MessageCircle size={20} />
              <span>Falar no WhatsApp</span>
            </button>
          </div>
          
          <div className="relative" style={{ overflow: 'visible' }}>
            <ShapeBlur 
              className="absolute inset-0 pointer-events-none"
              variation={0}
              shapeSize={1.2}
              roundness={0.4}
              borderSize={0.05}
              circleSize={0.3}
              circleEdge={0.5}
            />
            <button 
              onClick={handleScrollToDemo}
              className="btn-secondary flex items-center space-x-3 text-lg px-8 py-4 focus-ring relative z-20"
            >
              <Play size={20} />
              <span>Ver como funciona</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default Hero;