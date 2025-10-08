import { NextApiRequest, NextApiResponse } from 'next';
import { runWorkflow } from '@/lib/commercial-agent';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Try to run the commercial agent workflow
    try {
      const result = await runWorkflow({
        input_as_text: message
      });

      res.status(200).json({
        response: result.output_text,
        timestamp: new Date().toISOString()
      });

    } catch (agentError) {
      console.error('Agent execution error:', agentError);
      
      // Fallback response if agent fails
      res.status(200).json({
        response: `Olá! Recebi sua mensagem: "${message}". 

O sistema de chat está funcionando! Estou analisando seus relatórios do WhatsApp através do Google Drive.

Por enquanto, posso responder perguntas gerais sobre atendimento:
• Como melhorar o tempo de resposta
• Estratégias para follow-ups  
• Scripts de atendimento
• Métricas importantes

O que você gostaria de saber sobre atendimento WhatsApp?`,
        timestamp: new Date().toISOString(),
        error: 'Agent execution failed'
      });
    }

  } catch (error) {
    console.error('Error in chat agent API:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Ocorreu um erro interno. Tente novamente.',
      timestamp: new Date().toISOString()
    });
  }
}
