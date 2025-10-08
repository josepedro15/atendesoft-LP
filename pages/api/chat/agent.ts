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
      console.log('Attempting to run commercial agent...');
      const result = await runWorkflow({
        input_as_text: message
      });

      console.log('Agent result:', result);
      res.status(200).json({
        response: result.output_text,
        timestamp: new Date().toISOString()
      });

    } catch (agentError) {
      console.error('Agent execution error:', agentError);
      
      // Fallback response if agent fails
      res.status(200).json({
        response: `🔧 **Sistema em Manutenção**

Olá! Recebi sua mensagem: "${message}".

O agente comercial está sendo configurado. Por enquanto, posso responder perguntas gerais sobre atendimento WhatsApp:

**📊 Métricas Importantes:**
• Tempo médio de resposta (TMR)
• Taxa de conversão de leads
• Follow-ups pendentes
• Satisfação do cliente

**💡 Estratégias de Melhoria:**
• Resposta automática em até 5 minutos
• Scripts personalizados por tipo de cliente
• Segmentação de leads por interesse
• Análise de horários de maior engajamento

**🚀 Próximos Passos:**
1. Configure as variáveis de ambiente
2. Teste a conexão com Google Drive
3. Valide as credenciais da OpenAI

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
