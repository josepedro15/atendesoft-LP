import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Phone } from 'lucide-react';

export default function CapturaPage() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
              referrer: document.referrer || 'direct'
            }
          }
        ]);

      if (supabaseError) {
        throw supabaseError;
      }

      // Redirecionar para página de obrigado
      router.push('/captura/obrigado');
    } catch (err) {
      console.error('Erro ao salvar lead:', err);
      setError('Erro ao processar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                    required
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
                disabled={loading}
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
  );
}
