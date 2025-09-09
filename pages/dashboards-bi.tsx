import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BarChart3, Clock, Lightbulb, FileText, TrendingUp, Activity, AlertTriangle, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "motion/react";

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Badge className="mb-3">Dashboards com BI</Badge>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900">
            Transforme dados em decisões com Dashboards Inteligentes
          </h1>
          <p className="mt-4 text-slate-600 text-lg max-w-2xl">
            Análises preditivas e insights em tempo real para impulsionar seu negócio. Tudo em uma única visão clara e acionável.
          </p>
          <div className="mt-6 flex gap-3">
            <Button size="lg" className="rounded-2xl">Quero meu Dashboard</Button>
            <Button size="lg" variant="outline" className="rounded-2xl"><MessageSquare className="mr-2 h-4 w-4"/>Falar no WhatsApp</Button>
          </div>
        </motion.div>
      </section>

      {/* DEMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Visão Geral (Exemplo)</CardTitle>
              <p className="text-sm text-slate-500">KPIs chave, vendas por mês e previsão automática</p>
            </CardHeader>
            <CardContent>
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {kpis.map((k) => (
                  <Card key={k.label} className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">{k.label}</p>
                          <p className="mt-1 text-2xl font-semibold">{k.value}</p>
                          <p className="mt-1 text-xs text-emerald-600">{k.delta}</p>
                        </div>
                        <k.icon className="h-6 w-6 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CHART */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={serieMensal} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="vendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                        <stop offset="80%" stopColor="currentColor" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                    <Area type="monotone" dataKey="vendas" name="Vendas" strokeWidth={2} fill="url(#vendas)" />
                    <Line type="monotone" dataKey="previsto" name="Previsto (IA)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* INSIGHTS */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-xl border-emerald-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5"/>
                      <div>
                        <p className="font-medium">Insight de IA</p>
                        <p className="text-sm text-slate-600">Campanhas do canal <strong>Orgânico</strong> superaram a previsão em 6%. Replique criativos de maior CTR.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5"/>
                      <div>
                        <p className="font-medium">Alerta</p>
                        <p className="text-sm text-slate-600">Queda de conversão na etapa de pagamento (‑12%). Revise taxa e frete para o Sul.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5"/>
                      <div>
                        <p className="font-medium">Próxima melhor ação</p>
                        <p className="text-sm text-slate-600">Agende reposição de estoque do SKU #X12 para 7 dias. Probabilidade de ruptura: 78%.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {beneficios.map((b) => (
            <Card key={b.title} className="rounded-2xl">
              <CardContent className="p-5">
                <b.icon className="h-6 w-6 text-slate-500" />
                <h3 className="mt-3 font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Na prática, como funciona?</h2>
          <p className="text-slate-600">Exemplos de aplicação que ajudam o cliente a se enxergar usando a solução.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {casosUso.map((c) => (
            <Card key={c.titulo} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{c.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-700">
                  {c.pontos.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="lg" className="rounded-2xl">Ver demonstração completa</Button>
          <Button size="lg" variant="outline" className="rounded-2xl">Agendar diagnóstico gratuito</Button>
        </div>
      </section>
    </div>
  );
}
