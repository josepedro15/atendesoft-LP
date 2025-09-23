// API para gerenciamento de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Proposal, CreateProposalData, ApiResponse, ProposalFilters } from '@/types/proposals';
import { mockStorage } from './mock-storage';

// Usa a mesma lógica do sistema de autenticação
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
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

    // Para desenvolvimento, usar armazenamento mockado
    // TODO: Implementar com Supabase quando RLS estiver configurado
    let proposals = mockStorage.getAllProposals();

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

    // Para desenvolvimento, usar armazenamento mockado
    // TODO: Implementar com Supabase quando RLS estiver configurado
    const mockProposal = {
      id: `prop-${Date.now()}`,
      title: proposalData.title,
      client_id: proposalData.client_id || null,
      owner_id: '550e8400-e29b-41d4-a716-446655440000',
      currency: 'BRL',
      status: 'draft',
      valid_until: proposalData.valid_until || null,
      approval_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      versions: [],
      latest_version: null
    };

    // Salvar no armazenamento mockado
    const savedProposal = mockStorage.createProposal(mockProposal);
    console.log('Proposta criada (mock):', savedProposal);

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
      data: savedProposal,
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
