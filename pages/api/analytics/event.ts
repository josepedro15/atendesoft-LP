import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { event, properties } = req.body;

    // Validar dados obrigatórios
    if (!event) {
      return res.status(400).json({
        success: false,
        error: 'Evento é obrigatório'
      });
    }

    // Log do evento para debug
    console.log('Analytics Event:', {
      event,
      properties,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    });

    // Por enquanto, apenas logamos os eventos
    // Em produção, você pode salvar no banco de dados ou enviar para um serviço de analytics
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 100));

    res.status(200).json({
      success: true,
      message: 'Evento registrado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao processar evento de analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
