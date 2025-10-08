import { NextApiRequest, NextApiResponse } from 'next';

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

    console.log('Received message:', message);

    // Simple test response
    res.status(200).json({
      response: `🤖 **Agente Comercial Ativo**

Olá! Recebi sua mensagem: "${message}"

**📊 Status do Sistema:**
✅ API funcionando
✅ Endpoint respondendo
✅ Mensagens sendo processadas

**🔍 Análise Simulada:**
Baseado na sua pergunta, aqui estão alguns insights sobre atendimento WhatsApp:

**📈 Métricas Sugeridas:**
• Tempo médio de resposta: 8-12 minutos
• Taxa de conversão: 15-25%
• Follow-ups pendentes: 3-5 contatos
• Satisfação: 4.2/5.0

**💡 Recomendações:**
1. Implementar resposta automática em 5 minutos
2. Criar templates para perguntas frequentes
3. Segmentar leads por interesse
4. Agendar follow-ups automáticos

**🚀 Próximos Passos:**
O sistema está funcionando! Em breve, o agente estará conectado ao Google Drive para análise real dos seus relatórios.

Tem alguma pergunta específica sobre atendimento WhatsApp?`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat agent API:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Ocorreu um erro interno. Tente novamente.',
      timestamp: new Date().toISOString()
    });
  }
}
