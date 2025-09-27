import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit2, Check, X, FileText, Globe, Search, Target, Facebook, Instagram, Youtube, Bot, Users, MessageSquare, Type } from 'lucide-react'

// Helper function para cores
const getColors = () => [
  { name: 'Azul', value: 'blue', bg: 'bg-blue-50', border: 'border-blue-500', handle: 'bg-blue-500', shape: 'bg-blue-200', inner: 'bg-blue-300' },
  { name: 'Verde', value: 'green', bg: 'bg-green-50', border: 'border-green-500', handle: 'bg-green-500', shape: 'bg-green-200', inner: 'bg-green-300' },
  { name: 'Vermelho', value: 'red', bg: 'bg-red-50', border: 'border-red-500', handle: 'bg-red-500', shape: 'bg-red-200', inner: 'bg-red-300' },
  { name: 'Amarelo', value: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-500', handle: 'bg-yellow-500', shape: 'bg-yellow-200', inner: 'bg-yellow-300' },
  { name: 'Roxo', value: 'purple', bg: 'bg-purple-50', border: 'border-purple-500', handle: 'bg-purple-500', shape: 'bg-purple-200', inner: 'bg-purple-300' },
  { name: 'Laranja', value: 'orange', bg: 'bg-orange-50', border: 'border-orange-500', handle: 'bg-orange-500', shape: 'bg-orange-200', inner: 'bg-orange-300' },
  { name: 'Rosa', value: 'pink', bg: 'bg-pink-50', border: 'border-pink-500', handle: 'bg-pink-500', shape: 'bg-pink-200', inner: 'bg-pink-300' },
  { name: 'Cinza', value: 'gray', bg: 'bg-gray-50', border: 'border-gray-500', handle: 'bg-gray-500', shape: 'bg-gray-200', inner: 'bg-gray-300' },
]

// Helper component para handles em todos os lados
const AllSideHandles = ({ color }: { color: string }) => (
  <>
    <Handle 
      type="target" 
      position={Position.Top} 
      className={`w-3 h-3 ${color}`}
      id="top"
    />
    <Handle 
      type="source" 
      position={Position.Bottom} 
      className={`w-3 h-3 ${color}`}
      id="bottom"
    />
    <Handle 
      type="target" 
      position={Position.Left} 
      className={`w-3 h-3 ${color}`}
      id="left"
    />
    <Handle 
      type="source" 
      position={Position.Right} 
      className={`w-3 h-3 ${color}`}
      id="right"
    />
  </>
)

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

  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0]

  // Debug: verificar se o nó está selecionado (apenas quando selecionado)
  React.useEffect(() => {
    if (selected) {
      console.log('🔍 Nó selecionado:', selected, 'ID:', data.id)
    }
  }, [selected, data.id])

  // Atualizar editLabel quando data.label mudar
  React.useEffect(() => {
    setEditLabel(data.label)
  }, [data.label])

  const handleSave = () => {
    // console.log('💾 Salvando label:', editLabel)
    // console.log('🔗 onLabelChange existe?', !!onLabelChange)
    if (onLabelChange) {
      // console.log('📞 Chamando onLabelChange com:', editLabel)
      onLabelChange(editLabel)
    } else {
      console.error('❌ onLabelChange não está definido!')
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    // console.log('❌ Cancelando edição')
    setEditLabel(data.label)
    setIsEditing(false)
  }


  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[140px] transition-all relative group ${currentColor.bg} ${
      selected ? `${currentColor.border} shadow-blue-200` : 'border-gray-300 hover:border-gray-400'
    }`}>
      {children}
      
      {/* Action Button - APENAS EDITAR NOME */}
      <div className="absolute -top-2 -right-2 flex space-x-1 z-50">
        <Button
          size="sm"
          variant="ghost"
          className="w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 z-50"
          onClick={(e) => {
            e.stopPropagation()
            // console.log('✏️ Botão de editar clicado')
            setIsEditing(true)
          }}
          title="Editar nome"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>


      {/* Editable Label */}
      {isEditing ? (
        <div className="flex items-center space-x-1 mt-2">
          <Input
            value={editLabel}
            onChange={(e) => {
              // console.log('📝 Input mudou para:', e.target.value)
              setEditLabel(e.target.value)
            }}
            className="text-xs h-6"
            autoFocus
            onKeyDown={(e) => {
              // console.log('⌨️ Tecla pressionada:', e.key)
              if (e.key === 'Enter') {
                // console.log('✅ Enter pressionado, salvando...')
                handleSave()
              }
              if (e.key === 'Escape') {
                // console.log('❌ Escape pressionado, cancelando...')
                handleCancel()
              }
            }}
          />
          <Button size="sm" variant="ghost" className="w-4 h-4 p-0" onClick={() => {
            // console.log('✅ Botão salvar clicado')
            handleSave()
          }}>
            <Check className="w-3 h-3 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="w-4 h-4 p-0" onClick={() => {
            // console.log('❌ Botão cancelar clicado')
            handleCancel()
          }}>
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
export const ProcessNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0]
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
    </EditableNode>
  )
}

// Decision Node (Losango)
export const DecisionNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[2] // Default vermelho
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div 
        className={`w-16 h-16 ${currentColor.shape} flex items-center justify-center`}
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
      />
    </EditableNode>
  )
}

// Start/End Node (Oval)
export const StartEndNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[1] // Default verde
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-12 ${currentColor.shape} rounded-full flex items-center justify-center`}>
        <div className={`w-12 h-8 ${currentColor.inner} rounded-full`}></div>
      </div>
    </EditableNode>
  )
}

// Input/Output Node (Paralelogramo)
export const InputOutputNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[3] // Default amarelo
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div 
        className={`w-16 h-12 ${currentColor.shape} flex items-center justify-center`}
        style={{ 
          clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
        }}
      />
    </EditableNode>
  )
}

// Data Node (Cilindro)
export const DataNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[4] // Default roxo
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div 
        className={`w-16 h-12 ${currentColor.shape} flex items-center justify-center`}
        style={{ 
          clipPath: 'ellipse(50% 100% at 50% 0%)',
          borderRadius: '50% 50% 0 0'
        }}
      />
    </EditableNode>
  )
}

// Document Node (Retângulo com dobra)
export const DocumentNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0] // Default azul
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-12 ${currentColor.shape} relative`}>
        {/* Dobra do documento */}
        <div className={`absolute top-0 right-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] ${currentColor.inner}`}></div>
      </div>
    </EditableNode>
  )
}

// Connector Node (Círculo pequeno)
export const ConnectorNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[7] // Default cinza
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-8 h-8 ${currentColor.shape} rounded-full flex items-center justify-center`}>
        <div className={`w-2 h-2 ${currentColor.handle} rounded-full`}></div>
      </div>
    </EditableNode>
  )
}

// Database Node (Cilindro)
export const DatabaseNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[4] // Default roxo
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-12 ${currentColor.shape} rounded-t-lg relative`}>
        <div className={`absolute bottom-0 w-full h-8 ${currentColor.inner} rounded-b-full`}></div>
      </div>
    </EditableNode>
  )
}

// API Node (Hexágono)
export const ApiNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[5] // Default laranja
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-12 ${currentColor.shape} relative`} 
           style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
      </div>
    </EditableNode>
  )
}

// Timer Node (Círculo com relógio)
export const TimerNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[3] // Default amarelo
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-16 ${currentColor.shape} rounded-full flex items-center justify-center`}>
        <div className={`w-8 h-8 border-2 ${currentColor.handle} rounded-full relative`}>
          <div className={`absolute top-1 left-1/2 w-0.5 h-3 ${currentColor.handle} transform -translate-x-1/2`}></div>
          <div className={`absolute top-1/2 left-1/2 w-1 h-1 ${currentColor.handle} rounded-full transform -translate-x-1/2 -translate-y-1/2`}></div>
        </div>
      </div>
    </EditableNode>
  )
}

// User Node (Pessoa)
export const UserNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[1] // Default verde
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-12 h-16 ${currentColor.shape} rounded-full relative`}>
        <div className={`absolute top-2 left-1/2 w-6 h-6 ${currentColor.inner} rounded-full transform -translate-x-1/2`}></div>
        <div className={`absolute bottom-2 left-1/2 w-8 h-8 ${currentColor.inner} rounded-full transform -translate-x-1/2`}></div>
      </div>
    </EditableNode>
  )
}

// Cloud Node (Nuvem)
export const CloudNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0] // Default azul
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-10 ${currentColor.shape} rounded-full relative`}>
        <div className={`absolute -top-2 left-2 w-6 h-6 ${currentColor.shape} rounded-full`}></div>
        <div className={`absolute -top-1 right-2 w-8 h-8 ${currentColor.shape} rounded-full`}></div>
      </div>
    </EditableNode>
  )
}

// Loop Node (Setas circulares)
export const LoopNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0] // Default azul
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-12 h-12 ${currentColor.shape} rounded-full flex items-center justify-center`}>
        <div className={`w-8 h-8 border-2 ${currentColor.handle} rounded-full relative`}>
          <div className={`absolute top-0 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-${currentColor.handle.replace('bg-', '')} transform -translate-x-1/2`}></div>
        </div>
      </div>
    </EditableNode>
  )
}

// Blog Node
export const BlogNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0] // Default azul
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-12 ${currentColor.shape} rounded-lg flex items-center justify-center`}>
        <FileText className={`w-6 h-6 ${currentColor.handle}`} />
      </div>
    </EditableNode>
  )
}

// Site Node
export const SiteNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0] // Default azul
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-12 ${currentColor.shape} rounded-lg flex items-center justify-center`}>
        <Globe className={`w-6 h-6 ${currentColor.handle}`} />
      </div>
    </EditableNode>
  )
}

// Google Node
export const GoogleNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-blue-500" />
      <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-blue-100 shadow-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </EditableNode>
  )
}

// Google ADS Node
export const GoogleAdsNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-blue-500" />
      <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-blue-100 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <Target className="w-3 h-3 text-blue-500" />
        </div>
      </div>
    </EditableNode>
  )
}

// Facebook Node
export const FacebookNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-blue-600" />
      <div className="w-16 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
        <Facebook className="w-6 h-6 text-white" />
      </div>
    </EditableNode>
  )
}

// Meta ADS Node
export const MetaAdsNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-blue-600" />
      <div className="w-16 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
        <div className="flex flex-col items-center">
          <Facebook className="w-4 h-4 text-white" />
          <Target className="w-2 h-2 text-white" />
        </div>
      </div>
    </EditableNode>
  )
}

// Youtube Node
export const YoutubeNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-red-600" />
      <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
        <Youtube className="w-6 h-6 text-white" />
      </div>
    </EditableNode>
  )
}

// TikTok Node
export const TikTokNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-black" />
      <div className="w-16 h-12 bg-black rounded-lg flex items-center justify-center shadow-sm">
        <div className="text-white font-bold text-lg">T</div>
      </div>
    </EditableNode>
  )
}

// Instagram Node
export const InstagramNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-gradient-to-br from-purple-500 to-pink-500" />
      <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
        <Instagram className="w-6 h-6 text-white" />
      </div>
    </EditableNode>
  )
}

// IA Node
export const IANode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-purple-600" />
      <div className="w-16 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
        <Bot className="w-6 h-6 text-white" />
      </div>
    </EditableNode>
  )
}

// CRM Node
export const CRMNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[1] // Default verde
  
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color={currentColor.handle} />
      <div className={`w-16 h-12 ${currentColor.shape} rounded-lg flex items-center justify-center`}>
        <Users className={`w-6 h-6 ${currentColor.handle}`} />
      </div>
    </EditableNode>
  )
}

// Whatsapp Node
export const WhatsappNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  return (
    <EditableNode data={data} selected={selected} onLabelChange={onLabelChange}>
      <AllSideHandles color="bg-green-500" />
      <div className="w-16 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
        <MessageSquare className="w-6 h-6 text-white" />
      </div>
    </EditableNode>
  )
}

// Conteúdo Node (nó de texto editável)
export const ConteudoNode = ({ data, selected, onLabelChange }: { 
  data: any; 
  selected: boolean; 
  onLabelChange?: (label: string) => void;
}) => {
  const colors = getColors()
  const currentColor = colors.find(c => c.value === data.color) || colors[0] // Default azul
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(data.label || 'Digite o texto...')

  // Atualizar editLabel quando data.label mudar
  React.useEffect(() => {
    setEditLabel(data.label || 'Digite o texto...')
  }, [data.label])

  const handleSave = () => {
    if (onLabelChange) {
      onLabelChange(editLabel)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditLabel(data.label || 'Digite o texto...')
    setIsEditing(false)
  }

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[200px] transition-all relative group ${currentColor.bg} ${
      selected ? `${currentColor.border} shadow-blue-200` : 'border-gray-300 hover:border-gray-400'
    }`}>
      <AllSideHandles color={currentColor.handle} />
      
      {/* Botão de editar - apenas quando não estiver editando */}
      {!isEditing && (
        <div className="absolute -top-2 -right-2 flex space-x-1 z-50">
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 z-50"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            title="Editar texto"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Área de texto editável */}
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            className="text-sm h-8 w-full"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
              if (e.key === 'Escape') {
                handleCancel()
              }
            }}
            placeholder="Digite o texto..."
          />
          <div className="flex justify-end space-x-1">
            <Button size="sm" variant="ghost" className="w-6 h-6 p-0" onClick={handleSave}>
              <Check className="w-3 h-3 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" className="w-6 h-6 p-0" onClick={handleCancel}>
              <X className="w-3 h-3 text-red-600" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-[40px] flex items-center justify-center">
          <div className="text-sm text-gray-800 text-center break-words max-w-full">
            {data.label || 'Digite o texto...'}
          </div>
        </div>
      )}
    </div>
  )
}
