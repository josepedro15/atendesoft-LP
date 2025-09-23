// Armazenamento temporário em memória para desenvolvimento
// TODO: Substituir por Supabase quando RLS estiver configurado

interface MockProposal {
  id: string;
  title: string;
  client_id: string | null;
  owner_id: string;
  currency: string;
  status: string;
  valid_until: string | null;
  approval_required: boolean;
  created_at: string;
  updated_at: string;
  client?: any;
  versions?: any[];
  latest_version?: any;
}

interface MockVersion {
  id: string;
  proposal_id: string;
  version_number: number;
  snapshot_html: string;
  snapshot_json: any;
  variables: any;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  public_token: string;
  public_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Armazenamento em memória
const mockProposals: Map<string, MockProposal> = new Map();
const mockVersions: Map<string, MockVersion> = new Map();

// Adicionar dados de exemplo para desenvolvimento
const exampleProposal: MockProposal = {
  id: 'prop-example-1',
  title: 'Proposta de Exemplo',
  client_id: 'client-1',
  owner_id: '550e8400-e29b-41d4-a716-446655440000',
  currency: 'BRL',
  status: 'draft',
  valid_until: null,
  approval_required: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  client: {
    id: 'client-1',
    name: 'Camilotti Casa e Construção',
    email: 'contato@camilotti.com',
    phone: '(11) 99999-9999'
  },
  versions: [],
  latest_version: null
};

// Criar versão de exemplo
const exampleVersion: MockVersion = {
  id: 'version-example-1',
  proposal_id: 'prop-example-1',
  version_number: 1,
  snapshot_html: '<div class="proposal-content"><h1>Proposta de Exemplo</h1><p>Esta é uma proposta de exemplo para demonstração.</p></div>',
  snapshot_json: {
    blocks: [
      {
        type: 'header',
        content: 'Proposta de Exemplo',
        style: { fontSize: '24px', fontWeight: 'bold' }
      },
      {
        type: 'text',
        content: 'Esta é uma proposta de exemplo para demonstração do sistema.',
        style: { fontSize: '16px' }
      }
    ],
    variables: {
      cliente: {
        nome: 'Camilotti Casa e Construção',
        empresa: 'Camilotti Casa e Construção',
        email: 'contato@camilotti.com',
        telefone: '(11) 99999-9999'
      },
      fornecedor: {
        nome: 'AtendeSoft',
        marca: 'AtendeSoft'
      },
      projeto: {
        titulo: 'Proposta de Exemplo',
        validade: '7 dias'
      },
      precos: {
        itens: [
          {
            name: 'Desenvolvimento de Sistema',
            description: 'Sistema completo de automação',
            quantity: 1,
            unit_price: 5000.00,
            discount: 0,
            tax_rate: 0
          }
        ],
        moeda: 'BRL',
        condicoes: '50% à vista, 50% na entrega'
      }
    }
  },
  variables: {
    cliente: {
      nome: 'Camilotti Casa e Construção',
      empresa: 'Camilotti Casa e Construção',
      email: 'contato@camilotti.com',
      telefone: '(11) 99999-9999'
    },
    fornecedor: {
      nome: 'AtendeSoft',
      marca: 'AtendeSoft'
    },
    projeto: {
      titulo: 'Proposta de Exemplo',
      validade: '7 dias'
    },
    precos: {
      itens: [
        {
          name: 'Desenvolvimento de Sistema',
          description: 'Sistema completo de automação',
          quantity: 1,
          unit_price: 5000.00,
          discount: 0,
          tax_rate: 0
        }
      ],
      moeda: 'BRL',
      condicoes: '50% à vista, 50% na entrega'
    }
  },
  total_amount: 5000.00,
  discount_amount: 0,
  tax_amount: 0,
  public_token: '70d8bff46fa8abda0330312270d672332b60bc06754cca93e897774bc027abb8',
  public_url: 'https://atendesoft.com/p/70d8bff46fa8abda0330312270d672332b60bc06754cca93e897774bc027abb8',
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Inicializar com dados de exemplo
mockProposals.set(exampleProposal.id, exampleProposal);
mockVersions.set(exampleVersion.id, exampleVersion);

// Atualizar a proposta com a versão
const updatedProposal = {
  ...exampleProposal,
  versions: [exampleVersion],
  latest_version: exampleVersion,
  status: 'ready_to_send'
};
mockProposals.set(exampleProposal.id, updatedProposal);

export const mockStorage = {
  // Propostas
  createProposal: (proposal: MockProposal) => {
    mockProposals.set(proposal.id, proposal);
    return proposal;
  },

  getProposal: (id: string) => {
    return mockProposals.get(id) || null;
  },

  getAllProposals: () => {
    return Array.from(mockProposals.values());
  },

  updateProposal: (id: string, updates: Partial<MockProposal>) => {
    const proposal = mockProposals.get(id);
    if (proposal) {
      const updated = { ...proposal, ...updates, updated_at: new Date().toISOString() };
      mockProposals.set(id, updated);
      return updated;
    }
    return null;
  },

  // Versões
  createVersion: (version: MockVersion) => {
    mockVersions.set(version.id, version);
    
    // Atualizar proposta com a nova versão
    const proposal = mockProposals.get(version.proposal_id);
    if (proposal) {
      const versions = proposal.versions || [];
      versions.unshift(version); // Adicionar no início
      const updatedProposal = {
        ...proposal,
        versions,
        latest_version: version,
        status: 'ready_to_send',
        updated_at: new Date().toISOString()
      };
      mockProposals.set(version.proposal_id, updatedProposal);
    }
    
    return version;
  },

  getVersion: (id: string) => {
    return mockVersions.get(id) || null;
  },

  getVersionsByProposal: (proposalId: string) => {
    return Array.from(mockVersions.values()).filter(v => v.proposal_id === proposalId);
  }
};
