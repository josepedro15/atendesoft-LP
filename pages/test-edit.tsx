import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { ProcessNode } from '@/components/flowchart/CustomNodes'

function TestEditContent() {
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste dos Botões de Edição</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Nó de Teste</h2>
          <div className="flex justify-center">
            <ProcessNode 
              data={nodeData} 
              selected={true}
              onLabelChange={handleLabelChange}
              onColorChange={handleColorChange}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Estado Atual</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {nodeData.id}</p>
            <p><strong>Label:</strong> {nodeData.label}</p>
            <p><strong>Color:</strong> {nodeData.color}</p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Instruções:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Clique no botão azul (✏️) para editar o nome</li>
            <li>Clique no botão roxo (🎨) para mudar a cor</li>
            <li>Clique no nome do nó para editar diretamente</li>
            <li>Abra o console (F12) para ver os logs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function TestEdit() {
  return (
    <ReactFlowProvider>
      <TestEditContent />
    </ReactFlowProvider>
  )
}