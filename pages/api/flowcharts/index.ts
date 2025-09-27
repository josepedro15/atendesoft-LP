import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Armazenamento temporário em memória (será perdido quando o servidor reiniciar)
let tempFlowcharts: any[] = []

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
      console.log('📋 Buscando fluxogramas (armazenamento temporário)')
      
      // Por enquanto, usar armazenamento temporário
      console.log('✅ Fluxogramas encontrados:', tempFlowcharts.length)
      return res.status(200).json({ success: true, data: tempFlowcharts })
    }
    
    if (req.method === 'POST') {
      console.log('📝 Criando novo fluxograma (armazenamento temporário)')
      const { title, description, data } = req.body
      
      // Criar novo fluxograma no armazenamento temporário
      const newFlowchart = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title || 'Novo Fluxograma',
        description: description || '',
        data: data || { nodes: [], edges: [] },
        user_id: userId,
        is_template: false,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      tempFlowcharts.push(newFlowchart)
      
      console.log('✅ Fluxograma criado (temporário):', newFlowchart.id)
      return res.status(201).json({ success: true, data: newFlowchart })
    }
    
    if (req.method === 'PUT') {
      console.log('📝 Atualizando fluxograma (armazenamento temporário)')
      const { id } = req.query
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
      const { id } = req.query
      
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