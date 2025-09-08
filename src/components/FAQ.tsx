import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { events } from "@/lib/events";
import faqData from "@/content/faq.json";
import MagicBento from "./MagicBento";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string, pergunta: string) => {
    events.faqOpen(pergunta);
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossas soluções de automação e IA
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <MagicBento 
                key={item.id}
                className="glass-card overflow-hidden"
                enableStars={true}
                enableTilt={false}
                clickEffect={false}
                enableMagnetism={false}
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-muted/30 transition-colors focus-ring"
                  onClick={() => toggleItem(item.id, item.pergunta)}
                >
                  <span className="font-semibold text-foreground pr-4">
                    {item.pergunta}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                      openItems[item.id] ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openItems[item.id] && (
                  <div className="accordion-content">
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.resposta}
                      </p>
                    </div>
                  </div>
                )}
              </MagicBento>
            ))}
          </div>
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-16">
          <MagicBento className="glass-card p-8 max-w-2xl mx-auto" enableStars={true} enableTilt={true} clickEffect={true}>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para esclarecer qualquer questão
            </p>
            <button 
              onClick={() => window.open("https://wa.me/5531994959512?text=Tenho%20algumas%20dúvidas%20sobre%20as%20soluções", "_blank")}
              className="btn-whatsapp focus-ring"
            >
              Falar com Especialista
            </button>
          </MagicBento>
        </div>
      </div>
    </section>
  );
};

export default FAQ;