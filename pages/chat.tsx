import { useState, useEffect } from 'react';
import { ChatInterface, Message, QuickActions } from '@/components/ChatInterface';
import { Bot, TrendingUp, Clock, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Bot className="h-16 w-16 text-blue-600 mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        Bem-vindo ao Agente Comercial
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Este agente analisa automaticamente relatórios do Google Drive e fornece insights sobre 
        seu atendimento WhatsApp. Faça uma pergunta ou solicite uma análise do dia.
      </p>
      <QuickActions onAction={sendMessage} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          title="Agente Comercial - Análise de Relatórios WhatsApp"
          description="Analise relatórios diários e receba orientações para melhorar atendimento e vendas"
          placeholder="Digite sua mensagem..."
          emptyState={emptyState}
        />
      </div>
    </div>
  );
}
