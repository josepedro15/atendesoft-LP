import { Brain, MessageCircle, BarChart3 } from "lucide-react";
import beneficiosData from "@/content/beneficios.json";

const iconMap = {
  MessageCircle,
  Brain,
  BarChart3
};

const Beneficios = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Transforme seu negócio com{" "}Inteligência Artificial
          </h2>
          <p className="text-lg text-primary max-w-3xl mx-auto leading-relaxed">
            Soluções completas e personalizadas que revolucionam seus processos comerciais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficiosData.map((beneficio) => {
            const Icon = iconMap[beneficio.icone as keyof typeof iconMap];
            
            return (
              <div 
                key={beneficio.id}
                className="glass-card p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{beneficio.titulo}</h3>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {beneficio.descricao}
                </p>
                
                <ul className="space-y-3">
                  {beneficio.beneficios.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Beneficios;