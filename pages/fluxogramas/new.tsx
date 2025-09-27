import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

export default function NewFlowchartPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return

    setIsLoading(true)
    try {
      // Simular criação de fluxograma
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirecionar para o editor
      const newId = 'new-' + Date.now()
      router.push(`/fluxogramas/${newId}`)
    } catch (error) {
      console.error('Erro ao criar fluxograma:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/fluxogramas')
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Novo Fluxograma</h1>
          <p className="text-gray-600 mt-2">Crie um novo fluxograma personalizado</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do fluxograma"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito do fluxograma (opcional)"
              className="w-full"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Criando...' : 'Criar Fluxograma'}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
