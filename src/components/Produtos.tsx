import { MessageCircle, ArrowRight } from "lucide-react";
import { events } from "@/lib/events";
import produtosData from "@/content/produtos.json";
import MagicBento from "./MagicBento";

const Produtos = () => {
  const handleProductCTA = (produto: any) => {
    events.productCtaClick(produto.id);
    events.ctaWhatsappClick(`produto-${produto.id}`);
    const message = encodeURIComponent(produto.cta_texto);
    window.open(`https://wa.me/5531994959512?text=${message}`, "_blank");
  };

  return (
    <section id="produtos" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nossos Produtos
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Soluções de IA sob medida para cada necessidade do seu negócio
          </p>
        </div>

        <div className="space-y-12">
          {produtosData.map((produto, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={produto.id}
                className={`flex flex-col lg:flex-row items-center gap-12 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Product Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {produto.titulo}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {produto.descricao}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    {produto.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleProductCTA(produto)}
                    className="btn-whatsapp flex items-center space-x-2 focus-ring"
                  >
                    <MessageCircle size={18} />
                    <span>Quero saber mais</span>
                  </button>
                </div>

                {/* Product Visual */}
                <div className="flex-1 max-w-lg">
                  <MagicBento className="glass-card p-8 aspect-square flex items-center justify-center" enableStars={true} enableTilt={true} clickEffect={true} enableMagnetism={true} enableBorderGlow={true}>
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto flex items-center justify-center">
                        <MessageCircle className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground">{produto.titulo}</h4>
                      <div className="space-y-2">
                        {produto.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
                            {feature.split(' ').slice(0, 3).join(' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </MagicBento>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Produtos;