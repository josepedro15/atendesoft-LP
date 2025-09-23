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
