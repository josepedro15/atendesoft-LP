import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase-server'
import { createSuccessResponse, createErrorResponse, handleApiError } from '@/lib/errors'

interface FlowchartData {
  title: string
  description?: string
  data: {
    nodes: any[]
    edges: any[]
    metadata?: any
  }
  is_template?: boolean
  is_public?: boolean
}

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado'))
    }

    switch (req.method) {
      case 'GET':
        return await handleGetFlowcharts(req, res, supabase, user.id)
      case 'POST':
        return await handleCreateFlowchart(req, res, supabase, user.id)
      default:
        return res.status(405).json(createErrorResponse('Método não permitido'))
    }
  } catch (error) {
    const { status } = handleApiError(error)
    return res.status(status).json(createErrorResponse(error))
  }
}

async function handleGetFlowcharts(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>, 
  supabase: any, 
  userId: string
) {
  try {
    const { is_template, is_public } = req.query

    let query = supabase
      .from('flowcharts')
      .select('*')
      .order('updated_at', { ascending: false })

    // Se não for template público, filtrar por usuário
    if (is_template !== 'true' || is_public !== 'true') {
      query = query.eq('user_id', userId)
    }

    // Filtrar por template se especificado
    if (is_template === 'true') {
      query = query.eq('is_template', true)
    }

    // Filtrar por público se especificado
    if (is_public === 'true') {
      query = query.eq('is_public', true)
    }

    const { data: flowcharts, error } = await query

    if (error) {
      throw new Error(`Erro ao buscar fluxogramas: ${error.message}`)
    }

    return res.status(200).json(createSuccessResponse(
      flowcharts,
      'Fluxogramas carregados com sucesso'
    ))

  } catch (error) {
    const { status } = handleApiError(error)
    return res.status(status).json(createErrorResponse(error))
  }
}

async function handleCreateFlowchart(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>, 
  supabase: any, 
  userId: string
) {
  try {
    const flowchartData: FlowchartData = req.body

    // Validar dados obrigatórios
    if (!flowchartData.title || !flowchartData.data) {
      return res.status(400).json(createErrorResponse('Título e dados são obrigatórios'))
    }

    // Criar fluxograma no Supabase
    const { data: newFlowchart, error } = await supabase
      .from('flowcharts')
      .insert({
        user_id: userId,
        title: flowchartData.title,
        description: flowchartData.description || '',
        data: flowchartData.data,
        is_template: flowchartData.is_template || false,
        is_public: flowchartData.is_public || false,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar fluxograma: ${error.message}`)
    }

    return res.status(201).json(createSuccessResponse(
      newFlowchart,
      'Fluxograma criado com sucesso'
    ))

  } catch (error) {
    const { status } = handleApiError(error)
    return res.status(status).json(createErrorResponse(error))
  }
}
