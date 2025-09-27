// Armazenamento temporário compartilhado para fluxogramas
// Este módulo mantém o estado dos fluxogramas em memória

interface Flowchart {
  id: string
  title: string
  description?: string
  data: {
    nodes: any[]
    edges: any[]
  }
  user_id: string
  is_template: boolean
  is_public: boolean
  created_at: string
  updated_at: string
}

// Singleton global para armazenar fluxogramas
// Usar uma variável global para garantir que seja compartilhada entre todas as APIs
declare global {
  var __tempFlowcharts: Flowchart[] | undefined
}

// Inicializar array global se não existir
if (!global.__tempFlowcharts) {
  global.__tempFlowcharts = []
}

const tempFlowcharts = global.__tempFlowcharts

export const tempStorage = {
  // Obter todos os fluxogramas
  getAll: (): Flowchart[] => {
    return tempFlowcharts
  },

  // Obter fluxograma por ID
  getById: (id: string): Flowchart | undefined => {
    return tempFlowcharts.find(f => f.id === id)
  },

  // Criar novo fluxograma
  create: (flowchart: Omit<Flowchart, 'id' | 'created_at' | 'updated_at'>): Flowchart => {
    const newFlowchart: Flowchart = {
      ...flowchart,
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    tempFlowcharts.push(newFlowchart)
    console.log('📝 Fluxograma criado no armazenamento temporário:', newFlowchart.id)
    return newFlowchart
  },

  // Atualizar fluxograma existente
  update: (id: string, updates: Partial<Omit<Flowchart, 'id' | 'created_at'>>): Flowchart | null => {
    const index = tempFlowcharts.findIndex(f => f.id === id)
    if (index === -1) {
      console.log('❌ Fluxograma não encontrado para atualização:', id)
      return null
    }

    tempFlowcharts[index] = {
      ...tempFlowcharts[index],
      ...updates,
      updated_at: new Date().toISOString()
    }

    console.log('📝 Fluxograma atualizado no armazenamento temporário:', id)
    return tempFlowcharts[index]
  },

  // Deletar fluxograma
  delete: (id: string): boolean => {
    const index = tempFlowcharts.findIndex(f => f.id === id)
    if (index === -1) {
      console.log('❌ Fluxograma não encontrado para deleção:', id)
      return false
    }

    tempFlowcharts.splice(index, 1)
    console.log('🗑️ Fluxograma deletado do armazenamento temporário:', id)
    return true
  },

  // Limpar todos os fluxogramas (para testes)
  clear: (): void => {
    tempFlowcharts = []
    console.log('🧹 Armazenamento temporário limpo')
  },

  // Obter estatísticas
  getStats: () => {
    return {
      total: tempFlowcharts.length,
      byUser: tempFlowcharts.reduce((acc, f) => {
        acc[f.user_id] = (acc[f.user_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }
}
