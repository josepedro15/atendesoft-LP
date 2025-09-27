import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useFlowcharts } from '@/contexts/FlowchartsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function FlowchartsList() {
  const router = useRouter()
  const { flowcharts, loading, error, deleteFlowchart, refreshFlowcharts } = useFlowcharts()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Atualizar lista quando a página for focada (voltar do editor)
  useEffect(() => {
    const handleFocus = () => {
      refreshFlowcharts()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshFlowcharts])

  // Atualizar lista quando a página for carregada
  useEffect(() => {
    refreshFlowcharts()
  }, [refreshFlowcharts])

  const filteredFlowcharts = flowcharts.filter(flowchart =>
    flowchart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (flowchart.description && flowchart.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateNew = () => {
    router.push('/fluxogramas/editor')
  }

  const handleEdit = (id: string) => {
    router.push(`/fluxogramas/editor?id=${id}`)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar o fluxograma "${title}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      const success = await deleteFlowchart(id)
      if (success) {
        // Fluxograma deletado com sucesso
      }
    } catch (error) {
      console.error('Erro ao deletar fluxograma:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleView = (id: string) => {
    // TODO: Implementar visualização de fluxograma
    console.log('Visualizar fluxograma:', id)
  }

  if (loading && flowcharts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando fluxogramas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Fluxogramas</h1>
              <p className="text-gray-600 mt-2">
                Crie e gerencie seus fluxogramas de processos
              </p>
            </div>
            <Button onClick={handleCreateNew} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Fluxograma</span>
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar fluxogramas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Flowcharts Grid */}
        {filteredFlowcharts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum fluxograma encontrado' : 'Nenhum fluxograma criado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Tente ajustar os termos de busca'
                : 'Comece criando seu primeiro fluxograma'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateNew} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Criar Primeiro Fluxograma</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlowcharts.map((flowchart) => (
              <Card key={flowchart.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {flowchart.title}
                      </CardTitle>
                      {flowchart.description && (
                        <CardDescription className="mt-2 line-clamp-2">
                          {flowchart.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1 ml-2">
                      {flowchart.is_template && (
                        <Badge variant="secondary" className="text-xs">
                          Template
                        </Badge>
                      )}
                      {flowchart.is_public && (
                        <Badge variant="outline" className="text-xs">
                          Público
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {flowchart.data?.nodes?.length || 0} nós
                      </span>
                      <span>
                        {flowchart.data?.edges?.length || 0} conexões
                      </span>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Atualizado {formatDistanceToNow(new Date(flowchart.updated_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(flowchart.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(flowchart.id)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(flowchart.id, flowchart.title)}
                        disabled={deletingId === flowchart.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deletingId === flowchart.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {flowcharts.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={refreshFlowcharts}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Atualizar Lista</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FlowchartsPage() {
  return (
    <ProtectedRoute>
      <FlowchartsList />
    </ProtectedRoute>
  )
}
