// Página de Propostas Comerciais - Sistema Completo
import { useState, useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import ParallaxBackground from "@/components/ParallaxBackground";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "motion/react";
import { 
  Proposal, 
  ProposalVersion, 
  ProposalTemplate, 
  CatalogItem,
  ProposalVariables,
  TemplateBlock,
  CreateProposalData,
  PublishVersionData,
  SendProposalData,
  Client
} from "@/types/proposals";

// Componentes de UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Ícones
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Download, 
  Eye, 
  Edit,
  FileText,
  DollarSign,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  Copy,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

function PropostasContent() {
  const { user } = useAuth();
  
  // Estado principal
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  
  // Estado da proposta atual
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [currentVersion, setCurrentVersion] = useState<ProposalVersion | null>(null);
  const [proposalVariables, setProposalVariables] = useState<ProposalVariables | null>(null);
  const [proposalBlocks, setProposalBlocks] = useState<TemplateBlock[]>([]);
  
  // Estado da UI
  const [activeTab, setActiveTab] = useState('lista');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Carregar dados iniciais
  useEffect(() => {
    loadProposals();
    loadTemplates();
    loadCatalogItems();
    loadClients();
  }, []);

  const loadProposals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/proposals');
      const data = await response.json();
      
      if (data.success) {
        setProposals(data.data.proposals || []);
      } else {
        setError(data.error || 'Erro ao carregar propostas');
      }
    } catch (error) {
      setError('Erro ao carregar propostas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/proposal-templates');
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const loadCatalogItems = async () => {
    try {
      const response = await fetch('/api/catalog/items');
      const data = await response.json();
      
      if (data.success) {
        setCatalogItems(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      
      if (data.success) {
        setClients(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const loadProposalForEdit = async (proposalId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/proposals/${proposalId}`);
      const data = await response.json();
      
      if (data.success) {
        const proposal = data.data;
        setCurrentProposal(proposal);
        
        // Se a proposta tem uma versão, carregar os dados de edição
        if (proposal.latest_version) {
          setCurrentVersion(proposal.latest_version);
          setProposalVariables(proposal.latest_version.variables || null);
          setProposalBlocks(proposal.latest_version.blocks || []);
        } else {
          // Se não tem versão, inicializar com dados padrão
          setProposalVariables({
            cliente: {
              nome: '',
              empresa: '',
              email: '',
              telefone: ''
            },
            fornecedor: {
              nome: 'AtendeSoft',
              marca: 'AtendeSoft'
            },
            projeto: {
              titulo: proposal.title,
              validade: '7 dias'
            },
            precos: {
              itens: [],
              moeda: 'BRL',
              condicoes: '50% à vista, 50% na entrega'
            }
          });
          setProposalBlocks([]);
        }
        
        setActiveTab('editar');
      } else {
        setError(data.error || 'Erro ao carregar proposta');
      }
    } catch (error) {
      setError('Erro ao carregar proposta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    try {
      setIsLoading(true);
      
      const proposalData: CreateProposalData = {
        title: 'Nova Proposta'
      };

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentProposal(data.data);
        setActiveTab('editar');
        await loadProposals();
      } else {
        setError(data.error || 'Erro ao criar proposta');
      }
    } catch (error) {
      setError('Erro ao criar proposta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = async (template: ProposalTemplate) => {
    try {
      setIsLoading(true);
      
      // Se não há proposta atual, criar uma nova
      if (!currentProposal) {
        const proposalData: CreateProposalData = {
          title: `Proposta - ${template.name}`
        };

        const response = await fetch('/api/proposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proposalData)
        });

        const data = await response.json();
        
        if (data.success) {
          setCurrentProposal(data.data);
        } else {
          setError(data.error || 'Erro ao criar proposta');
          return;
        }
      }

      // Aplicar template
      setProposalBlocks(template.content_json?.blocks || []);
      setProposalVariables({
        ...template.default_variables,
        cliente: {
          nome: '',
          empresa: '',
          email: '',
          telefone: ''
        },
        fornecedor: {
          nome: 'AtendeSoft',
          marca: 'AtendeSoft'
        },
        projeto: {
          titulo: currentProposal?.title || `Proposta - ${template.name}`,
          validade: '7 dias'
        },
        precos: {
          itens: [],
          moeda: 'BRL',
          condicoes: '50% à vista, 50% na entrega'
        }
      });
      
      setShowTemplateModal(false);
      setActiveTab('editar');
      
    } catch (error) {
      setError('Erro ao aplicar template');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishVersion = async () => {
    if (!currentProposal || !proposalVariables || !proposalBlocks) return;

    try {
      setIsLoading(true);
      
      const versionData: PublishVersionData = {
        variables: proposalVariables,
        blocks: proposalBlocks
      };

      const response = await fetch(`/api/proposals/${currentProposal.id}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(versionData)
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentVersion(data.data);
        setActiveTab('lista');
        await loadProposals();
      } else {
        setError(data.error || 'Erro ao publicar versão');
      }
    } catch (error) {
      setError('Erro ao publicar versão');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendProposal = async (sendData: SendProposalData) => {
    if (!currentProposal) return;

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/proposals/${currentProposal.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowSendModal(false);
        await loadProposals();
      } else {
        setError(data.error || 'Erro ao enviar proposta');
      }
    } catch (error) {
      setError('Erro ao enviar proposta');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ready_to_send': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      case 'viewed': return 'bg-purple-100 text-purple-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'won': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'ready_to_send': return 'Pronta para Envio';
      case 'sent': return 'Enviada';
      case 'viewed': return 'Visualizada';
      case 'signed': return 'Assinada';
      case 'won': return 'Ganha';
      case 'lost': return 'Perdida';
      case 'expired': return 'Expirada';
      default: return 'Desconhecido';
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background relative">
      <ParallaxBackground />
      
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-lg relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Propostas Comerciais</h1>
                <p className="text-sm text-muted-foreground">Sistema completo de gestão de propostas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleCreateProposal}
                className="btn-primary"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Proposta
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lista">Lista de Propostas</TabsTrigger>
            <TabsTrigger value="editar" disabled={!currentProposal}>
              {currentProposal ? 'Editar Proposta' : 'Nova Proposta'}
            </TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-6">
            {/* Filtros e Busca */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar propostas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="ready_to_send">Pronta para Envio</SelectItem>
                      <SelectItem value="sent">Enviada</SelectItem>
                      <SelectItem value="viewed">Visualizada</SelectItem>
                      <SelectItem value="signed">Assinada</SelectItem>
                      <SelectItem value="won">Ganha</SelectItem>
                      <SelectItem value="lost">Perdida</SelectItem>
                      <SelectItem value="expired">Expirada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Propostas */}
            <div className="space-y-4">
              {filteredProposals.map((proposal) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{proposal.title}</h3>
                            <Badge className={getStatusColor(proposal.status)}>
                              {getStatusText(proposal.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4" />
                              <span>{proposal.client?.name || 'Cliente não definido'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {proposal.latest_version?.total_amount 
                                  ? new Intl.NumberFormat('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL'
                                    }).format(proposal.latest_version.total_amount)
                                  : 'Valor não definido'
                                }
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(proposal.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadProposalForEdit(proposal.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {proposal.latest_version && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(proposal.latest_version!.public_url, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {proposal.status === 'ready_to_send' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCurrentProposal(proposal);
                                setShowSendModal(true);
                              }}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editar" className="space-y-6">
            {currentProposal && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                    <CardDescription>
                      Dados da proposta e informações do cliente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="titulo">Título da Proposta</Label>
                        <Input
                          id="titulo"
                          value={currentProposal.title}
                          onChange={(e) => setCurrentProposal({
                            ...currentProposal,
                            title: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cliente">Cliente</Label>
                        <Select
                          value={currentProposal.client_id || ''}
                          onValueChange={(value) => setCurrentProposal({
                            ...currentProposal,
                            client_id: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Template */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Template</CardTitle>
                        <CardDescription>
                          Selecione um template para sua proposta
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setShowTemplateModal(true)}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Selecionar Template
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {proposalBlocks.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Template selecionado com {proposalBlocks.length} blocos
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {proposalBlocks.map((block, index) => (
                            <Badge key={index} variant="secondary">
                              {block.type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum template selecionado
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentProposal(null);
                      setActiveTab('lista');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handlePublishVersion}
                    disabled={!proposalBlocks.length || !proposalVariables}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Publicar Versão
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {(template.content_json?.blocks || []).length} blocos
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(template.content_json?.blocks || []).slice(0, 3).map((block, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {block.type}
                          </Badge>
                        ))}
                        {(template.content_json?.blocks || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(template.content_json?.blocks || []).length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Seleção de Template */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Selecionar Template</DialogTitle>
            <DialogDescription>
              Escolha um template para sua proposta
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {(template.content_json?.blocks || []).length} blocos
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(template.content_json?.blocks || []).slice(0, 4).map((block, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {block.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Envio */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Proposta</DialogTitle>
            <DialogDescription>
              Escolha o canal de envio para sua proposta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Canal de Envio</Label>
              <Select defaultValue="link">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link Público</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowSendModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                if (currentProposal) {
                  handleSendProposal({
                    channel: 'link',
                    message: ''
                  });
                }
              }}>
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const PropostasPage = () => {
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <ProtectedRoute>
      <PropostasContent />
    </ProtectedRoute>
  );
};

export default PropostasPage;
