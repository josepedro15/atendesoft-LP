import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('🔍 API /api/flowcharts chamada:', req.method)
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
    )
    console.log('✅ Cliente Supabase criado')
    
    // Por enquanto, usar um ID de usuário fixo para teste
    const userId = '00000000-0000-0000-0000-000000000000'
    console.log('🆔 Usando userId fixo para teste:', userId)

    if (req.method === 'GET') {
      console.log('📋 Buscando TODOS os fluxogramas no banco de dados')
      
      const { data: flowcharts, error } = await supabase
        .from('flowcharts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('❌ Erro na query:', error)
        return res.status(500).json({ success: false, error: error.message })
      }

      console.log('✅ Fluxogramas encontrados (todos):', flowcharts?.length || 0)
      return res.status(200).json({ success: true, data: flowcharts })
    }
    
    if (req.method === 'POST') {
      console.log('📝 Criando novo fluxograma no banco de dados')
      const { title, description, data } = req.body
      
      const { data: newFlowchart, error } = await supabase
        .from('flowcharts')
        .insert([{
          title: title || 'Novo Fluxograma',
          description: description || '',
          data: data || { nodes: [], edges: [] },
          user_id: userId,
          is_template: false,
          is_public: false
        }])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Erro ao criar:', error)
        return res.status(500).json({ success: false, error: error.message })
      }
      
      console.log('✅ Fluxograma criado no banco:', newFlowchart.id)
      return res.status(201).json({ success: true, data: newFlowchart })
    }
    
    if (req.method === 'PUT') {
      console.log('📝 Atualizando fluxograma no banco de dados')
      const { id } = req.query
      const { title, description, data } = req.body
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'ID do fluxograma é obrigatório' })
      }
      
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
      const { id } = req.query
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'ID do fluxograma é obrigatório' })
      }
      
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