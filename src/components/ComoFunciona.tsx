import { Search, Target, Code, TestTube, Rocket } from "lucide-react";
import passosData from "@/content/passos.json";
import MagicBento from "./MagicBento";

const iconMap = {
  Search,
  Target,
  Code,
  TestTube,
  Rocket
};

const ComoFunciona = () => {
  return (
    <section id="como-funciona" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Metodologia comprovada em 5 passos para transformar seu negócio com IA
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-success opacity-30 hidden md:block"></div>
          
          <div className="space-y-8 md:space-y-12">
            {passosData.map((passo, index) => {
              const Icon = iconMap[passo.icone as keyof typeof iconMap];
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={passo.id}
                  className={`flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Timeline Bubble */}
                  <MagicBento className="timeline-bubble flex-1 max-w-md" enableStars={true} enableTilt={true} clickEffect={true}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-primary">Passo {passo.id}</span>
                          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                            {passo.tempo}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{passo.titulo}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{passo.descricao}</p>
                  </MagicBento>

                  {/* Timeline Dot */}
                  <div className="hidden md:flex w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg flex-shrink-0 z-10"></div>
                  
                  {/* Spacer for alternating layout */}
                  <div className={`flex-1 max-w-md ${isEven ? 'md:block' : 'md:block'} hidden`}></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Pronto para começar sua transformação digital?
            </h3>
            <p className="text-muted-foreground mb-6">
              Agende uma conversa gratuita e descubra como a IA pode revolucionar seu negócio
            </p>
            <button 
              onClick={() => window.open("https://wa.me/5511999999999?text=Quero%20conhecer%20o%20processo%20de%20implementação", "_blank")}
              className="btn-primary focus-ring"
            >
              Agendar Consultoria Gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;