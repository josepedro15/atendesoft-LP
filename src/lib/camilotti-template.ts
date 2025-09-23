// Template da Proposta Camilotti - Plataforma de Atendimento Inteligente
// Baseado na proposta fornecida pelo usuário

import { ProposalTemplate } from '@/types/proposals';

export const camilottiTemplate: ProposalTemplate = {
  id: 'template-camilotti-1',
  name: 'Proposta — Plataforma de Atendimento Inteligente',
  description: 'Template baseado no case Camilotti (Atendesoft).',
  content_json: {
    blocks: [
      {
        type: 'hero',
        props: {
          title: '{{projeto.titulo}}',
          subtitle: '{{fornecedor.nome}} → {{cliente.nome}}',
          tagline: 'Uma solução completa para transformar o atendimento ao cliente com automação inteligente e tecnologia de ponta.'
        }
      },
      {
        type: 'objective',
        props: {
          title: 'Objetivo',
          bullets: [
            'Transformar o atendimento da {{cliente.nome}} em um processo automatizado, ágil e escalável.',
            'Garantir triagem automática, follow-ups e campanhas em massa via WhatsApp.',
            'Oferecer análise em tempo real com painéis de produtos, vendas e atendimento.'
          ]
        }
      },
      {
        type: 'benefits',
        props: {
          title: 'Principais Benefícios',
          items: [
            { icon: '⚡', text: 'Atendimento automático 24/7 com encaminhamento para setores especializados.' },
            { icon: '📈', text: 'Relatórios e métricas em tempo real para decisões rápidas.' },
            { icon: '🔁', text: 'Follow-ups automáticos para reativar clientes inativos.' },
            { icon: '🎯', text: 'Campanhas segmentadas via API Oficial da Meta (WhatsApp).' }
          ]
        }
      },
      {
        type: 'scope',
        props: {
          title: 'Escopo da Solução',
          sections: [
            {
              title: 'Configuração de Infraestrutura',
              bullets: [
                'Servidor dedicado com segurança (backup, firewall, SSL, monitoramento).',
                'Instalação e configuração do n8n.',
                'Banco de dados PostgreSQL estruturado (clientes, pedidos, interações, métricas).'
              ]
            },
            {
              title: 'Fluxos de Atendimento Otimizados',
              bullets: [
                'Apresentação inicial e identificação da necessidade.',
                'Pedidos: identificação de produtos, retirada/entrega e resumo automático.',
                'Financeiro: direcionamento ao setor responsável.',
                'Dúvidas: respostas automáticas ou registro para tratativa humana.',
                'Follow-up automático se o cliente não responder.'
              ]
            },
            {
              title: 'Pós-Atendimento & Inteligência',
              bullets: [
                'Registro de todos os atendimentos no CRM/BD.',
                'Segmentação de clientes e relatórios de desempenho com insights estratégicos.'
              ]
            },
            {
              title: 'Estrutura de Disparo em Massa',
              bullets: [
                'Integração com API Oficial da Meta (WhatsApp).',
                'Segmentação por perfil de cliente e uso de templates aprovados.'
              ]
            },
            {
              title: 'Testes & Validação Rigorosos',
              bullets: [
                'Simulação de atendimentos reais.',
                'Testes de carga com múltiplos clientes simultâneos.',
                'Ajustes contínuos dos fluxos para máxima performance.'
              ]
            },
            {
              title: 'Suporte & Manutenção Contínuos',
              bullets: [
                'Monitoramento 24/7, correções em tempo real e melhorias evolutivas.',
                'Reuniões mensais de alinhamento estratégico.'
              ]
            }
          ]
        }
      },
      {
        type: 'timeline',
        props: {
          title: 'Planejamento & Cronograma (30 dias)',
          weeks: [
            { label: 'Semana 1', items: ['Kickoff e Infraestrutura', 'Provisionamento do servidor, Docker/n8n/BD, SSL, backups'] },
            { label: 'Semana 2', items: ['Implementação dos Fluxos', 'Triagem, pedidos, financeiro, dúvidas, integrações'] },
            { label: 'Semana 3', items: ['Automação e Relatórios', 'Follow-ups, integração CRM/BD, dashboards'] },
            { label: 'Semana 4', items: ['Finalização e Go-Live', 'API Meta, testes completos, treinamento da equipe'] }
          ],
          note: 'Prazo total estimado: 30 dias corridos para implementação completa.'
        }
      },
      {
        type: 'comparison',
        props: {
          title: 'Comparativo de Custos: Plataforma x Novo Funcionário',
          left: {
            heading: 'Contratação de Funcionário',
            bullets: [
              'Salário + encargos: entre R$ 2.500 e R$ 3.500/mês.',
              'Atendimento limitado a horário de expediente.',
              'Risco de erros manuais e ausência.',
              'Sem relatórios automáticos de performance.'
            ]
          },
          right: {
            heading: 'Plataforma {{fornecedor.nome}}',
            bullets: [
              'Atendimento automatizado 24/7.',
              'Follow-ups e campanhas automáticas.',
              'Relatórios em tempo real.',
              'Escalabilidade imediata.'
            ]
          },
          conclusion: 'Por um valor inferior ao de um novo funcionário, a {{cliente.nome}} terá acesso a uma plataforma robusta, escalável e com inteligência integrada.'
        }
      },
      {
        type: 'pricing',
        props: {
          title: 'Investimento',
          currency: '{{precos.moeda}}',
          items: '{{precos.itens}}',
          totals: {
            subtotal: '{{precos.subtotal}}',
            discount: '{{precos.desconto}}',
            taxes: '{{precos.impostos}}',
            total: '{{precos.total}}'
          },
          notes: [
            'Custos de disparos em massa via WhatsApp são cobrados diretamente pela Meta, conforme tabela oficial vigente.',
            'Consumo da API da OpenAI é cobrado diretamente pela OpenAI, conforme volume de processamento.'
          ]
        }
      },
      {
        type: 'chart_placeholder',
        props: {
          title: 'Distribuição do Investimento (1º ano)',
          description: 'Opcional: gráfico de barras/rosca mostrando Implementação x Manutenção.',
          data: '{{precos.chart_dados}}'
        }
      },
      {
        type: 'next_steps',
        props: {
          title: 'Próximos Passos',
          steps: [
            { title: 'Aprovação da Proposta', text: 'Análise e aprovação pela equipe da {{cliente.nome}}.' },
            { title: 'Assinatura de Contrato', text: 'Formalização do acordo e pagamento inicial ({{precos.pagamento_inicial}}).' },
            { title: 'Kickoff Técnico', text: 'Início da configuração de ambiente e fluxos com a equipe técnica.' }
          ]
        }
      },
      {
        type: 'partnership',
        props: {
          title: 'Parceria Estratégica',
          supplier: '{{fornecedor.nome}}',
          client: '{{cliente.nome}}',
          pillars: [
            { title: 'Inovação', text: 'Tecnologia de ponta para automatizar processos e melhorar a experiência do cliente.' },
            { title: 'Eficiência', text: 'Otimização de recursos com atendimento 24/7 e relatórios inteligentes.' },
            { title: 'Crescimento', text: 'Escalabilidade para acompanhar a expansão do negócio.' }
          ]
        }
      },
      {
        type: 'terms',
        props: {
          title: 'Condições & Validade',
          validade: '{{projeto.validade}}',
          condicoes: '{{precos.condicoes}}',
          legal: 'Ao aceitar, o cliente concorda com os termos comerciais e de privacidade (LGPD).'
        }
      },
      {
        type: 'signature',
        props: {
          cta: 'Aceitar e Assinar',
          signer_name: '{{cliente.nome}}',
          signer_email: '{{cliente.email}}'
        }
      }
    ]
  },
  default_variables: {
    cliente: { 
      nome: 'Camilotti Casa e Construção', 
      email: 'contato@cliente.com' 
    },
    fornecedor: { nome: 'Atendesoft' },
    projeto: { 
      titulo: 'Plataforma de Atendimento Inteligente e Automação', 
      validade: '7 dias' 
    },
    precos: {
      moeda: 'BRL',
      itens: [
        { 
          name: 'Implementação da Plataforma', 
          quantity: 1, 
          unit_price: 6000, 
          description: 'Configuração completa de infraestrutura e fluxos', 
          discount: 0, 
          tax_rate: 0 
        },
        { 
          name: 'Manutenção Mensal', 
          quantity: 12, 
          unit_price: 2300, 
          description: 'Suporte contínuo e melhorias evolutivas', 
          discount: 0, 
          tax_rate: 0 
        }
      ],
      condicoes: 'Implementação em até 30 dias após pagamento inicial. Faturamento mensal para manutenção.'
    }
  },
  is_active: true,
  created_by: '550e8400-e29b-41d4-a716-446655440000',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
