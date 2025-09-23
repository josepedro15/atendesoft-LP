// API para gerenciamento de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Proposal, CreateProposalData, ApiResponse, ProposalFilters } from '@/types/proposals';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/proposals - Listar propostas
export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    return handleGetProposals(req, res);
  }
  
  if (req.method === 'POST') {
    return handleCreateProposal(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ success: false, error: 'Method not allowed' });
}

async function handleGetProposals(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { 
      status, 
      owner_id, 
      client_id, 
      date_from, 
      date_to, 
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Construir filtros
    let query = supabase
      .from('proposals')
      .select(`
        *,
        client:clients(*),
        versions:proposal_versions(*)
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      query = query.in('status', statusArray);
    }

    if (owner_id) {
      query = query.eq('owner_id', owner_id);
    }

    if (client_id) {
      query = query.eq('client_id', client_id);
    }

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,client:clients.name.ilike.%${search}%`);
    }

    // Paginação
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar propostas:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }

    // Adicionar versão mais recente a cada proposta
    const proposalsWithLatestVersion = data?.map(proposal => ({
      ...proposal,
      latest_version: proposal.versions?.[0] // Versão mais recente
    }));

    res.status(200).json({
      success: true,
      data: {
        proposals: proposalsWithLatestVersion,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}

async function handleCreateProposal(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const proposalData: CreateProposalData = req.body;

    // Validar dados obrigatórios
    if (!proposalData.title) {
      return res.status(400).json({
        success: false,
        error: 'Título é obrigatório'
      });
    }

    // Obter usuário da sessão (implementar autenticação)
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    // Criar proposta
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        title: proposalData.title,
        client_id: proposalData.client_id,
        owner_id: userId,
        currency: 'BRL',
        status: 'draft',
        valid_until: proposalData.valid_until,
        approval_required: false
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar proposta:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar proposta'
      });
    }

    // Se foi fornecido um template, aplicar variáveis padrão
    if (proposalData.template_id) {
      const { data: template } = await supabase
        .from('proposal_templates')
        .select('*')
        .eq('id', proposalData.template_id)
        .single();

      if (template) {
        // Aqui você pode aplicar as variáveis padrão do template
        // Por enquanto, apenas retornamos a proposta criada
      }
    }

    res.status(201).json({
      success: true,
      data: proposal,
      message: 'Proposta criada com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
