// API para rastreamento de eventos de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ProposalEventType, ApiResponse } from '@/types/proposals';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3MTAwMiwiZXhwIjoyMDY5NTQ3MDAyfQ.placeholder'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { 
      proposal_id, 
      version_id, 
      type, 
      metadata = {},
      section_id,
      scroll_percentage,
      time_spent
    } = req.body;

    // Validar dados obrigatórios
    if (!proposal_id || !type) {
      return res.status(400).json({
        success: false,
        error: 'proposal_id e type são obrigatórios'
      });
    }

    // Validar tipo de evento
    const validTypes: ProposalEventType[] = [
      'sent', 'open', 'scroll', 'section_view', 'download_pdf', 
      'accept_click', 'signature_start', 'signature_complete', 'signature_rejected'
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de evento inválido'
      });
    }

    // Obter IP e User-Agent
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    // Preparar metadados
    const eventMetadata = {
      ...metadata,
      ...(section_id && { section_id }),
      ...(scroll_percentage !== undefined && { scroll_percentage }),
      ...(time_spent !== undefined && { time_spent }),
      timestamp: new Date().toISOString()
    };

    // Inserir evento
    const { data: event, error } = await supabase
      .from('proposal_events')
      .insert({
        proposal_id,
        version_id,
        type,
        metadata: eventMetadata,
        ip: Array.isArray(ip) ? ip[0] : ip,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar evento:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao registrar evento'
      });
    }

    // Se for evento de abertura, atualizar status da proposta
    if (type === 'open') {
      await supabase
        .from('proposals')
        .update({ 
          status: 'viewed',
          updated_at: new Date().toISOString()
        })
        .eq('id', proposal_id)
        .eq('status', 'sent'); // Só atualiza se ainda estiver como 'sent'
    }

    // Se for evento de assinatura completa, atualizar status
    if (type === 'signature_complete') {
      await supabase
        .from('proposals')
        .update({ 
          status: 'signed',
          updated_at: new Date().toISOString()
        })
        .eq('id', proposal_id);
    }

    res.status(201).json({
      success: true,
      data: event,
      message: 'Evento registrado com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

// Endpoint para tracking de abertura (pixel)
export async function trackOpen(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pid, vid } = req.query;

  if (!pid) {
    return res.status(400).json({ error: 'proposal_id é obrigatório' });
  }

  try {
    // Registrar evento de abertura
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    await supabase
      .from('proposal_events')
      .insert({
        proposal_id: pid as string,
        version_id: vid as string,
        type: 'open',
        metadata: {
          timestamp: new Date().toISOString(),
          referrer: req.headers.referer
        },
        ip: Array.isArray(ip) ? ip[0] : ip,
        user_agent: userAgent
      });

    // Atualizar status da proposta
    await supabase
      .from('proposals')
      .update({ 
        status: 'viewed',
        updated_at: new Date().toISOString()
      })
      .eq('id', pid)
      .eq('status', 'sent');

    // Retornar pixel transparente 1x1
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pixel.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(pixel);

  } catch (error) {
    console.error('Erro ao registrar abertura:', error);
    
    // Mesmo com erro, retornar pixel para não quebrar a página
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pixel.length);
    res.status(200).send(pixel);
  }
}
