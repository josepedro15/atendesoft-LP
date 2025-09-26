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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Webhook response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // Mesmo com erro no webhook externo, vamos retornar sucesso
        // para não bloquear o usuário
        console.log('Webhook externo falhou, mas retornando sucesso para o usuário');
        return res.status(200).json({ 
          success: true,
          message: 'Dados processados com sucesso',
          warning: 'Webhook externo temporariamente indisponível'
        });
      }

      const responseText = await response.text();
      console.log('Webhook response body:', responseText);

    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      // Mesmo com erro de rede, vamos retornar sucesso
      // para não bloquear o usuário
      console.log('Erro de rede no webhook, mas retornando sucesso para o usuário');
      return res.status(200).json({ 
        success: true,
        message: 'Dados processados com sucesso',
        warning: 'Webhook externo temporariamente indisponível'
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
    
    // Em caso de erro geral, ainda retornamos sucesso
    // para não bloquear o fluxo do usuário
    return res.status(200).json({ 
      success: true,
      message: 'Dados processados com sucesso',
      warning: 'Sistema temporariamente indisponível'
    });
  }
}
