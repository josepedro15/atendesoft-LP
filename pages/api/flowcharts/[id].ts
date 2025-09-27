import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

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
      console.log('📋 Buscando fluxograma específico no banco de dados')
      
      const { data: flowchart, error } = await supabase
        .from('flowcharts')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('❌ Erro na query:', error)
        return res.status(500).json({ success: false, error: error.message })
      }
      
      if (!flowchart) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      console.log('✅ Fluxograma encontrado:', flowchart.title)
      return res.status(200).json({ success: true, data: flowchart })
    }
    
    if (req.method === 'PUT') {
      console.log('📝 Atualizando fluxograma no banco de dados')
      const { title, description, data } = req.body
      
      const { data: updatedFlowchart, error } = await supabase
        .from('flowcharts')
        .update({
          title: title || undefined,
          description: description || undefined,
          data: data || undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Erro ao atualizar:', error)
        return res.status(500).json({ success: false, error: error.message })
      }
      
      if (!updatedFlowchart) {
        return res.status(404).json({ success: false, error: 'Fluxograma não encontrado' })
      }
      
      console.log('✅ Fluxograma atualizado no banco:', id)
      return res.status(200).json({ success: true, data: updatedFlowchart })
    }
    
    if (req.method === 'DELETE') {
      console.log('🗑️ Deletando fluxograma do banco de dados')
      
      const { error } = await supabase
        .from('flowcharts')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ Erro ao deletar:', error)
        return res.status(500).json({ success: false, error: error.message })
      }
      
      console.log('✅ Fluxograma deletado do banco:', id)
      return res.status(200).json({ success: true, message: 'Fluxograma deletado com sucesso' })
    }
    
    return res.status(405).json({ success: false, error: 'Método não permitido' })
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return res.status(500).json({ success: false, error: 'Erro interno do servidor' })
  }
}