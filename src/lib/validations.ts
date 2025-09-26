import { z } from 'zod'

// Schemas de validação para APIs

// Schema para criação de propostas
export const createProposalSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
  client_id: z.string().uuid('ID do cliente inválido').optional(),
  valid_until: z.string().datetime('Data inválida').optional(),
  currency: z.enum(['BRL', 'USD', 'EUR']).default('BRL'),
})

// Schema para atualização de propostas
export const updateProposalSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  client_id: z.string().uuid().optional(),
  valid_until: z.string().datetime().optional(),
  status: z.enum(['draft', 'sent', 'viewed', 'signed', 'rejected']).optional(),
})

// Schema para criação de clientes
export const createClientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  document: z.string().optional(),
})

// Schema para criação de itens do catálogo
export const createCatalogItemSchema = z.object({
  sku: z.string().min(1, 'SKU é obrigatório').max(100),
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  unit_price: z.number().positive('Preço deve ser positivo'),
  currency: z.enum(['BRL', 'USD', 'EUR']).default('BRL'),
  is_active: z.boolean().default(true),
})

// Schema para templates de propostas
export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().optional(),
  content_json: z.record(z.any()), // JSON flexível para conteúdo
  is_active: z.boolean().default(true),
})

// Schema para eventos de analytics
export const analyticsEventSchema = z.object({
  event: z.string().min(1, 'Evento é obrigatório'),
  properties: z.record(z.any()).optional(),
  user_id: z.string().uuid().optional(),
  session_id: z.string().optional(),
})

// Schema para filtros de propostas
export const proposalFiltersSchema = z.object({
  status: z.array(z.enum(['draft', 'sent', 'viewed', 'signed', 'rejected'])).optional(),
  owner_id: z.string().uuid().optional(),
  client_id: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// Schema para filtros de blog
export const blogFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  keyword: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['published', 'draft']).default('published'),
})

// Schema para autenticação
export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  full_name: z.string().min(1, 'Nome é obrigatório').optional(),
})

// Função helper para validar dados
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      throw new Error(`Dados inválidos: ${errorMessage}`)
    }
    throw error
  }
}

// Função helper para validar query parameters
export function validateQuery<T>(schema: z.ZodSchema<T>, query: Record<string, unknown>): T {
  return validateData(schema, query)
}
