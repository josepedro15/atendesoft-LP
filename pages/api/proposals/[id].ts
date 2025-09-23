// API para operações específicas de uma proposta
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ApiResponse } from '@/types/proposals';

// Usa a mesma lógica do sistema de autenticação
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'ID da proposta é obrigatório'
    });
  }

  switch (req.method) {
    case 'GET':
      return handleGetProposal(req, res, id);
    case 'PATCH':
      return handleUpdateProposal(req, res, id);
    case 'DELETE':
      return handleDeleteProposal(req, res, id);
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function handleGetProposal(req: NextApiRequest, res: NextApiResponse<ApiResponse>, id: string) {
  try {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select(`
        *,
        client:clients(*),
        versions:proposal_versions(
          *,
          items:proposal_version_items(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Proposta não encontrada'
        });
      }
      
      console.error('Erro ao buscar proposta:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }

    // Adicionar versão mais recente
    const proposalWithLatestVersion = {
      ...proposal,
      latest_version: proposal.versions?.[0]
    };

    res.status(200).json({
      success: true,
      data: proposalWithLatestVersion
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function handleUpdateProposal(req: NextApiRequest, res: NextApiResponse<ApiResponse>, id: string) {
  try {
    const updateData = req.body;

    // Validar se a proposta existe
    const { data: existingProposal, error: fetchError } = await supabase
      .from('proposals')
      .select('id, owner_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingProposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposta não encontrada'
      });
    }

    // Verificar permissões (implementar lógica de RBAC)
    // Para desenvolvimento, usar um ID fixo temporário
    const userId = 'temp-user-id';
    if (existingProposal.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Sem permissão para editar esta proposta'
      });
    }

    // Atualizar proposta
    const { data: updatedProposal, error } = await supabase
      .from('proposals')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar proposta:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao atualizar proposta'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProposal,
      message: 'Proposta atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function handleDeleteProposal(req: NextApiRequest, res: NextApiResponse<ApiResponse>, id: string) {
  try {
    // Verificar se a proposta existe
    const { data: existingProposal, error: fetchError } = await supabase
      .from('proposals')
      .select('id, owner_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingProposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposta não encontrada'
      });
    }

    // Verificar permissões
    // Para desenvolvimento, usar um ID fixo temporário
    const userId = 'temp-user-id';
    if (existingProposal.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Sem permissão para excluir esta proposta'
      });
    }

    // Verificar se pode ser excluída (não pode ter versões publicadas)
    const { data: versions } = await supabase
      .from('proposal_versions')
      .select('id')
      .eq('proposal_id', id);

    if (versions && versions.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Não é possível excluir proposta com versões publicadas'
      });
    }

    // Excluir proposta (cascade vai excluir relacionamentos)
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir proposta:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao excluir proposta'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Proposta excluída com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
