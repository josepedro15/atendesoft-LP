import { useState, useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import ParallaxBackground from "@/components/ParallaxBackground";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "motion/react";

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
  Copy
} from "lucide-react";

// Tipos para a proposta
interface Cliente {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  cargo?: string;
}

interface ItemProposta {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  categoria: string;
}

interface Proposta {
  id: string;
  titulo: string;
  cliente: Cliente;
  dataValidade: string;
  observacoes: string;
  itens: ItemProposta[];
  desconto: number;
  valorTotal: number;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada';
  dataCriacao: string;
}

function PropostasContent() {
  const { user } = useAuth();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [propostaAtual, setPropostaAtual] = useState<Proposta | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('lista');

  // Dados mockados para demonstração
  useEffect(() => {
    const propostasMock: Proposta[] = [
      {
        id: '1',
        titulo: 'Proposta - Automação WhatsApp + Dashboard BI',
        cliente: {
          nome: 'João Silva',
          empresa: 'TechCorp Ltda',
          email: 'joao@techcorp.com',
          telefone: '(11) 99999-9999',
          cargo: 'CEO'
        },
        dataValidade: '2025-02-15',
        observacoes: 'Proposta para implementação completa de automação WhatsApp com dashboard BI personalizado.',
        itens: [
          {
            id: '1',
            descricao: 'Automação WhatsApp Business API',
            quantidade: 1,
            valorUnitario: 2500,
            valorTotal: 2500,
            categoria: 'Automação'
          },
          {
            id: '2',
            descricao: 'Dashboard BI com IA',
            quantidade: 1,
            valorUnitario: 3500,
            valorTotal: 3500,
            categoria: 'Dashboard'
          },
          {
            id: '3',
            descricao: 'Treinamento da equipe',
            quantidade: 1,
            valorUnitario: 800,
            valorTotal: 800,
            categoria: 'Treinamento'
          }
        ],
        desconto: 0,
        valorTotal: 6800,
        status: 'enviada',
        dataCriacao: '2025-01-18'
      }
    ];
    setPropostas(propostasMock);
  }, []);

  const handleNovaProposta = () => {
    const novaProposta: Proposta = {
      id: Date.now().toString(),
      titulo: 'Nova Proposta',
      cliente: {
        nome: '',
        empresa: '',
        email: '',
        telefone: '',
        cargo: ''
      },
      dataValidade: '',
      observacoes: '',
      itens: [],
      desconto: 0,
      valorTotal: 0,
      status: 'rascunho',
      dataCriacao: new Date().toISOString().split('T')[0]
    };
    setPropostaAtual(novaProposta);
    setModoEdicao(true);
    setAbaAtiva('editar');
  };

  const handleSalvarProposta = () => {
    if (!propostaAtual) return;
    
    const propostasAtualizadas = propostas.filter(p => p.id !== propostaAtual.id);
    propostasAtualizadas.push(propostaAtual);
    setPropostas(propostasAtualizadas);
    setModoEdicao(false);
    setAbaAtiva('lista');
  };

  const handleEnviarProposta = () => {
    if (!propostaAtual) return;
    
    // Aqui seria implementada a lógica de envio por email
    console.log('Enviando proposta:', propostaAtual);
    
    // Atualizar status para enviada
    const propostaEnviada = { ...propostaAtual, status: 'enviada' as const };
    setPropostaAtual(propostaEnviada);
    handleSalvarProposta();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho': return 'bg-gray-100 text-gray-800';
      case 'enviada': return 'bg-blue-100 text-blue-800';
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'rascunho': return 'Rascunho';
      case 'enviada': return 'Enviada';
      case 'aprovada': return 'Aprovada';
      case 'rejeitada': return 'Rejeitada';
      default: return 'Desconhecido';
    }
  };

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
                <p className="text-sm text-muted-foreground">Crie e gerencie propostas personalizadas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleNovaProposta}
                className="btn-primary"
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
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lista">Lista de Propostas</TabsTrigger>
            <TabsTrigger value="editar" disabled={!propostaAtual}>
              {propostaAtual ? 'Editar Proposta' : 'Nova Proposta'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{propostas.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Enviadas</p>
                      <p className="text-2xl font-bold">
                        {propostas.filter(p => p.status === 'enviada').length}
                      </p>
                    </div>
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                      <p className="text-2xl font-bold">
                        {propostas.filter(p => p.status === 'aprovada').length}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                      <p className="text-2xl font-bold">
                        R$ {propostas.reduce((acc, p) => acc + p.valorTotal, 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Propostas */}
            <div className="space-y-4">
              {propostas.map((proposta) => (
                <motion.div
                  key={proposta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{proposta.titulo}</h3>
                            <Badge className={getStatusColor(proposta.status)}>
                              {getStatusText(proposta.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4" />
                              <span>{proposta.cliente.empresa}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{proposta.cliente.nome}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4" />
                              <span>R$ {proposta.valorTotal.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPropostaAtual(proposta);
                              setModoEdicao(true);
                              setAbaAtiva('editar');
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editar" className="space-y-6">
            {propostaAtual && (
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
                          value={propostaAtual.titulo}
                          onChange={(e) => setPropostaAtual({
                            ...propostaAtual,
                            titulo: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataValidade">Data de Validade</Label>
                        <Input
                          id="dataValidade"
                          type="date"
                          value={propostaAtual.dataValidade}
                          onChange={(e) => setPropostaAtual({
                            ...propostaAtual,
                            dataValidade: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clienteNome">Nome do Cliente</Label>
                        <Input
                          id="clienteNome"
                          value={propostaAtual.cliente.nome}
                          onChange={(e) => setPropostaAtual({
                            ...propostaAtual,
                            cliente: { ...propostaAtual.cliente, nome: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="clienteEmpresa">Empresa</Label>
                        <Input
                          id="clienteEmpresa"
                          value={propostaAtual.cliente.empresa}
                          onChange={(e) => setPropostaAtual({
                            ...propostaAtual,
                            cliente: { ...propostaAtual.cliente, empresa: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="clienteEmail">Email</Label>
                        <Input
                          id="clienteEmail"
                          type="email"
                          value={propostaAtual.cliente.email}
                          onChange={(e) => setPropostaAtual({
                            ...propostaAtual,
                            cliente: { ...propostaAtual.cliente, email: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="clienteTelefone">Telefone</Label>
                        <Input
                          id="clienteTelefone"
                          value={propostaAtual.cliente.telefone}
                          onChange={(e) => setPropostaAtual({
                            ...propostaAtual,
                            cliente: { ...propostaAtual.cliente, telefone: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={propostaAtual.observacoes}
                        onChange={(e) => setPropostaAtual({
                          ...propostaAtual,
                          observacoes: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Itens da Proposta */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Itens da Proposta</CardTitle>
                        <CardDescription>
                          Adicione os produtos e serviços da proposta
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => {
                          const novoItem: ItemProposta = {
                            id: Date.now().toString(),
                            descricao: '',
                            quantidade: 1,
                            valorUnitario: 0,
                            valorTotal: 0,
                            categoria: 'Serviço'
                          };
                          setPropostaAtual({
                            ...propostaAtual,
                            itens: [...propostaAtual.itens, novoItem]
                          });
                        }}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {propostaAtual.itens.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                          <div className="md:col-span-2">
                            <Label>Descrição</Label>
                            <Input
                              value={item.descricao}
                              onChange={(e) => {
                                const novosItens = [...propostaAtual.itens];
                                novosItens[index] = { ...item, descricao: e.target.value };
                                setPropostaAtual({ ...propostaAtual, itens: novosItens });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Qtd</Label>
                            <Input
                              type="number"
                              value={item.quantidade}
                              onChange={(e) => {
                                const qtd = parseInt(e.target.value) || 0;
                                const novosItens = [...propostaAtual.itens];
                                novosItens[index] = { 
                                  ...item, 
                                  quantidade: qtd,
                                  valorTotal: qtd * item.valorUnitario
                                };
                                setPropostaAtual({ ...propostaAtual, itens: novosItens });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Valor Unit.</Label>
                            <Input
                              type="number"
                              value={item.valorUnitario}
                              onChange={(e) => {
                                const valor = parseFloat(e.target.value) || 0;
                                const novosItens = [...propostaAtual.itens];
                                novosItens[index] = { 
                                  ...item, 
                                  valorUnitario: valor,
                                  valorTotal: item.quantidade * valor
                                };
                                setPropostaAtual({ ...propostaAtual, itens: novosItens });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Total</Label>
                            <Input
                              value={`R$ ${item.valorTotal.toLocaleString()}`}
                              disabled
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const novosItens = propostaAtual.itens.filter(i => i.id !== item.id);
                                setPropostaAtual({ ...propostaAtual, itens: novosItens });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Resumo Financeiro */}
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total da Proposta:</span>
                        <span className="text-2xl font-bold text-primary">
                          R$ {propostaAtual.itens.reduce((acc, item) => acc + item.valorTotal, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setModoEdicao(false);
                      setAbaAtiva('lista');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSalvarProposta}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    onClick={handleEnviarProposta}
                    className="btn-primary"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Proposta
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

const PropostasPage = () => {
  // Initialize scroll tracking for analytics
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
