// Engine de Templates para Propostas Comerciais
// Implementa sintaxe Handlebars-like para renderização de templates

import { ProposalVariables, TemplateBlock, TemplateHelper, TemplateContext } from '@/types/proposals';

// Helpers padrão para templates
const defaultHelpers: Record<string, TemplateHelper> = {
  // Formatação de moeda
  currency: {
    name: 'currency',
    fn: (value: number, currency = 'BRL') => {
      if (typeof value !== 'number') return '0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency === 'BRL' ? 'BRL' : 'USD'
      }).format(value);
    }
  },

  // Formatação de percentual
  percent: {
    name: 'percent',
    fn: (value: number, decimals = 2) => {
      if (typeof value !== 'number') return '0%';
      return `${value.toFixed(decimals)}%`;
    }
  },

  // Formatação de data
  date: {
    name: 'date',
    fn: (value: string | Date, format = 'dd/MM/yyyy') => {
      if (!value) return '';
      const date = typeof value === 'string' ? new Date(value) : value;
      if (isNaN(date.getTime())) return '';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year.toString());
    }
  },

  // Cálculo de total
  calcTotal: {
    name: 'calcTotal',
    fn: (quantity: number, unitPrice: number, discount = 0) => {
      const subtotal = quantity * unitPrice;
      return (subtotal - discount).toString();
    }
  },

  // Formatação de texto
  uppercase: {
    name: 'uppercase',
    fn: (text: string) => {
      return typeof text === 'string' ? text.toUpperCase() : '';
    }
  },

  lowercase: {
    name: 'lowercase',
    fn: (text: string) => {
      return typeof text === 'string' ? text.toLowerCase() : '';
    }
  },

  // Condicionais
  if: {
    name: 'if',
    fn: (condition: any, trueValue: string, falseValue = '') => {
      return condition ? trueValue : falseValue;
    }
  },

  // Comparações
  eq: {
    name: 'eq',
    fn: (a: any, b: any) => {
      return (a === b).toString();
    }
  },

  gt: {
    name: 'gt',
    fn: (a: number, b: number) => {
      return (a > b).toString();
    }
  },

  lt: {
    name: 'lt',
    fn: (a: number, b: number) => {
      return (a < b).toString();
    }
  }
};

// Parser simples para sintaxe Handlebars-like
export class TemplateEngine {
  private helpers: Record<string, TemplateHelper>;

  constructor(customHelpers: Record<string, TemplateHelper> = {}) {
    this.helpers = { ...defaultHelpers, ...customHelpers };
  }

  // Renderiza um template com variáveis
  render(template: string, context: TemplateContext): string {
    let result = template;

    // Processa helpers customizados primeiro
    result = this.processHelpers(result, context);

    // Processa condicionais {{#if}} ... {{/if}}
    result = this.processConditionals(result, context);

    // Processa loops {{#each}} ... {{/each}}
    result = this.processLoops(result, context);

    // Processa variáveis simples {{variavel}}
    result = this.processVariables(result, context);

    return result;
  }

  // Processa helpers customizados
  private processHelpers(template: string, context: TemplateContext): string {
    const helperRegex = /\{\{(\w+)\s+([^}]+)\}\}/g;
    
    return template.replace(helperRegex, (match, helperName, args) => {
      const helper = this.helpers[helperName];
      if (!helper) return match;

      try {
        // Parse dos argumentos
        const parsedArgs = this.parseHelperArgs(args, context);
        const result = helper.fn(...parsedArgs);
        return result;
      } catch (error) {
        console.error(`Erro no helper ${helperName}:`, error);
        return match;
      }
    });
  }

  // Processa condicionais {{#if}} ... {{/if}}
  private processConditionals(template: string, context: TemplateContext): string {
    const conditionalRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    
    return template.replace(conditionalRegex, (match, condition, content) => {
      const value = this.getNestedValue(context.variables, condition.trim());
      return value ? content : '';
    });
  }

  // Processa loops {{#each}} ... {{/each}}
  private processLoops(template: string, context: TemplateContext): string {
    const loopRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    
    return template.replace(loopRegex, (match, arrayPath, content) => {
      const array = this.getNestedValue(context.variables, arrayPath.trim());
      
      if (!Array.isArray(array)) return '';

      return array.map((item, index) => {
        // Cria um contexto temporário com o item atual
        const itemContext = {
          ...context,
          variables: {
            ...context.variables,
            this: item,
            index: index
          }
        };

        // Renderiza o conteúdo do loop
        return this.render(content, itemContext);
      }).join('');
    });
  }

  // Processa variáveis simples {{variavel}}
  private processVariables(template: string, context: TemplateContext): string {
    const variableRegex = /\{\{([^#\/][^}]*)\}\}/g;
    
    return template.replace(variableRegex, (match, path) => {
      const value = this.getNestedValue(context.variables, path.trim());
      return value !== undefined ? String(value) : '';
    });
  }

  // Parse dos argumentos de helpers
  private parseHelperArgs(args: string, context: TemplateContext): any[] {
    // Split por vírgulas, mas respeitando strings
    const parts: string[] = [];
    let current = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < args.length; i++) {
      const char = args[i];
      
      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
        current += char;
      } else if (inString && char === stringChar) {
        inString = false;
        current += char;
      } else if (!inString && char === ',') {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      parts.push(current.trim());
    }

    // Converte cada parte
    return parts.map(part => {
      part = part.trim();
      
      // String literal
      if ((part.startsWith('"') && part.endsWith('"')) || 
          (part.startsWith("'") && part.endsWith("'"))) {
        return part.slice(1, -1);
      }
      
      // Número
      if (!isNaN(Number(part))) {
        return Number(part);
      }
      
      // Variável
      return this.getNestedValue(context.variables, part);
    });
  }

  // Obtém valor aninhado usando notação de ponto
  private getNestedValue(obj: any, path: string): any {
    if (!path || !obj) return undefined;
    
    return path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return undefined;
      return current[key];
    }, obj);
  }

  // Adiciona helper customizado
  addHelper(name: string, helper: TemplateHelper): void {
    this.helpers[name] = helper;
  }

  // Remove helper
  removeHelper(name: string): void {
    delete this.helpers[name];
  }
}

// Instância global do engine
export const templateEngine = new TemplateEngine();

// Função utilitária para renderizar template
export function renderTemplate(
  template: string, 
  variables: ProposalVariables, 
  customHelpers?: Record<string, TemplateHelper>
): string {
  const engine = customHelpers ? new TemplateEngine(customHelpers) : templateEngine;
  
  return engine.render(template, {
    variables,
    helpers: engine['helpers']
  });
}

// Função para renderizar blocos de template
export function renderTemplateBlocks(
  blocks: TemplateBlock[], 
  variables: ProposalVariables
): string {
  return blocks.map(block => {
    const blockTemplate = getBlockTemplate(block.type);
    return renderTemplate(blockTemplate, variables);
  }).join('');
}

// Templates para cada tipo de bloco
function getBlockTemplate(blockType: string): string {
  const templates: Record<string, string> = {
    hero: `
      <section class="hero-section bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div class="container mx-auto px-6 text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">{{projeto.titulo}}</h1>
          <p class="text-xl opacity-90">{{fornecedor.nome}} → {{cliente.nome}}</p>
          <div class="mt-8">
            <div class="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span class="text-sm opacity-80">Proposta válida até</span>
              <span class="font-semibold ml-2">{{projeto.validade}}</span>
            </div>
          </div>
        </div>
      </section>
    `,

    objective: `
      <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Objetivo</h2>
            <p class="text-lg text-gray-700 leading-relaxed">{{projeto.objetivo}}</p>
          </div>
        </div>
      </section>
    `,

    scope: `
      <section class="py-12">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Escopo do Projeto</h2>
            <div class="grid md:grid-cols-2 gap-6">
              {{#each projeto.escopo}}
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <span class="text-gray-700">{{this}}</span>
                </div>
              {{/each}}
            </div>
          </div>
        </div>
      </section>
    `,

    pricing: `
      <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Investimento</h2>
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
                      <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">Qtd</th>
                      <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">Valor Unit.</th>
                      <th class="px-6 py-4 text-right text-sm font-semibold text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    {{#each precos.itens}}
                      <tr>
                        <td class="px-6 py-4">
                          <div>
                            <div class="text-sm font-medium text-gray-900">{{name}}</div>
                            {{#if description}}
                              <div class="text-sm text-gray-500">{{description}}</div>
                            {{/if}}
                          </div>
                        </td>
                        <td class="px-6 py-4 text-center text-sm text-gray-900">{{quantity}}</td>
                        <td class="px-6 py-4 text-right text-sm text-gray-900">{{currency unit_price}}</td>
                        <td class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {{currency (calcTotal quantity unit_price discount)}}
                        </td>
                      </tr>
                    {{/each}}
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="3" class="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        Total:
                      </td>
                      <td class="px-6 py-4 text-right text-lg font-bold text-primary">
                        {{precos.total_formatado}}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {{#if precos.condicoes}}
              <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                  <strong>Condições de Pagamento:</strong> {{precos.condicoes}}
                </p>
              </div>
            {{/if}}
          </div>
        </div>
      </section>
    `,

    timeline: `
      <section class="py-12">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Cronograma</h2>
            <div class="relative">
              <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary"></div>
              {{#each projeto.cronograma}}
                <div class="relative flex items-center mb-8">
                  <div class="flex-1 {{#if (gt index 0)}}pr-8{{/if}}">
                    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
                      <h3 class="text-lg font-semibold text-gray-900 mb-2">Semana {{add index 1}}</h3>
                      <p class="text-gray-700">{{this}}</p>
                    </div>
                  </div>
                  <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                </div>
              {{/each}}
            </div>
          </div>
        </div>
      </section>
    `,

    terms: `
      <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-6">
          <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Termos e Condições</h2>
            <div class="bg-white rounded-lg shadow-lg p-8">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Validade da Proposta</h3>
                  <p class="text-gray-700">Esta proposta é válida por {{projeto.validade}} a partir da data de envio.</p>
                </div>
                {{#if precos.condicoes}}
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Condições de Pagamento</h3>
                    <p class="text-gray-700">{{precos.condicoes}}</p>
                  </div>
                {{/if}}
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Aceite</h3>
                  <p class="text-gray-700">O aceite desta proposta deve ser formalizado através da assinatura digital abaixo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,

    signature: `
      <section class="py-12">
        <div class="container mx-auto px-6">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Aceite e Assinatura</h2>
            <div class="bg-white rounded-lg shadow-lg p-8">
              <p class="text-gray-700 mb-8">
                Ao assinar esta proposta, você concorda com todos os termos e condições apresentados.
              </p>
              <button 
                id="signature-button"
                class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
              >
                {{cta}}
              </button>
            </div>
          </div>
        </div>
      </section>
    `
  };

  return templates[blockType] || '';
}

// Helper para adicionar números (usado no timeline)
templateEngine.addHelper('add', {
  name: 'add',
  fn: (a: number, b: number) => (a + b).toString()
});
