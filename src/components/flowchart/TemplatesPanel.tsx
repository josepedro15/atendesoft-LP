import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search,
  Download,
  X,
  Square,
  Circle,
  Triangle,
  Diamond,
  MessageCircle,
  Parallelogram,
  Star,
  ArrowRight,
  ArrowLeft,
  ArrowUpDown,
  Pentagon,
  Octagon,
  Hexagon,
  FileText,
  Trapezoid,
  Cloud,
  Plus,
  Cylinder,
  ChevronDown,
  ChevronRight,
  Palette
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface TemplatesPanelProps {
  isOpen: boolean
  onClose: () => void
  onTemplateSelect: (template: any) => void
}

const basicShapes = [
  { id: 'square', icon: Square, label: 'Quadrado' },
  { id: 'rounded-square', icon: Square, label: 'Quadrado Arredondado' },
  { id: 'circle', icon: Circle, label: 'Círculo' },
  { id: 'triangle', icon: Triangle, label: 'Triângulo' },
  { id: 'diamond', icon: Diamond, label: 'Losango' },
  { id: 'speech-bubble', icon: MessageCircle, label: 'Balão de Fala' },
  { id: 'parallelogram', icon: Parallelogram, label: 'Paralelogramo' },
  { id: 'star', icon: Star, label: 'Estrela' },
  { id: 'arrow-right', icon: ArrowRight, label: 'Seta Direita' },
  { id: 'arrow-left', icon: ArrowLeft, label: 'Seta Esquerda' },
  { id: 'arrow-up-down', icon: ArrowUpDown, label: 'Seta Cima/Baixo' },
  { id: 'pentagon', icon: Pentagon, label: 'Pentágono' },
  { id: 'octagon', icon: Octagon, label: 'Octógono' },
  { id: 'hexagon', icon: Hexagon, label: 'Hexágono' },
  { id: 'document', icon: FileText, label: 'Documento' },
  { id: 'trapezoid', icon: Trapezoid, label: 'Trapézio' },
  { id: 'cloud', icon: Cloud, label: 'Nuvem' },
  { id: 'plus', icon: Plus, label: 'Mais' },
  { id: 'cylinder', icon: Cylinder, label: 'Cilindro' },
]

const flowchartShapes = [
  { id: 'process', icon: Square, label: 'Processo', color: '#3b82f6' },
  { id: 'decision', icon: Diamond, label: 'Decisão', color: '#ef4444' },
  { id: 'start-end', icon: Circle, label: 'Início/Fim', color: '#10b981' },
  { id: 'document', icon: FileText, label: 'Documento', color: '#6366f1' },
  { id: 'message', icon: MessageCircle, label: 'Mensagem', color: '#8b5cf6' },
  { id: 'input-output', icon: Trapezoid, label: 'Entrada/Saída', color: '#f59e0b' },
  { id: 'preparation', icon: Hexagon, label: 'Preparação', color: '#06b6d4' },
  { id: 'data', icon: Parallelogram, label: 'Dados', color: '#8b5cf6' },
  { id: 'database', icon: Cylinder, label: 'Banco de Dados', color: '#a855f7' },
  { id: 'list', icon: FileText, label: 'Lista', color: '#6b7280' },
]

const templates = [
  {
    id: 'simple-decision',
    name: 'Fluxo de Decisão Simples',
    description: 'Template básico com início, processo, decisão e fim',
    preview: '🟢 → 🔵 → 🔴 → 🟢',
    nodes: [
      { id: '1', type: 'startEnd', position: { x: 100, y: 50 }, data: { label: 'Início' } },
      { id: '2', type: 'process', position: { x: 100, y: 150 }, data: { label: 'Processo' } },
      { id: '3', type: 'decision', position: { x: 100, y: 250 }, data: { label: 'Decisão?' } },
      { id: '4', type: 'startEnd', position: { x: 100, y: 350 }, data: { label: 'Fim' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  },
  {
    id: 'sales-process',
    name: 'Processo de Vendas',
    description: 'Fluxo completo de vendas com follow-up',
    preview: '🟢 → 🔵 → 🔴 → 🔵 → 🟢',
    nodes: [
      { id: '1', type: 'startEnd', position: { x: 100, y: 50 }, data: { label: 'Lead' } },
      { id: '2', type: 'process', position: { x: 100, y: 150 }, data: { label: 'Qualificar' } },
      { id: '3', type: 'decision', position: { x: 100, y: 250 }, data: { label: 'Interessado?' } },
      { id: '4', type: 'process', position: { x: 100, y: 350 }, data: { label: 'Follow-up' } },
      { id: '5', type: 'startEnd', position: { x: 100, y: 450 }, data: { label: 'Venda' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ]
  },
  {
    id: 'approval-workflow',
    name: 'Workflow de Aprovação',
    description: 'Processo de aprovação com múltiplos níveis',
    preview: '🟢 → 🔵 → 🔴 → 🔵 → 🔴 → 🟢',
    nodes: [
      { id: '1', type: 'startEnd', position: { x: 100, y: 50 }, data: { label: 'Solicitação' } },
      { id: '2', type: 'process', position: { x: 100, y: 150 }, data: { label: 'Revisar' } },
      { id: '3', type: 'decision', position: { x: 100, y: 250 }, data: { label: 'Aprovado?' } },
      { id: '4', type: 'process', position: { x: 100, y: 350 }, data: { label: 'Implementar' } },
      { id: '5', type: 'decision', position: { x: 100, y: 450 }, data: { label: 'Finalizado?' } },
      { id: '6', type: 'startEnd', position: { x: 100, y: 550 }, data: { label: 'Concluído' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
    ]
  },
]

export default function TemplatesPanel({ isOpen, onClose, onTemplateSelect }: TemplatesPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState('basic')
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    flowchart: true,
    templates: true
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const filteredShapes = basicShapes.filter(shape =>
    shape.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFlowchartShapes = flowchartShapes.filter(shape =>
    shape.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Formas de Diagramação</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar formas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Formas Básicas */}
        <div>
          <button
            onClick={() => toggleSection('basic')}
            className="flex items-center justify-between w-full text-left font-semibold mb-3"
          >
            <span>Formas Básicas</span>
            {expandedSections.basic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.basic && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Aplicar cores</span>
              <Button variant="ghost" size="sm">
                <Palette className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {expandedSections.basic && (
            <div className="grid grid-cols-4 gap-2">
              {filteredShapes.map((shape) => (
                <Button
                  key={shape.id}
                  variant="outline"
                  size="sm"
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={() => onTemplateSelect({ type: 'shape', shape })}
                >
                  <shape.icon className="h-6 w-6" />
                  <span className="text-xs text-center">{shape.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Formas de Fluxograma */}
        <div>
          <button
            onClick={() => toggleSection('flowchart')}
            className="flex items-center justify-between w-full text-left font-semibold mb-3"
          >
            <span>Fluxograma</span>
            {expandedSections.flowchart ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.flowchart && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Aplicar cores</span>
              <Button variant="ghost" size="sm">
                <Palette className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {expandedSections.flowchart && (
            <div className="grid grid-cols-2 gap-2">
              {filteredFlowchartShapes.map((shape) => (
                <Button
                  key={shape.id}
                  variant="outline"
                  size="sm"
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={() => onTemplateSelect({ type: 'flowchart', shape })}
                >
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: shape.color }}
                  >
                    <shape.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-center">{shape.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div>
          <button
            onClick={() => toggleSection('templates')}
            className="flex items-center justify-between w-full text-left font-semibold mb-3"
          >
            <span>Templates</span>
            {expandedSections.templates ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.templates && (
            <div className="space-y-2">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTemplateSelect({ type: 'template', template })}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <span className="text-lg">{template.preview}</span>
                    </div>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button variant="outline" className="w-full">
          Gerenciar Formas
        </Button>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Criar Diagrama
        </Button>
      </div>
    </motion.div>
  )
}
