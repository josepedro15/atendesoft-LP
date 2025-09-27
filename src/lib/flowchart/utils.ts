// Utilitários para o Sistema de Fluxogramas v2.0

import { NodeData, EdgeData, Position, FlowchartState, ExportOptions } from './types'
import { NODE_TYPES } from './constants'

// Geração de IDs únicos
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}${timestamp}${random}`
}

// Geração de posição aleatória no canvas
export const generateRandomPosition = (): Position => {
  return {
    x: Math.random() * 400 + 100,
    y: Math.random() * 300 + 100,
  }
}

// Criação de nó padrão
export const createNode = (
  type: string,
  position?: Position,
  label?: string
): NodeData => {
  const nodeType = NODE_TYPES[type]
  if (!nodeType) {
    throw new Error(`Tipo de nó inválido: ${type}`)
  }

  return {
    id: generateId('node_'),
    type,
    label: label || nodeType.label,
    position: position || generateRandomPosition(),
    data: {
      ...nodeType.defaultSize,
    },
  }
}

// Criação de aresta padrão
export const createEdge = (
  source: string,
  target: string,
  type: string = 'smoothstep'
): EdgeData => {
  return {
    id: generateId('edge_'),
    source,
    target,
    type,
  }
}

// Validação de nó
export const validateNode = (node: NodeData): boolean => {
  return !!(
    node.id &&
    node.type &&
    node.label &&
    node.position &&
    typeof node.position.x === 'number' &&
    typeof node.position.y === 'number'
  )
}

// Validação de aresta
export const validateEdge = (edge: EdgeData): boolean => {
  return !!(
    edge.id &&
    edge.source &&
    edge.target &&
    edge.source !== edge.target
  )
}

// Cálculo de distância entre pontos
export const calculateDistance = (point1: Position, point2: Position): number => {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Encontrar nó mais próximo
export const findNearestNode = (
  position: Position,
  nodes: NodeData[],
  excludeId?: string
): NodeData | null => {
  let nearest: NodeData | null = null
  let minDistance = Infinity

  for (const node of nodes) {
    if (excludeId && node.id === excludeId) continue
    
    const distance = calculateDistance(position, node.position)
    if (distance < minDistance) {
      minDistance = distance
      nearest = node
    }
  }

  return nearest
}

// Verificar se ponto está dentro de um nó
export const isPointInNode = (
  point: Position,
  node: NodeData,
  tolerance: number = 10
): boolean => {
  const { x, y } = point
  const nodeX = node.position.x
  const nodeY = node.position.y
  const width = node.data.width || 150
  const height = node.data.height || 60

  return (
    x >= nodeX - tolerance &&
    x <= nodeX + width + tolerance &&
    y >= nodeY - tolerance &&
    y <= nodeY + height + tolerance
  )
}

// Duplicar nós selecionados
export const duplicateNodes = (
  nodes: NodeData[],
  offset: Position = { x: 20, y: 20 }
): NodeData[] => {
  return nodes.map(node => ({
    ...node,
    id: generateId('node_'),
    position: {
      x: node.position.x + offset.x,
      y: node.position.y + offset.y,
    },
  }))
}

// Duplicar arestas com novos IDs de nós
export const duplicateEdges = (
  edges: EdgeData[],
  nodeMapping: Record<string, string>
): EdgeData[] => {
  return edges
    .filter(edge => nodeMapping[edge.source] && nodeMapping[edge.target])
    .map(edge => ({
      ...edge,
      id: generateId('edge_'),
      source: nodeMapping[edge.source],
      target: nodeMapping[edge.target],
    }))
}

// Centralizar nós no canvas
export const centerNodes = (nodes: NodeData[]): NodeData[] => {
  if (nodes.length === 0) return nodes

  // Calcular centro atual
  const centerX = nodes.reduce((sum, node) => sum + node.position.x, 0) / nodes.length
  const centerY = nodes.reduce((sum, node) => sum + node.position.y, 0) / nodes.length

  // Centro desejado (meio da tela)
  const targetX = 400
  const targetY = 300

  // Calcular offset
  const offsetX = targetX - centerX
  const offsetY = targetY - centerY

  // Aplicar offset
  return nodes.map(node => ({
    ...node,
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY,
    },
  }))
}

// Organizar nós em grid
export const arrangeNodesInGrid = (
  nodes: NodeData[],
  columns: number = 3,
  spacing: Position = { x: 200, y: 150 }
): NodeData[] => {
  return nodes.map((node, index) => {
    const row = Math.floor(index / columns)
    const col = index % columns

    return {
      ...node,
      position: {
        x: col * spacing.x + 100,
        y: row * spacing.y + 100,
      },
    }
  })
}

// Exportar dados para JSON
export const exportToJSON = (state: FlowchartState): string => {
  const exportData = {
    nodes: state.nodes,
    edges: state.edges,
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '2.0',
    },
  }

  return JSON.stringify(exportData, null, 2)
}

// Importar dados de JSON
export const importFromJSON = (jsonString: string): Partial<FlowchartState> => {
  try {
    const data = JSON.parse(jsonString)
    
    if (!data.nodes || !Array.isArray(data.nodes)) {
      throw new Error('Dados inválidos: nodes não encontrados')
    }

    if (!data.edges || !Array.isArray(data.edges)) {
      throw new Error('Dados inválidos: edges não encontrados')
    }

    // Validar e corrigir IDs se necessário
    const nodes = data.nodes.map((node: NodeData) => ({
      ...node,
      id: node.id || generateId('node_'),
    }))

    const edges = data.edges.map((edge: EdgeData) => ({
      ...edge,
      id: edge.id || generateId('edge_'),
    }))

    return { nodes, edges }
  } catch (error) {
    throw new Error(`Erro ao importar JSON: ${error}`)
  }
}

// Limpar dados para exportação
export const cleanDataForExport = (state: FlowchartState) => {
  return {
    nodes: state.nodes.map(node => ({
      ...node,
      // Remover dados temporários se necessário
    })),
    edges: state.edges.map(edge => ({
      ...edge,
      // Remover dados temporários se necessário
    })),
  }
}

// Debounce para auto-save
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

// Throttle para eventos frequentes
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let lastCall = 0
  
  return ((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func(...args)
    }
  }) as T
}

// Formatação de data
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength - 3) + '...'
}

// Verificar se é mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Clamp número entre min e max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}
