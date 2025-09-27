// Tipos TypeScript para o Sistema de Fluxogramas v2.0

export interface Position {
  x: number
  y: number
}

export interface NodeData {
  id: string
  type: string
  label: string
  position: Position
  data: {
    [key: string]: any
  }
}

export interface EdgeData {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  animated?: boolean
  style?: {
    [key: string]: any
  }
}

export interface FlowchartMetadata {
  title: string
  description?: string
  tags?: string[]
  version: string
  created_by: string
  last_modified_by: string
}

export interface Flowchart {
  id: string
  title: string
  description?: string
  data: {
    nodes: NodeData[]
    edges: EdgeData[]
    metadata: FlowchartMetadata
  }
  is_template: boolean
  is_public: boolean
  user_id: string
  created_at: string
  updated_at: string
  version: number
}

export interface CreateFlowchartRequest {
  title: string
  description?: string
  is_template?: boolean
  is_public?: boolean
  template_id?: string
}

export interface UpdateFlowchartRequest {
  title?: string
  description?: string
  data?: {
    nodes: NodeData[]
    edges: EdgeData[]
    metadata: FlowchartMetadata
  }
  is_template?: boolean
  is_public?: boolean
}

export interface NodeType {
  type: string
  label: string
  icon: string
  category: 'process' | 'decision' | 'data' | 'platform' | 'content' | 'connector'
  color: string
  description: string
  defaultSize: {
    width: number
    height: number
  }
  editable: boolean
  deletable: boolean
}

export interface FlowchartTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  data: {
    nodes: NodeData[]
    edges: EdgeData[]
  }
  tags: string[]
  is_public: boolean
  created_by: string
  created_at: string
}

export interface ExportOptions {
  format: 'png' | 'pdf' | 'svg' | 'json'
  quality?: number
  backgroundColor?: string
  includeBackground?: boolean
  scale?: number
}

export interface FlowchartState {
  nodes: NodeData[]
  edges: EdgeData[]
  selectedNodes: string[]
  selectedEdges: string[]
  clipboard: {
    nodes: NodeData[]
    edges: EdgeData[]
  }
  history: {
    past: FlowchartState[]
    present: FlowchartState
    future: FlowchartState[]
  }
  isLoading: boolean
  error?: string
  lastSaved?: Date
  hasUnsavedChanges: boolean
}

export interface FlowchartActions {
  // Node actions
  addNode: (node: NodeData) => void
  updateNode: (id: string, updates: Partial<NodeData>) => void
  deleteNode: (id: string) => void
  selectNode: (id: string, multi?: boolean) => void
  
  // Edge actions
  addEdge: (edge: EdgeData) => void
  updateEdge: (id: string, updates: Partial<EdgeData>) => void
  deleteEdge: (id: string) => void
  selectEdge: (id: string, multi?: boolean) => void
  
  // Selection actions
  clearSelection: () => void
  selectAll: () => void
  
  // Clipboard actions
  copy: () => void
  paste: () => void
  cut: () => void
  
  // History actions
  undo: () => void
  redo: () => void
  
  // Save actions
  save: () => Promise<void>
  autoSave: () => Promise<void>
  
  // Import/Export actions
  export: (options: ExportOptions) => Promise<void>
  import: (data: any) => void
  
  // State management
  setLoading: (loading: boolean) => void
  setError: (error?: string) => void
  reset: () => void
}
