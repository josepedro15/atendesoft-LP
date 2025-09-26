import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/hooks/use-analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Phone, Building, Briefcase, CheckCircle, Star, Zap, Shield, Clock } from 'lucide-react';

export default function CapturaPage() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [telefoneValido, setTelefoneValido] = useState(false);
  const router = useRouter();
  const { trackFormStart, trackFormComplete, trackConversion } = useAnalytics();

  // Track form start when component mounts
  useEffect(() => {
    trackFormStart('captura_lead');
  }, [trackFormStart]);

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

  // Atualizar telefone com máscara
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setTelefone(valorFormatado);
    setTelefoneValido(validarTelefone(valorFormatado));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar campos obrigatórios
      if (!nome.trim() || !telefone.trim()) {
        setError('Nome e telefone são obrigatórios');
        setLoading(false);
        return;
      }

      if (!telefoneValido) {
        setError('Por favor, insira um telefone válido');
        setLoading(false);
        return;
      }

      // Salvar no Supabase
      const { data, error: supabaseError } = await supabase
        .from('captura_leads')
        .insert([
          {
            nome: nome.trim(),
            telefone: telefone.trim(),
            data_captura: new Date().toISOString(),
            origem: 'captura_page',
            metadados: {
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              referrer: document.referrer || 'direct',
              empresa: empresa.trim() || null,
              cargo: cargo.trim() || null,
              telefone_valido: telefoneValido
            }
          }
        ]);

      if (supabaseError) {
        throw supabaseError;
      }

      setSuccess(true);
      
      // Track successful form completion and conversion
      trackFormComplete('captura_lead', { nome, telefone, empresa, cargo });
      trackConversion('lead_capture', 1);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/captura/obrigado');
      }, 2000);

    } catch (err) {
      console.error('Erro ao salvar lead:', err);
      setError('Erro ao processar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Dados Recebidos!
            </h2>
            <p className="text-gray-600 mb-6">
              Seus dados foram processados com sucesso. Você será redirecionado em instantes...
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-gray-500">Redirecionando...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Benefits */}
          <div className="hidden lg:block space-y-6">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-4">
                🚀 Sistema de Agentes N8N
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Acesse o workflow completo que automatiza criação de conteúdo com IA
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Automação completa de blog</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <span>IA + SEO otimizado</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Zero intervenção manual</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Posts diários automáticos</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between text-white/90 text-sm">
                <span>Leads capturados hoje:</span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  47
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Acesso Exclusivo
              </CardTitle>
              <CardDescription className="text-gray-600">
                Preencha seus dados para acessar o sistema completo de agentes N8N
              </CardDescription>
            </CardHeader>
          
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                    Nome Completo *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                    Telefone/WhatsApp *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="telefone"
                      type="tel"
                      value={telefone}
                      onChange={handleTelefoneChange}
                      placeholder="(11) 99999-9999"
                      className={`pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary ${
                        telefone && !telefoneValido ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                      required
                    />
                    {telefone && telefoneValido && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                    )}
                  </div>
                  {telefone && !telefoneValido && (
                    <p className="text-red-500 text-xs">Por favor, insira um telefone válido</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa" className="text-sm font-medium text-gray-700">
                    Empresa <span className="text-gray-400">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="empresa"
                      type="text"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Sua empresa"
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                    Cargo <span className="text-gray-400">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="cargo"
                      type="text"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Seu cargo"
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200"
                  disabled={loading || !telefoneValido}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Acessar Sistema'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Seus dados estão seguros e serão usados apenas para envio do material solicitado.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
