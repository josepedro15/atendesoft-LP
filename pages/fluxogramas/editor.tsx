import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useFlowcharts } from '@/contexts/FlowchartsContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Save, 
  Download, 
  ArrowLeft,
  FileDown,
  Undo,
  Redo,
  Square,
  Diamond,
  Circle,
  Trash2
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
import SimpleSidebar from '@/components/flowchart/SimpleSidebar'
import { exportAsPNG, exportAsPDF, exportAsSVG, exportAsJSON } from '@/components/flowchart/ExportUtils'

// NodeTypes será definido dentro do componente para ter acesso aos callbacks

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'startEnd',
    position: { x: 250, y: 25 },
    data: { label: 'Início', color: 'green' },
  },
  {
    id: '2',
    type: 'process',
    position: { x: 100, y: 125 },
    data: { label: 'Processo 1', color: 'blue' },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 400, y: 125 },
    data: { label: 'Decisão?', color: 'red' },
  },
  {
    id: '4',
    type: 'process',
    position: { x: 100, y: 250 },
    data: { label: 'Processo 2', color: 'blue' },
  },
  {
    id: '5',
    type: 'startEnd',
    position: { x: 400, y: 250 },
    data: { label: 'Fim', color: 'green' },
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
  const { query } = router
  const { createFlowchart, updateFlowchart, loadFlowchart, loading: flowchartsLoading, error: flowchartsError } = useFlowcharts()
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [flowchartTitle, setFlowchartTitle] = useState('Novo Fluxograma')
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([{ nodes: initialNodes, edges: initialEdges }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentFlowchartId, setCurrentFlowchartId] = useState<string | null>(null)
  const [isNewFlowchart, setIsNewFlowchart] = useState(true)

  const saveToHistory = useCallback(() => {
    const newState = { nodes, edges }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [nodes, edges, history, historyIndex])

  // Função para lidar com mudanças de label
  const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    )
    saveToHistory()
  }, [setNodes, saveToHistory])

  // Função para lidar com mudanças de cor
  const handleColorChange = useCallback((nodeId: string, newColor: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, color: newColor } } : node
      )
    )
    saveToHistory()
  }, [setNodes, saveToHistory])

  // NodeTypes dinâmico com callbacks
  const nodeTypes: NodeTypes = useMemo(() => ({
    process: (props) => <ProcessNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    decision: (props) => <DecisionNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    startEnd: (props) => <StartEndNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    inputOutput: (props) => <InputOutputNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    data: (props) => <DataNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    document: (props) => <DocumentNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    connector: (props) => <ConnectorNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    database: (props) => <DatabaseNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    api: (props) => <ApiNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    timer: (props) => <TimerNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    user: (props) => <UserNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    cloud: (props) => <CloudNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
    loop: (props) => <LoopNode {...props} onLabelChange={(label) => handleLabelChange(props.id, label)} onColorChange={(color) => handleColorChange(props.id, color)} />,
  }), [handleLabelChange, handleColorChange])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}-${params.sourceHandle || 'default'}-${params.targetHandle || 'default'}`,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        // Preservar os handles específicos
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      }
      setEdges((eds) => addEdge(newEdge, eds))
      saveToHistory()
    },
    [setEdges, saveToHistory]
  )

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
    // Calcular posição central da viewport
    const centerX = window.innerWidth / 2 - 100
    const centerY = window.innerHeight / 2 - 100
    
    // Cores padrão para cada tipo de nó
    const defaultColors: { [key: string]: string } = {
      process: 'blue',
      decision: 'red',
      startEnd: 'green',
      inputOutput: 'yellow',
      data: 'purple',
      document: 'blue',
      connector: 'gray',
      database: 'purple',
      api: 'orange',
      timer: 'yellow',
      user: 'green',
      cloud: 'blue',
      loop: 'blue',
    }
    
    const newNode: Node = {
      id: `${Date.now()}`, // Usar timestamp para IDs únicos
      type,
      position: { 
        x: centerX + (Math.random() - 0.5) * 200, 
        y: centerY + (Math.random() - 0.5) * 200 
      },
      data: { 
        label: `Novo ${type}`,
        color: defaultColors[type] || 'blue'
      },
    }
    setNodes((nds) => [...nds, newNode])
    saveToHistory()
  }

  const deleteSelected = () => {
    setNodes(nodes.filter(node => !node.selected))
    setEdges(edges.filter(edge => !edge.selected))
    saveToHistory()
  }

  const handleExportPNG = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await exportAsPNG(reactFlowInstance, flowchartTitle)
    } catch (error) {
      setError('Erro ao exportar PNG')
      console.error('Erro ao exportar PNG:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await exportAsPDF(reactFlowInstance, flowchartTitle)
    } catch (error) {
      setError('Erro ao exportar PDF')
      console.error('Erro ao exportar PDF:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportSVG = () => {
    try {
      setError(null)
      exportAsSVG(nodes, edges, flowchartTitle)
    } catch (error) {
      setError('Erro ao exportar SVG')
      console.error('Erro ao exportar SVG:', error)
    }
  }

  const handleExportJSON = () => {
    try {
      setError(null)
      exportAsJSON(nodes, edges, flowchartTitle)
    } catch (error) {
      setError('Erro ao exportar JSON')
      console.error('Erro ao exportar JSON:', error)
    }
  }

  // Carregar fluxograma existente se ID for fornecido
  useEffect(() => {
    const loadExistingFlowchart = async () => {
      if (query.id && typeof query.id === 'string') {
        setIsLoading(true)
        setError(null)
        
        try {
          const flowchart = await loadFlowchart(query.id)
          if (flowchart) {
            setFlowchartTitle(flowchart.title)
            setNodes(flowchart.data.nodes || initialNodes)
            setEdges(flowchart.data.edges || initialEdges)
            setCurrentFlowchartId(flowchart.id)
            setIsNewFlowchart(false)
            
            // Resetar histórico
            setHistory([{ nodes: flowchart.data.nodes || initialNodes, edges: flowchart.data.edges || initialEdges }])
            setHistoryIndex(0)
          } else {
            setError('Fluxograma não encontrado')
          }
        } catch (err) {
          setError('Erro ao carregar fluxograma')
          console.error('Erro ao carregar fluxograma:', err)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadExistingFlowchart()
  }, [query.id, loadFlowchart, setNodes, setEdges])

  const saveFlowchart = async () => {
    if (!flowchartTitle.trim()) {
      setError('Título é obrigatório')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const flowchartData = {
        title: flowchartTitle.trim(),
        data: {
          nodes,
          edges,
          metadata: {
            created_at: new Date().toISOString(),
            version: '1.0',
            nodeCount: nodes.length,
            edgeCount: edges.length
          }
        }
      }

      let savedFlowchart
      if (isNewFlowchart) {
        // Criar novo fluxograma
        console.log('Criando novo fluxograma:', flowchartData)
        savedFlowchart = await createFlowchart(flowchartData)
        if (savedFlowchart) {
          console.log('Fluxograma criado com sucesso:', savedFlowchart)
          setCurrentFlowchartId(savedFlowchart.id)
          setIsNewFlowchart(false)
          // Atualizar URL sem recarregar a página
          router.replace(`/fluxogramas/editor?id=${savedFlowchart.id}`, undefined, { shallow: true })
        } else {
          console.error('Falha ao criar fluxograma')
        }
      } else if (currentFlowchartId) {
        // Atualizar fluxograma existente
        console.log('Atualizando fluxograma existente:', currentFlowchartId, flowchartData)
        savedFlowchart = await updateFlowchart(currentFlowchartId, flowchartData)
        if (savedFlowchart) {
          console.log('Fluxograma atualizado com sucesso:', savedFlowchart)
        } else {
          console.error('Falha ao atualizar fluxograma')
        }
      }

      if (savedFlowchart) {
        // Mostrar feedback de sucesso
        setError(null)
        console.log('✅ Fluxograma salvo com sucesso!')
        // Aqui você pode adicionar um toast de sucesso
      } else {
        setError('Erro ao salvar fluxograma')
        console.error('❌ Erro ao salvar fluxograma')
      }
    } catch (err) {
      setError('Erro ao salvar fluxograma')
      console.error('Erro ao salvar fluxograma:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Removidas funções não utilizadas

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Simplified Toolbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 p-3 flex items-center space-x-3">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="w-8 h-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="w-8 h-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Node */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addNode('process')}
              className="w-8 h-8 p-0"
              title="Adicionar Processo"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addNode('decision')}
              className="w-8 h-8 p-0"
              title="Adicionar Decisão"
            >
              <Diamond className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addNode('startEnd')}
              className="w-8 h-8 p-0"
              title="Adicionar Início/Fim"
            >
              <Circle className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteSelected}
              disabled={!nodes.some(node => node.selected) && !edges.some(edge => edge.selected)}
              className="w-8 h-8 p-0"
              title="Excluir Selecionado"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Export */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPNG}
              disabled={isLoading}
              className="h-8 px-3"
            >
              <Download className="h-4 w-4 mr-1" />
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isLoading}
              className="h-8 px-3"
            >
              <FileDown className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </div>

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
            </div>
          </div>
        </div>
      </header>


      {/* Error Alert */}
      {(error || flowchartsError) && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-96">
          <Alert variant="destructive">
            <AlertDescription>{error || flowchartsError}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Loading Overlay */}
      {(isLoading || flowchartsLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Salvando fluxograma...</span>
            </div>
          </div>
        </div>
      )}


      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 relative">
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

        {/* Clean Sidebar */}
        <SimpleSidebar
          onAddNode={addNode}
          onSave={saveFlowchart}
          onExportPNG={handleExportPNG}
          onExportPDF={handleExportPDF}
          isLoading={isLoading}
          onBackToList={() => router.push('/fluxogramas')}
        />
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
