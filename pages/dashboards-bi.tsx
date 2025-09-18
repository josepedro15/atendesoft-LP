import React from "react";
import { CheckCircle2, BarChart3, Clock, Lightbulb, FileText, TrendingUp, Activity, AlertTriangle, MessageCircle, Play, ArrowRight } from "lucide-react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MagicBento from "@/components/MagicBento";
import { events } from "@/lib/events";

// --------------------
// Mock data (exemplo)
// --------------------
const serieMensal = [
  { mes: "Jan", vendas: 52000, previsto: 54000 },
  { mes: "Fev", vendas: 61000, previsto: 60000 },
  { mes: "Mar", vendas: 59000, previsto: 63000 },
  { mes: "Abr", vendas: 64000, previsto: 65000 },
  { mes: "Mai", vendas: 72000, previsto: 70000 },
  { mes: "Jun", vendas: 68000, previsto: 71000 },
  { mes: "Jul", vendas: 75000, previsto: 76000 },
  { mes: "Ago", vendas: 79000, previsto: 80000 },
  { mes: "Set", vendas: 81000, previsto: 83000 },
  { mes: "Out", vendas: 86000, previsto: 88000 },
  { mes: "Nov", vendas: 93000, previsto: 94000 },
  { mes: "Dez", vendas: 102000, previsto: 98000 },
];

const kpis = [
  { label: "Receita do mês", value: "R$ 102.000", delta: "+9,3%", icon: TrendingUp },
  { label: "Taxa de conversão", value: "3,9%", delta: "+0,4pp", icon: BarChart3 },
  { label: "Ticket médio", value: "R$ 287", delta: "+5,1%", icon: Activity },
  { label: "Churn (30d)", value: "1,2%", delta: "-0,3pp", icon: AlertTriangle },
];

const beneficios = [
  { icon: BarChart3, title: "Análises preditivas automatizadas", desc: "Antecipe tendências e ajuste sua operação antes da concorrência." },
  { icon: Clock, title: "KPIs em tempo real", desc: "Todos os números do seu negócio em uma única tela, 24/7." },
  { icon: Lightbulb, title: "Insights acionáveis por IA", desc: "Recomendações práticas para aumentar vendas e reduzir custos." },
  { icon: FileText, title: "Relatórios personalizados", desc: "Envio automático por e‑mail/WhatsApp do jeito que sua equipe usa." },
];

const casosUso = [
  { titulo: "E‑commerce", pontos: ["Previsão de vendas por produto", "Alertas de ruptura de estoque", "Mix ideal por canal"] },
  { titulo: "Clínicas", pontos: ["Ocupação por especialidade", "No‑show e overbooking", "Previsão de demanda"] },
  { titulo: "Indústria", pontos: ["Lead time e OEE", "Planejamento de demanda", "Custo por lote em tempo real"] },
];

export default function DashboardsBIPage() {
  const handleWhatsAppClick = () => {
    events.ctaWhatsappClick("dashboards-page");
    window.open("https://wa.me/5531994959512?text=Quero%20ver%20uma%20demo%20dos%20dashboards%20com%20IA", "_blank");
  };

  const handleDemoClick = () => {
    events.heroCtaClick("secondary");
    const element = document.getElementById("demo-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          className="container mx-auto px-6 text-center relative z-20"
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboards com BI
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Transforme dados em decisões com{" "}
            <span className="text-primary">Dashboards Inteligentes</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Análises preditivas e insights em tempo real para impulsionar seu negócio. Tudo em uma única visão clara e acionável.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleDemoClick}
              className="btn-primary flex items-center space-x-3 text-lg px-8 py-4"
            >
              <Play size={20} />
              <span>Ver Demonstração</span>
              <ArrowRight size={18} />
            </button>
            
            <button 
              onClick={handleWhatsAppClick}
              className="btn-whatsapp flex items-center space-x-3 text-lg px-8 py-4"
            >
              <MessageCircle size={20} />
              <span>Falar no WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* DEMO */}
      <section id="demo-section" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Veja seus dados tomarem vida
            </h2>
            <p className="text-lg text-primary max-w-3xl mx-auto leading-relaxed">
              KPIs em tempo real, análises preditivas e insights acionáveis em uma única visão
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <MagicBento 
              className="glass-card p-8" 
              enableStars={true} 
              enableTilt={true} 
              clickEffect={true}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Visão Geral (Exemplo)</h3>
                <p className="text-muted-foreground">KPIs chave, vendas por mês e previsão automática</p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {kpis.map((k) => (
                  <div key={k.label} className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{k.label}</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{k.value}</p>
                        <p className="mt-1 text-xs text-success font-semibold">{k.delta}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <k.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHART */}
              <div className="h-80 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={serieMensal} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="vendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(220 60% 65%)" stopOpacity={0.3} />
                        <stop offset="80%" stopColor="hsl(220 60% 65%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                    <XAxis dataKey="mes" stroke="hsl(0 0% 45%)" />
                    <YAxis stroke="hsl(0 0% 45%)" />
                    <Tooltip 
                      formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`}
                      contentStyle={{
                        backgroundColor: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(0 0% 90%)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="vendas" 
                      name="Vendas" 
                      stroke="hsl(220 60% 65%)" 
                      strokeWidth={3}
                      fill="url(#vendas)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previsto" 
                      name="Previsto (IA)" 
                      stroke="hsl(120 45% 65%)" 
                      strokeWidth={3} 
                      dot={false} 
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* INSIGHTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-xl border-l-4 border-success">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-success"/>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Insight de IA</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Campanhas do canal <strong>Orgânico</strong> superaram a previsão em 6%. Replique criativos de maior CTR.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-xl border-l-4 border-destructive">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-destructive"/>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Alerta</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Queda de conversão na etapa de pagamento (‑12%). Revise taxa e frete para o Sul.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-xl border-l-4 border-primary">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-primary"/>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Próxima melhor ação</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Agende reposição de estoque do SKU #X12 para 7 dias. Probabilidade de ruptura: 78%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </MagicBento>
          </motion.div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Por que escolher nossos Dashboards?
            </h2>
            <p className="text-lg text-primary max-w-3xl mx-auto leading-relaxed">
              Tecnologia de ponta para transformar seus dados em vantagem competitiva
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((b, index) => (
              <MagicBento 
                key={b.title}
                className="glass-card p-8 hover:shadow-lg transition-all duration-300 group"
                enableStars={true}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-4">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
              </MagicBento>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Na prática, como funciona?
            </h2>
            <p className="text-lg text-primary max-w-3xl mx-auto leading-relaxed">
              Exemplos de aplicação que ajudam o cliente a se enxergar usando a solução
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {casosUso.map((c) => (
              <MagicBento 
                key={c.titulo}
                className="glass-card p-8 hover:shadow-lg transition-all duration-300 group"
                enableStars={true}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">{c.titulo}</h3>
                </div>
                
                <ul className="space-y-4">
                  {c.pontos.map((p) => (
                    <li key={p} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </MagicBento>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <MagicBento 
              className="glass-card p-8 max-w-2xl mx-auto" 
              enableStars={true} 
              enableTilt={true} 
              clickEffect={true}
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Pronto para transformar seus dados?
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Veja como nossos dashboards podem revolucionar a tomada de decisões no seu negócio
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleWhatsAppClick}
                  className="btn-primary focus-ring"
                >
                  Ver demonstração completa
                </button>
                <button 
                  onClick={handleWhatsAppClick}
                  className="btn-secondary focus-ring"
                >
                  Agendar diagnóstico gratuito
                </button>
              </div>
            </MagicBento>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
