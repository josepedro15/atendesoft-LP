import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;

    // Validar dados obrigatórios
    if (!webhookData.nome || !webhookData.telefone) {
      return res.status(400).json({ 
        error: 'Nome e telefone são obrigatórios',
        success: false 
      });
    }

    // Enviar para o webhook externo
    const response = await fetch('https://webhook.aiensed.com/webhook/atendesoft-devhub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AtendeSoft-Webhook-Proxy/1.0',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      console.error('Webhook response error:', response.status, response.statusText);
      return res.status(500).json({ 
        error: 'Erro ao enviar dados para o webhook',
        success: false 
      });
    }

    // Log para debug
    console.log('Webhook enviado com sucesso:', {
      nome: webhookData.nome,
      telefone: webhookData.telefone,
      timestamp: webhookData.timestamp
    });

    return res.status(200).json({ 
      success: true,
      message: 'Dados enviados com sucesso'
    });

  } catch (error) {
    console.error('Erro no webhook proxy:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      success: false 
    });
  }
}
