import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Save, 
  Download, 
  ArrowLeft,
  FileDown
} from 'lucide-react'
import Image from 'next/image'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  ProcessNode, 
  DecisionNode, 
  StartEndNode, 
  InputOutputNode,
  DataNode,
  DocumentNode,
  ConnectorNode,
  DatabaseNode,
  ApiNode,
  TimerNode,
  UserNode,
  CloudNode,
  LoopNode
} from '@/components/flowchart/CustomNodes'
import FlowchartToolbar from '@/components/flowchart/FlowchartToolbar'
import MiroToolbar from '@/components/flowchart/MiroToolbar'
import MiroSidebar from '@/components/flowchart/MiroSidebar'
import TemplatesPanel from '@/components/flowchart/TemplatesPanel'
import { exportAsPNG, exportAsPDF, exportAsSVG, exportAsJSON } from '@/components/flowchart/ExportUtils'

const nodeTypes: NodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  startEnd: StartEndNode,
  inputOutput: InputOutputNode,
  data: DataNode,
  document: DocumentNode,
  connector: ConnectorNode,
  database: DatabaseNode,
  api: ApiNode,
  timer: TimerNode,
  user: UserNode,
  cloud: CloudNode,
  loop: LoopNode,
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'startEnd',
    position: { x: 250, y: 25 },
    data: { label: 'Início' },
  },
  {
    id: '2',
    type: 'process',
    position: { x: 100, y: 125 },
    data: { label: 'Processo 1' },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 400, y: 125 },
    data: { label: 'Decisão?' },
  },
  {
    id: '4',
    type: 'process',
    position: { x: 100, y: 250 },
    data: { label: 'Processo 2' },
  },
  {
    id: '5',
    type: 'startEnd',
    position: { x: 400, y: 250 },
    data: { label: 'Fim' },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    label: 'Sim',
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    label: 'Não',
  },
]

function EditorContent() {
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [flowchartTitle, setFlowchartTitle] = useState('Novo Fluxograma')
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([{ nodes: initialNodes, edges: initialEdges }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedTool, setSelectedTool] = useState('select')
  const [fontSize, setFontSize] = useState(16)
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [isLocked, setIsLocked] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
      saveToHistory()
    },
    [setEdges, saveToHistory]
  )

  const saveToHistory = () => {
    const newState = { nodes, edges }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setNodes(history[newIndex].nodes)
      setEdges(history[newIndex].edges)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setNodes(history[newIndex].nodes)
      setEdges(history[newIndex].edges)
    }
  }

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Novo ${type}` },
    }
    setNodes((nds) => [...nds, newNode])
    saveToHistory()
  }

  const deleteSelected = () => {
    setNodes(nodes.filter(node => !node.selected))
    setEdges(edges.filter(edge => !edge.selected))
    saveToHistory()
  }

  const handleExportPNG = () => {
    exportAsPNG(reactFlowInstance, flowchartTitle)
  }

  const handleExportPDF = () => {
    exportAsPDF(reactFlowInstance, flowchartTitle)
  }

  const handleExportSVG = () => {
    exportAsSVG(nodes, edges, flowchartTitle)
  }

  const handleExportJSON = () => {
    exportAsJSON(nodes, edges, flowchartTitle)
  }

  const saveFlowchart = () => {
    // Implementar salvamento
  }

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool)
    if (tool === 'shapes') {
      setShowTemplates(true)
    }
  }

  const handleShapeSelect = () => {
    // Implementar seleção de forma
  }

  const handleTemplateSelect = (template: any) => {
    if (template.type === 'template') {
      setNodes(template.template.nodes)
      setEdges(template.template.edges)
      setShowTemplates(false)
    } else if (template.type === 'flowchart') {
      addNode(template.shape.id)
    }
  }

  const handleLock = () => {
    setIsLocked(!isLocked)
  }

  const handleUnlock = () => {
    setIsLocked(false)
  }

  const handlePresent = () => {
    // Implementar apresentação
  }

  const handleShare = () => {
    // Implementar compartilhamento
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Miro-style Toolbar */}
      <MiroToolbar
        onToolSelect={handleToolSelect}
        onUndo={undo}
        onRedo={redo}
        onCopy={() => {}}
        onDelete={deleteSelected}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onPresent={handlePresent}
        onShare={handleShare}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        hasSelection={nodes.some(node => node.selected) || edges.some(edge => edge.selected)}
        isLocked={isLocked}
        selectedTool={selectedTool}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />

      {/* Miro-style Sidebar */}
      <MiroSidebar
        onToolSelect={handleToolSelect}
        onShapeSelect={handleShapeSelect}
        selectedTool={selectedTool}
        onAddNode={addNode}
      />

      {/* Templates Panel */}
      <TemplatesPanel
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-lg flex-shrink-0 mt-16">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/fluxogramas')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Image 
                src="/LOGO HOME.svg" 
                alt="AtendeSoft" 
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <Badge variant="secondary">
                Editor de Fluxogramas
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                value={flowchartTitle}
                onChange={(e) => setFlowchartTitle(e.target.value)}
                className="w-64"
                placeholder="Nome do fluxograma"
              />
              <Button onClick={saveFlowchart} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={handleExportPNG} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PNG
              </Button>
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 relative ml-20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'process': return '#3b82f6'
                  case 'decision': return '#ef4444'
                  case 'startEnd': return '#10b981'
                  case 'inputOutput': return '#f59e0b'
                  case 'data': return '#8b5cf6'
                  case 'document': return '#6366f1'
                  case 'connector': return '#6b7280'
                  case 'database': return '#a855f7'
                  case 'api': return '#f97316'
                  case 'timer': return '#eab308'
                  case 'user': return '#22c55e'
                  case 'cloud': return '#0ea5e9'
                  case 'loop': return '#6366f1'
                  default: return '#6b7280'
                }
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Optional */}
        <div className="w-80 border-l bg-white/50 backdrop-blur-sm">
          <FlowchartToolbar
            onAddNode={addNode}
            onUndo={undo}
            onRedo={redo}
            onDelete={deleteSelected}
            onCopy={() => {}}
            onPaste={() => {}}
            onSave={saveFlowchart}
            onExport={(format) => {
              if (format === 'png') handleExportPNG()
              if (format === 'pdf') handleExportPDF()
              if (format === 'svg') handleExportSVG()
              if (format === 'json') handleExportJSON()
            }}
            onShare={() => {}}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            hasSelection={nodes.some(node => node.selected) || edges.some(edge => edge.selected)}
          />
        </div>
      </div>
    </div>
  )
}

export default function Editor() {
  return (
    <ProtectedRoute>
      <EditorContent />
    </ProtectedRoute>
  )
}
