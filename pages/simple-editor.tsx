import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
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
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { createSimpleNodeTypes } from '@/components/flowchart/SimpleNodeTypes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react'

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

function SimpleEditorContent() {
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [flowchartTitle, setFlowchartTitle] = useState('Novo Fluxograma')

  // Funções de callback estáveis
  const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
    console.log('🔄 Mudando label do nó:', nodeId, 'para:', newLabel)
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    )
  }, [setNodes])

  const handleColorChange = useCallback((nodeId: string, newColor: string) => {
    console.log('🎨 Mudando cor do nó:', nodeId, 'para:', newColor)
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, color: newColor } } : node
      )
    )
  }, [setNodes])

  // NodeTypes estável
  const nodeTypes = useMemo(() => 
    createSimpleNodeTypes(handleLabelChange, handleColorChange), 
    [handleLabelChange, handleColorChange]
  )

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
    },
    [setEdges]
  )

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: `Novo ${type}`, color: 'blue' },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const deleteSelectedNodes = () => {
    const selectedNodes = nodes.filter(node => node.selected)
    if (selectedNodes.length > 0) {
      setNodes((nds) => nds.filter(node => !node.selected))
      setEdges((eds) => eds.filter(edge => 
        !selectedNodes.some(node => node.id === edge.source || node.id === edge.target)
      ))
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/fluxogramas')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
            <Input
              value={flowchartTitle}
              onChange={(e) => setFlowchartTitle(e.target.value)}
              className="text-lg font-semibold border-none bg-transparent p-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => console.log('Salvando...', { nodes, edges })}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Nós</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('process')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Processo
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('decision')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Decisão
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('startEnd')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Início/Fim
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('data')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Dados
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('document')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Documento
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addNode('database')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Banco de Dados
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={deleteSelectedNodes}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar Selecionados
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Instruções</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Clique em um nó para selecioná-lo</p>
              <p>• Clique no nome do nó para editá-lo</p>
              <p>• Use os botões de edição para mudar nome e cor</p>
              <p>• Arraste para mover nós</p>
              <p>• Conecte nós arrastando entre eles</p>
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                const colors: { [key: string]: string } = {
                  process: '#3b82f6',
                  decision: '#ef4444',
                  startEnd: '#10b981',
                  inputOutput: '#f59e0b',
                  data: '#8b5cf6',
                  document: '#6366f1',
                  connector: '#6b7280',
                  database: '#a855f7',
                  api: '#f97316',
                  timer: '#eab308',
                  user: '#22c55e',
                  cloud: '#0ea5e9',
                  loop: '#6366f1',
                }
                return colors[node.type || 'process'] || '#6b7280'
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export default function SimpleEditor() {
  return (
    <ProtectedRoute>
      <SimpleEditorContent />
    </ProtectedRoute>
  )
}
