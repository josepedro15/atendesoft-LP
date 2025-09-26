import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, Zap, Search, FileText, Image, Send, Users, MessageCircle, ArrowRight, Star, Clock, TrendingUp, Target, Shield, Globe, Bot, Database, Smartphone, Copy, ExternalLink, Play, BookOpen, Code, Settings } from 'lucide-react';

export default function ObrigadoPage() {
  const [downloadCount, setDownloadCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { trackDownload, trackWhatsAppClick, trackConversion } = useAnalytics();

  useEffect(() => {
    // Simular contador de downloads
    const interval = setInterval(() => {
      setDownloadCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);

    // Track page view as conversion success
    trackConversion('thank_you_page_view', 1);

    return () => clearInterval(interval);
  }, [trackConversion]);

  const handleDownload = () => {
    // Criar link de download para o arquivo
    const link = document.createElement('a');
    link.href = '/fluxo-n8n.zip';
    link.download = 'fluxo-n8n.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download event
    trackDownload('fluxo-n8n.zip', 'zip');
    trackConversion('file_download', 1);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleJoinCommunity = () => {
    trackWhatsAppClick('community_join');
    window.open('https://wa.me/5531994959512?text=Olá! Quero participar do Atendesoft DevHub!', '_blank');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Aqui você pode adicionar um toast de sucesso
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-lg">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🚀 Sistema de Agentes N8N
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <span className="text-green-600 font-semibold">Sucesso!</span> Seus dados foram recebidos. 
              Agora você tem acesso ao sistema completo de automação de blog.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Download Section */}
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mb-6">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Baixe o Workflow Completo
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                    Arquivo ZIP contendo o workflow N8N completo, documentação detalhada e instruções de implementação.
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Download className="w-3 h-3 mr-1" />
                      {downloadCount + 127} downloads hoje
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Star className="w-3 h-3 mr-1" />
                      Versão 2.1
                    </Badge>
                  </div>

                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Fluxo N8N Completo
                  </Button>

                  {showSuccess && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Download iniciado com sucesso!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center">
                  <Play className="w-8 h-8 mr-3 text-primary" />
                  Guia Rápido de Implementação
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
                  Siga estes passos para implementar o sistema em menos de 30 minutos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Instalar N8N</h3>
                        <p className="text-sm text-gray-600">Baixe e instale o N8N no seu servidor</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleCopyCode('npm install n8n -g')}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copiar comando
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Importar Workflow</h3>
                        <p className="text-sm text-gray-600">Importe o arquivo JSON no N8N</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleCopyCode('n8n import:workflow --file=workflow.json')}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copiar comando
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Configurar APIs</h3>
                        <p className="text-sm text-gray-600">Adicione suas chaves de API</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open('#config', '_blank')}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Ver configuração
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Testar Workflow</h3>
                        <p className="text-sm text-gray-600">Execute um teste para verificar funcionamento</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleCopyCode('n8n execute --workflow=blog-automation')}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Executar teste
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Agendar Execução</h3>
                        <p className="text-sm text-gray-600">Configure execução automática diária</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleCopyCode('0 15 * * *')}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Copiar cron
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Monitorar Resultados</h3>
                        <p className="text-sm text-gray-600">Acompanhe métricas e performance</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open('/dashboard', '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ver dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Como Funciona o Sistema */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-gray-900 text-center">
                  Como Funciona o Sistema
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
                  Nosso sistema de agentes N8N é um workflow automatizado que combina pesquisa inteligente, 
                  criação de conteúdo, otimização SEO, publicação automática e notificações em tempo real.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Fluxo de Trabalho */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Pesquisa Inteligente</h3>
                    <p className="text-gray-600">Agentes analisam Google Trends e selecionam tópicos com +30% de crescimento</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Criação de Conteúdo</h3>
                    <p className="text-gray-600">IA gera conteúdo de 1500-2000 palavras com linkagem interna automática</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Otimização SEO</h3>
                    <p className="text-gray-600">Otimização automática de títulos, meta descriptions e estrutura HTML</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Publicação Automática</h3>
                    <p className="text-gray-600">Post publicado automaticamente com notificação via WhatsApp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Especificações Técnicas */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900 text-center">
                  Especificações Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Database className="w-6 h-6 mr-2 text-primary" />
                      Integrações (15+ APIs)
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-600">
                        <Bot className="w-4 h-4 mr-3 text-green-500" />
                        OpenAI GPT-4 (IA principal)
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Search className="w-4 h-4 mr-3 text-blue-500" />
                        Perplexity AI (pesquisa)
                      </li>
                      <li className="flex items-center text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-3 text-purple-500" />
                        Google Trends (tendências)
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Image className="w-4 h-4 mr-3 text-orange-500" />
                        SerpAPI (imagens)
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Database className="w-4 h-4 mr-3 text-indigo-500" />
                        Supabase (banco de dados)
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Smartphone className="w-4 h-4 mr-3 text-green-600" />
                        Evolution API (WhatsApp)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Star className="w-6 h-6 mr-2 text-yellow-500" />
                      Resultados Alcançados
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-3 text-blue-500" />
                        15 páginas no sitemap
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-3 text-green-500" />
                        Post diário às 15:00
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Zap className="w-4 h-4 mr-3 text-yellow-500" />
                        Zero intervenção manual
                      </li>
                      <li className="flex items-center text-gray-600">
                        <MessageCircle className="w-4 h-4 mr-3 text-purple-500" />
                        Notificações automáticas
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Shield className="w-4 h-4 mr-3 text-indigo-500" />
                        Cache inteligente de 1h
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Target className="w-4 h-4 mr-3 text-red-500" />
                        SEO otimizado
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* CTA Principal */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Pronto para Automatizar?</h3>
                  <p className="text-white/90 mb-6 text-sm">
                    Implemente este sistema na sua operação e tenha conteúdo SEO-otimizado todos os dias.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-primary hover:bg-gray-100 font-semibold"
                    onClick={() => {
                      trackWhatsAppClick('expert_consultation');
                      window.open('https://wa.me/5531994959512?text=Olá! Gostaria de implementar o sistema de blog automatizado.', '_blank');
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Falar com Especialista
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Estatísticas do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts Criados</span>
                  <span className="font-semibold text-primary">5+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tempo de Execução</span>
                  <span className="font-semibold text-primary">~5 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Precisão SEO</span>
                  <span className="font-semibold text-primary">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-semibold text-green-600">99.9%</span>
                </div>
              </CardContent>
            </Card>

            {/* Recursos Adicionais */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recursos Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('/blog-template.html', '_blank')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Template de Blog
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('/README-fluxo-n8n.md', '_blank')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documentação Completa
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('/fluxo-n8n-workflow.json', '_blank')}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Workflow JSON
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    trackWhatsAppClick('technical_support');
                    window.open('https://wa.me/5531994959512?text=Preciso de suporte técnico para implementar o workflow N8N', '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Suporte Técnico
                </Button>
              </CardContent>
            </Card>

            {/* Próximos Passos */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Próximos Passos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-gray-700">Baixe o arquivo ZIP</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-gray-700">Siga o guia de implementação</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-gray-700">Configure suas APIs</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span className="text-gray-700">Teste o sistema</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span className="text-gray-700">Automatize seu blog!</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Comunidade N8N */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl border-0 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardContent className="relative p-12 text-center">
                <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-8">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  🚀 Junte-se ao Atendesoft DevHub
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Conecte-se com outros profissionais que estão revolucionando a automação de conteúdo. 
                  Compartilhe experiências, aprenda novas técnicas e acelere seus resultados.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <MessageCircle className="w-8 h-8 text-white mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Suporte Técnico</h3>
                    <p className="text-white/80 text-sm">Ajuda especializada para implementação</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Networking</h3>
                    <p className="text-white/80 text-sm">Conecte-se com outros profissionais</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <Zap className="w-8 h-8 text-white mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Novidades</h3>
                    <p className="text-white/80 text-sm">Primeiro a saber sobre atualizações</p>
                  </div>
                </div>

                <Button
                  onClick={handleJoinCommunity}
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Participar do DevHub
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-white/70 text-sm mt-4">
                  +500 profissionais já fazem parte da nossa comunidade
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}