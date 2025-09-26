import { useState, useCallback, useRef } from 'react'
import { Node, Edge, useNodesState, useEdgesState } from 'reactflow'

export interface FlowchartEditorState {
  nodes: Node[]
  edges: Edge[]
  flowchartTitle: string
  history: { nodes: Node[]; edges: Edge[] }[]
  historyIndex: number
  selectedTool: string
  fontSize: number
  selectedColor: string
  isLocked: boolean
  isLoading: boolean
  error: string | null
}

export interface FlowchartEditorActions {
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void
  setFlowchartTitle: (title: string) => void
  setSelectedTool: (tool: string) => void
  setFontSize: (size: number) => void
  setSelectedColor: (color: string) => void
  setIsLocked: (locked: boolean) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addNode: (type: string) => void
  deleteSelected: () => void
  undo: () => void
  redo: () => void
  saveToHistory: () => void
  clearError: () => void
}

export const useFlowchartEditor = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [flowchartTitle, setFlowchartTitle] = useState('Novo Fluxograma')
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([
    { nodes: initialNodes, edges: initialEdges }
  ])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedTool, setSelectedTool] = useState('select')
  const [fontSize, setFontSize] = useState(16)
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [isLocked, setIsLocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveToHistory = useCallback(() => {
    const newState = { nodes, edges }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [nodes, edges, history, historyIndex])

  const addNode = useCallback((type: string) => {
    // Calcular posição central da viewport
    const centerX = window.innerWidth / 2 - 100
    const centerY = window.innerHeight / 2 - 100
    
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: { 
        x: centerX + (Math.random() - 0.5) * 200, 
        y: centerY + (Math.random() - 0.5) * 200 
      },
      data: { label: `Novo ${type}` },
    }
    setNodes((nds) => [...nds, newNode])
    saveToHistory()
  }, [setNodes, saveToHistory])

  const deleteSelected = useCallback(() => {
    setNodes(nodes.filter(node => !node.selected))
    setEdges(edges.filter(edge => !edge.selected))
    saveToHistory()
  }, [nodes, edges, setNodes, setEdges, saveToHistory])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setNodes(history[newIndex].nodes)
      setEdges(history[newIndex].edges)
    }
  }, [historyIndex, history, setNodes, setEdges])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setNodes(history[newIndex].nodes)
      setEdges(history[newIndex].edges)
    }
  }, [historyIndex, history, setNodes, setEdges])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const state: FlowchartEditorState = {
    nodes,
    edges,
    flowchartTitle,
    history,
    historyIndex,
    selectedTool,
    fontSize,
    selectedColor,
    isLocked,
    isLoading,
    error,
  }

  const actions: FlowchartEditorActions = {
    setNodes,
    setEdges,
    setFlowchartTitle,
    setSelectedTool,
    setFontSize,
    setSelectedColor,
    setIsLocked,
    setIsLoading,
    setError,
    addNode,
    deleteSelected,
    undo,
    redo,
    saveToHistory,
    clearError,
  }

  return {
    state,
    actions,
    onNodesChange,
    onEdgesChange,
  }
}
