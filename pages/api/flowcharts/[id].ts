import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID é obrigatório' })
  }

  if (req.method === 'GET') {
    // Buscar fluxograma específico
    try {
      const { data, error } = await supabase
        .from('flowcharts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) {
        return res.status(404).json({ error: 'Fluxograma não encontrado' })
      }

      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar fluxograma' })
    }
  } else if (req.method === 'PUT') {
    // Atualizar fluxograma
    try {
      const { title, description, data, is_template, is_public } = req.body

      const updates: any = {
        updated_at: new Date().toISOString(),
      }

      if (title !== undefined) updates.title = title
      if (description !== undefined) updates.description = description
      if (data !== undefined) updates.data = data
      if (is_template !== undefined) updates.is_template = is_template
      if (is_public !== undefined) updates.is_public = is_public

      const { data: result, error } = await supabase
        .from('flowcharts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar fluxograma' })
    }
  } else if (req.method === 'DELETE') {
    // Deletar fluxograma
    try {
      const { error } = await supabase
        .from('flowcharts')
        .delete()
        .eq('id', id)

      if (error) throw error

      res.status(200).json({ message: 'Fluxograma deletado com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar fluxograma' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).json({ error: 'Método não permitido' })
  }
}
