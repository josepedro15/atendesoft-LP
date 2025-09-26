import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, Zap, Search, FileText, Image, Send } from 'lucide-react';

export default function ObrigadoPage() {
  const handleDownload = () => {
    // Criar link de download para o arquivo
    const link = document.createElement('a');
    link.href = '/fluxo-n8n.zip';
    link.download = 'fluxo-n8n.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Sistema de Agentes N8N
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-2xl mx-auto">
              Obrigado! Seus dados foram recebidos com sucesso. Agora você tem acesso ao sistema completo de automação de blog.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Resumo do Sistema */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Como Funciona o Sistema
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
                Nosso sistema de agentes N8N é um workflow automatizado que combina <strong>pesquisa inteligente</strong>, 
                <strong>criação de conteúdo</strong>, <strong>otimização SEO</strong>, <strong>publicação automática</strong> 
                e <strong>notificações em tempo real</strong>. Tudo isso acontece diariamente às 15:00, sem intervenção manual.
              </p>
            </div>

            {/* Fluxo de Trabalho */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Pesquisa</h4>
                <p className="text-sm text-gray-600">Agentes analisam Google Trends e selecionam tópicos com +30% de crescimento</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Criação</h4>
                <p className="text-sm text-gray-600">IA gera conteúdo de 1500-2000 palavras com linkagem interna automática</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. SEO</h4>
                <p className="text-sm text-gray-600">Otimização automática de títulos, meta descriptions e estrutura HTML</p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">4. Publicação</h4>
                <p className="text-sm text-gray-600">Post publicado automaticamente com notificação via WhatsApp</p>
              </div>
            </div>

            {/* Especificações Técnicas */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Especificações Técnicas
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Integrações (15+ APIs):</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• OpenAI GPT-4 (IA principal)</li>
                    <li>• Perplexity AI (pesquisa)</li>
                    <li>• Google Trends (tendências)</li>
                    <li>• SerpAPI (imagens)</li>
                    <li>• Supabase (banco de dados)</li>
                    <li>• Evolution API (WhatsApp)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resultados:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 15 páginas no sitemap</li>
                    <li>• Post diário às 15:00</li>
                    <li>• Zero intervenção manual</li>
                    <li>• Notificações automáticas</li>
                    <li>• Cache inteligente de 1h</li>
                    <li>• SEO otimizado</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botão de Download */}
            <div className="text-center">
              <Button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar Fluxo N8N Completo
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Arquivo ZIP contendo o workflow completo para implementação
              </p>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Pronto para Automatizar seu Blog?</h3>
              <p className="mb-4 opacity-90">
                Implemente este sistema na sua operação e tenha conteúdo SEO-otimizado todos os dias.
              </p>
              <Button
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => window.open('https://wa.me/5531994959512?text=Olá! Gostaria de implementar o sistema de blog automatizado.', '_blank')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Falar com Especialista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
