import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    
    console.log('Webhook request received:', {
      nome: webhookData.nome,
      telefone: webhookData.telefone,
      timestamp: webhookData.timestamp
    });

    // Validar dados obrigatórios
    if (!webhookData.nome || !webhookData.telefone) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ 
        error: 'Nome e telefone são obrigatórios',
        success: false 
      });
    }

    // Tentar enviar para o webhook externo
    try {
      console.log('Attempting to send to external webhook...');
      console.log('Webhook data being sent:', JSON.stringify(webhookData, null, 2));
      
      // Criar AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      const response = await fetch('https://webhook.aiensed.com/webhook/atendesoft-devhub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AtendeSoft-Webhook-Proxy/1.0',
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Webhook response status:', response.status);
      console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Webhook response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        return res.status(500).json({ 
          success: false,
          error: `Webhook externo retornou erro: ${response.status} - ${errorText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          }
        });
      }

      const responseText = await response.text();
      console.log('Webhook response body:', responseText);

      // Verificar se a resposta é válida
      try {
        const responseData = JSON.parse(responseText);
        console.log('Webhook response parsed:', responseData);
      } catch (parseError) {
        console.log('Webhook response is not JSON:', responseText);
      }

    } catch (fetchError) {
      console.error('Fetch error details:', {
        name: fetchError.name,
        message: fetchError.message,
        cause: fetchError.cause,
        stack: fetchError.stack
      });
      
      return res.status(500).json({ 
        success: false,
        error: `Erro ao conectar com webhook: ${fetchError.message}`,
        details: {
          name: fetchError.name,
          message: fetchError.message
        }
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
    console.error('Erro geral no webhook proxy:', error);
    
    return res.status(500).json({ 
      success: false,
      error: `Erro interno: ${error.message}`,
      details: {
        name: error.name,
        message: error.message
      }
    });
  }
}
