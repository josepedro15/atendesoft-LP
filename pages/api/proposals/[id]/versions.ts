// API para gerenciamento de versões de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { renderTemplateBlocks } from '@/lib/template-engine';
import { PublishVersionData, ApiResponse, ProposalVersion } from '@/types/proposals';
import crypto from 'crypto';

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
    case 'POST':
      return handlePublishVersion(req, res, id);
    case 'GET':
      return handleGetVersions(req, res, id);
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function handlePublishVersion(req: NextApiRequest, res: NextApiResponse<ApiResponse>, proposalId: string) {
  try {
    const versionData: PublishVersionData = req.body;

    // Validar dados obrigatórios
    if (!versionData.variables || !versionData.blocks) {
      return res.status(400).json({
        success: false,
        error: 'Variáveis e blocos são obrigatórios'
      });
    }

    // Verificar se a proposta existe
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('id, owner_id, status')
      .eq('id', proposalId)
      .single();

    if (proposalError || !proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposta não encontrada'
      });
    }

    // Verificar permissões
    // Para desenvolvimento, usar um UUID válido temporário
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    if (proposal.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Sem permissão para publicar esta proposta'
      });
    }

    // Obter próxima versão
    const { data: existingVersions } = await supabase
      .from('proposal_versions')
      .select('version_number')
      .eq('proposal_id', proposalId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersion = (existingVersions?.[0]?.version_number || 0) + 1;

    // Renderizar HTML da proposta
    const renderedHTML = renderTemplateBlocks(versionData.blocks, versionData.variables);

    // Calcular totais
    const totalAmount = versionData.variables.precos.itens.reduce((sum, item) => {
      const subtotal = item.quantity * item.unit_price;
      const discount = item.discount || 0;
      return sum + (subtotal - discount);
    }, 0);

    const discountAmount = versionData.variables.precos.itens.reduce((sum, item) => {
      return sum + (item.discount || 0);
    }, 0);

    const taxAmount = versionData.variables.precos.itens.reduce((sum, item) => {
      const subtotal = item.quantity * item.unit_price;
      const discount = item.discount || 0;
      const taxableAmount = subtotal - discount;
      return sum + (taxableAmount * (item.tax_rate || 0) / 100);
    }, 0);

    // Gerar token público
    const publicToken = crypto.randomBytes(32).toString('hex');
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${publicToken}`;

    // Criar versão
    const { data: version, error: versionError } = await supabase
      .from('proposal_versions')
      .insert({
        proposal_id: proposalId,
        version_number: nextVersion,
        snapshot_html: renderedHTML,
        snapshot_json: {
          blocks: versionData.blocks,
          variables: versionData.variables
        },
        variables: versionData.variables,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        public_token: publicToken,
        public_url: publicUrl
      })
      .select()
      .single();

    if (versionError) {
      console.error('Erro ao criar versão:', versionError);
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar versão da proposta'
      });
    }

    // Inserir itens da versão
    if (versionData.variables.precos.itens.length > 0) {
      const items = versionData.variables.precos.itens.map(item => ({
        version_id: version.id,
        sku: item.sku,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount || 0,
        tax_rate: item.tax_rate || 0
      }));

      const { error: itemsError } = await supabase
        .from('proposal_version_items')
        .insert(items);

      if (itemsError) {
        console.error('Erro ao inserir itens:', itemsError);
        // Não falha a operação, apenas loga o erro
      }
    }

    // Atualizar status da proposta para ready_to_send
    await supabase
      .from('proposals')
      .update({ 
        status: 'ready_to_send',
        updated_at: new Date().toISOString()
      })
      .eq('id', proposalId);

    res.status(201).json({
      success: true,
      data: version,
      message: 'Versão publicada com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function handleGetVersions(req: NextApiRequest, res: NextApiResponse<ApiResponse>, proposalId: string) {
  try {
    const { data: versions, error } = await supabase
      .from('proposal_versions')
      .select(`
        *,
        items:proposal_version_items(*)
      `)
      .eq('proposal_id', proposalId)
      .order('version_number', { ascending: false });

    if (error) {
      console.error('Erro ao buscar versões:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }

    res.status(200).json({
      success: true,
      data: versions
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
