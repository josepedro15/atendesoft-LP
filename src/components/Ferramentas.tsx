import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { events } from "@/lib/events";
import ferramentasData from "@/content/ferramentas.json";
import MagicBento from "./MagicBento";

const Ferramentas = () => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);


  const categorias = [...new Set(ferramentasData.map(f => f.categoria))];

  return (
    <section id="ferramentas" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ferramentas & Integrações
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ecossistema completo de tecnologias para potencializar seus resultados
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categorias.map((categoria) => (
            <span 
              key={categoria}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium"
            >
              {categoria}
            </span>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {ferramentasData.map((ferramenta, index) => (
            <MagicBento 
              key={ferramenta.nome}
              className="glass-card p-6 hover:shadow-lg transition-all duration-300 group relative"
              enableStars={true}
              enableTilt={false}
              clickEffect={false}
              enableMagnetism={false}
            >
              <div
                onMouseEnter={() => setHoveredTool(ferramenta.nome)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                {/* Tool Logo Placeholder */}
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <span className="text-lg font-bold text-muted-foreground group-hover:text-primary">
                    {ferramenta.nome.charAt(0)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-foreground text-sm mb-2">
                  {ferramenta.nome}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{ferramenta.categoria}</span>
                </div>

                {/* Tooltip */}
                {hoveredTool === ferramenta.nome && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-foreground text-background text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                    {ferramenta.descricao}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                  </div>
                )}
              </div>
            </MagicBento>
          ))}
        </div>

        {/* Integration CTA */}
        <div className="text-center mt-16">
          <MagicBento className="glass-card p-8 max-w-3xl mx-auto" enableStars={true} enableTilt={true} clickEffect={true}>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Precisa de uma integração específica?
            </h3>
            <p className="text-muted-foreground mb-6">
              Trabalhamos com APIs customizadas e integrações sob medida para seu negócio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open("https://wa.me/5511999999999?text=Preciso%20de%20uma%20integração%20customizada", "_blank")}
                className="btn-primary focus-ring"
              >
                Solicitar Integração
              </button>
              <button 
                onClick={() => window.open("https://wa.me/5511999999999?text=Quero%20ver%20todas%20as%20integrações%20disponíveis", "_blank")}
                className="btn-secondary focus-ring"
              >
                Ver Todas as Integrações
              </button>
            </div>
          </MagicBento>
        </div>
      </div>
    </section>
  );
};

export default Ferramentas;