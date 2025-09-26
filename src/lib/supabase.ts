import { createClient } from '@supabase/supabase-js'
import { config } from './config'

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
)

// Tipos para o banco de dados
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}
