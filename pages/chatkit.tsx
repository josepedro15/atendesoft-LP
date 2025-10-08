import { useEffect, useRef } from 'react';
import type { ChatKitOptions } from '@openai/chatkit';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openai-chatkit': any;
    }
  }
}

const options: ChatKitOptions = {
  api: {
    // Configure your ChatKit API integration
    url: '/api/chat/agent',
    domainKey: 'your-domain-key', // You'll need to replace this
  },
  theme: {
    colorScheme: 'light',
    radius: 'pill',
    density: 'spacious',
    typography: {
      baseSize: 16,
      fontFamily: '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
      fontSources: [
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
          weight: 400,
          style: 'normal',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Medium.woff2',
          weight: 500,
          style: 'normal',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Semibold.woff2',
          weight: 600,
          style: 'normal',
          display: 'swap'
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Bold.woff2',
          weight: 700,
          style: 'normal',
          display: 'swap'
        }
      ]
    }
  },
  composer: {
    attachments: {
      enabled: true,
      maxCount: 5,
      maxSize: 10485760
    },
    tools: [
      {
        id: 'search_docs',
        label: 'Buscar relatórios',
        shortLabel: 'Relatórios',
        placeholderOverride: 'Buscar nos relatórios do WhatsApp',
        icon: 'book-open',
        pinned: false
      },
      {
        id: 'analyze_metrics',
        label: 'Analisar métricas',
        shortLabel: 'Métricas',
        placeholderOverride: 'Analisar métricas de atendimento',
        icon: 'chart',
        pinned: false
      }
    ],
  },
  startScreen: {
    greeting: 'Olá! Sou seu Agente Comercial especializado em análise de relatórios WhatsApp. Como posso ajudar você hoje?',
    prompts: [
      {
        icon: 'chart',
        label: 'Como está o atendimento hoje?',
        prompt: 'Como está o atendimento hoje?'
      },
      {
        icon: 'user',
        label: 'Quantos leads foram atendidos?',
        prompt: 'Quantos leads foram atendidos?'
      },
      {
        icon: 'calendar',
        label: 'Há follow-ups pendentes?',
        prompt: 'Há follow-ups pendentes?'
      },
      {
        icon: 'analytics',
        label: 'Qual o tempo médio de resposta?',
        prompt: 'Qual o tempo médio de resposta?'
      },
      {
        icon: 'analytics',
        label: 'Análise completa do dia',
        prompt: 'Faça uma análise completa do atendimento de hoje'
      }
    ],
  },
  locale: 'pt-BR',
};

export default function ChatKitPage() {
  const chatKitRef = useRef<any>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && chatKitRef.current) {
      // Set options for the ChatKit web component
      chatKitRef.current.setOptions(options);
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Agente Comercial
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Análise inteligente de relatórios WhatsApp com insights acionáveis
          </p>
        </div>
        
        <openai-chatkit 
          ref={chatKitRef}
          className="h-[calc(100vh-12rem)] rounded-lg shadow-lg overflow-hidden"
        />
      </div>
    </div>
  );
}
