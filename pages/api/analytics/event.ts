import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsEventSchema, validateData } from '@/lib/validations';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/errors';
import { config } from '@/lib/config';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase para operações do servidor
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json(createErrorResponse(new Error('Method not allowed')));
  }

  try {
    // Validar dados de entrada
    const eventData = validateData(analyticsEventSchema, req.body);

    // Preparar dados do evento
    const analyticsEvent = {
      event: eventData.event,
      properties: eventData.properties || {},
      user_id: eventData.user_id,
      session_id: eventData.session_id,
      ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      user_agent: req.headers['user-agent'] || 'unknown',
      timestamp: new Date().toISOString(),
    };

    // Salvar no banco de dados (se a tabela existir)
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(analyticsEvent);

      if (error && !error.message.includes('relation "analytics_events" does not exist')) {
        console.warn('Erro ao salvar evento no banco:', error.message);
      }
    } catch (dbError) {
      // Se a tabela não existir, apenas logar
      console.log('Tabela analytics_events não encontrada, apenas logando evento');
    }

    // Log do evento para debug
    console.log('Analytics Event:', analyticsEvent);

    res.status(200).json(createSuccessResponse(
      { eventId: Date.now().toString() },
      'Evento registrado com sucesso'
    ));

  } catch (error) {
    const { status } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}
