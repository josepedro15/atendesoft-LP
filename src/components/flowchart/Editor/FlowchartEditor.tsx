import React, { useCallback, useMemo } from 'react'
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
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useFlowchart } from '@/contexts/FlowchartContext'
import { createNode, createEdge, generateId } from '@/lib/flowchart/utils'
import ProcessNode from '../Nodes/ProcessNode'
import ConteudoNode from '../Nodes/ConteudoNode'

const nodeTypes: NodeTypes = {
  process: ProcessNode,
  conteudo: ConteudoNode,
}

export default function FlowchartEditor() {
  const { state, actions } = useFlowchart()
  const [nodes, setNodes, onNodesChange] = useNodesState(state.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(state.edges)

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      const newEdge = createEdge(connection.source, connection.target)
      actions.addEdge(newEdge)
    }
  }, [actions])

  const onNodeDragStop = useCallback((event: any, node: Node) => {
    actions.updateNode(node.id, { position: node.position })
  }, [actions])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    actions.selectNode(node.id, event.ctrlKey || event.metaKey)
  }, [actions])

  const onPaneClick = useCallback(() => {
    actions.clearSelection()
  }, [actions])

  const handleAddNode = useCallback((type: string) => {
    const newNode = createNode(type)
    actions.addNode(newNode)
  }, [actions])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      state.selectedNodes.forEach(id => actions.deleteNode(id))
      state.selectedEdges.forEach(id => actions.deleteEdge(id))
    }
  }, [state.selectedNodes, state.selectedEdges, actions])

  return (
    <div className="h-screen w-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>

      {/* Botões de teste */}
      <div className="absolute top-4 left-4 space-x-2">
        <button
          onClick={() => handleAddNode('process')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Adicionar Processo
        </button>
        <button
          onClick={() => handleAddNode('conteudo')}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Adicionar Conteúdo
        </button>
      </div>

      {/* Status */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
        <div className="text-xs text-gray-600">
          Nós: {nodes.length} | Arestas: {edges.length}
        </div>
      </div>
    </div>
  )
}
