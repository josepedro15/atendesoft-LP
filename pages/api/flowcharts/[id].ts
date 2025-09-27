import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Armazenamento temporário em memória (será perdido quando o servidor reiniciar)
let tempFlowcharts: any[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('🔍 API /api/flowcharts/[id] chamada:', req.method)
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
    )
    console.log('✅ Cliente Supabase criado')
    
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'ID do fluxograma é obrigatório' })
    }

    console.log('🆔 Buscando fluxograma com ID:', id)

    if (req.method === 'GET') {
      console.log('📋 Buscando fluxograma específico (armazenamento temporário)')
      
      // Buscar no armazenamento temporário
      const flowchart = tempFlowcharts.find(f => f.id === id)
      
      if (!flowchart) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      console.log('✅ Fluxograma encontrado:', flowchart.title)
      return res.status(200).json({ success: true, data: flowchart })
    }
    
    if (req.method === 'PUT') {
      console.log('📝 Atualizando fluxograma (armazenamento temporário)')
      const { title, description, data } = req.body
      
      const index = tempFlowcharts.findIndex(f => f.id === id)
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      tempFlowcharts[index] = {
        ...tempFlowcharts[index],
        title: title || tempFlowcharts[index].title,
        description: description || tempFlowcharts[index].description,
        data: data || tempFlowcharts[index].data,
        updated_at: new Date().toISOString()
      }
      
      console.log('✅ Fluxograma atualizado (temporário):', id)
      return res.status(200).json({ success: true, data: tempFlowcharts[index] })
    }
    
    if (req.method === 'DELETE') {
      console.log('🗑️ Deletando fluxograma (armazenamento temporário)')
      
      const index = tempFlowcharts.findIndex(f => f.id === id)
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      tempFlowcharts.splice(index, 1)
      
      console.log('✅ Fluxograma deletado (temporário):', id)
      return res.status(200).json({ success: true, message: 'Fluxograma deletado com sucesso' })
    }
    
    return res.status(405).json({ success: false, error: 'Método não permitido' })
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return res.status(500).json({ success: false, error: 'Erro interno do servidor' })
  }
}