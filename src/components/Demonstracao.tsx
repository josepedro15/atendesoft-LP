import { Play, ExternalLink } from "lucide-react";
import { events } from "@/lib/events";

const Demonstracao = () => {
  const handleVideoPlay = () => {
    events.videoPlay("hero-demo");
    // In production, this would trigger video playback
  };

  const handleLiveDemo = () => {
    events.ctaWhatsappClick("live-demo");
    window.open("https://wa.me/5511999999999?text=Quero%20ver%20o%20fluxo%20ao%20vivo", "_blank");
  };

  return (
    <section id="demonstracao" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Veja a IA em Ação
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Demonstração prática de como nossas soluções transformam negócios reais
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Video Container */}
          <div className="relative glass-card p-2 mb-8">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
              {/* Video Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
              
              {/* Play Button */}
              <button 
                onClick={handleVideoPlay}
                className="relative z-10 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 focus-ring"
              >
                <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
              </button>

              {/* Video Overlay */}
              <div className="absolute inset-0 flex items-end justify-end p-6">
                <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
                  2:30 min • Demonstração completa
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Automação Completa de Vendas no WhatsApp
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja como um lead é capturado, qualificado automaticamente pela IA, 
              nutrido com conteúdo personalizado e convertido em cliente, 
              tudo de forma automática 24/7.
            </p>
          </div>

          {/* Demo Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">IA Conversacional</h4>
              <p className="text-sm text-muted-foreground">Respostas naturais e contextualizadas</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Tempo Real</h4>
              <p className="text-sm text-muted-foreground">Respostas instantâneas 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Analytics</h4>
              <p className="text-sm text-muted-foreground">Métricas detalhadas de conversão</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleLiveDemo}
              className="btn-primary flex items-center space-x-2 focus-ring"
            >
              <ExternalLink size={18} />
              <span>Ver Fluxo ao Vivo</span>
            </button>
            <button 
              onClick={() => window.open("https://wa.me/5511999999999?text=Quero%20uma%20demo%20personalizada%20para%20meu%20negócio", "_blank")}
              className="btn-secondary focus-ring"
            >
              Agendar Demo Personalizada
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demonstracao;