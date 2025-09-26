// API para gerenciamento de clientes
import { NextApiRequest, NextApiResponse } from 'next';
import { Client, ApiResponse } from '@/types/proposals';
import { createClientSchema, validateData } from '@/lib/validations';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/errors';
import { config } from '@/lib/config';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    return handleGetClients(req, res);
  }
  
  if (req.method === 'POST') {
    return handleCreateClient(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ success: false, error: 'Method not allowed' });
}

async function handleGetClients(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    // Construir query do Supabase
    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Aplicar filtro de busca se fornecido
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Aplicar paginação
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;
    query = query.range(from, to);

    const { data: clients, error, count } = await query;

    if (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }

    const total = count || 0;
    const pages = Math.ceil(total / limitNum);

    res.status(200).json(createSuccessResponse({
      clients: clients || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages
      }
    }));

  } catch (error) {
    const { status } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}

async function handleCreateClient(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    // Validar dados de entrada
    const clientData = validateData(createClientSchema, req.body);

    // Criar cliente no Supabase
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        document: clientData.document,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }

    res.status(201).json(createSuccessResponse(
      newClient,
      'Cliente criado com sucesso'
    ));

  } catch (error) {
    const { status } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}
