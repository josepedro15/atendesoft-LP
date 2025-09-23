import React, { useState, useEffect } from 'react';
import { ProposalTemplate, TemplateBlock, ProposalVariables } from '@/types/proposals';
import { renderTemplateBlocks } from '@/lib/template-engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Save, 
  Copy,
  Move,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplateEditorProps {
  template: ProposalTemplate;
  onSave: (template: ProposalTemplate) => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template, 
  onSave, 
  onCancel 
}) => {
  const [editedTemplate, setEditedTemplate] = useState<ProposalTemplate>(template);
  const [activeTab, setActiveTab] = useState('blocks');
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [previewVariables, setPreviewVariables] = useState<ProposalVariables>({
    cliente: { 
      nome: template.default_variables?.cliente?.nome || 'Cliente Exemplo',
      cnpj: template.default_variables?.cliente?.cnpj || '',
      email: template.default_variables?.cliente?.email || '',
      telefone: template.default_variables?.cliente?.telefone || '',
      empresa: template.default_variables?.cliente?.empresa || '',
      cargo: template.default_variables?.cliente?.cargo || ''
    },
    fornecedor: { 
      nome: template.default_variables?.fornecedor?.nome || 'AtendeSoft',
      marca: template.default_variables?.fornecedor?.marca || 'AtendeSoft',
      cnpj: template.default_variables?.fornecedor?.cnpj || '',
      endereco: template.default_variables?.fornecedor?.endereco || '',
      telefone: template.default_variables?.fornecedor?.telefone || '',
      email: template.default_variables?.fornecedor?.email || ''
    },
    projeto: { 
      titulo: template.default_variables?.projeto?.titulo || 'Projeto Exemplo',
      escopo: template.default_variables?.projeto?.escopo || '',
      cronograma: template.default_variables?.projeto?.cronograma || '',
      validade: template.default_variables?.projeto?.validade || '7 dias',
      objetivo: template.default_variables?.projeto?.objetivo || ''
    },
    precos: { 
      itens: template.default_variables?.precos?.itens || [],
      moeda: template.default_variables?.precos?.moeda || 'BRL',
      condicoes: template.default_variables?.precos?.condicoes || '50% à vista, 50% na entrega',
      total_formatado: template.default_variables?.precos?.total_formatado || ''
    }
  });

  // Atualizar preview quando template ou variáveis mudarem
  useEffect(() => {
    // Preview será renderizado automaticamente
  }, [editedTemplate, previewVariables]);

  const addBlock = (type: string) => {
    const newBlock: TemplateBlock = {
      type,
      props: getDefaultBlockProps(type),
      id: `block-${Date.now()}`
    };

    setEditedTemplate(prev => ({
      ...prev,
      content_json: {
        ...prev.content_json,
        blocks: [...prev.content_json.blocks, newBlock]
      }
    }));
  };

  const removeBlock = (index: number) => {
    setEditedTemplate(prev => ({
      ...prev,
      content_json: {
        ...prev.content_json,
        blocks: prev.content_json.blocks.filter((_, i) => i !== index)
      }
    }));
    setSelectedBlock(null);
  };

  const updateBlock = (index: number, updates: Partial<TemplateBlock>) => {
    setEditedTemplate(prev => ({
      ...prev,
      content_json: {
        ...prev.content_json,
        blocks: prev.content_json.blocks.map((block, i) => 
          i === index ? { ...block, ...updates } : block
        )
      }
    }));
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setEditedTemplate(prev => {
      const blocks = [...prev.content_json.blocks];
      const [movedBlock] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, movedBlock);
      
      return {
        ...prev,
        content_json: {
          ...prev.content_json,
          blocks
        }
      };
    });
  };

  const getDefaultBlockProps = (type: string): Record<string, any> => {
    const defaults: Record<string, any> = {
      hero: {
        title: '{{projeto.titulo}}',
        subtitle: '{{fornecedor.nome}} → {{cliente.nome}}',
        tagline: 'Descrição do projeto'
      },
      objective: {
        title: 'Objetivo',
        bullets: ['Objetivo 1', 'Objetivo 2']
      },
      benefits: {
        title: 'Benefícios',
        items: [
          { icon: '✓', text: 'Benefício 1' },
          { icon: '✓', text: 'Benefício 2' }
        ]
      },
      scope: {
        title: 'Escopo',
        sections: [
          {
            title: 'Seção 1',
            bullets: ['Item 1', 'Item 2']
          }
        ]
      },
      timeline: {
        title: 'Cronograma',
        weeks: [
          { label: 'Semana 1', items: ['Tarefa 1', 'Tarefa 2'] }
        ]
      },
      comparison: {
        title: 'Comparativo',
        left: { heading: 'Opção A', bullets: ['Vantagem 1'] },
        right: { heading: 'Opção B', bullets: ['Vantagem 1'] }
      },
      pricing: {
        title: 'Investimento',
        currency: 'BRL',
        items: [],
        notes: []
      },
      terms: {
        title: 'Termos',
        validade: '{{projeto.validade}}',
        condicoes: '{{precos.condicoes}}'
      },
      signature: {
        cta: 'Aceitar e Assinar',
        signer_name: '{{cliente.contato}}',
        signer_email: '{{cliente.email}}'
      }
    };

    return defaults[type] || {};
  };

  const blockTypes = [
    { type: 'hero', label: 'Hero', description: 'Cabeçalho principal' },
    { type: 'objective', label: 'Objetivo', description: 'Objetivos do projeto' },
    { type: 'benefits', label: 'Benefícios', description: 'Lista de benefícios' },
    { type: 'scope', label: 'Escopo', description: 'Escopo detalhado' },
    { type: 'timeline', label: 'Cronograma', description: 'Timeline do projeto' },
    { type: 'comparison', label: 'Comparativo', description: 'Comparação de opções' },
    { type: 'pricing', label: 'Preços', description: 'Tabela de preços' },
    { type: 'terms', label: 'Termos', description: 'Termos e condições' },
    { type: 'signature', label: 'Assinatura', description: 'Área de assinatura' }
  ];

  const renderBlockEditor = (block: TemplateBlock, index: number) => {
    const isSelected = selectedBlock === index;
    
    return (
      <motion.div
        key={block.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`border rounded-lg p-4 transition-all ${
          isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{block.type}</Badge>
            <span className="text-sm text-gray-600">Bloco {index + 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedBlock(isSelected ? null : index)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeBlock(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {renderBlockPropsEditor(block, index)}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderBlockPropsEditor = (block: TemplateBlock, index: number) => {
    const { type, props } = block;

    switch (type) {
      case 'hero':
        return (
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input
                value={props.title || ''}
                onChange={(e) => updateBlock(index, {
                  props: { ...props, title: e.target.value }
                })}
                placeholder="Título da proposta"
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={props.subtitle || ''}
                onChange={(e) => updateBlock(index, {
                  props: { ...props, subtitle: e.target.value }
                })}
                placeholder="Fornecedor → Cliente"
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Textarea
                value={props.tagline || ''}
                onChange={(e) => updateBlock(index, {
                  props: { ...props, tagline: e.target.value }
                })}
                placeholder="Descrição do projeto"
                rows={2}
              />
            </div>
          </div>
        );

      case 'objective':
        return (
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input
                value={props.title || ''}
                onChange={(e) => updateBlock(index, {
                  props: { ...props, title: e.target.value }
                })}
                placeholder="Objetivo"
              />
            </div>
            <div>
              <Label>Objetivos</Label>
              <div className="space-y-2">
                {(props.bullets || []).map((bullet: string, bulletIndex: number) => (
                  <div key={bulletIndex} className="flex space-x-2">
                    <Input
                      value={bullet}
                      onChange={(e) => {
                        const newBullets = [...(props.bullets || [])];
                        newBullets[bulletIndex] = e.target.value;
                        updateBlock(index, {
                          props: { ...props, bullets: newBullets }
                        });
                      }}
                      placeholder="Objetivo"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const newBullets = (props.bullets || []).filter((_, i) => i !== bulletIndex);
                        updateBlock(index, {
                          props: { ...props, bullets: newBullets }
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newBullets = [...(props.bullets || []), 'Novo objetivo'];
                    updateBlock(index, {
                      props: { ...props, bullets: newBullets }
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input
                value={props.title || ''}
                onChange={(e) => updateBlock(index, {
                  props: { ...props, title: e.target.value }
                })}
                placeholder="Investimento"
              />
            </div>
            <div>
              <Label>Moeda</Label>
              <Input
                value={props.currency || ''}
                onChange={(e) => updateBlock(index, {
                  props: { ...props, currency: e.target.value }
                })}
                placeholder="BRL"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            Editor para {type} em desenvolvimento
          </div>
        );
    }
  };

  const handleSave = () => {
    onSave({
      ...editedTemplate,
      updated_at: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Editor de Template</h1>
            <p className="text-gray-600">Edite o template: {editedTemplate.name}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blocks">Blocos</TabsTrigger>
          <TabsTrigger value="variables">Variáveis</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Template</CardTitle>
              <CardDescription>
                Adicione, edite e organize os blocos da proposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {editedTemplate.content_json.blocks.map((block, index) => 
                    renderBlockEditor(block, index)
                  )}
                </AnimatePresence>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Adicionar Bloco</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {blockTypes.map((blockType) => (
                      <Button
                        key={blockType.type}
                        variant="outline"
                        className="h-auto p-3 flex flex-col items-start"
                        onClick={() => addBlock(blockType.type)}
                      >
                        <span className="font-medium">{blockType.label}</span>
                        <span className="text-xs text-gray-500">{blockType.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Variáveis Padrão</CardTitle>
              <CardDescription>
                Configure as variáveis padrão do template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={editedTemplate.default_variables?.cliente?.nome || ''}
                    onChange={(e) => setEditedTemplate(prev => ({
                      ...prev,
                      default_variables: {
                        ...prev.default_variables,
                        cliente: {
                          ...prev.default_variables?.cliente,
                          nome: e.target.value
                        }
                      }
                    }))}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <Label>Nome do Fornecedor</Label>
                  <Input
                    value={editedTemplate.default_variables?.fornecedor?.nome || ''}
                    onChange={(e) => setEditedTemplate(prev => ({
                      ...prev,
                      default_variables: {
                        ...prev.default_variables,
                        fornecedor: {
                          ...prev.default_variables?.fornecedor,
                          nome: e.target.value
                        }
                      }
                    }))}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div>
                  <Label>Título do Projeto</Label>
                  <Input
                    value={editedTemplate.default_variables?.projeto?.titulo || ''}
                    onChange={(e) => setEditedTemplate(prev => ({
                      ...prev,
                      default_variables: {
                        ...prev.default_variables,
                        projeto: {
                          ...prev.default_variables?.projeto,
                          titulo: e.target.value
                        }
                      }
                    }))}
                    placeholder="Título do projeto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Proposta</CardTitle>
              <CardDescription>
                Visualize como a proposta ficará com as variáveis preenchidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white">
                <div 
                  dangerouslySetInnerHTML={{
                    __html: renderTemplateBlocks(
                      editedTemplate.content_json.blocks,
                      previewVariables
                    )
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateEditor;
