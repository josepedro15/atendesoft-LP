import React from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'

export default function FlowchartsPage() {
  const router = useRouter()

  const handleCreateNew = () => {
    router.push('/fluxogramas/new')
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fluxogramas</h1>
            <p className="text-gray-600 mt-2">Crie e gerencie seus fluxogramas</p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Fluxograma
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de exemplo */}
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-500">Há 2 dias</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fluxograma de Exemplo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Um exemplo de fluxograma para demonstrar as funcionalidades
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/fluxogramas/example')}
            >
              Abrir
            </Button>
          </div>

          {/* Card para criar novo */}
          <div 
            className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={handleCreateNew}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Plus className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">Criar Novo</h3>
              <p className="text-sm text-gray-500">
                Comece um novo fluxograma do zero
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
