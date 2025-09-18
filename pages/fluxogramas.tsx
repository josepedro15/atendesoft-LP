import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Save, 
  Download, 
  Share2, 
  Settings, 
  Trash2,
  Eye,
  Edit,
  Copy,
  FileText,
  Workflow,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import { motion } from 'motion/react'

interface Flowchart {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  nodes: any[]
  edges: any[]
  isTemplate?: boolean
}

function FluxogramasContent() {
  const router = useRouter()
  const [flowcharts, setFlowcharts] = useState<Flowchart[]>([
    {
      id: '1',
      title: 'Processo de Onboarding',
      description: 'Fluxo completo de integração de novos funcionários',
      createdAt: '2025-01-18',
      updatedAt: '2025-01-18',
      nodes: [],
      edges: []
    },
    {
      id: '2',
      title: 'Workflow de Vendas',
      description: 'Processo de qualificação e conversão de leads',
      createdAt: '2025-01-17',
      updatedAt: '2025-01-18',
      nodes: [],
      edges: []
    },
    {
      id: '3',
      title: 'Template - Decisão Simples',
      description: 'Modelo básico para fluxos de decisão',
      createdAt: '2025-01-16',
      updatedAt: '2025-01-16',
      nodes: [],
      edges: [],
      isTemplate: true
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)

  const handleCreateNew = () => {
    router.push('/fluxogramas/editor')
  }

  const handleEdit = (id: string) => {
    router.push(`/fluxogramas/editor?id=${id}`)
  }

  const handleDuplicate = (flowchart: Flowchart) => {
    const newFlowchart = {
      ...flowchart,
      id: Date.now().toString(),
      title: `${flowchart.title} (Cópia)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isTemplate: false
    }
    setFlowcharts([newFlowchart, ...flowcharts])
  }

  const handleDelete = (id: string) => {
    setFlowcharts(flowcharts.filter(f => f.id !== id))
  }

  const filteredFlowcharts = flowcharts.filter(flowchart => {
    const matchesSearch = flowchart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flowchart.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTemplate = showTemplates ? flowchart.isTemplate : !flowchart.isTemplate
    return matchesSearch && matchesTemplate
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image 
                src="/LOGO HOME.svg" 
                alt="AtendeSoft" 
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <Badge variant="secondary" className="ml-2">
                Fluxogramas
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline" 
                size="sm"
              >
                Dashboard
              </Button>
              <Button 
                onClick={handleCreateNew}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Fluxograma
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Módulo de Fluxogramas
          </h1>
          <p className="text-muted-foreground">
            Crie, edite e compartilhe fluxogramas de forma visual e colaborativa
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Fluxogramas
                    </p>
                    <p className="text-2xl font-bold">{flowcharts.length}</p>
                  </div>
                  <Workflow className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Templates
                    </p>
                    <p className="text-2xl font-bold">
                      {flowcharts.filter(f => f.isTemplate).length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Colaborações
                    </p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Share2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Exportações
                    </p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                  <Download className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Buscar fluxogramas</Label>
            <Input
              id="search"
              placeholder="Digite o nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant={showTemplates ? "default" : "outline"}
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <Zap className="h-4 w-4 mr-2" />
              {showTemplates ? 'Meus Fluxogramas' : 'Templates'}
            </Button>
          </div>
        </div>

        {/* Flowcharts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlowcharts.map((flowchart, index) => (
            <motion.div
              key={flowchart.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {flowchart.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {flowchart.description}
                      </CardDescription>
                    </div>
                    {flowchart.isTemplate && (
                      <Badge variant="secondary" className="ml-2">
                        Template
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p>Criado em: {new Date(flowchart.createdAt).toLocaleDateString('pt-BR')}</p>
                      <p>Atualizado em: {new Date(flowchart.updatedAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(flowchart.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(flowchart)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(flowchart.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(flowchart.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Abrir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredFlowcharts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Workflow className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Nenhum fluxograma encontrado' : 'Nenhum fluxograma criado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Tente ajustar os termos de busca'
                : 'Comece criando seu primeiro fluxograma'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateNew} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Fluxograma
              </Button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default function Fluxogramas() {
  return (
    <ProtectedRoute>
      <FluxogramasContent />
    </ProtectedRoute>
  )
}
