import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useMobile } from '@/hooks/use-mobile'
import ParallaxBackground from '@/components/ParallaxBackground'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, MessageCircle } from 'lucide-react'
import Image from 'next/image'

export default function Login() {
  const isMobile = useMobile()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  const { signIn, signUp, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (result.error) {
        if (result.error.message === 'Email not confirmed') {
          setError('Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.')
          // Redirecionar para página de confirmação após 3 segundos
          setTimeout(() => {
            router.push('/confirmar-email')
          }, 3000)
        } else if (result.error.message === 'Invalid login credentials') {
          setError('Email ou senha incorretos. Verifique suas credenciais.')
        } else {
          setError(result.error.message)
        }
      } else if (isSignUp) {
        setError('✅ Conta criada! Verifique seu email para confirmar a conta.')
      } else {
        setError('') // Limpar erros
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppDemo = () => {
    window.open("https://wa.me/5531994959512?text=Quero%20uma%20demo%20com%20IA%20da%20AtendeSoft", "_blank")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {!isMobile && <ParallaxBackground />}
      <div className="w-full max-w-md space-y-6 relative z-10">
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
          <h1 className="text-2xl font-bold text-foreground">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Crie sua conta para acessar o dashboard' 
              : 'Acesse seu dashboard da AtendeSoft'
            }
          </p>
        </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isSignUp ? 'Criar Nova Conta' : 'Fazer Login'}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Preencha os dados abaixo para criar sua conta'
                : 'Digite suas credenciais para acessar'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-muted-foreground">
                    A senha deve ter pelo menos 6 caracteres
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? 'Criando conta...' : 'Entrando...'}
                  </>
                ) : (
                  isSignUp ? 'Criar Conta' : 'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading}
                className="text-sm"
              >
                {isSignUp 
                  ? 'Já tem uma conta? Faça login' 
                  : 'Não tem conta? Criar uma'
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo WhatsApp */}
        <Card className="border-success/20 bg-success/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-success-foreground">
                Quer ver uma demonstração?
              </h3>
              <p className="text-sm text-muted-foreground">
                Fale conosco no WhatsApp para uma demo personalizada
              </p>
              <Button 
                onClick={handleWhatsAppDemo}
                className="btn-whatsapp w-full"
                disabled={loading}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar no WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
