// Página pública para visualização e assinatura de propostas
import { GetServerSideProps } from 'next';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ProposalVersion, SignatureData } from '@/types/proposals';
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  // Tracking de eventos
  const trackEvent = useCallback(async (type: string, metadata: any = {}) => {
    try {
      await fetch('/api/track/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: version.proposal_id,
          version_id: version.id,
          type,
          metadata: {
            ...metadata,
            scroll_percentage: scrollPercentage,
            time_spent: timeSpent
          }
        })
      });
    } catch (error) {
      console.error('Erro ao registrar evento:', error);
    }
  }, [version.proposal_id, version.id, scrollPercentage, timeSpent]);

  // Tracking de seções visualizadas
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              trackEvent('section_view', { section_id: sectionId });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [trackEvent]);

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    await trackEvent('download_pdf');
    
    try {
      // Implementar download do PDF
      const response = await fetch(`/api/proposals/${version.proposal_id}/versions/${version.id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proposta-${version.proposal_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptClick = () => {
    trackEvent('accept_click');
    setShowSignatureModal(true);
  };

  const handleSignatureStart = () => {
    trackEvent('signature_start', { method: signatureMethod });
  };

  const handleSignatureComplete = async () => {
    if (!signatureData) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/proposals/${version.proposal_id}/versions/${version.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signatureData)
      });

      if (response.ok) {
        setIsSigned(true);
        setShowSignatureModal(false);
        await trackEvent('signature_complete', { method: signatureMethod });
      } else {
        throw new Error('Erro ao processar assinatura');
      }
    } catch (error) {
      console.error('Erro ao assinar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      await trackEvent('signature_rejected', { error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Canvas para assinatura desenhada
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

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const getSignatureData = () => {
    if (signatureMethod === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        return canvas.toDataURL();
      }
    }
    return '';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
              <Badge variant="outline">Proposta Comercial</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo da Proposta */}
      <main className="container mx-auto px-6 py-8">
        {/* Informações do Cliente */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informações do Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Cliente</Label>
                <p className="text-lg font-semibold">{version.variables.cliente.nome}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Empresa</Label>
                <p className="text-lg font-semibold">{version.variables.cliente.empresa}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-gray-700">{version.variables.cliente.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Telefone</Label>
                <p className="text-gray-700">{version.variables.cliente.telefone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Resumo Financeiro</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(version.total_amount)}
              </div>
              <p className="text-gray-600">Valor total da proposta</p>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Renderizado */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: version.snapshot_html }}
        />

        {/* Seção de Assinatura */}
        {!isSigned ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-center">Aceite e Assinatura</CardTitle>
              <CardDescription className="text-center">
                Ao assinar esta proposta, você concorda com todos os termos e condições apresentados.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                size="lg"
                onClick={handleAcceptClick}
                className="w-full max-w-md"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Aceitar e Assinar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Proposta Assinada!</h3>
              <p className="text-green-700">
                Obrigado por aceitar nossa proposta. Entraremos em contato em breve.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modal de Assinatura */}
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assinatura Digital</DialogTitle>
            <DialogDescription>
              Escolha o método de assinatura e preencha os dados necessários.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Seleção do Método */}
            <div>
              <Label className="text-sm font-medium">Método de Assinatura</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <Button
                  variant={signatureMethod === 'draw' ? 'default' : 'outline'}
                  onClick={() => setSignatureMethod('draw')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <PenTool className="h-5 w-5" />
                  <span className="text-sm">Desenhar</span>
                </Button>
                <Button
                  variant={signatureMethod === 'type' ? 'default' : 'outline'}
                  onClick={() => setSignatureMethod('type')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Type className="h-5 w-5" />
                  <span className="text-sm">Digitar</span>
                </Button>
                <Button
                  variant={signatureMethod === 'clickwrap' ? 'default' : 'outline'}
                  onClick={() => setSignatureMethod('clickwrap')}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <MousePointer className="h-5 w-5" />
                  <span className="text-sm">Clique</span>
                </Button>
              </div>
            </div>

            {/* Dados do Signatário */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signerName">Nome Completo</Label>
                <Input
                  id="signerName"
                  placeholder="Seu nome completo"
                  onChange={(e) => setSignatureData({
                    signer_name: e.target.value,
                    signer_email: signatureData?.signer_email || '',
                    method: signatureMethod,
                    signature_data: signatureData?.signature_data || ''
                  })}
                />
              </div>
              <div>
                <Label htmlFor="signerEmail">Email</Label>
                <Input
                  id="signerEmail"
                  type="email"
                  placeholder="seu@email.com"
                  onChange={(e) => setSignatureData({
                    signer_name: signatureData?.signer_name || '',
                    signer_email: e.target.value,
                    method: signatureMethod,
                    signature_data: signatureData?.signature_data || ''
                  })}
                />
              </div>
            </div>

            {/* Área de Assinatura */}
            <div>
              <Label>Assinatura</Label>
              {signatureMethod === 'draw' && (
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm" onClick={clearSignature}>
                      Limpar
                    </Button>
                  </div>
                </div>
              )}
              
              {signatureMethod === 'type' && (
                <Input
                  placeholder="Digite sua assinatura"
                  className="mt-2"
                  onChange={(e) => setSignatureData({
                    signer_name: signatureData?.signer_name || '',
                    signer_email: signatureData?.signer_email || '',
                    method: signatureData?.method || 'type',
                    signature_data: e.target.value
                  })}
                />
              )}
              
              {signatureMethod === 'clickwrap' && (
                <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Ao clicar em &quot;Confirmar Assinatura&quot;, você concorda com os termos da proposta.
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSignatureModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  const data = getSignatureData();
                  setSignatureData({
                    signer_name: signatureData?.signer_name || '',
                    signer_email: signatureData?.signer_email || '',
                    signature_data: data,
                    method: signatureMethod
                  });
                  handleSignatureStart();
                  handleSignatureComplete();
                }}
                disabled={!signatureData?.signer_name || !signatureData?.signer_email}
              >
                Confirmar Assinatura
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pixel de Tracking */}
      <Image
        src={`/api/track/open?pid=${version.proposal_id}&vid=${version.id}`}
        alt=""
        width={1}
        height={1}
        className="hidden"
        onLoad={() => trackEvent('open')}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.params!;

  try {
    // Buscar versão da proposta pelo token
    const { data: version, error } = await supabase
      .from('proposal_versions')
      .select(`
        *,
        proposal:proposals(*)
      `)
      .eq('public_token', token)
      .single();

    if (error || !version) {
      return {
        props: {
          version: null,
          error: 'Proposta não encontrada ou expirada'
        }
      };
    }

    // Verificar se a proposta ainda é válida
    const proposal = version.proposal;
    if (proposal.valid_until && new Date(proposal.valid_until) < new Date()) {
      return {
        props: {
          version: null,
          error: 'Esta proposta expirou'
        }
      };
    }

    return {
      props: {
        version,
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
