import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { tempStorage } from '@/lib/temp-storage'

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
      
      const flowchart = tempStorage.getById(id)
      
      if (!flowchart) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      console.log('✅ Fluxograma encontrado:', flowchart.title)
      return res.status(200).json({ success: true, data: flowchart })
    }
    
    if (req.method === 'PUT') {
      console.log('📝 Atualizando fluxograma (armazenamento temporário)')
      const { title, description, data } = req.body
      
      const updatedFlowchart = tempStorage.update(id, {
        title: title || undefined,
        description: description || undefined,
        data: data || undefined
      })
      
      if (!updatedFlowchart) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      console.log('✅ Fluxograma atualizado (temporário):', id)
      return res.status(200).json({ success: true, data: updatedFlowchart })
    }
    
    if (req.method === 'DELETE') {
      console.log('🗑️ Deletando fluxograma (armazenamento temporário)')
      
      const success = tempStorage.delete(id)
      if (!success) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      console.log('✅ Fluxograma deletado (temporário):', id)
      return res.status(200).json({ success: true, message: 'Fluxograma deletado com sucesso' })
    }
    
    return res.status(405).json({ success: false, error: 'Método não permitido' })
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return res.status(500).json({ success: false, error: 'Erro interno do servidor' })
  }
}