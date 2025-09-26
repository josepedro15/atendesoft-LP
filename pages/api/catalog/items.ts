// API para gerenciamento de itens do catálogo
import { NextApiRequest, NextApiResponse } from 'next';
import { CatalogItem, ApiResponse } from '@/types/proposals';
import { createCatalogItemSchema, validateData } from '@/lib/validations';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/errors';
import { config } from '@/lib/config';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    return handleGetItems(req, res);
  }
  
  if (req.method === 'POST') {
    return handleCreateItem(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json(createErrorResponse(new Error('Method not allowed')));
}

async function handleGetItems(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { search, category, active_only = 'true' } = req.query;

    // Construir query do Supabase
    let query = supabase
      .from('catalog_items')
      .select('*')
      .order('name', { ascending: true });

    // Aplicar filtros
    if (active_only === 'true') {
      query = query.eq('is_active', true);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data: items, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar itens: ${error.message}`);
    }

    res.status(200).json(createSuccessResponse(items || []));

  } catch (error) {
    const { status } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}

async function handleCreateItem(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    // Validar dados de entrada
    const itemData = validateData(createCatalogItemSchema, req.body);

    // Criar item no Supabase
    const { data: newItem, error } = await supabase
      .from('catalog_items')
      .insert({
        sku: itemData.sku,
        name: itemData.name,
        description: itemData.description,
        category: itemData.category,
        unit_price: itemData.unit_price,
        currency: itemData.currency,
        is_active: itemData.is_active,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar item: ${error.message}`);
    }

    res.status(201).json(createSuccessResponse(
      newItem,
      'Item criado com sucesso'
    ));

  } catch (error) {
    const { status } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}