import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MousePointer2,
  Square,
  Type,
  Palette,
  Undo,
  Redo,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
  MoreHorizontal,
  Present,
  Share2,
  Users,
  MessageCircle,
  Video,
  Clock
} from 'lucide-react'
import { motion } from 'motion/react'

interface MiroToolbarProps {
  onToolSelect: (tool: string) => void
  onUndo: () => void
  onRedo: () => void
  onCopy: () => void
  onDelete: () => void
  onLock: () => void
  onUnlock: () => void
  onPresent: () => void
  onShare: () => void
  canUndo: boolean
  canRedo: boolean
  hasSelection: boolean
  isLocked: boolean
  selectedTool: string
  fontSize: number
  onFontSizeChange: (size: number) => void
  selectedColor: string
  onColorChange: (color: string) => void
}

const colors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
  '#ffffff', '#000000', '#6b7280', '#e5e7eb'
]

export default function MiroToolbar({
  onToolSelect,
  onUndo,
  onRedo,
  onCopy,
  onDelete,
  onLock,
  onUnlock,
  onPresent,
  onShare,
  canUndo,
  canRedo,
  hasSelection,
  isLocked,
  selectedTool,
  fontSize,
  onFontSizeChange,
  selectedColor,
  onColorChange
}: MiroToolbarProps) {
  const [showColorPalette, setShowColorPalette] = useState(false)
  const [showTextOptions, setShowTextOptions] = useState(false)

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Selecionar' },
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'text', icon: Type, label: 'Texto' },
  ]

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-2 flex items-center space-x-2">
        
        {/* Ferramentas Principais */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolSelect(tool.id)}
              className="w-10 h-10 p-0"
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Opções de Texto */}
        {selectedTool === 'text' && (
          <div className="flex items-center space-x-2 border-r border-gray-200 pr-2">
            <Input
              type="text"
              placeholder="Roobert"
              className="w-20 h-8 text-xs"
            />
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFontSizeChange(Math.max(8, fontSize - 2))}
                className="w-6 h-6 p-0"
              >
                -
              </Button>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-12 h-8 text-xs text-center"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFontSizeChange(Math.min(72, fontSize + 2))}
                className="w-6 h-6 p-0"
              >
                +
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <span className="font-bold text-sm">B</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <span className="italic text-sm">I</span>
            </Button>
          </div>
        )}

        {/* Paleta de Cores */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPalette(!showColorPalette)}
            className="w-8 h-8 p-0 relative"
          >
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: selectedColor }}
            />
          </Button>
          
          {showColorPalette && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
            >
              <div className="grid grid-cols-4 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onColorChange(color)
                      setShowColorPalette(false)
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="w-8 h-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="w-8 h-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            disabled={!hasSelection}
            className="w-8 h-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={!hasSelection}
            className="w-8 h-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Bloqueio */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={isLocked ? onUnlock : onLock}
            className="w-8 h-8 p-0"
          >
            {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
        </div>

        {/* IA */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>

        {/* Mais Opções */}
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        {/* Usuário */}
        <div className="flex items-center space-x-2 border-l border-gray-200 pl-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-blue-500 text-white rounded-full"
          >
            J
          </Button>
        </div>

        {/* Apresentar */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPresent}
          className="h-8 px-3"
        >
          <Present className="h-4 w-4 mr-1" />
          Apresentar
        </Button>

        {/* Compartilhar */}
        <Button
          size="sm"
          onClick={onShare}
          className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Compartilhar
        </Button>
      </div>
    </motion.div>
  )
}
