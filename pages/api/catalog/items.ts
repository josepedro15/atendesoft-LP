// API para gerenciamento de itens do catálogo
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { CatalogItem, ApiResponse } from '@/types/proposals';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3MTAwMiwiZXhwIjoyMDY5NTQ3MDAyfQ.placeholder'
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

    // Dados mockados temporários até resolver o RLS
    const mockData = [
      {
        id: '1',
        sku: 'AUTO-WA-001',
        name: 'Automação WhatsApp Business API',
        description: 'Implementação completa de automação WhatsApp com IA',
        category: 'Automação',
        unit_price: 2500.00,
        currency: 'BRL',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        sku: 'DASH-BI-001',
        name: 'Dashboard BI com IA',
        description: 'Dashboard personalizado com inteligência artificial',
        category: 'Dashboard',
        unit_price: 3500.00,
        currency: 'BRL',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        sku: 'TRAIN-001',
        name: 'Treinamento da Equipe',
        description: 'Capacitação completa da equipe no uso da plataforma',
        category: 'Treinamento',
        unit_price: 800.00,
        currency: 'BRL',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        sku: 'SUP-001',
        name: 'Suporte Técnico Mensal',
        description: 'Suporte técnico especializado por 30 dias',
        category: 'Suporte',
        unit_price: 500.00,
        currency: 'BRL',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        sku: 'DEV-001',
        name: 'Desenvolvimento Customizado',
        description: 'Desenvolvimento de funcionalidades específicas',
        category: 'Desenvolvimento',
        unit_price: 150.00,
        currency: 'BRL',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    let filteredData = mockData;

    // Aplicar filtros
    if (active_only === 'true') {
      filteredData = filteredData.filter(item => item.is_active);
    }

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      filteredData = filteredData.filter(item => item.category === category);
    }

    res.status(200).json({
      success: true,
      data: filteredData
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
