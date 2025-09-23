// API para assinatura de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SignatureData, ApiResponse } from '@/types/proposals';
import crypto from 'crypto';

// Usa a mesma lógica do sistema de autenticação
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id: proposalId, versionId } = req.query;

  if (!proposalId || !versionId) {
    return res.status(400).json({
      success: false,
      error: 'ID da proposta e versão são obrigatórios'
    });
  }

  try {
    const signatureData: SignatureData = req.body;

    // Validar dados obrigatórios
    if (!signatureData.signer_name || !signatureData.signer_email || !signatureData.signature_data) {
      return res.status(400).json({
        success: false,
        error: 'Dados de assinatura incompletos'
      });
    }

    // Verificar se a versão existe
    const { data: version, error: versionError } = await supabase
      .from('proposal_versions')
      .select('*')
      .eq('id', versionId)
      .eq('proposal_id', proposalId)
      .single();

    if (versionError || !version) {
      return res.status(404).json({
        success: false,
        error: 'Versão da proposta não encontrada'
      });
    }

    // Verificar se a proposta ainda é válida
    const { data: proposal } = await supabase
      .from('proposals')
      .select('valid_until, status')
      .eq('id', proposalId)
      .single();

    if (proposal?.valid_until && new Date(proposal.valid_until) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Esta proposta expirou'
      });
    }

    // Obter IP e User-Agent
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               'unknown';

    // Gerar hash do conteúdo para imutabilidade
    const contentHash = crypto
      .createHash('sha256')
      .update(version.snapshot_html)
      .digest('hex');

    // Criar assinatura
    const { data: signature, error: signatureError } = await supabase
      .from('proposal_signatures')
      .insert({
        proposal_id: proposalId as string,
        version_id: versionId as string,
        signer_name: signatureData.signer_name,
        signer_email: signatureData.signer_email,
        method: signatureData.method,
        signature_data: signatureData.signature_data,
        signed_at: new Date().toISOString(),
        ip: Array.isArray(ip) ? ip[0] : ip,
        hash: contentHash
      })
      .select()
      .single();

    if (signatureError) {
      console.error('Erro ao criar assinatura:', signatureError);
      return res.status(500).json({
        success: false,
        error: 'Erro ao processar assinatura'
      });
    }

    // Atualizar status da proposta
    await supabase
      .from('proposals')
      .update({ 
        status: 'signed',
        updated_at: new Date().toISOString()
      })
      .eq('id', proposalId);

    // Registrar evento de assinatura
    await supabase
      .from('proposal_events')
      .insert({
        proposal_id: proposalId as string,
        version_id: versionId as string,
        type: 'signature_complete',
        metadata: {
          signer_name: signatureData.signer_name,
          signer_email: signatureData.signer_email,
          method: signatureData.method,
          timestamp: new Date().toISOString()
        },
        ip: Array.isArray(ip) ? ip[0] : ip,
        user_agent: req.headers['user-agent'] || 'unknown'
      });

    // Aqui você pode adicionar webhooks para n8n ou outras integrações
    // await sendWebhook('proposal.signed', { proposal_id: proposalId, signature });

    res.status(201).json({
      success: true,
      data: signature,
      message: 'Proposta assinada com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
