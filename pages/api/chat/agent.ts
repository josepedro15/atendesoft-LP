import { NextApiRequest, NextApiResponse } from 'next';
import { runWorkflow } from '@/lib/commercial-agent';
import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Optional: Add authentication check here
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // Run the commercial agent workflow
    const result = await runWorkflow({
      input_as_text: message
    });

    return res.status(200).json({
      response: result.output_text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat agent API:', error);
    
    // Return a fallback response if the agent fails
    return res.status(200).json({
      response: `Desculpe, não consegui acessar os dados do Google Drive no momento. Isso pode ser devido a:

• Problemas de conectividade com o Google Drive
• Configuração de autorização pendente
• Arquivos não encontrados na pasta Metrics

Para resolver:
1. Verifique se a autorização do Google Drive está configurada
2. Confirme se existem relatórios na pasta Metrics (ID: 1HiSD6F45Q4XwAvMjsODOE7_baPdzdLyY)
3. Tente novamente em alguns minutos

Você pode me fazer perguntas gerais sobre atendimento WhatsApp enquanto isso!`,
      timestamp: new Date().toISOString(),
      error: 'Agent execution failed'
    });
  }
}
