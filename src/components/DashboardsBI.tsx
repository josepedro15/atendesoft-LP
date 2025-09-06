import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import dashboardsData from "@/content/dashboards.json";
import MagicBento from "./MagicBento";

const iconMap = {
  "vendas-previsao": TrendingUp,
  "marketing-performance": PieChart,
  "operacional-eficiencia": Activity,
  "financeiro-fluxo": BarChart3
};

const DashboardsBI = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Dashboards Inteligentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Business Intelligence com IA para insights acionáveis e decisões baseadas em dados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {dashboardsData.map((dashboard, index) => {
            const Icon = iconMap[dashboard.id as keyof typeof iconMap] || BarChart3;
            
            return (
              <MagicBento 
                key={dashboard.id}
                className="glass-card p-8 hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${index * 150}ms` }}
                enableStars={true}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{dashboard.titulo}</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {dashboard.descricao}
                </p>

                {/* KPIs List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                    KPIs Inclusos
                  </h4>
                  <div className="space-y-3">
                    {dashboard.kpis.map((kpi, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Indicator */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Atualização</span>
                    <span className="text-success font-semibold">Tempo Real</span>
                  </div>
                </div>
              </MagicBento>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <MagicBento className="glass-card p-8 max-w-2xl mx-auto" enableStars={true} enableTilt={true} clickEffect={true}>
            <h3 className="text-xl font-bold text-foreground mb-4">
              Veja seus dados tomarem vida
            </h3>
            <p className="text-muted-foreground mb-6">
              Transforme planilhas complexas em insights visuais e acionáveis
            </p>
            <button 
              onClick={() => window.open("https://wa.me/5511999999999?text=Quero%20ver%20uma%20demo%20dos%20dashboards%20com%20IA", "_blank")}
              className="btn-primary focus-ring"
            >
              Ver Demo dos Dashboards
            </button>
          </MagicBento>
        </div>
      </div>
    </section>
  );
};

export default DashboardsBI;