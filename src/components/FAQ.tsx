import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { events } from "@/lib/events";
import faqData from "@/content/faq.json";

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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossas soluções de automação e IA
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div 
                key={item.id}
                className="glass-card overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
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
                
                <div 
                  className={`accordion-content ${
                    openItems[item.id] ? 'h-auto' : 'h-0'
                  }`}
                  style={{
                    height: openItems[item.id] ? 'auto' : '0',
                  }}
                >
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.resposta}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para esclarecer qualquer questão
            </p>
            <button 
              onClick={() => window.open("https://wa.me/5511999999999?text=Tenho%20algumas%20dúvidas%20sobre%20as%20soluções", "_blank")}
              className="btn-whatsapp focus-ring"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;