import React from 'react'
import { Handle, Position } from 'reactflow'

// Process Node (Retângulo)
export const ProcessNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[140px] transition-all ${
    selected ? 'border-blue-500 shadow-blue-200' : 'border-gray-300 hover:border-gray-400'
  }`}>
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-blue-500"
    />
    <div className="font-semibold text-sm text-gray-800 text-center">
      {data.label}
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-blue-500"
    />
  </div>
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
