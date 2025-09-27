// Validações para o Sistema de Fluxogramas v2.0

import { NodeData, EdgeData, Flowchart, CreateFlowchartRequest, UpdateFlowchartRequest } from './types'
import { NODE_TYPES } from './constants'

// Validação de nó
export const validateNode = (node: NodeData): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Verificar ID
  if (!node.id || typeof node.id !== 'string' || node.id.trim().length === 0) {
    errors.push('ID do nó é obrigatório')
  }

  // Verificar tipo
  if (!node.type || typeof node.type !== 'string') {
    errors.push('Tipo do nó é obrigatório')
  } else if (!NODE_TYPES[node.type]) {
    errors.push(`Tipo de nó inválido: ${node.type}`)
  }

  // Verificar label
  if (!node.label || typeof node.label !== 'string' || node.label.trim().length === 0) {
    errors.push('Label do nó é obrigatório')
  } else if (node.label.length > 100) {
    errors.push('Label do nó deve ter no máximo 100 caracteres')
  }

  // Verificar posição
  if (!node.position) {
    errors.push('Posição do nó é obrigatória')
  } else {
    if (typeof node.position.x !== 'number' || isNaN(node.position.x)) {
      errors.push('Posição X deve ser um número válido')
    }
    if (typeof node.position.y !== 'number' || isNaN(node.position.y)) {
      errors.push('Posição Y deve ser um número válido')
    }
    if (node.position.x < 0 || node.position.y < 0) {
      errors.push('Posição deve ser maior ou igual a zero')
    }
  }

  // Verificar dados
  if (!node.data || typeof node.data !== 'object') {
    errors.push('Dados do nó são obrigatórios')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validação de aresta
export const validateEdge = (edge: EdgeData, nodes: NodeData[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Verificar ID
  if (!edge.id || typeof edge.id !== 'string' || edge.id.trim().length === 0) {
    errors.push('ID da aresta é obrigatório')
  }

  // Verificar source
  if (!edge.source || typeof edge.source !== 'string' || edge.source.trim().length === 0) {
    errors.push('Source da aresta é obrigatório')
  } else {
    const sourceNode = nodes.find(n => n.id === edge.source)
    if (!sourceNode) {
      errors.push(`Nó source não encontrado: ${edge.source}`)
    }
  }

  // Verificar target
  if (!edge.target || typeof edge.target !== 'string' || edge.target.trim().length === 0) {
    errors.push('Target da aresta é obrigatório')
  } else {
    const targetNode = nodes.find(n => n.id === edge.target)
    if (!targetNode) {
      errors.push(`Nó target não encontrado: ${edge.target}`)
    }
  }

  // Verificar se source e target são diferentes
  if (edge.source === edge.target) {
    errors.push('Source e target não podem ser iguais')
  }

  // Verificar se já existe aresta entre os mesmos nós
  // (isso será verificado no contexto do fluxograma completo)

  // Verificar label se fornecido
  if (edge.label !== undefined && edge.label !== null) {
    if (typeof edge.label !== 'string') {
      errors.push('Label da aresta deve ser uma string')
    } else if (edge.label.length > 50) {
      errors.push('Label da aresta deve ter no máximo 50 caracteres')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validação de fluxograma completo
export const validateFlowchart = (flowchart: Flowchart): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Verificar ID
  if (!flowchart.id || typeof flowchart.id !== 'string' || flowchart.id.trim().length === 0) {
    errors.push('ID do fluxograma é obrigatório')
  }

  // Verificar título
  if (!flowchart.title || typeof flowchart.title !== 'string' || flowchart.title.trim().length === 0) {
    errors.push('Título do fluxograma é obrigatório')
  } else if (flowchart.title.length > 200) {
    errors.push('Título do fluxograma deve ter no máximo 200 caracteres')
  }

  // Verificar descrição se fornecida
  if (flowchart.description && flowchart.description.length > 1000) {
    errors.push('Descrição do fluxograma deve ter no máximo 1000 caracteres')
  }

  // Verificar user_id
  if (!flowchart.user_id || typeof flowchart.user_id !== 'string' || flowchart.user_id.trim().length === 0) {
    errors.push('User ID é obrigatório')
  }

  // Verificar dados
  if (!flowchart.data || typeof flowchart.data !== 'object') {
    errors.push('Dados do fluxograma são obrigatórios')
  } else {
    // Verificar nós
    if (!Array.isArray(flowchart.data.nodes)) {
      errors.push('Nodes devem ser um array')
    } else {
      // Validar cada nó
      flowchart.data.nodes.forEach((node, index) => {
        const nodeValidation = validateNode(node)
        if (!nodeValidation.valid) {
          nodeValidation.errors.forEach(error => {
            errors.push(`Nó ${index + 1}: ${error}`)
          })
        }
      })

      // Verificar IDs únicos dos nós
      const nodeIds = flowchart.data.nodes.map(n => n.id)
      const uniqueNodeIds = new Set(nodeIds)
      if (nodeIds.length !== uniqueNodeIds.size) {
        errors.push('IDs dos nós devem ser únicos')
      }
    }

    // Verificar arestas
    if (!Array.isArray(flowchart.data.edges)) {
      errors.push('Edges devem ser um array')
    } else {
      // Validar cada aresta
      flowchart.data.edges.forEach((edge, index) => {
        const edgeValidation = validateEdge(edge, flowchart.data.nodes)
        if (!edgeValidation.valid) {
          edgeValidation.errors.forEach(error => {
            errors.push(`Aresta ${index + 1}: ${error}`)
          })
        }
      })

      // Verificar IDs únicos das arestas
      const edgeIds = flowchart.data.edges.map(e => e.id)
      const uniqueEdgeIds = new Set(edgeIds)
      if (edgeIds.length !== uniqueEdgeIds.size) {
        errors.push('IDs das arestas devem ser únicos')
      }

      // Verificar arestas duplicadas
      const edgePairs = flowchart.data.edges.map(e => `${e.source}-${e.target}`)
      const uniqueEdgePairs = new Set(edgePairs)
      if (edgePairs.length !== uniqueEdgePairs.size) {
        errors.push('Não pode haver arestas duplicadas entre os mesmos nós')
      }
    }

    // Verificar metadata
    if (!flowchart.data.metadata || typeof flowchart.data.metadata !== 'object') {
      errors.push('Metadata do fluxograma é obrigatório')
    } else {
      if (!flowchart.data.metadata.title || flowchart.data.metadata.title !== flowchart.title) {
        errors.push('Metadata title deve corresponder ao título do fluxograma')
      }
      if (!flowchart.data.metadata.version || typeof flowchart.data.metadata.version !== 'string') {
        errors.push('Metadata version é obrigatório')
      }
    }
  }

  // Verificar flags booleanas
  if (typeof flowchart.is_template !== 'boolean') {
    errors.push('is_template deve ser um boolean')
  }
  if (typeof flowchart.is_public !== 'boolean') {
    errors.push('is_public deve ser um boolean')
  }

  // Verificar datas
  if (!flowchart.created_at || isNaN(Date.parse(flowchart.created_at))) {
    errors.push('created_at deve ser uma data válida')
  }
  if (!flowchart.updated_at || isNaN(Date.parse(flowchart.updated_at))) {
    errors.push('updated_at deve ser uma data válida')
  }

  // Verificar versão
  if (typeof flowchart.version !== 'number' || flowchart.version < 1) {
    errors.push('Versão deve ser um número maior que 0')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validação de request de criação
export const validateCreateFlowchartRequest = (request: CreateFlowchartRequest): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Verificar título
  if (!request.title || typeof request.title !== 'string' || request.title.trim().length === 0) {
    errors.push('Título é obrigatório')
  } else if (request.title.length > 200) {
    errors.push('Título deve ter no máximo 200 caracteres')
  }

  // Verificar descrição se fornecida
  if (request.description && request.description.length > 1000) {
    errors.push('Descrição deve ter no máximo 1000 caracteres')
  }

  // Verificar flags booleanas se fornecidas
  if (request.is_template !== undefined && typeof request.is_template !== 'boolean') {
    errors.push('is_template deve ser um boolean')
  }
  if (request.is_public !== undefined && typeof request.is_public !== 'boolean') {
    errors.push('is_public deve ser um boolean')
  }

  // Verificar template_id se fornecido
  if (request.template_id && typeof request.template_id !== 'string') {
    errors.push('template_id deve ser uma string')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validação de request de atualização
export const validateUpdateFlowchartRequest = (request: UpdateFlowchartRequest): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Pelo menos um campo deve ser fornecido
  const hasFields = Object.keys(request).length > 0
  if (!hasFields) {
    errors.push('Pelo menos um campo deve ser fornecido para atualização')
  }

  // Verificar título se fornecido
  if (request.title !== undefined) {
    if (!request.title || typeof request.title !== 'string' || request.title.trim().length === 0) {
      errors.push('Título não pode ser vazio')
    } else if (request.title.length > 200) {
      errors.push('Título deve ter no máximo 200 caracteres')
    }
  }

  // Verificar descrição se fornecida
  if (request.description !== undefined && request.description && request.description.length > 1000) {
    errors.push('Descrição deve ter no máximo 1000 caracteres')
  }

  // Verificar dados se fornecidos
  if (request.data !== undefined) {
    const dataValidation = validateFlowchartData(request.data)
    if (!dataValidation.valid) {
      dataValidation.errors.forEach(error => {
        errors.push(`Dados: ${error}`)
      })
    }
  }

  // Verificar flags booleanas se fornecidas
  if (request.is_template !== undefined && typeof request.is_template !== 'boolean') {
    errors.push('is_template deve ser um boolean')
  }
  if (request.is_public !== undefined && typeof request.is_public !== 'boolean') {
    errors.push('is_public deve ser um boolean')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validação dos dados do fluxograma
export const validateFlowchartData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    errors.push('Dados devem ser um objeto')
    return { valid: false, errors }
  }

  // Verificar nós
  if (!Array.isArray(data.nodes)) {
    errors.push('Nodes devem ser um array')
  } else {
    data.nodes.forEach((node: NodeData, index: number) => {
      const nodeValidation = validateNode(node)
      if (!nodeValidation.valid) {
        nodeValidation.errors.forEach(error => {
          errors.push(`Nó ${index + 1}: ${error}`)
        })
      }
    })
  }

  // Verificar arestas
  if (!Array.isArray(data.edges)) {
    errors.push('Edges devem ser um array')
  } else {
    data.edges.forEach((edge: EdgeData, index: number) => {
      const edgeValidation = validateEdge(edge, data.nodes || [])
      if (!edgeValidation.valid) {
        edgeValidation.errors.forEach(error => {
          errors.push(`Aresta ${index + 1}: ${error}`)
        })
      }
    })
  }

  // Verificar metadata
  if (!data.metadata || typeof data.metadata !== 'object') {
    errors.push('Metadata é obrigatório')
  } else {
    if (!data.metadata.title || typeof data.metadata.title !== 'string') {
      errors.push('Metadata title é obrigatório')
    }
    if (!data.metadata.version || typeof data.metadata.version !== 'string') {
      errors.push('Metadata version é obrigatório')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Sanitização de entrada
export const sanitizeString = (input: string, maxLength?: number): string => {
  let sanitized = input.trim()
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  // Remover caracteres perigosos
  sanitized = sanitized.replace(/[<>]/g, '')
  
  return sanitized
}

// Sanitização de dados do fluxograma
export const sanitizeFlowchartData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const sanitized = { ...data }

  // Sanitizar nós
  if (Array.isArray(sanitized.nodes)) {
    sanitized.nodes = sanitized.nodes.map((node: any) => ({
      ...node,
      label: sanitizeString(node.label || '', 100),
    }))
  }

  // Sanitizar arestas
  if (Array.isArray(sanitized.edges)) {
    sanitized.edges = sanitized.edges.map((edge: any) => ({
      ...edge,
      label: edge.label ? sanitizeString(edge.label, 50) : undefined,
    }))
  }

  // Sanitizar metadata
  if (sanitized.metadata && typeof sanitized.metadata === 'object') {
    sanitized.metadata = {
      ...sanitized.metadata,
      title: sanitizeString(sanitized.metadata.title || '', 200),
      description: sanitized.metadata.description ? sanitizeString(sanitized.metadata.description, 1000) : undefined,
    }
  }

  return sanitized
}
