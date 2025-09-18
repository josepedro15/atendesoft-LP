import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  MousePointer2,
  Square,
  Type,
  Pencil,
  Eraser,
  Circle,
  Triangle,
  Hexagon,
  Star,
  MessageCircle,
  Smile,
  Users,
  Plus,
  Grid3X3,
  Table,
  FileText,
  Workflow,
  Sparkles,
  History,
  Video,
  MessageSquare
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface MiroSidebarProps {
  onToolSelect: (tool: string) => void
  onShapeSelect: (shape: string) => void
  selectedTool: string
  onAddNode: (type: string) => void
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Selecionar' },
  { id: 'table', icon: Table, label: 'Tabela' },
  { id: 'frame', icon: Square, label: 'Quadro' },
  { id: 'text', icon: Type, label: 'Texto' },
  { id: 'shapes', icon: Square, label: 'Formas' },
  { id: 'pen', icon: Pencil, label: 'Caneta' },
  { id: 'grid', icon: Grid3X3, label: 'Grade' },
  { id: 'emoji', icon: Smile, label: 'Emoji' },
  { id: 'comment', icon: MessageCircle, label: 'Comentário' },
  { id: 'flowchart', icon: Workflow, label: 'Fluxograma' },
  { id: 'add', icon: Plus, label: 'Adicionar' },
]

const drawingTools = [
  { id: 'pen', icon: Pencil, label: 'Caneta' },
  { id: 'marker', icon: Pencil, label: 'Marcador' },
  { id: 'select', icon: MousePointer2, label: 'Selecionar' },
  { id: 'eraser', icon: Eraser, label: 'Borracha' },
]

const shapes = [
  { id: 'square', icon: Square, label: 'Quadrado' },
  { id: 'circle', icon: Circle, label: 'Círculo' },
  { id: 'triangle', icon: Triangle, label: 'Triângulo' },
  { id: 'hexagon', icon: Hexagon, label: 'Hexágono' },
  { id: 'star', icon: Star, label: 'Estrela' },
]

const nodeTypes = [
  { id: 'process', icon: Square, label: 'Processo', color: 'bg-blue-500' },
  { id: 'decision', icon: Triangle, label: 'Decisão', color: 'bg-red-500' },
  { id: 'startEnd', icon: Circle, label: 'Início/Fim', color: 'bg-green-500' },
  { id: 'database', icon: Square, label: 'Banco de Dados', color: 'bg-purple-500' },
  { id: 'api', icon: Hexagon, label: 'API', color: 'bg-orange-500' },
  { id: 'user', icon: Users, label: 'Usuário', color: 'bg-green-600' },
]

export default function MiroSidebar({ onToolSelect, onShapeSelect, selectedTool, onAddNode }: MiroSidebarProps) {
  const [activePanel, setActivePanel] = useState('tools')
  const [showDrawingTools, setShowDrawingTools] = useState(false)
  const [showShapes, setShowShapes] = useState(false)

  const handleToolClick = (toolId: string) => {
    onToolSelect(toolId)
    
    if (toolId === 'pen') {
      setShowDrawingTools(true)
      setActivePanel('drawing')
    } else if (toolId === 'shapes') {
      setShowShapes(true)
      setActivePanel('shapes')
    } else {
      setShowDrawingTools(false)
      setShowShapes(false)
      setActivePanel('tools')
    }
  }

  return (
    <div className="fixed left-4 top-20 z-40 flex">
      {/* Sidebar Principal */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col space-y-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => handleToolClick(tool.id)}
            className="w-12 h-12 p-0 relative group"
          >
            <tool.icon className="h-5 w-5" />
            
            {/* Tooltip */}
            <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {tool.label}
            </div>
          </Button>
        ))}
      </div>

      {/* Painel Secundário - Ferramentas de Desenho */}
      <AnimatePresence>
        {showDrawingTools && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="ml-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col space-y-1"
          >
            {drawingTools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onToolSelect(tool.id)}
                className="w-12 h-12 p-0 relative group"
              >
                <tool.icon className="h-5 w-5" />
                
                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {tool.label}
                </div>
              </Button>
            ))}
            
            {/* Cores */}
            <div className="pt-2 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-1">
                {['#000000', '#ef4444', '#3b82f6', '#10b981'].map((color) => (
                  <button
                    key={color}
                    className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel Secundário - Formas */}
      <AnimatePresence>
        {showShapes && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="ml-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col space-y-1"
          >
            {shapes.map((shape) => (
              <Button
                key={shape.id}
                variant="ghost"
                size="sm"
                onClick={() => onShapeSelect(shape.id)}
                className="w-12 h-12 p-0 relative group"
              >
                <shape.icon className="h-5 w-5" />
                
                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {shape.label}
                </div>
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel de Nós do Fluxograma */}
      <AnimatePresence>
        {selectedTool === 'flowchart' && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="ml-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col space-y-1"
          >
            {nodeTypes.map((node) => (
              <Button
                key={node.id}
                variant="ghost"
                size="sm"
                onClick={() => onAddNode(node.id)}
                className="w-12 h-12 p-0 relative group"
              >
                <div className={`w-6 h-6 rounded ${node.color} flex items-center justify-center`}>
                  <node.icon className="h-3 w-3 text-white" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {node.label}
                </div>
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
