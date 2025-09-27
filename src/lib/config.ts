/**
 * Configurações centralizadas da aplicação
 * Centraliza o acesso às variáveis de ambiente e configurações
 */

// Validação das variáveis de ambiente obrigatórias com valores padrão
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY',
} as const;

// Verificar se todas as variáveis obrigatórias estão definidas (com fallback)
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.warn(`Variável de ambiente ${key} não encontrada, usando valor padrão`);
  }
}

export const config = {
  // Supabase
  supabase: {
    url: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
