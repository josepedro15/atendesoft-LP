import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle, RefreshCw } from 'lucide-react'
import Image from 'next/image'

export default function ConfirmarEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleResendConfirmation = async () => {
    if (!email) {
      setMessage('Por favor, digite seu email')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Aqui você pode implementar a lógica para reenviar o email de confirmação
      // Por enquanto, vamos simular
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMessage('✅ Email de confirmação reenviado! Verifique sua caixa de entrada.')
    } catch (error) {
      setMessage('❌ Erro ao reenviar email. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Image 
            src="/LOGO HOME.svg" 
            alt="AtendeSoft" 
            width={200}
            height={60}
            className="mx-auto mb-4"
            priority
          />
        </div>

        {/* Card Principal */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Confirme seu Email</CardTitle>
            <CardDescription>
              Para acessar sua conta, você precisa confirmar seu endereço de email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Enviamos um email de confirmação para sua caixa de entrada. 
                Clique no link para ativar sua conta.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Não recebeu o email?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Verifique sua pasta de spam ou reenvie o email de confirmação:
                </p>
              </div>

              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <Button 
                  onClick={handleResendConfirmation}
                  disabled={loading}
                  size="sm"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    'Reenviar'
                  )}
                </Button>
              </div>

              {message && (
                <Alert variant={message.includes('✅') ? 'default' : 'destructive'}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-900 mb-2">Dicas:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verifique sua pasta de spam/lixo eletrônico</li>
              <li>• O email pode demorar alguns minutos para chegar</li>
              <li>• Certifique-se de que digitou o email correto</li>
              <li>• O link de confirmação expira em 24 horas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
