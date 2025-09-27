// Contexto principal do Sistema de Fluxogramas v2.0

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { FlowchartState, FlowchartActions, NodeData, EdgeData, ExportOptions } from '@/lib/flowchart/types'
import { generateId, createNode, createEdge, centerNodes } from '@/lib/flowchart/utils'
import { validateNode, validateEdge } from '@/lib/flowchart/validation'

type FlowchartAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_FLOWCHART'; payload: { nodes: NodeData[]; edges: EdgeData[] } }
  | { type: 'ADD_NODE'; payload: NodeData }
  | { type: 'UPDATE_NODE'; payload: { id: string; updates: Partial<NodeData> } }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'ADD_EDGE'; payload: EdgeData }
  | { type: 'UPDATE_EDGE'; payload: { id: string; updates: Partial<EdgeData> } }
  | { type: 'DELETE_EDGE'; payload: string }
  | { type: 'SELECT_NODE'; payload: { id: string; multi: boolean } }
  | { type: 'SELECT_EDGE'; payload: { id: string; multi: boolean } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SELECT_ALL' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_HAS_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'SET_CLIPBOARD'; payload: { nodes: NodeData[]; edges: EdgeData[] } }

const initialState: FlowchartState = {
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  clipboard: { nodes: [], edges: [] },
  history: { past: [], present: { nodes: [], edges: [], selectedNodes: [], selectedEdges: [], clipboard: { nodes: [], edges: [] }, history: { past: [], present: {} as any, future: [] }, isLoading: false, hasUnsavedChanges: false }, future: [] },
  isLoading: false,
  hasUnsavedChanges: false,
}

function flowchartReducer(state: FlowchartState, action: FlowchartAction): FlowchartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_FLOWCHART':
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        hasUnsavedChanges: false,
      }
    
    case 'ADD_NODE':
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
        hasUnsavedChanges: true,
      }
    
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.id ? { ...node, ...action.payload.updates } : node
        ),
        hasUnsavedChanges: true,
      }
    
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload),
        edges: state.edges.filter(edge => edge.source !== action.payload && edge.target !== action.payload),
        hasUnsavedChanges: true,
      }
    
    case 'ADD_EDGE':
      return {
        ...state,
        edges: [...state.edges, action.payload],
        hasUnsavedChanges: true,
      }
    
    case 'UPDATE_EDGE':
      return {
        ...state,
        edges: state.edges.map(edge =>
          edge.id === action.payload.id ? { ...edge, ...action.payload.updates } : edge
        ),
        hasUnsavedChanges: true,
      }
    
    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.payload),
        hasUnsavedChanges: true,
      }
    
    case 'SELECT_NODE':
      if (action.payload.multi) {
        const isSelected = state.selectedNodes.includes(action.payload.id)
        return {
          ...state,
          selectedNodes: isSelected
            ? state.selectedNodes.filter(id => id !== action.payload.id)
            : [...state.selectedNodes, action.payload.id],
        }
      } else {
        return {
          ...state,
          selectedNodes: [action.payload.id],
          selectedEdges: [],
        }
      }
    
    case 'SELECT_EDGE':
      if (action.payload.multi) {
        const isSelected = state.selectedEdges.includes(action.payload.id)
        return {
          ...state,
          selectedEdges: isSelected
            ? state.selectedEdges.filter(id => id !== action.payload.id)
            : [...state.selectedEdges, action.payload.id],
        }
      } else {
        return {
          ...state,
          selectedNodes: [],
          selectedEdges: [action.payload.id],
        }
      }
    
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedNodes: [],
        selectedEdges: [],
      }
    
    case 'SELECT_ALL':
      return {
        ...state,
        selectedNodes: state.nodes.map(node => node.id),
        selectedEdges: state.edges.map(edge => edge.id),
      }
    
    case 'SET_HAS_UNSAVED_CHANGES':
      return { ...state, hasUnsavedChanges: action.payload }
    
    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload }
    
    case 'SET_CLIPBOARD':
      return { ...state, clipboard: action.payload }
    
    default:
      return state
  }
}

const FlowchartContext = createContext<{
  state: FlowchartState
  actions: FlowchartActions
} | null>(null)

export function FlowchartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(flowchartReducer, initialState)

  // Actions
  const addNode = useCallback((node: NodeData) => {
    const validation = validateNode(node)
    if (!validation.valid) {
      dispatch({ type: 'SET_ERROR', payload: validation.errors.join(', ') })
      return
    }
    dispatch({ type: 'ADD_NODE', payload: node })
  }, [])

  const updateNode = useCallback((id: string, updates: Partial<NodeData>) => {
    const node = state.nodes.find(n => n.id === id)
    if (!node) return

    const updatedNode = { ...node, ...updates }
    const validation = validateNode(updatedNode)
    if (!validation.valid) {
      dispatch({ type: 'SET_ERROR', payload: validation.errors.join(', ') })
      return
    }

    dispatch({ type: 'UPDATE_NODE', payload: { id, updates } })
  }, [state.nodes])

  const deleteNode = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NODE', payload: id })
  }, [])

  const addEdge = useCallback((edge: EdgeData) => {
    const validation = validateEdge(edge, state.nodes)
    if (!validation.valid) {
      dispatch({ type: 'SET_ERROR', payload: validation.errors.join(', ') })
      return
    }
    dispatch({ type: 'ADD_EDGE', payload: edge })
  }, [state.nodes])

  const updateEdge = useCallback((id: string, updates: Partial<EdgeData>) => {
    const edge = state.edges.find(e => e.id === id)
    if (!edge) return

    const updatedEdge = { ...edge, ...updates }
    const validation = validateEdge(updatedEdge, state.nodes)
    if (!validation.valid) {
      dispatch({ type: 'SET_ERROR', payload: validation.errors.join(', ') })
      return
    }

    dispatch({ type: 'UPDATE_EDGE', payload: { id, updates } })
  }, [state.edges, state.nodes])

  const deleteEdge = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EDGE', payload: id })
  }, [])

  const selectNode = useCallback((id: string, multi = false) => {
    dispatch({ type: 'SELECT_NODE', payload: { id, multi } })
  }, [])

  const selectEdge = useCallback((id: string, multi = false) => {
    dispatch({ type: 'SELECT_EDGE', payload: { id, multi } })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' })
  }, [])

  const selectAll = useCallback(() => {
    dispatch({ type: 'SELECT_ALL' })
  }, [])

  const copy = useCallback(() => {
    const selectedNodes = state.nodes.filter(node => state.selectedNodes.includes(node.id))
    const selectedEdges = state.edges.filter(edge => state.selectedEdges.includes(edge.id))
    dispatch({ type: 'SET_CLIPBOARD', payload: { nodes: selectedNodes, edges: selectedEdges } })
  }, [state.nodes, state.edges, state.selectedNodes, state.selectedEdges])

  const paste = useCallback(() => {
    if (state.clipboard.nodes.length === 0) return

    const offset = { x: 20, y: 20 }
    const newNodes = state.clipboard.nodes.map(node => ({
      ...node,
      id: generateId('node_'),
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
    }))

    const nodeMapping = state.clipboard.nodes.reduce((acc, node, index) => {
      acc[node.id] = newNodes[index].id
      return acc
    }, {} as Record<string, string>)

    const newEdges = state.clipboard.edges
      .filter(edge => nodeMapping[edge.source] && nodeMapping[edge.target])
      .map(edge => ({
        ...edge,
        id: generateId('edge_'),
        source: nodeMapping[edge.source],
        target: nodeMapping[edge.target],
      }))

    newNodes.forEach(node => dispatch({ type: 'ADD_NODE', payload: node }))
    newEdges.forEach(edge => dispatch({ type: 'ADD_EDGE', payload: edge }))
  }, [state.clipboard])

  const cut = useCallback(() => {
    copy()
    state.selectedNodes.forEach(id => dispatch({ type: 'DELETE_NODE', payload: id }))
    state.selectedEdges.forEach(id => dispatch({ type: 'DELETE_EDGE', payload: id }))
  }, [copy, state.selectedNodes, state.selectedEdges])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const save = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Implementar save logic
      dispatch({ type: 'SET_LAST_SAVED', payload: new Date() })
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao salvar' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const autoSave = useCallback(() => {
    // Auto-save simples
    save()
  }, [save])

  const exportFlowchart = useCallback(async (options: ExportOptions) => {
    // Implementar export logic
  }, [])

  const importFlowchart = useCallback((data: any) => {
    // Implementar import logic
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error?: string) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'SET_FLOWCHART', payload: { nodes: [], edges: [] } })
  }, [])

  // Auto-save effect
  useEffect(() => {
    if (state.hasUnsavedChanges) {
      autoSave()
    }
  }, [state.hasUnsavedChanges, autoSave])

  const actions: FlowchartActions = {
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    addEdge,
    updateEdge,
    deleteEdge,
    selectEdge,
    clearSelection,
    selectAll,
    copy,
    paste,
    cut,
    undo,
    redo,
    save,
    autoSave,
    export: exportFlowchart,
    import: importFlowchart,
    setLoading,
    setError,
    reset,
  }

  return (
    <FlowchartContext.Provider value={{ state, actions }}>
      {children}
    </FlowchartContext.Provider>
  )
}

export function useFlowchart() {
  const context = useContext(FlowchartContext)
  if (!context) {
    throw new Error('useFlowchart deve ser usado dentro de FlowchartProvider')
  }
  return context
}
