/**
 * Configurações centralizadas da aplicação
 * Centraliza o acesso às variáveis de ambiente e configurações
 */

// Validação das variáveis de ambiente obrigatórias
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

// Verificar se todas as variáveis obrigatórias estão definidas
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${key}`);
  }
}

export const config = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },

  // API
  api: {
    baseUrl: 'https://api.aiensed.com', // Sempre usar api.aiensed.com
    timeout: 30000, // 30 segundos
  },

  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: 'AtendeSoft',
    description: 'Automação Comercial e IA',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },

  // Desenvolvimento
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Tipos para TypeScript
export type Config = typeof config;
