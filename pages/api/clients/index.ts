// API para gerenciamento de clientes
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Client, ApiResponse } from '@/types/proposals';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3MTAwMiwiZXhwIjoyMDY5NTQ3MDAyfQ.placeholder'
);

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
    const { search, limit = 50 } = req.query;

    // Dados mockados temporários
    const mockData = [
      {
        id: '1',
        name: 'TechCorp Ltda',
        document: '12.345.678/0001-90',
        email: 'contato@techcorp.com',
        phone: '(11) 99999-9999',
        company_size: 'Média',
        segment: 'Tecnologia',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Camilotti Casa e Construção',
        document: '98.765.432/0001-10',
        email: 'vendas@camilotti.com',
        phone: '(11) 88888-8888',
        company_size: 'Grande',
        segment: 'Construção',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'StartupXYZ',
        document: '11.222.333/0001-44',
        email: 'ceo@startupxyz.com',
        phone: '(11) 77777-7777',
        company_size: 'Pequena',
        segment: 'SaaS',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    let filteredData = mockData;

    // Aplicar filtros
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredData = filteredData.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.document.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar limite
    filteredData = filteredData.slice(0, Number(limit));

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

async function handleCreateClient(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { name, document, email, phone, company_size, segment } = req.body;

    // Validar dados obrigatórios
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Nome é obrigatório'
      });
    }

    // Criar cliente
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        name,
        document,
        email,
        phone,
        company_size,
        segment
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cliente:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar cliente'
      });
    }

    res.status(201).json({
      success: true,
      data: client,
      message: 'Cliente criado com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
