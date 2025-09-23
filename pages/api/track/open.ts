// API para tracking de abertura (pixel)
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Usa a mesma lógica do sistema de autenticação
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pixel.length);
    res.status(200).send(pixel);
  }
}
