// Nó base para o Sistema de Fluxogramas v2.0

import React, { useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Check, X } from 'lucide-react'
import { NodeData } from '@/lib/flowchart/types'

interface BaseNodeProps extends NodeProps {
  data: NodeData & {
    onLabelChange?: (label: string) => void
    editable?: boolean
    deletable?: boolean
  }
}

export default function BaseNode({ data, selected }: BaseNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(data.label)

  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleSave = useCallback(() => {
    if (data.onLabelChange && editLabel.trim()) {
      data.onLabelChange(editLabel.trim())
    }
    setIsEditing(false)
  }, [data.onLabelChange, editLabel])

  const handleCancel = useCallback(() => {
    setEditLabel(data.label)
    setIsEditing(false)
  }, [data.label])

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
    <div className={`relative group ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />

      {/* Conteúdo do nó */}
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm min-w-[120px] min-h-[60px] p-3">
        {/* Botão de editar */}
        {data.editable !== false && !isEditing && (
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
              className="text-sm h-8"
              autoFocus
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
          <div className="text-sm font-medium text-gray-800 text-center">
            {data.label}
          </div>
        )}
      </div>
    </div>
  )
}
