// API para gerenciamento de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { Proposal, CreateProposalData, ApiResponse, ProposalFilters } from '@/types/proposals';
import { createProposalSchema, proposalFiltersSchema, validateData, validateQuery } from '@/lib/validations';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/errors';
import { config } from '@/lib/config';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase para operações do servidor
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

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
    // Validar parâmetros da query
    const filters = validateQuery(proposalFiltersSchema, req.query);

    // Construir query do Supabase
    let query = supabase
      .from('proposals')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }

    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    // Aplicar paginação
    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;
    query = query.range(from, to);

    const { data: proposals, error, count } = await query;

    if (error) {
      throw new Error(`Erro ao buscar propostas: ${error.message}`);
    }

    const total = count || 0;
    const pages = Math.ceil(total / filters.limit);

    res.status(200).json(createSuccessResponse({
      proposals: proposals || [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        pages
      }
    }));

  } catch (error) {
    const { status, message } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}

async function handleCreateProposal(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    // Validar dados de entrada
    const proposalData = validateData(createProposalSchema, req.body);

    // Criar proposta no Supabase
    const { data: newProposal, error } = await supabase
      .from('proposals')
      .insert({
        title: proposalData.title,
        client_id: proposalData.client_id,
        currency: proposalData.currency,
        status: 'draft',
        valid_until: proposalData.valid_until,
        approval_required: false,
        // owner_id será definido pelo RLS baseado no usuário autenticado
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar proposta: ${error.message}`);
    }

    res.status(201).json(createSuccessResponse(
      newProposal,
      'Proposta criada com sucesso'
    ));

  } catch (error) {
    const { status } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}
