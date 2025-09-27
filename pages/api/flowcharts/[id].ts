import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase-server'
import { createSuccessResponse, createErrorResponse, handleApiError } from '@/lib/errors'

interface FlowchartData {
  title?: string
  description?: string
  data?: {
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
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json(createErrorResponse('ID do fluxograma é obrigatório'))
    }

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado'))
    }

    switch (req.method) {
      case 'GET':
        return await handleGetFlowchart(req, res, supabase, id, user.id)
      case 'PUT':
        return await handleUpdateFlowchart(req, res, supabase, id, user.id)
      case 'DELETE':
        return await handleDeleteFlowchart(req, res, supabase, id, user.id)
      default:
        return res.status(405).json(createErrorResponse('Método não permitido'))
    }
  } catch (error) {
    const { status } = handleApiError(error)
    return res.status(status).json(createErrorResponse(error))
  }
}

async function handleGetFlowchart(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>, 
  supabase: any, 
  flowchartId: string,
  userId: string
) {
  try {
    const { data: flowchart, error } = await supabase
      .from('flowcharts')
      .select('*')
      .eq('id', flowchartId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json(createErrorResponse('Fluxograma não encontrado'))
      }
      throw new Error(`Erro ao buscar fluxograma: ${error.message}`)
    }

    // Verificar se o usuário tem permissão para ver o fluxograma
    if (flowchart.user_id !== userId && !flowchart.is_public) {
      return res.status(403).json(createErrorResponse('Acesso negado'))
    }

    return res.status(200).json(createSuccessResponse(
      flowchart,
      'Fluxograma carregado com sucesso'
    ))

  } catch (error) {
    const { status } = handleApiError(error)
    return res.status(status).json(createErrorResponse(error))
  }
}

async function handleUpdateFlowchart(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>, 
  supabase: any, 
  flowchartId: string,
  userId: string
) {
  try {
    const flowchartData: FlowchartData = req.body

    // Verificar se o fluxograma existe e pertence ao usuário
    const { data: existingFlowchart, error: fetchError } = await supabase
      .from('flowcharts')
      .select('user_id')
      .eq('id', flowchartId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json(createErrorResponse('Fluxograma não encontrado'))
      }
      throw new Error(`Erro ao buscar fluxograma: ${fetchError.message}`)
    }

    if (existingFlowchart.user_id !== userId) {
      return res.status(403).json(createErrorResponse('Acesso negado'))
    }

    // Atualizar fluxograma
    const updateData: any = {}
    if (flowchartData.title !== undefined) updateData.title = flowchartData.title
    if (flowchartData.description !== undefined) updateData.description = flowchartData.description
    if (flowchartData.data !== undefined) updateData.data = flowchartData.data
    if (flowchartData.is_template !== undefined) updateData.is_template = flowchartData.is_template
    if (flowchartData.is_public !== undefined) updateData.is_public = flowchartData.is_public

    const { data: updatedFlowchart, error } = await supabase
      .from('flowcharts')
      .update(updateData)
      .eq('id', flowchartId)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar fluxograma: ${error.message}`)
    }

    return res.status(200).json(createSuccessResponse(
      updatedFlowchart,
      'Fluxograma atualizado com sucesso'
    ))

  } catch (error) {
    const { status } = handleApiError(error)
    return res.status(status).json(createErrorResponse(error))
  }
}

async function handleDeleteFlowchart(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>, 
  supabase: any, 
  flowchartId: string,
  userId: string
) {
  try {
    // Verificar se o fluxograma existe e pertence ao usuário
    const { data: existingFlowchart, error: fetchError } = await supabase
      .from('flowcharts')
      .select('user_id')
      .eq('id', flowchartId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json(createErrorResponse('Fluxograma não encontrado'))
      }
      throw new Error(`Erro ao buscar fluxograma: ${fetchError.message}`)
    }

    if (existingFlowchart.user_id !== userId) {
      return res.status(403).json(createErrorResponse('Acesso negado'))
    }

    // Deletar fluxograma
    const { error } = await supabase
      .from('flowcharts')
      .delete()
      .eq('id', flowchartId)

    if (error) {
      throw new Error(`Erro ao deletar fluxograma: ${error.message}`)
    }

    return res.status(200).json(createSuccessResponse(
      null,
      'Fluxograma deletado com sucesso'
    ))

  } catch (error) {
    const { status } = handleApiError(error)
    return res.status(status).json(createErrorResponse(error))
  }
}
