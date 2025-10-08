import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import type { ChatKitOptions } from "@openai/chatkit";

// Declare the custom element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openai-chatkit': any;
    }
  }
}

export default function ChatKitPage() {
  const router = useRouter();
  const chatKitRef = useRef<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Wait for the custom element to be defined
    const setupChatKit = () => {
      if (chatKitRef.current && typeof chatKitRef.current.setOptions === 'function') {
        const options: ChatKitOptions = {
          api: {
            url: '/api/chat/agent',
            domainKey: 'atendesoft-commercial-agent'
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
                id: 'analyze_reports',
                label: 'Analisar Relatórios',
                shortLabel: 'Relatórios',
                placeholderOverride: 'Analisar relatórios do WhatsApp',
                icon: 'chart',
                pinned: true
              },
              {
                id: 'metrics',
                label: 'Métricas',
                shortLabel: 'Métricas',
                placeholderOverride: 'Ver métricas de atendimento',
                icon: 'analytics',
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
                icon: 'analytics',
                label: 'Mostre as métricas principais',
                prompt: 'Mostre as métricas principais do atendimento'
              },
              {
                icon: 'user',
                label: 'Quantos leads temos pendentes?',
                prompt: 'Quantos leads temos pendentes para follow-up?'
              },
              {
                icon: 'calendar',
                label: 'Qual o TMR atual?',
                prompt: 'Qual é o tempo médio de resposta atual?'
              },
              {
                icon: 'circle-question',
                label: 'Dicas de melhoria',
                prompt: 'Quais são suas recomendações para melhorar o atendimento?'
              }
            ],
          },
          locale: 'pt-BR'
        };

        chatKitRef.current.setOptions(options);
      } else {
        // Retry after a short delay
        setTimeout(setupChatKit, 100);
      }
    };

    setupChatKit();
  }, []);

  return (
    <div className="min-h-screen">
      <openai-chatkit 
        ref={chatKitRef}
        style={{ 
          width: '100%', 
          height: '100vh',
          display: 'block'
        }}
      />
    </div>
  );
}