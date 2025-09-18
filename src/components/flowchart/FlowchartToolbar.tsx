import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Square, 
  Diamond, 
  Circle, 
  Hexagon, 
  Cylinder,
  FileText,
  Dot,
  Undo,
  Redo,
  Trash2,
  Copy,
  Clipboard,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Save,
  Download,
  Share2,
  Settings,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Layers,
  Grid,
  Eye,
  EyeOff,
  Database,
  Cloud,
  Clock,
  User,
  RotateCcw,
  Zap
} from 'lucide-react'

interface FlowchartToolbarProps {
  onAddNode: (type: string) => void
  onUndo: () => void
  onRedo: () => void
  onDelete: () => void
  onCopy: () => void
  onPaste: () => void
  onSave: () => void
  onExport: (format: string) => void
  onShare: () => void
  canUndo: boolean
  canRedo: boolean
  hasSelection: boolean
}

const nodeTypes = [
  { type: 'process', label: 'Processo', icon: Square, color: 'bg-blue-500', description: 'Ação ou processo' },
  { type: 'decision', label: 'Decisão', icon: Diamond, color: 'bg-red-500', description: 'Ponto de decisão' },
  { type: 'startEnd', label: 'Início/Fim', icon: Circle, color: 'bg-green-500', description: 'Início ou fim do fluxo' },
  { type: 'inputOutput', label: 'Entrada/Saída', icon: Hexagon, color: 'bg-yellow-500', description: 'Dados de entrada/saída' },
  { type: 'data', label: 'Dados', icon: Cylinder, color: 'bg-purple-500', description: 'Armazenamento de dados' },
  { type: 'document', label: 'Documento', icon: FileText, color: 'bg-indigo-500', description: 'Documento ou relatório' },
  { type: 'connector', label: 'Conector', icon: Dot, color: 'bg-gray-500', description: 'Ponto de conexão' },
  { type: 'database', label: 'Banco de Dados', icon: Database, color: 'bg-purple-600', description: 'Base de dados' },
  { type: 'api', label: 'API', icon: Zap, color: 'bg-orange-500', description: 'Interface de programação' },
  { type: 'timer', label: 'Timer', icon: Clock, color: 'bg-yellow-600', description: 'Temporizador ou delay' },
  { type: 'user', label: 'Usuário', icon: User, color: 'bg-green-600', description: 'Interação do usuário' },
  { type: 'cloud', label: 'Nuvem', icon: Cloud, color: 'bg-sky-500', description: 'Serviço em nuvem' },
  { type: 'loop', label: 'Loop', icon: RotateCcw, color: 'bg-indigo-600', description: 'Repetição ou ciclo' },
]

export default function FlowchartToolbar({
  onAddNode,
  onUndo,
  onRedo,
  onDelete,
  onCopy,
  onPaste,
  onSave,
  onExport,
  onShare,
  canUndo,
  canRedo,
  hasSelection
}: FlowchartToolbarProps) {
  const [activeTab, setActiveTab] = useState('shapes')
  const [showColors, setShowColors] = useState(false)

  const tabs = [
    { id: 'shapes', label: 'Formas', icon: Square },
    { id: 'edit', label: 'Editar', icon: Settings },
    { id: 'view', label: 'Visualizar', icon: Eye },
    { id: 'export', label: 'Exportar', icon: Download },
  ]

  return (
    <Card className="w-80 h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Tabs */}
        <div className="flex space-x-1 mb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex-1"
            >
              <tab.icon className="h-4 w-4 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'shapes' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-3">Biblioteca de Formas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {nodeTypes.map((nodeType) => (
                    <Button
                      key={nodeType.type}
                      variant="outline"
                      size="sm"
                      onClick={() => onAddNode(nodeType.type)}
                      className="h-auto p-3 flex flex-col items-center space-y-2"
                    >
                      <div className={`w-8 h-8 rounded ${nodeType.color} flex items-center justify-center`}>
                        <nodeType.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-medium">{nodeType.label}</div>
                        <div className="text-muted-foreground">{nodeType.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Templates Rápidos</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Fluxo de Decisão Simples
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Layers className="h-4 w-4 mr-2" />
                    Processo de Vendas
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Grid className="h-4 w-4 mr-2" />
                    Workflow de Aprovação
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-3">Histórico</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="flex-1"
                  >
                    <Undo className="h-4 w-4 mr-1" />
                    Desfazer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="flex-1"
                  >
                    <Redo className="h-4 w-4 mr-1" />
                    Refazer
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Elementos</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCopy}
                    disabled={!hasSelection}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPaste}
                    className="flex-1"
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Colar
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  disabled={!hasSelection}
                  className="w-full mt-2"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir Selecionado
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Alinhamento</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Estilo</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColors(!showColors)}
                  className="w-full"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Cores
                </Button>
                {showColors && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'view' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-3">Zoom</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ZoomOut className="h-4 w-4 mr-1" />
                    Zoom Out
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ZoomIn className="h-4 w-4 mr-1" />
                    Zoom In
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Maximize className="h-4 w-4 mr-1" />
                  Ajustar à Tela
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Visualização</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Grid className="h-4 w-4 mr-2" />
                    Mostrar Grade
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Mostrar Mini-mapa
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Layers className="h-4 w-4 mr-2" />
                    Mostrar Controles
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-3">Salvar</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSave}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Fluxograma
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Exportar</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport('png')}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PNG (Imagem)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport('pdf')}
                    className="w-full justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF (Documento)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport('svg')}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    SVG (Vetorial)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport('json')}
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    JSON (Dados)
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Compartilhar</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShare}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar Link
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
