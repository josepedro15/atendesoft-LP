import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import casesData from "@/content/cases.json";
import MagicBento from "./MagicBento";

const getIcon = (tipo: string) => {
  switch (tipo) {
    case 'percentual':
      return TrendingUp;
    case 'numerico':
      return Users;
    case 'monetario':
      return DollarSign;
    default:
      return Clock;
  }
};

const Cases = () => {
  return (
    <section id="cases" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Casos de Sucesso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resultados reais de clientes que transformaram seus negócios com nossas soluções
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {casesData.map((caso) => {
            const Icon = getIcon(caso.tipo);
            
            return (
              <MagicBento 
                key={caso.id}
                className="glass-card p-6 hover:shadow-lg transition-all duration-300 group"
                enableStars={true}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {caso.setor}
                  </span>
                  <Icon className="w-5 h-5 text-success" />
                </div>

                {/* Problem */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground text-sm mb-2">Desafio</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {caso.problema}
                  </p>
                </div>

                {/* Solution */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground text-sm mb-2">Solução</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {caso.solucao}
                  </p>
                </div>

                {/* Results */}
                <div className="border-t border-border pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">
                      {caso.aumento}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        <span className="line-through opacity-60">{caso.resultado_antes}</span>
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        {caso.resultado_depois}
                      </div>
                    </div>
                  </div>
                </div>
              </MagicBento>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <MagicBento className="glass-card p-8 max-w-3xl mx-auto" enableStars={true} enableTilt={true} clickEffect={true}>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Quer ser o próximo case de sucesso?
            </h3>
            <p className="text-muted-foreground mb-6">
              Conte-nos sobre seu desafio e vamos criar uma solução personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open("https://wa.me/5531994959512?text=Quero%20ser%20um%20case%20de%20sucesso%20da%20AtendeSoft", "_blank")}
                className="btn-primary focus-ring"
              >
                Contar Meu Desafio
              </button>
              <button 
                onClick={() => window.open("https://wa.me/5531994959512?text=Quero%20ver%20mais%20cases%20de%20sucesso", "_blank")}
                className="btn-secondary focus-ring"
              >
                Ver Mais Cases
              </button>
            </div>
          </MagicBento>
        </div>
      </div>
    </section>
  );
};

export default Cases;