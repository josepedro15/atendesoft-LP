import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit2, Check, X, Palette } from 'lucide-react'

// Cores disponíveis
const colors = [
  { name: 'Azul', value: 'blue', bg: 'bg-blue-50', border: 'border-blue-500', handle: 'bg-blue-500' },
  { name: 'Verde', value: 'green', bg: 'bg-green-50', border: 'border-green-500', handle: 'bg-green-500' },
  { name: 'Vermelho', value: 'red', bg: 'bg-red-50', border: 'border-red-500', handle: 'bg-red-500' },
  { name: 'Amarelo', value: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-500', handle: 'bg-yellow-500' },
  { name: 'Roxo', value: 'purple', bg: 'bg-purple-50', border: 'border-purple-500', handle: 'bg-purple-500' },
  { name: 'Laranja', value: 'orange', bg: 'bg-orange-50', border: 'border-orange-500', handle: 'bg-orange-500' },
  { name: 'Rosa', value: 'pink', bg: 'bg-pink-50', border: 'border-pink-500', handle: 'bg-pink-500' },
  { name: 'Cinza', value: 'gray', bg: 'bg-gray-50', border: 'border-gray-500', handle: 'bg-gray-500' },
]

// Componente base para todos os nós
const BaseNode = ({ 
  data, 
  selected, 
  onLabelChange, 
  onColorChange,
  children 
}: {
  data: any
  selected: boolean
  onLabelChange?: (label: string) => void
  onColorChange?: (color: string) => void
  children?: React.ReactNode
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(data.label || '')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const currentColor = colors.find(c => c.value === data.color) || colors[0]

  const handleSave = () => {
    if (onLabelChange && editLabel.trim()) {
      onLabelChange(editLabel.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditLabel(data.label || '')
    setIsEditing(false)
  }

  const handleColorSelect = (color: any) => {
    if (onColorChange) {
      onColorChange(color.value)
    }
    setShowColorPicker(false)
  }

  return (
    <div className={`relative min-w-[120px] min-h-[60px] ${currentColor.bg} ${currentColor.border} border-2 rounded-lg shadow-lg ${selected ? 'ring-2 ring-blue-300' : ''}`}>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" style={{ background: currentColor.handle }} />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" style={{ background: currentColor.handle }} />
      <Handle type="target" position={Position.Left} className="w-3 h-3" style={{ background: currentColor.handle }} />
      <Handle type="source" position={Position.Right} className="w-3 h-3" style={{ background: currentColor.handle }} />

      {/* Conteúdo do nó */}
      <div className="p-3">
        {children}
        
        {/* Label */}
        {isEditing ? (
          <div className="flex items-center space-x-1 mt-2">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="text-sm h-6 flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
            />
            <Button size="sm" variant="ghost" className="w-6 h-6 p-0" onClick={handleSave}>
              <Check className="w-3 h-3 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" className="w-6 h-6 p-0" onClick={handleCancel}>
              <X className="w-3 h-3 text-red-600" />
            </Button>
          </div>
        ) : (
          <div 
            className="text-sm font-medium text-center cursor-pointer hover:bg-white/50 rounded px-1 py-1"
            onClick={() => setIsEditing(true)}
          >
            {data.label || 'Clique para editar'}
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="absolute -top-2 -right-2 flex space-x-1">
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
          title="Editar nome"
        >
          <Edit2 className="w-3 h-3 text-blue-600" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-purple-50"
          onClick={(e) => {
            e.stopPropagation()
            setShowColorPicker(!showColorPicker)
          }}
          title="Mudar cor"
        >
          <Palette className="w-3 h-3 text-purple-600" />
        </Button>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50">
          <div className="text-xs font-semibold mb-2">Escolher Cor</div>
          <div className="grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded border-2 ${
                  currentColor.value === color.value ? 'border-gray-800' : 'border-gray-300'
                } ${color.bg}`}
                onClick={() => handleColorSelect(color)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Nó de Processo (Retângulo)
export const ProcessNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-full h-8 bg-white/50 rounded border border-gray-200"></div>
    </BaseNode>
  )
}

// Nó de Decisão (Losango)
export const DecisionNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 transform rotate-45 border border-gray-200 mx-auto"></div>
    </BaseNode>
  )
}

// Nó de Início/Fim (Círculo)
export const StartEndNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 rounded-full border border-gray-200 mx-auto"></div>
    </BaseNode>
  )
}

// Nó de Entrada/Saída (Paralelogramo)
export const InputOutputNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-full h-8 bg-white/50 border border-gray-200 transform skew-x-12"></div>
    </BaseNode>
  )
}

// Nó de Dados (Cilindro)
export const DataNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-full h-8 bg-white/50 rounded-full border border-gray-200"></div>
    </BaseNode>
  )
}

// Nó de Documento
export const DocumentNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-6 h-8 bg-white/50 border border-gray-200 mx-auto relative">
        <div className="absolute top-0 right-0 w-2 h-2 bg-white/50 border-l border-b border-gray-200"></div>
      </div>
    </BaseNode>
  )
}

// Nó de Conector
export const ConnectorNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-6 h-6 bg-white/50 rounded-full border border-gray-200 mx-auto"></div>
    </BaseNode>
  )
}

// Nó de Banco de Dados
export const DatabaseNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 border border-gray-200 mx-auto relative">
        <div className="absolute -top-1 left-0 right-0 h-2 bg-white/50 border border-gray-200 rounded-t-full"></div>
        <div className="absolute -bottom-1 left-0 right-0 h-2 bg-white/50 border border-gray-200 rounded-b-full"></div>
      </div>
    </BaseNode>
  )
}

// Nó de API
export const ApiNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 border border-gray-200 mx-auto flex items-center justify-center">
        <div className="text-xs font-bold">API</div>
      </div>
    </BaseNode>
  )
}

// Nó de Timer
export const TimerNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 border border-gray-200 mx-auto rounded-full flex items-center justify-center">
        <div className="text-xs">⏱️</div>
      </div>
    </BaseNode>
  )
}

// Nó de Usuário
export const UserNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 border border-gray-200 mx-auto rounded-full flex items-center justify-center">
        <div className="text-xs">👤</div>
      </div>
    </BaseNode>
  )
}

// Nó de Nuvem
export const CloudNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 border border-gray-200 mx-auto rounded-full flex items-center justify-center">
        <div className="text-xs">☁️</div>
      </div>
    </BaseNode>
  )
}

// Nó de Loop
export const LoopNode = ({ data, selected, onLabelChange, onColorChange }: any) => {
  return (
    <BaseNode data={data} selected={selected} onLabelChange={onLabelChange} onColorChange={onColorChange}>
      <div className="w-8 h-8 bg-white/50 border border-gray-200 mx-auto rounded-full flex items-center justify-center">
        <div className="text-xs">🔄</div>
      </div>
    </BaseNode>
  )
}
