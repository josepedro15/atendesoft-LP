// Página pública para visualização e assinatura de propostas baseada no slug
import { GetServerSideProps } from 'next';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ProposalVersion, SignatureData } from '@/types/proposals';
import { mockStorage } from '@/lib/mock-storage';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Componentes de UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Ícones
import { 
  Download, 
  CheckCircle, 
  Clock, 
  User, 
  Building,
  DollarSign,
  FileText,
  PenTool,
  Type,
  MousePointer
} from 'lucide-react';

interface PublicProposalPageProps {
  version: ProposalVersion;
  error?: string;
}

export default function PublicProposalPage({ version, error }: PublicProposalPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState<'draw' | 'type' | 'clickwrap'>('draw');
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Tracking de tempo na página
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Tracking de scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollPercentage(Math.round(scrollPercent));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tracking de abertura da página
  useEffect(() => {
    const trackOpen = async () => {
      try {
        await fetch('/api/track/open', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erro ao rastrear abertura:', error);
      }
    };

    trackOpen();
  }, []);

  // Função para rastrear eventos
  const trackEvent = useCallback(async (eventType: string, data?: any) => {
    try {
      await fetch('/api/track/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          proposal_id: version.proposal_id,
          version_id: version.id,
          data: data || {}
        }),
      });
    } catch (error) {
      console.error('Erro ao rastrear evento:', error);
    }
  }, [version]);

  // Função para assinar
  const handleSignature = async () => {
    if (!signatureData) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/proposals/${version.proposal_id}/versions/${version.id}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature_data: signatureData.signature_data,
          signer_name: signatureData.signer_name,
          signer_email: signatureData.signer_email,
          method: signatureData.method
        }),
      });

      if (response.ok) {
        setIsSigned(true);
        setShowSignatureModal(false);
        await trackEvent('signature_complete', { method: signatureData.method });
      } else {
        throw new Error('Erro ao assinar');
      }
    } catch (error) {
      console.error('Erro ao assinar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para desenhar assinatura
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  // Função para obter assinatura do canvas
  const getSignatureFromCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    return canvas.toDataURL('image/png');
  };

  // Função para limpar canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Função para baixar PDF
  const handleDownload = async () => {
    await trackEvent('download');
    // TODO: Implementar download de PDF
    console.log('Download PDF');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!version) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Carregando...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">Carregando proposta...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/LOGO HOME.svg"
                alt="AtendeSoft"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <Badge variant="secondary">Proposta Pública</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Tempo na página: {timeSpent}s</p>
                <p className="text-muted-foreground">Leitura: {scrollPercentage}%</p>
              </div>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Informações da Proposta */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{version.variables?.projeto?.titulo || 'Proposta'}</CardTitle>
                  <CardDescription>
                    Proposta para {version.variables?.cliente?.nome || 'Cliente'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Válida por {version.variables?.projeto?.validade || '7 dias'}
                  </Badge>
                  {isSigned && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Assinada
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Conteúdo da Proposta */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div 
                className="proposal-content"
                dangerouslySetInnerHTML={{ __html: version.snapshot_html }}
              />
            </CardContent>
          </Card>

          {/* Seção de Assinatura */}
          {!isSigned && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="h-5 w-5 mr-2" />
                  Assinatura Digital
                </CardTitle>
                <CardDescription>
                  Assine esta proposta para confirmar sua aceitação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowSignatureModal(true)}
                  className="w-full"
                  size="lg"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Assinar Proposta
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pixel de Tracking */}
          <Image
            src="/api/track/open"
            alt=""
            width={1}
            height={1}
            className="hidden"
          />
        </div>
      </main>

      {/* Modal de Assinatura */}
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assinar Proposta</DialogTitle>
            <DialogDescription>
              Escolha o método de assinatura e preencha os dados necessários
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Seleção do Método */}
            <div className="space-y-3">
              <Label>Método de Assinatura</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={signatureMethod === 'draw' ? 'default' : 'outline'}
                  onClick={() => setSignatureMethod('draw')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <PenTool className="h-6 w-6 mb-2" />
                  <span className="text-sm">Desenhar</span>
                </Button>
                <Button
                  variant={signatureMethod === 'type' ? 'default' : 'outline'}
                  onClick={() => setSignatureMethod('type')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <Type className="h-6 w-6 mb-2" />
                  <span className="text-sm">Digitar</span>
                </Button>
                <Button
                  variant={signatureMethod === 'clickwrap' ? 'default' : 'outline'}
                  onClick={() => setSignatureMethod('clickwrap')}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <MousePointer className="h-6 w-6 mb-2" />
                  <span className="text-sm">Clique</span>
                </Button>
              </div>
            </div>

            {/* Dados do Signatário */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signer-name">Nome Completo</Label>
                <Input
                  id="signer-name"
                  placeholder="Seu nome completo"
                  value={signatureData?.signer_name || ''}
                  onChange={(e) => setSignatureData({
                    signature_data: signatureData?.signature_data || '',
                    signer_name: e.target.value,
                    signer_email: signatureData?.signer_email || '',
                    method: signatureMethod
                  })}
                />
              </div>
              <div>
                <Label htmlFor="signer-email">E-mail</Label>
                <Input
                  id="signer-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={signatureData?.signer_email || ''}
                  onChange={(e) => setSignatureData({
                    signature_data: signatureData?.signature_data || '',
                    signer_name: signatureData?.signer_name || '',
                    signer_email: e.target.value,
                    method: signatureMethod
                  })}
                />
              </div>
            </div>

            {/* Área de Assinatura */}
            {signatureMethod === 'draw' && (
              <div className="space-y-3">
                <Label>Desenhe sua assinatura</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="border rounded cursor-crosshair w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="flex justify-between mt-2">
                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                      Limpar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const signature = getSignatureFromCanvas();
                        setSignatureData({
                          signature_data: signature,
                          signer_name: signatureData?.signer_name || '',
                          signer_email: signatureData?.signer_email || '',
                          method: signatureMethod
                        });
                      }}
                    >
                      Confirmar Assinatura
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {signatureMethod === 'type' && (
              <div className="space-y-3">
                <Label htmlFor="typed-signature">Digite sua assinatura</Label>
                <Input
                  id="typed-signature"
                  placeholder="Digite seu nome como assinatura"
                  onChange={(e) => setSignatureData({
                    signature_data: e.target.value,
                    signer_name: signatureData?.signer_name || '',
                    signer_email: signatureData?.signer_email || '',
                    method: signatureMethod
                  })}
                />
              </div>
            )}

            {signatureMethod === 'clickwrap' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    onChange={(e) => setSignatureData({
                      signature_data: e.target.checked ? 'accepted' : '',
                      signer_name: signatureData?.signer_name || '',
                      signer_email: signatureData?.signer_email || '',
                      method: signatureMethod
                    })}
                  />
                  <Label htmlFor="agree-terms" className="text-sm">
                    Eu aceito os termos desta proposta e confirmo minha assinatura
                  </Label>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowSignatureModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSignature}
                disabled={isLoading || !signatureData?.signature_data || !signatureData?.signer_name}
              >
                {isLoading ? 'Assinando...' : 'Confirmar Assinatura'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  try {
    // Para desenvolvimento, usar mock storage
    // TODO: Implementar com Supabase quando RLS estiver configurado
    console.log('Buscando versão com slug:', slug);
    
    // Buscar versão no mock storage pelo slug
    const version = mockStorage.getVersionBySlug(slug as string);
    console.log('Versão encontrada no mock storage:', version);
    
    if (!version) {
      console.log('Versão não encontrada para slug:', slug);
      console.log('Slugs disponíveis:', mockStorage.getAllSlugs());
      return {
        props: {
          version: null,
          error: 'Proposta não encontrada ou expirada'
        }
      };
    }

    // Buscar a proposta pai
    const proposal = mockStorage.getProposal(version.proposal_id);
    if (!proposal) {
      return {
        props: {
          version: null,
          error: 'Proposta não encontrada'
        }
      };
    }

    // Verificar se a proposta ainda é válida
    if (proposal.valid_until && new Date(proposal.valid_until) < new Date()) {
      return {
        props: {
          version: null,
          error: 'Esta proposta expirou'
        }
      };
    }

    // Adicionar dados da proposta à versão
    const versionWithProposal = {
      ...version,
      proposal: proposal
    };

    console.log('Versão encontrada:', versionWithProposal);

    return {
      props: {
        version: versionWithProposal,
        error: null
      }
    };

  } catch (error) {
    console.error('Erro ao carregar proposta:', error);
    return {
      props: {
        version: null,
        error: 'Erro interno do servidor'
      }
    };
  }
};
