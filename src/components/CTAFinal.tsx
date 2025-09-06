import { MessageCircle, ArrowRight } from "lucide-react";
import { events } from "@/lib/events";
import ShinyText from "./ShinyText";

const CTAFinal = () => {
  const handleWhatsAppClick = () => {
    events.ctaWhatsappClick("final-cta");
    window.open("https://wa.me/5511999999999?text=Estou%20pronto%20para%20vender%20com%20IA!", "_blank");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ShinyText
            text="Pronto para vender com Inteligência Artificial?"
            speed={3}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
          />
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
            Comece sua transformação digital hoje mesmo. 
            Nossa equipe está esperando para criar a solução perfeita para seu negócio.
          </p>

          {/* Main CTA */}
          <div className="mb-12">
            <button 
              onClick={handleWhatsAppClick}
              className="glass-card text-primary hover:bg-white/95 font-bold text-lg md:text-xl px-12 py-6 rounded-2xl flex items-center space-x-4 mx-auto transition-all duration-300 hover:scale-105 focus-ring shadow-2xl"
            >
              <MessageCircle size={24} />
              <span>Começar Agora no WhatsApp</span>
              <ArrowRight size={24} />
            </button>
          </div>

          {/* Benefits List */}
          <div className="grid md:grid-cols-3 gap-6 text-white/80">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">✓</span>
              </div>
              <span>Consultoria gratuita de 30 minutos</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">✓</span>
              </div>
              <span>Análise completa do seu processo</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">✓</span>
              </div>
              <span>Proposta personalizada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-xl"></div>
    </section>
  );
};

export default CTAFinal;