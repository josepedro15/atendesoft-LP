import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Square, 
  Diamond, 
  Circle, 
  Hexagon,
  FileText,
  Database,
  Clock,
  User,
  Cloud,
  RotateCcw
} from 'lucide-react'

interface SimpleSidebarProps {
  onAddNode: (type: string) => void
  onSave: () => void
  onExportPNG: () => void
  onExportPDF: () => void
  isLoading: boolean
}

const nodeTypes = [
  { 
    type: 'process', 
    icon: Square, 
    label: 'Processo', 
    color: 'bg-blue-500',
    description: 'Ação ou processo'
  },
  { 
    type: 'decision', 
    icon: Diamond, 
    label: 'Decisão', 
    color: 'bg-red-500',
    description: 'Ponto de decisão'
  },
  { 
    type: 'startEnd', 
    icon: Circle, 
    label: 'Início/Fim', 
    color: 'bg-green-500',
    description: 'Início ou fim do fluxo'
  },
  { 
    type: 'inputOutput', 
    icon: Hexagon, 
    label: 'Entrada/Saída', 
    color: 'bg-yellow-500',
    description: 'Dados de entrada/saída'
  },
  { 
    type: 'data', 
    icon: Database, 
    label: 'Dados', 
    color: 'bg-purple-500',
    description: 'Armazenamento de dados'
  },
  { 
    type: 'document', 
    icon: FileText, 
    label: 'Documento', 
    color: 'bg-indigo-500',
    description: 'Documento ou relatório'
  },
  { 
    type: 'timer', 
    icon: Clock, 
    label: 'Timer', 
    color: 'bg-orange-500',
    description: 'Temporizador ou delay'
  },
  { 
    type: 'user', 
    icon: User, 
    label: 'Usuário', 
    color: 'bg-green-600',
    description: 'Interação do usuário'
  },
  { 
    type: 'cloud', 
    icon: Cloud, 
    label: 'Nuvem', 
    color: 'bg-sky-500',
    description: 'Serviço em nuvem'
  },
  { 
    type: 'loop', 
    icon: RotateCcw, 
    label: 'Loop', 
    color: 'bg-indigo-600',
    description: 'Repetição ou ciclo'
  },
]

export default function SimpleSidebar({ 
  onAddNode, 
  onSave, 
  onExportPNG, 
  onExportPDF, 
  isLoading 
}: SimpleSidebarProps) {
  return (
    <div className="w-64 border-l bg-white/50 backdrop-blur-sm p-4 h-full overflow-y-auto">
      <div className="space-y-6">
        
        {/* Biblioteca de Formas */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Biblioteca de Formas</h3>
          <div className="grid grid-cols-2 gap-2">
            {nodeTypes.map((nodeType) => (
              <Button
                key={nodeType.type}
                variant="outline"
                size="sm"
                onClick={() => onAddNode(nodeType.type)}
                className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-gray-50"
                title={nodeType.description}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center ${nodeType.color}`}>
                  <nodeType.icon className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs text-center">{nodeType.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Ações</h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="w-full"
            disabled={isLoading}
          >
            Salvar Fluxograma
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPNG}
              disabled={isLoading}
              className="text-xs"
            >
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              disabled={isLoading}
              className="text-xs"
            >
              PDF
            </Button>
          </div>
        </div>

        {/* Dicas */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Dicas</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Clique em um nó para editá-lo</p>
            <p>• Arraste para mover elementos</p>
            <p>• Conecte nós arrastando entre eles</p>
            <p>• Use Ctrl+Z para desfazer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
