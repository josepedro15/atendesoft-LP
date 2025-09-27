import React, { useState, useCallback, useEffect } from 'react'
import { Handle, Position } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Check, X, Type } from 'lucide-react'

interface ConteudoNodeProps {
  data: {
    label: string
    onLabelChange?: (label: string) => void
  }
  selected: boolean
}

export default function ConteudoNode({ data, selected }: ConteudoNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(data.label || 'Digite o texto...')

  useEffect(() => {
    setEditLabel(data.label || 'Digite o texto...')
  }, [data.label])

  const handleSave = useCallback(() => {
    if (data.onLabelChange && editLabel.trim()) {
      data.onLabelChange(editLabel.trim())
    }
    setIsEditing(false)
  }, [data.onLabelChange, editLabel])

  const handleCancel = useCallback(() => {
    setEditLabel(data.label || 'Digite o texto...')
    setIsEditing(false)
  }, [data])

  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }, [handleSave, handleCancel])

  return (
    <div className={`bg-blue-50 border-2 border-blue-300 rounded-lg shadow-lg min-w-[200px] min-h-[80px] p-4 relative group ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />

      {/* Botão de editar */}
      {!isEditing && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 z-10"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleStartEdit()
          }}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      )}

      {/* Área de conteúdo */}
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm h-8 w-full"
            autoFocus
            placeholder="Digite o texto..."
          />
          <div className="flex justify-end space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0"
              onClick={handleSave}
            >
              <Check className="w-3 h-3 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0"
              onClick={handleCancel}
            >
              <X className="w-3 h-3 text-red-600" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="min-h-[40px] flex items-center justify-center cursor-pointer hover:bg-blue-100 rounded p-1" 
          onClick={handleStartEdit}
        >
          <div className="text-sm text-gray-800 text-center break-words max-w-full">
            {data.label || 'Digite o texto...'}
          </div>
        </div>
      )}

      {/* Ícone */}
      <div className="absolute top-2 left-2">
        <Type className="w-4 h-4 text-blue-600" />
      </div>
    </div>
  )
}
