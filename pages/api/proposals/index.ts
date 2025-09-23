// API para gerenciamento de propostas - Versão com Mock Storage
import { NextApiRequest, NextApiResponse } from 'next';
import { Proposal, CreateProposalData, ApiResponse, ProposalFilters } from '@/types/proposals';
import { mockStorage } from '@/lib/mock-storage';

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
    let proposals = mockStorage.getAllProposals();

    // Aplicar filtros
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      proposals = proposals.filter(p => statusArray.includes(p.status));
    }

    if (owner_id) {
      proposals = proposals.filter(p => p.owner_id === owner_id);
    }

    if (client_id) {
      proposals = proposals.filter(p => p.client_id === client_id);
    }

    if (search) {
      proposals = proposals.filter(p => 
        p.title.toLowerCase().includes((search as string).toLowerCase())
      );
    }

    // Ordenar por data de criação (mais recente primeiro)
    proposals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Aplicar paginação
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit);
    const paginatedProposals = proposals.slice(from, to);

    res.status(200).json({
      success: true,
      data: {
        proposals: paginatedProposals,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: proposals.length,
          pages: Math.ceil(proposals.length / Number(limit))
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
