import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, CheckCircle, Zap, Search, FileText, Image, ImageIcon, Send, Users, MessageCircle, ArrowRight, Star, Clock, TrendingUp, Target, Shield, Globe, Bot, Database, Smartphone, Play, BookOpen, Code, Loader2, User, Phone } from 'lucide-react';

export default function ObrigadoPage() {
  const [downloadCount, setDownloadCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Debug: Log modal state changes
  useEffect(() => {
    console.log('Modal state changed:', modalOpen);
  }, [modalOpen]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalNome, setModalNome] = useState('');
  const [modalTelefone, setModalTelefone] = useState('');
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

  // Máscara de telefone
  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  // Validação de telefone
  const validarTelefone = (telefone: string) => {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
  };

  const handleJoinCommunity = () => {
    console.log('handleJoinCommunity called'); // Debug
    trackWhatsAppClick('community_join');
    setModalOpen(true);
    console.log('modalOpen set to true'); // Debug
  };

  const handleModalSubmit = async () => {
    if (!modalNome.trim() || !modalTelefone.trim()) {
      setModalError('Nome e telefone são obrigatórios');
      return;
    }

    if (!validarTelefone(modalTelefone)) {
      setModalError('Por favor, insira um telefone válido');
      return;
    }

    setModalLoading(true);
    setModalError('');

    try {
      const webhookData = {
        nome: modalNome.trim(),
        telefone: modalTelefone.trim(),
        valor: 'R$ 39,90',
        produto: 'Atendesoft DevHub',
        timestamp: new Date().toISOString(),
        origem: 'captura_obrigado',
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };

      const response = await fetch('/api/webhook/devhub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao enviar dados');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar dados');
      }

      setModalSuccess(true);
      trackConversion('devhub_signup', 39.90);
      
      // Fechar modal após 3 segundos
      setTimeout(() => {
        setModalOpen(false);
        setModalSuccess(false);
        setModalNome('');
        setModalTelefone('');
      }, 3000);

    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      setModalError('Erro ao processar dados. Tente novamente.');
    } finally {
      setModalLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 shadow-lg">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              🚀 Sistema de Agentes N8N
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              <span className="text-green-600 font-semibold">Sucesso!</span> Seus dados foram recebidos. 
              Agora você tem acesso ao sistema completo de automação de blog.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            
            {/* Download Section */}
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <Download className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                    Baixe o Workflow Completo
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
                    Arquivo ZIP contendo o workflow N8N completo, documentação detalhada e instruções de implementação.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                      <Download className="w-3 h-3 mr-1" />
                      {downloadCount + 127} downloads hoje
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm">
                      <Star className="w-3 h-3 mr-1" />
                      Versão 2.1
                    </Badge>
                  </div>

                  <Button
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 text-center flex items-center justify-center">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-primary" />
                  Guia Rápido de Implementação
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-600 text-center max-w-3xl mx-auto px-2">
                  Siga estes passos para implementar o sistema em menos de 30 minutos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Instalar N8N</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Baixe e instale o N8N no seu servidor</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">2</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Importar Workflow</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Importe o arquivo JSON no N8N</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Configurar APIs</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Adicione suas chaves de API</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">4</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Testar Workflow</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Execute um teste para verificar funcionamento</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">5</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Agendar Execução</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Configure execução automática diária</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 sm:p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">6</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Monitorar Resultados</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Acompanhe métricas e performance</p>
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
                        <ImageIcon className="w-4 h-4 mr-3 text-orange-500" />
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
          <div className="space-y-4 sm:space-y-6">
            {/* CTA Principal */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Pronto para Automatizar?</h3>
                  <p className="text-white/90 mb-4 sm:mb-6 text-xs sm:text-sm">
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
                <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
                  Conecte-se com outros profissionais que estão revolucionando a automação de conteúdo. 
                  Compartilhe experiências, aprenda novas técnicas e acelere seus resultados.
                </p>
                
                {/* Pricing Badge */}
                <div className="mb-8">
                  <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-lg font-semibold">
                    <Star className="w-5 h-5 mr-2" />
                    Apenas R$ 39,90/mês
                  </Badge>
                  <p className="text-white/80 text-sm mt-2">
                    Acesso completo à comunidade + recursos exclusivos
                  </p>
                </div>
                
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

                {/* Value Proposition */}
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm mb-8">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">R$ 39,90</div>
                      <div className="text-white/80 text-sm">por mês</div>
                    </div>
                    <div className="text-white/60 text-2xl">vs</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white line-through opacity-60">R$ 200+</div>
                      <div className="text-white/80 text-sm">cursos individuais</div>
                    </div>
                  </div>
                  <p className="text-white/90 text-center mt-4 font-medium">
                    Economia de mais de 80% comparado a cursos individuais
                  </p>
                </div>

                <Button
                  onClick={handleJoinCommunity}
                  className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Participar do DevHub
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
                
                <p className="text-white/70 text-sm mt-4">
                  +500 profissionais já fazem parte da nossa comunidade por apenas R$ 39,90/mês
                </p>
                
                {/* Debug button - remove after testing */}
                <Button
                  onClick={() => {
                    console.log('Debug button clicked');
                    setModalOpen(true);
                  }}
                  className="w-full mt-2 bg-red-500 text-white hover:bg-red-600"
                  size="sm"
                >
                  Debug: Abrir Modal
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmação DevHub */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto z-50 fixed inset-4 sm:inset-auto">
          <DialogHeader className="px-2 sm:px-0">
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-gray-900">
              🚀 Confirmar Participação
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-sm sm:text-base">
              Confirme seus dados para participar do Atendesoft DevHub por R$ 39,90/mês
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {modalSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ✅ Dados Confirmados!
                </h3>
                <p className="text-gray-600">
                  Você será redirecionado para o WhatsApp em instantes...
                </p>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-500">Redirecionando...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="modal-nome" className="text-sm font-medium text-gray-700">
                    Nome Completo *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="modal-nome"
                      type="text"
                      value={modalNome}
                      onChange={(e) => setModalNome(e.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modal-telefone" className="text-sm font-medium text-gray-700">
                    Telefone/WhatsApp *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="modal-telefone"
                      type="tel"
                      value={modalTelefone}
                      onChange={(e) => setModalTelefone(formatarTelefone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {modalError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{modalError}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Atendesoft DevHub</p>
                      <p className="text-sm text-blue-700">R$ 39,90/mês - Acesso completo</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    className="flex-1"
                    disabled={modalLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleModalSubmit}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={modalLoading || !modalNome.trim() || !modalTelefone.trim()}
                  >
                    {modalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      'Confirmar Participação'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}