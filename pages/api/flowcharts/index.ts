import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Listar fluxogramas
    try {
      const { data, error } = await supabase
        .from('flowcharts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error

      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar fluxogramas' })
    }
  } else if (req.method === 'POST') {
    // Criar novo fluxograma
    try {
      const { title, description, is_template = false, is_public = false } = req.body

      if (!title) {
        return res.status(400).json({ error: 'Título é obrigatório' })
      }

      const newFlowchart = {
        title,
        description,
        data: {
          nodes: [],
          edges: [],
          metadata: {
            title,
            description,
            version: '2.0',
            created_by: 'user', // TODO: Pegar do auth
            last_modified_by: 'user',
          }
        },
        is_template,
        is_public,
        user_id: 'user', // TODO: Pegar do auth
        version: 1,
      }

      const { data, error } = await supabase
        .from('flowcharts')
        .insert([newFlowchart])
        .select()
        .single()

      if (error) throw error

      res.status(201).json(data)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar fluxograma' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: 'Método não permitido' })
  }
}
