// API para envio de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SendProposalData, ApiResponse } from '@/types/proposals';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'ID da proposta é obrigatório'
    });
  }

  try {
    const sendData: SendProposalData = req.body;

    // Validar dados obrigatórios
    if (!sendData.channel) {
      return res.status(400).json({
        success: false,
        error: 'Canal de envio é obrigatório'
      });
    }

    // Verificar se a proposta existe e tem versão publicada
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        id,
        title,
        owner_id,
        status,
        client:clients(*),
        versions:proposal_versions(*)
      `)
      .eq('id', id)
      .single();

    if (proposalError || !proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposta não encontrada'
      });
    }

    // Verificar se tem versões publicadas
    if (!proposal.versions || proposal.versions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Proposta não tem versões publicadas'
      });
    }

    // Pegar a versão mais recente
    const latestVersion = proposal.versions[0];

    // Verificar permissões
    const userId = req.headers['x-user-id'] as string;
    if (proposal.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Sem permissão para enviar esta proposta'
      });
    }

    // Verificar se pode ser enviada
    if (proposal.status !== 'ready_to_send' && proposal.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Proposta não está pronta para envio'
      });
    }

    // Registrar evento de envio
    await supabase
      .from('proposal_events')
      .insert({
        proposal_id: id,
        version_id: latestVersion.id,
        type: 'sent',
        metadata: {
          channel: sendData.channel,
          recipient: sendData.channel === 'email' ? sendData.recipient_email : sendData.recipient_phone
        }
      });

    // Enviar conforme o canal
    let sendResult;
    switch (sendData.channel) {
      case 'whatsapp':
        sendResult = await sendWhatsApp(proposal, sendData);
        break;
      case 'email':
        sendResult = await sendEmail(proposal, sendData);
        break;
      case 'link':
        sendResult = { success: true, message: 'Link gerado com sucesso' };
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Canal de envio inválido'
        });
    }

    if (!sendResult.success) {
      return res.status(500).json({
        success: false,
        error: sendResult.error || 'Erro ao enviar proposta'
      });
    }

    // Atualizar status da proposta
    await supabase
      .from('proposals')
      .update({ 
        status: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    res.status(200).json({
      success: true,
      data: {
        channel: sendData.channel,
        public_url: latestVersion.public_url,
        sent_at: new Date().toISOString()
      },
      message: 'Proposta enviada com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function sendWhatsApp(proposal: any, sendData: SendProposalData) {
  try {
    // Implementar integração com WhatsApp Business API
    // Por enquanto, apenas simular o envio
    
    const message = sendData.message || 
      `Olá! Enviamos sua proposta "${proposal.title}". Acesse: ${proposal.latest_version.public_url}`;

    // Aqui você integraria com a API do WhatsApp
    // const whatsappResponse = await fetch('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: sendData.recipient_phone,
    //     type: 'text',
    //     text: { body: message }
    //   })
    // });

    console.log('WhatsApp enviado:', {
      to: sendData.recipient_phone,
      message: message
    });

    return { success: true, message: 'WhatsApp enviado com sucesso' };

  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return { success: false, error: 'Erro ao enviar WhatsApp' };
  }
}

async function sendEmail(proposal: any, sendData: SendProposalData) {
  try {
    // Implementar integração com SendGrid ou outro provedor de email
    // Por enquanto, apenas simular o envio
    
    const emailData = {
      to: sendData.recipient_email,
      subject: `Proposta: ${proposal.title}`,
      html: `
        <h2>Olá!</h2>
        <p>Enviamos sua proposta "${proposal.title}".</p>
        <p>Acesse através do link: <a href="${proposal.latest_version.public_url}">Ver Proposta</a></p>
        <p>Atenciosamente,<br>Equipe AtendeSoft</p>
      `
    };

    // Aqui você integraria com SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(emailData);

    console.log('Email enviado:', emailData);

    return { success: true, message: 'Email enviado com sucesso' };

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: 'Erro ao enviar email' };
  }
}
