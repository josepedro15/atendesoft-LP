import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { ProcessNode, DecisionNode, StartEndNode, DataNode } from '@/components/flowchart/SimpleNodes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function TestSimpleNodesContent() {
  const [nodeData, setNodeData] = useState({
    id: 'test-1',
    label: 'Nó de Teste',
    color: 'blue'
  })

  const handleLabelChange = (label: string) => {
    console.log('🔥 TESTE: Label mudou para:', label)
    setNodeData(prev => ({ ...prev, label }))
  }

  const handleColorChange = (color: string) => {
    console.log('🔥 TESTE: Cor mudou para:', color)
    setNodeData(prev => ({ ...prev, color }))
  }

  const testNodes = [
    { type: 'Processo', component: ProcessNode },
    { type: 'Decisão', component: DecisionNode },
    { type: 'Início/Fim', component: StartEndNode },
    { type: 'Dados', component: DataNode },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste dos Novos Nós Simplificados</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testNodes.map(({ type, component: NodeComponent }, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Nó de {type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <NodeComponent 
                    data={nodeData} 
                    selected={true}
                    onLabelChange={handleLabelChange}
                    onColorChange={handleColorChange}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>ID:</strong> {nodeData.id}</p>
                  <p><strong>Label:</strong> {nodeData.label}</p>
                  <p><strong>Color:</strong> {nodeData.color}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instruções de Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Para testar a edição:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Clique no nome do nó para editar</li>
                  <li>Use os botões de edição (lápis e paleta)</li>
                  <li>Pressione Enter para salvar ou Escape para cancelar</li>
                  <li>Abra o console (F12) para ver os logs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Teste de cores:</h3>
                <div className="flex space-x-2">
                  {['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray'].map(color => (
                    <Button
                      key={color}
                      size="sm"
                      variant="outline"
                      onClick={() => handleColorChange(color)}
                      className="text-xs"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Teste de labels:</h3>
                <div className="flex space-x-2">
                  {['Novo Nome', 'Processo Importante', 'Decisão Crítica', 'Fim do Fluxo'].map(label => (
                    <Button
                      key={label}
                      size="sm"
                      variant="outline"
                      onClick={() => handleLabelChange(label)}
                      className="text-xs"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/simple-editor'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ir para Editor Completo
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function TestSimpleNodes() {
  return (
    <ReactFlowProvider>
      <TestSimpleNodesContent />
    </ReactFlowProvider>
  )
}
