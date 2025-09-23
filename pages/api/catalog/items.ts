// API para gerenciamento de itens do catálogo
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { CatalogItem, ApiResponse } from '@/types/proposals';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    return handleGetItems(req, res);
  }
  
  if (req.method === 'POST') {
    return handleCreateItem(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ success: false, error: 'Method not allowed' });
}

async function handleGetItems(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { search, category, active_only = 'true' } = req.query;

    let query = supabase
      .from('catalog_items')
      .select('*')
      .order('name', { ascending: true });

    if (active_only === 'true') {
      query = query.eq('is_active', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar itens do catálogo:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }

    res.status(200).json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function handleCreateItem(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { sku, name, description, category, unit_price, currency = 'BRL' } = req.body;

    // Validar dados obrigatórios
    if (!name || unit_price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Nome e preço são obrigatórios'
      });
    }

    // Criar item
    const { data: item, error } = await supabase
      .from('catalog_items')
      .insert({
        sku,
        name,
        description,
        category,
        unit_price: Number(unit_price),
        currency,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar item:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar item'
      });
    }

    res.status(201).json({
      success: true,
      data: item,
      message: 'Item criado com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
