import { ArrowRight, MessageCircle, Play } from "lucide-react";
import { events } from "@/lib/events";
import BlurText from "./BlurText";

const Hero = () => {
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
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Orange S */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none">
        <div 
          className="text-[40rem] font-bold text-accent leading-none select-none"
          style={{ fontFamily: "Inter, system-ui" }}
        >
          S
        </div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Headline */}
        <BlurText
          text="Automação Comercial, Apps e Dashboards com IA"
          delay={80}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
          onAnimationComplete={() => console.log('Hero animation completed!')}
        />

        {/* Subtitle */}
        <BlurText
          text="Fluxos de vendas e atendimento no WhatsApp, aplicativos com LLMs/RAG e BI com IA para decisões em minutos."
          delay={60}
          animateBy="words"
          direction="top"
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
        />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={handleWhatsAppClick}
            className="btn-whatsapp flex items-center space-x-3 text-lg px-8 py-4 focus-ring"
          >
            <MessageCircle size={20} />
            <span>Falar no WhatsApp</span>
          </button>
          
          <button 
            onClick={handleScrollToDemo}
            className="btn-secondary flex items-center space-x-3 text-lg px-8 py-4 focus-ring"
          >
            <Play size={20} />
            <span>Ver como funciona</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="glass-card p-8 max-w-5xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider">
            Tecnologias que utilizamos
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Trust badge placeholders - in production these would be actual logos */}
            <div className="trust-badge px-4 py-2 bg-muted rounded-lg">
              <span className="font-semibold text-muted-foreground">n8n</span>
            </div>
            <div className="trust-badge px-4 py-2 bg-muted rounded-lg">
              <span className="font-semibold text-muted-foreground">Evolution API</span>
            </div>
            <div className="trust-badge px-4 py-2 bg-muted rounded-lg">
              <span className="font-semibold text-muted-foreground">OpenAI</span>
            </div>
            <div className="trust-badge px-4 py-2 bg-muted rounded-lg">
              <span className="font-semibold text-muted-foreground">Supabase</span>
            </div>
            <div className="trust-badge px-4 py-2 bg-muted rounded-lg">
              <span className="font-semibold text-muted-foreground">RD Station</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;