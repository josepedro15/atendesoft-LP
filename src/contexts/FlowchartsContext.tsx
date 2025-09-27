import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

export interface Flowchart {
  id: string
  title: string
  description?: string
  data: {
    nodes: any[]
    edges: any[]
    metadata?: any
  }
  is_template: boolean
  is_public: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateFlowchartData {
  title: string
  description?: string
  data: {
    nodes: any[]
    edges: any[]
    metadata?: any
  }
  is_template?: boolean
  is_public?: boolean
}

export interface UpdateFlowchartData {
  title?: string
  description?: string
  data?: {
    nodes: any[]
    edges: any[]
    metadata?: any
  }
  is_template?: boolean
  is_public?: boolean
}

interface FlowchartsContextType {
  flowcharts: Flowchart[]
  loading: boolean
  error: string | null
  createFlowchart: (data: CreateFlowchartData) => Promise<Flowchart | null>
  updateFlowchart: (id: string, data: UpdateFlowchartData) => Promise<Flowchart | null>
  deleteFlowchart: (id: string) => Promise<boolean>
  loadFlowchart: (id: string) => Promise<Flowchart | null>
  refreshFlowcharts: () => Promise<void>
  clearError: () => void
}

const FlowchartsContext = createContext<FlowchartsContextType | undefined>(undefined)

export function FlowchartsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [flowcharts, setFlowcharts] = useState<Flowchart[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchFlowcharts = useCallback(async () => {
    console.log('🔄 Buscando TODOS os fluxogramas...')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/flowcharts')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar fluxogramas')
      }

      const flowchartsData = result.data || []
      console.log('📋 Fluxogramas carregados (todos):', flowchartsData)
      setFlowcharts(flowchartsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('❌ Erro ao carregar fluxogramas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createFlowchart = useCallback(async (data: CreateFlowchartData): Promise<Flowchart | null> => {
    console.log('➕ Criando fluxograma:', data)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/flowcharts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar fluxograma')
      }

      const newFlowchart = result.data
      console.log('✅ Fluxograma criado:', newFlowchart)
      setFlowcharts(prev => {
        const updated = [newFlowchart, ...prev]
        console.log('📝 Lista atualizada:', updated)
        return updated
      })
      return newFlowchart
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('❌ Erro ao criar fluxograma:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFlowchart = useCallback(async (id: string, data: UpdateFlowchartData): Promise<Flowchart | null> => {
    console.log('✏️ Atualizando fluxograma:', id, data)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/flowcharts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar fluxograma')
      }

      const updatedFlowchart = result.data
      console.log('✅ Fluxograma atualizado:', updatedFlowchart)
      setFlowcharts(prev => 
        prev.map(flowchart => 
          flowchart.id === id ? updatedFlowchart : flowchart
        )
      )
      return updatedFlowchart
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('❌ Erro ao atualizar fluxograma:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteFlowchart = useCallback(async (id: string): Promise<boolean> => {
    console.log('🗑️ Deletando fluxograma:', id)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/flowcharts/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao deletar fluxograma')
      }

      console.log('✅ Fluxograma deletado')
      setFlowcharts(prev => prev.filter(flowchart => flowchart.id !== id))
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('❌ Erro ao deletar fluxograma:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const loadFlowchart = useCallback(async (id: string): Promise<Flowchart | null> => {
    console.log('📖 Carregando fluxograma:', id)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/flowcharts/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar fluxograma')
      }

      console.log('✅ Fluxograma carregado:', result.data)
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('❌ Erro ao carregar fluxograma:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshFlowcharts = useCallback(async () => {
    console.log('🔄 Refreshing fluxogramas...')
    await fetchFlowcharts()
  }, [fetchFlowcharts])

  // Carregar fluxogramas sempre (públicos)
  useEffect(() => {
    console.log('🔄 Carregando fluxogramas públicos...')
    fetchFlowcharts()
  }, [fetchFlowcharts])

  const value = {
    flowcharts,
    loading,
    error,
    createFlowchart,
    updateFlowchart,
    deleteFlowchart,
    loadFlowchart,
    refreshFlowcharts,
    clearError,
  }

  return (
    <FlowchartsContext.Provider value={value}>
      {children}
    </FlowchartsContext.Provider>
  )
}

export function useFlowcharts() {
  const context = useContext(FlowchartsContext)
  if (context === undefined) {
    throw new Error('useFlowcharts must be used within a FlowchartsProvider')
  }
  return context
}
