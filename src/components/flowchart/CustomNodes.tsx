import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit2, Check, X } from 'lucide-react'

// Editable Node Component
const EditableNode = ({ 
  data, 
  selected, 
  children, 
  className = '',
  onLabelChange 
}: { 
  data: any; 
  selected: boolean; 
  children: React.ReactNode;
  className?: string;
  onLabelChange?: (label: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(data.label)

  const handleSave = () => {
    if (onLabelChange) {
      onLabelChange(editLabel)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditLabel(data.label)
    setIsEditing(false)
  }

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[140px] transition-all relative group ${className} ${
      selected ? 'border-blue-500 shadow-blue-200' : 'border-gray-300 hover:border-gray-400'
    }`}>
      {children}
      
      {/* Edit Button */}
      {selected && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-50"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}

      {/* Editable Label */}
      {isEditing ? (
        <div className="flex items-center space-x-1 mt-2">
          <Input
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            className="text-xs h-6"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
          />
          <Button size="sm" variant="ghost" className="w-4 h-4 p-0" onClick={handleSave}>
            <Check className="w-3 h-3 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="w-4 h-4 p-0" onClick={handleCancel}>
            <X className="w-3 h-3 text-red-600" />
          </Button>
        </div>
      ) : (
        <div className="font-semibold text-sm text-gray-800 text-center">
          {data.label}
        </div>
      )}
    </div>
  )
}

// Process Node (Retângulo)
export const ProcessNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <EditableNode data={data} selected={selected} className="bg-blue-50">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-blue-500"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-blue-500"
    />
  </EditableNode>
)

// Decision Node (Losango)
export const DecisionNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-3 shadow-lg bg-white border-2 min-w-[140px] min-h-[80px] flex items-center justify-center transition-all ${
    selected ? 'border-red-500 shadow-red-200' : 'border-gray-300 hover:border-gray-400'
  }`} 
  style={{ 
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    transform: 'none'
  }}>
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-red-500"
    />
    <div className="font-semibold text-sm text-gray-800 text-center">
      {data.label}
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-red-500"
    />
    <Handle
      type="source"
      position={Position.Right}
      className="w-3 h-3 bg-red-500"
    />
  </div>
)

// Start/End Node (Oval)
export const StartEndNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-6 py-3 shadow-lg rounded-full bg-white border-2 min-w-[140px] transition-all ${
    selected ? 'border-green-500 shadow-green-200' : 'border-gray-300 hover:border-gray-400'
  }`}>
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-green-500"
    />
    <div className="font-semibold text-sm text-gray-800 text-center">
      {data.label}
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-green-500"
    />
  </div>
)

// Input/Output Node (Paralelogramo)
export const InputOutputNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-3 shadow-lg bg-white border-2 min-w-[140px] transition-all ${
    selected ? 'border-yellow-500 shadow-yellow-200' : 'border-gray-300 hover:border-gray-400'
  }`} 
  style={{ 
    clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
  }}>
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-yellow-500"
    />
    <div className="font-semibold text-sm text-gray-800 text-center">
      {data.label}
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-yellow-500"
    />
  </div>
)

// Data Node (Cilindro)
export const DataNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-3 shadow-lg bg-white border-2 min-w-[140px] transition-all ${
    selected ? 'border-purple-500 shadow-purple-200' : 'border-gray-300 hover:border-gray-400'
  }`} 
  style={{ 
    clipPath: 'ellipse(50% 100% at 50% 0%)',
    borderRadius: '50% 50% 0 0'
  }}>
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-purple-500"
    />
    <div className="font-semibold text-sm text-gray-800 text-center">
      {data.label}
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-purple-500"
    />
  </div>
)

// Document Node (Retângulo com dobra)
export const DocumentNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-3 shadow-lg bg-white border-2 min-w-[140px] transition-all relative ${
    selected ? 'border-indigo-500 shadow-indigo-200' : 'border-gray-300 hover:border-gray-400'
  }`}>
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-indigo-500"
    />
    <div className="font-semibold text-sm text-gray-800 text-center">
      {data.label}
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-indigo-500"
    />
    {/* Dobra do documento */}
    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-gray-200"></div>
  </div>
)

// Connector Node (Círculo pequeno)
export const ConnectorNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`w-8 h-8 shadow-lg rounded-full bg-white border-2 flex items-center justify-center transition-all ${
    selected ? 'border-gray-500 shadow-gray-200' : 'border-gray-300 hover:border-gray-400'
  }`}>
    <Handle
      type="target"
      position={Position.Top}
      className="w-2 h-2 bg-gray-500"
    />
    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-2 h-2 bg-gray-500"
    />
    <Handle
      type="source"
      position={Position.Left}
      className="w-2 h-2 bg-gray-500"
    />
    <Handle
      type="source"
      position={Position.Right}
      className="w-2 h-2 bg-gray-500"
    />
  </div>
)

// Database Node (Cilindro)
export const DatabaseNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <EditableNode data={data} selected={selected} className="bg-purple-50">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-purple-500"
    />
    <div className="w-16 h-12 bg-purple-200 rounded-t-lg relative">
      <div className="absolute bottom-0 w-full h-8 bg-purple-300 rounded-b-full"></div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-purple-500"
    />
  </EditableNode>
)

// API Node (Hexágono)
export const ApiNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <EditableNode data={data} selected={selected} className="bg-orange-50">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-orange-500"
    />
    <div className="w-16 h-12 bg-orange-200 relative" 
         style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-orange-500"
    />
  </EditableNode>
)

// Timer Node (Círculo com relógio)
export const TimerNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <EditableNode data={data} selected={selected} className="bg-yellow-50">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-yellow-500"
    />
    <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-600 rounded-full relative">
        <div className="absolute top-1 left-1/2 w-0.5 h-3 bg-yellow-600 transform -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-yellow-500"
    />
  </EditableNode>
)

// User Node (Pessoa)
export const UserNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <EditableNode data={data} selected={selected} className="bg-green-50">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-green-500"
    />
    <div className="w-12 h-16 bg-green-200 rounded-full relative">
      <div className="absolute top-2 left-1/2 w-6 h-6 bg-green-300 rounded-full transform -translate-x-1/2"></div>
      <div className="absolute bottom-2 left-1/2 w-8 h-8 bg-green-300 rounded-full transform -translate-x-1/2"></div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-green-500"
    />
  </EditableNode>
)

// Cloud Node (Nuvem)
export const CloudNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <EditableNode data={data} selected={selected} className="bg-sky-50">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-sky-500"
    />
    <div className="w-16 h-10 bg-sky-200 rounded-full relative">
      <div className="absolute -top-2 left-2 w-6 h-6 bg-sky-200 rounded-full"></div>
      <div className="absolute -top-1 right-2 w-8 h-8 bg-sky-200 rounded-full"></div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-sky-500"
    />
  </EditableNode>
)

// Loop Node (Setas circulares)
export const LoopNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <EditableNode data={data} selected={selected} className="bg-indigo-50">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-indigo-500"
    />
    <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-600 rounded-full relative">
        <div className="absolute top-0 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-indigo-600 transform -translate-x-1/2"></div>
      </div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-indigo-500"
    />
  </EditableNode>
)
