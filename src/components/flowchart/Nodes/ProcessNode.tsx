import React from 'react'
import { Handle, Position } from 'reactflow'
import { Square } from 'lucide-react'

interface ProcessNodeProps {
  data: {
    label: string
    onLabelChange?: (label: string) => void
  }
  selected: boolean
}

export default function ProcessNode({ data, selected }: ProcessNodeProps) {
  return (
    <div className={`bg-blue-500 text-white rounded-lg shadow-lg min-w-[120px] min-h-[60px] p-3 relative group ${selected ? 'ring-2 ring-blue-300' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      
      <div className="flex items-center justify-center h-full">
        <Square className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium text-center">{data.label}</span>
      </div>
    </div>
  )
}
