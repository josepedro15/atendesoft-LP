// Tipos para o Módulo de Propostas Comerciais
// Baseado na especificação funcional e técnica

export type ProposalStatus =
  | 'draft'
  | 'review'
  | 'ready_to_send'
  | 'sent'
  | 'viewed'
  | 'signed'
  | 'won'
  | 'lost'
  | 'expired'
  | 'awaiting_approval'
  | 'approved'
  | 'rejected';

export type ProposalEventType =
  | 'sent'
  | 'open'
  | 'scroll'
  | 'section_view'
  | 'download_pdf'
  | 'accept_click'
  | 'signature_start'
  | 'signature_complete'
  | 'signature_rejected';

export type SignatureMethod = 'draw' | 'type' | 'clickwrap';

export type UserRole = 'admin' | 'gestor' | 'vendedor' | 'visualizador';

// Cliente
export interface Client {
  id: string;
  name: string;
  document?: string; // CNPJ/CPF
  email?: string;
  phone?: string;
  company_size?: string;
  segment?: string;
  created_at: string;
  updated_at: string;
}

// Item de preço
export interface PriceItem {
  id?: string;
  sku?: string;
  name: string;
  description?: string;
  quantity: number; // permite decimais
  unit_price: number;
  discount?: number; // valor
  tax_rate?: number; // %
  category?: string;
}

// Variáveis da proposta
export interface ProposalVariables {
  cliente: {
    nome: string;
    cnpj?: string;
    email?: string;
    telefone?: string;
    empresa?: string;
    cargo?: string;
  };
  fornecedor: {
    nome: string;
    marca?: string;
    cnpj?: string;
    endereco?: string;
    telefone?: string;
    email?: string;
  };
  projeto: {
    titulo: string;
    escopo?: string;
    cronograma?: string;
    validade?: string;
    objetivo?: string;
  };
  precos: {
    itens: PriceItem[];
    moeda?: string;
    condicoes?: string;
    total_formatado?: string;
  };
}

// Bloco de template
export interface TemplateBlock {
  type: string;
  props: Record<string, any>;
  id?: string;
}

// Template de proposta
export interface ProposalTemplate {
  id: string;
  name: string;
  description?: string;
  content_json: {
    blocks: TemplateBlock[];
  };
  default_variables?: Partial<ProposalVariables>;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Proposta principal
export interface Proposal {
  id: string;
  client_id?: string;
  owner_id: string;
  title: string;
  currency: string;
  status: ProposalStatus;
  valid_until?: string;
  approval_required: boolean;
  approvals?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  client?: Client;
  versions?: ProposalVersion[];
  latest_version?: ProposalVersion;
}

// Versão da proposta (imutável)
export interface ProposalVersion {
  id: string;
  proposal_id: string;
  version_number: number;
  snapshot_html: string;
  snapshot_json: {
    blocks: TemplateBlock[];
    variables: ProposalVariables;
  };
  variables: ProposalVariables;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  public_token: string;
  public_url: string;
  pdf_file_id?: string;
  created_at: string;
  // Relacionamentos
  proposal?: Proposal;
  items?: ProposalVersionItem[];
  events?: ProposalEvent[];
  signatures?: ProposalSignature[];
}

// Item da versão
export interface ProposalVersionItem {
  id: string;
  version_id: string;
  sku?: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_rate: number;
}

// Evento de rastreamento
export interface ProposalEvent {
  id: string;
  proposal_id: string;
  version_id?: string;
  type: ProposalEventType;
  metadata?: Record<string, any>;
  ip?: string;
  user_agent?: string;
  created_at: string;
}

// Assinatura
export interface ProposalSignature {
  id: string;
  proposal_id: string;
  version_id?: string;
  signer_name: string;
  signer_email: string;
  method: SignatureMethod;
  signature_data: string; // base64, texto ou hash
  signed_at: string;
  ip?: string;
  hash: string; // hash do snapshot para imutabilidade
}

// Arquivo
export interface File {
  id: string;
  path: string;
  mime?: string;
  size?: number;
  created_at: string;
}

// Item do catálogo
export interface CatalogItem {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  category?: string;
  unit_price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Dados para criação de proposta
export interface CreateProposalData {
  title: string;
  client_id?: string;
  template_id?: string;
  variables?: Partial<ProposalVariables>;
  valid_until?: string;
}

// Dados para publicação de versão
export interface PublishVersionData {
  variables: ProposalVariables;
  blocks: TemplateBlock[];
}

// Dados para envio
export interface SendProposalData {
  channel: 'whatsapp' | 'email' | 'link';
  message?: string;
  recipient_email?: string;
  recipient_phone?: string;
}

// Dados para assinatura
export interface SignatureData {
  signer_name: string;
  signer_email: string;
  method: SignatureMethod;
  signature_data: string;
}

// Resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filtros para listagem
export interface ProposalFilters {
  status?: ProposalStatus[];
  owner_id?: string;
  client_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Estatísticas
export interface ProposalStats {
  total: number;
  sent: number;
  viewed: number;
  signed: number;
  won: number;
  lost: number;
  expired: number;
  total_value: number;
  average_value: number;
  conversion_rate: number;
}

// Configurações do sistema
export interface ProposalConfig {
  default_validity_days: number;
  max_discount_percentage: number;
  approval_required_amount: number;
  public_token_expiry_days: number;
  max_signature_attempts: number;
}

// Webhook payload
export interface WebhookPayload {
  event: string;
  proposal_id: string;
  version_id?: string;
  client?: Client;
  amount?: number;
  timestamp: string;
  signature?: {
    method: SignatureMethod;
    ip?: string;
  };
  metadata?: Record<string, any>;
}

// Template helpers
export interface TemplateHelper {
  name: string;
  fn: (...args: any[]) => string;
}

// Contexto do template
export interface TemplateContext {
  variables: ProposalVariables;
  helpers: Record<string, TemplateHelper>;
  partials?: Record<string, string>;
}
