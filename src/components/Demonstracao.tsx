import { Play, ExternalLink } from "lucide-react";
import MagicBento from "./MagicBento";
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
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
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


        </div>
      </div>
    </section>
  );
};

export default Demonstracao;