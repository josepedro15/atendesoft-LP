import { Check, MessageCircle, Star } from "lucide-react";
import { events } from "@/lib/events";
import planosData from "@/content/planos.json";

const Planos = () => {
  const handlePlanClick = (plano: any) => {
    events.pricingClick(plano.id);
    events.ctaWhatsappClick(`plano-${plano.id}`);
    const message = encodeURIComponent(plano.cta_texto);
    window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
  };

  return (
    <section id="planos" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Planos e Investimento
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soluções flexíveis que crescem junto com seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planosData.map((plano, index) => (
            <div 
              key={plano.id}
              className={`glass-card p-8 hover:shadow-lg transition-all duration-300 relative ${
                plano.popular ? 'ring-2 ring-primary/20 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Popular Badge */}
              {plano.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plano.nome}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plano.descricao}</p>
                <div className="text-3xl font-bold text-foreground">{plano.preco}</div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plano.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => handlePlanClick(plano)}
                className={`w-full flex items-center justify-center space-x-2 focus-ring ${
                  plano.popular ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <MessageCircle size={18} />
                <span>Escolher Plano</span>
              </button>
            </div>
          ))}
        </div>

        {/* Custom Solutions CTA */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Precisa de algo sob medida?
            </h3>
            <p className="text-muted-foreground mb-6">
              Criamos soluções 100% personalizadas para necessidades específicas
            </p>
            <button 
              onClick={() => window.open("https://wa.me/5511999999999?text=Preciso%20de%20uma%20solução%20customizada", "_blank")}
              className="btn-primary focus-ring"
            >
              Solicitar Orçamento Personalizado
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Planos;