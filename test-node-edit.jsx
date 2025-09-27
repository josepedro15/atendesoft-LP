import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Palette } from 'lucide-react'

// Componente de teste simples
export default function TestNodeEdit() {
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState('Teste')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [currentColor, setCurrentColor] = useState('blue')

  const colors = [
    { name: 'Azul', value: 'blue', bg: 'bg-blue-50' },
    { name: 'Verde', value: 'green', bg: 'bg-green-50' },
    { name: 'Vermelho', value: 'red', bg: 'bg-red-50' },
  ]

  const handleSave = () => {
    console.log('💾 TESTE: Salvando label:', editLabel)
    setIsEditing(false)
  }

  const handleColorSelect = (color) => {
    console.log('🎨 TESTE: Selecionando cor:', color.value)
    setCurrentColor(color.value)
    setShowColorPicker(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Teste de Edição de Nó</h1>
      
      <div className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[140px] transition-all relative group ${colors.find(c => c.value === currentColor)?.bg || 'bg-blue-50'}`}>
        <div className="absolute -top-2 -right-2 flex space-x-1 z-50">
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 z-50"
            onClick={() => {
              console.log('✏️ TESTE: Botão de editar clicado')
              setIsEditing(true)
            }}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 z-50"
            onClick={() => {
              console.log('🎨 TESTE: Botão de cor clicado')
              setShowColorPicker(!showColorPicker)
            }}
          >
            <Palette className="w-3 h-3" />
          </Button>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50">
            <div className="grid grid-cols-3 gap-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`w-6 h-6 rounded border-2 ${
                    currentColor === color.value ? 'border-gray-800' : 'border-gray-300'
                  } ${color.bg}`}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                />
              ))}
            </div>
          </div>
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
                if (e.key === 'Escape') {
                  setEditLabel('Teste')
                  setIsEditing(false)
                }
              }}
            />
            <Button size="sm" variant="ghost" className="w-4 h-4 p-0" onClick={handleSave}>
              ✓
            </Button>
            <Button size="sm" variant="ghost" className="w-4 h-4 p-0" onClick={() => {
              setEditLabel('Teste')
              setIsEditing(false)
            }}>
              ✗
            </Button>
          </div>
        ) : (
          <div className="font-semibold text-sm text-gray-800 text-center">
            {editLabel}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p>Status:</p>
        <p>Editando: {isEditing ? 'Sim' : 'Não'}</p>
        <p>Color Picker: {showColorPicker ? 'Aberto' : 'Fechado'}</p>
        <p>Cor atual: {currentColor}</p>
        <p>Label atual: {editLabel}</p>
      </div>
    </div>
  )
}
