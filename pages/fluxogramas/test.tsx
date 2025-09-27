import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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

function FlowchartsTestPage() {
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
    flowchart.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este fluxograma?')) return

    setDeletingId(id)
    try {
      const success = await deleteFlowchart(id)
      if (success) {
        console.log('✅ Fluxograma deletado com sucesso')
      } else {
        console.error('❌ Falha ao deletar fluxograma')
      }
    } catch (error) {
      console.error('❌ Erro ao deletar fluxograma:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/fluxogramas/editor?id=${id}`)
  }

  const handleCreateNew = () => {
    router.push('/fluxogramas/editor')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Meus Fluxogramas</h1>
              <p className="text-muted-foreground mt-2">
                Crie e gerencie seus fluxogramas de processos
              </p>
            </div>
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Fluxograma
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar fluxogramas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando fluxogramas...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFlowcharts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">
                {searchTerm ? 'Nenhum fluxograma encontrado' : 'Nenhum fluxograma criado'}
              </CardTitle>
              <CardDescription className="mb-6">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece criando seu primeiro fluxograma'
                }
              </CardDescription>
              {!searchTerm && (
                <Button onClick={handleCreateNew} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Fluxograma
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Flowcharts Grid */}
        {!loading && filteredFlowcharts.length > 0 && (
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
                        <CardDescription className="mt-2 line-clamp-3">
                          {flowchart.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
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
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(flowchart.updated_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(flowchart.id)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(flowchart.id)}
                      disabled={deletingId === flowchart.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {deletingId === flowchart.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FlowchartsTestPage
