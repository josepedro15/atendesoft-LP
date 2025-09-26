/**
 * Sistema de tratamento de erros padronizado
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} com ID ${id} não encontrado` : `${resource} não encontrado`
    super(404, message, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Não autorizado') {
    super(401, message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Acesso negado') {
    super(403, message, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, details?: any) {
    super(409, message, 'CONFLICT', details)
    this.name = 'ConflictError'
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Erro interno do servidor', details?: any) {
    super(500, message, 'INTERNAL_SERVER_ERROR', details)
    this.name = 'InternalServerError'
  }
}

// Função helper para tratar erros em APIs
export function handleApiError(error: unknown): { status: number; message: string; code?: string } {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return {
      status: error.status,
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR',
    }
  }

  return {
    status: 500,
    message: 'Erro desconhecido',
    code: 'UNKNOWN_ERROR',
  }
}

// Função helper para criar resposta de erro padronizada
export function createErrorResponse(error: unknown) {
  const { status, message, code } = handleApiError(error)
  
  return {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  }
}

// Função helper para criar resposta de sucesso padronizada
export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}
