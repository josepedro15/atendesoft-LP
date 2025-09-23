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
  if (!blocks || !Array.isArray(blocks)) {
    return '<div class="proposal-content"><p>Nenhum conteúdo disponível.</p></div>';
  }

  const context = createTemplateContext(variables);
  let html = '<div class="proposal-content">';

  blocks.forEach((block, index) => {
    try {
      html += renderBlock(block, context, index);
    } catch (error) {
      console.error(`Erro ao renderizar bloco ${index}:`, error);
      html += `<div class="block-error">Erro ao renderizar bloco: ${block.type}</div>`;
    }
  });

  html += '</div>';
  return html;
}

// Criar contexto do template
function createTemplateContext(variables: ProposalVariables): TemplateContext {
  return {
    variables,
    helpers: templateEngine['helpers']
  };
}

// Renderizar um bloco específico
function renderBlock(block: TemplateBlock, context: TemplateContext, index: number): string {
  const { type, props } = block;

  switch (type) {
    case 'hero':
      return renderHeroBlock(props, context);
    case 'objective':
      return renderObjectiveBlock(props, context);
    case 'benefits':
      return renderBenefitsBlock(props, context);
    case 'scope':
      return renderScopeBlock(props, context);
    case 'timeline':
      return renderTimelineBlock(props, context);
    case 'comparison':
      return renderComparisonBlock(props, context);
    case 'pricing':
      return renderPricingBlock(props, context);
    case 'chart_placeholder':
      return renderChartBlock(props, context);
    case 'next_steps':
      return renderNextStepsBlock(props, context);
    case 'partnership':
      return renderPartnershipBlock(props, context);
    case 'terms':
      return renderTermsBlock(props, context);
    case 'signature':
      return renderSignatureBlock(props, context);
    case 'header':
      return renderHeaderBlock(props, context);
    case 'text':
      return renderTextBlock(props, context);
    case 'section':
      return renderSectionBlock(props, context);
    case 'pricing_table':
      return renderPricingTableBlock(props, context);
    default:
      return `<div class="block-unknown">Bloco desconhecido: ${type}</div>`;
  }
}

// Renderizar bloco Hero
function renderHeroBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || '', context.variables);
  const subtitle = renderTemplate(props.subtitle || '', context.variables);
  const tagline = renderTemplate(props.tagline || '', context.variables);

  return `
    <div class="block-hero">
      <div class="hero-header">
        <h1 class="hero-title">${title}</h1>
        <h2 class="hero-subtitle">${subtitle}</h2>
        <p class="hero-tagline">${tagline}</p>
      </div>
    </div>
  `;
}

// Renderizar bloco Objetivo
function renderObjectiveBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Objetivo', context.variables);
  const bullets = props.bullets || [];

  const bulletsHtml = bullets.map((bullet: string) => 
    `<li>${renderTemplate(bullet, context.variables)}</li>`
  ).join('');

  return `
    <div class="block-objective">
      <h2 class="section-title">${title}</h2>
      <ul class="objective-list">
        ${bulletsHtml}
      </ul>
    </div>
  `;
}

// Renderizar bloco Benefícios
function renderBenefitsBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Principais Benefícios', context.variables);
  const items = props.items || [];

  const itemsHtml = items.map((item: any) => `
    <div class="benefit-item">
      <div class="benefit-icon">${item.icon || '✓'}</div>
      <div class="benefit-text">${renderTemplate(item.text || '', context.variables)}</div>
    </div>
  `).join('');

  return `
    <div class="block-benefits">
      <h2 class="section-title">${title}</h2>
      <div class="benefits-grid">
        ${itemsHtml}
      </div>
    </div>
  `;
}

// Renderizar bloco Escopo
function renderScopeBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Escopo da Solução', context.variables);
  const sections = props.sections || [];

  const sectionsHtml = sections.map((section: any) => {
    const sectionTitle = renderTemplate(section.title || '', context.variables);
    const bullets = section.bullets || [];
    const bulletsHtml = bullets.map((bullet: string) => 
      `<li>${renderTemplate(bullet, context.variables)}</li>`
    ).join('');

    return `
      <div class="scope-section">
        <h3 class="scope-section-title">${sectionTitle}</h3>
        <ul class="scope-bullets">
          ${bulletsHtml}
        </ul>
      </div>
    `;
  }).join('');

  return `
    <div class="block-scope">
      <h2 class="section-title">${title}</h2>
      <div class="scope-sections">
        ${sectionsHtml}
      </div>
    </div>
  `;
}

// Renderizar bloco Timeline
function renderTimelineBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Cronograma', context.variables);
  const weeks = props.weeks || [];
  const note = renderTemplate(props.note || '', context.variables);

  const weeksHtml = weeks.map((week: any) => {
    const weekLabel = week.label || '';
    const weekItems = week.items || [];
    const itemsHtml = weekItems.map((item: string) => 
      `<li>${renderTemplate(item, context.variables)}</li>`
    ).join('');

    return `
      <div class="timeline-week">
        <div class="week-label">${weekLabel}</div>
        <ul class="week-items">
          ${itemsHtml}
        </ul>
      </div>
    `;
  }).join('');

  return `
    <div class="block-timeline">
      <h2 class="section-title">${title}</h2>
      <div class="timeline-weeks">
        ${weeksHtml}
      </div>
      ${note ? `<div class="timeline-note">${note}</div>` : ''}
    </div>
  `;
}

// Renderizar bloco Comparação
function renderComparisonBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Comparativo', context.variables);
  const left = props.left || {};
  const right = props.right || {};
  const conclusion = renderTemplate(props.conclusion || '', context.variables);

  const leftBullets = (left.bullets || []).map((bullet: string) => 
    `<li>${renderTemplate(bullet, context.variables)}</li>`
  ).join('');

  const rightBullets = (right.bullets || []).map((bullet: string) => 
    `<li>${renderTemplate(bullet, context.variables)}</li>`
  ).join('');

  return `
    <div class="block-comparison">
      <h2 class="section-title">${title}</h2>
      <div class="comparison-grid">
        <div class="comparison-left">
          <h3 class="comparison-heading">${renderTemplate(left.heading || '', context.variables)}</h3>
          <ul class="comparison-bullets">
            ${leftBullets}
          </ul>
        </div>
        <div class="comparison-right">
          <h3 class="comparison-heading">${renderTemplate(right.heading || '', context.variables)}</h3>
          <ul class="comparison-bullets">
            ${rightBullets}
          </ul>
        </div>
      </div>
      ${conclusion ? `<div class="comparison-conclusion">${conclusion}</div>` : ''}
    </div>
  `;
}

// Renderizar bloco Preços
function renderPricingBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Investimento', context.variables);
  const currency = props.currency || 'BRL';
  const items = props.items || [];
  const totals = props.totals || {};
  const notes = props.notes || [];

  const itemsHtml = items.map((item: any) => {
    const name = renderTemplate(item.name || '', context.variables);
    const description = renderTemplate(item.description || '', context.variables);
    const quantity = item.quantity || 1;
    const unitPrice = item.unitPrice || 0;
    const discount = item.discount || 0;
    const taxRate = item.taxRate || 0;
    
    const subtotal = quantity * unitPrice;
    const discountAmount = discount;
    const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
    const total = subtotal - discountAmount + taxAmount;

    return `
      <div class="pricing-item">
        <div class="item-header">
          <h4 class="item-name">${name}</h4>
          <div class="item-price">${formatCurrency(unitPrice, currency)}</div>
        </div>
        ${description ? `<p class="item-description">${description}</p>` : ''}
        <div class="item-details">
          <div class="item-quantity">Qtd: ${quantity}</div>
          ${discount > 0 ? `<div class="item-discount">Desconto: ${formatCurrency(discount, currency)}</div>` : ''}
          ${taxRate > 0 ? `<div class="item-tax">Taxa: ${taxRate}%</div>` : ''}
          <div class="item-total">Total: ${formatCurrency(total, currency)}</div>
        </div>
      </div>
    `;
  }).join('');

  const notesHtml = notes.map((note: string) => 
    `<li>${renderTemplate(note, context.variables)}</li>`
  ).join('');

  return `
    <div class="block-pricing">
      <h2 class="section-title">${title}</h2>
      <div class="pricing-items">
        ${itemsHtml}
      </div>
      ${notes.length > 0 ? `
        <div class="pricing-notes">
          <h4>Observações:</h4>
          <ul>
            ${notesHtml}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

// Renderizar bloco Gráfico
function renderChartBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Distribuição', context.variables);
  const description = renderTemplate(props.description || '', context.variables);
  const data = props.data || [];

  return `
    <div class="block-chart">
      <h2 class="section-title">${title}</h2>
      ${description ? `<p class="chart-description">${description}</p>` : ''}
      <div class="chart-placeholder">
        <p>Gráfico: ${data.map((item: any) => `${item.label}: ${item.value}`).join(', ')}</p>
      </div>
    </div>
  `;
}

// Renderizar bloco Próximos Passos
function renderNextStepsBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Próximos Passos', context.variables);
  const steps = props.steps || [];

  const stepsHtml = steps.map((step: any, index: number) => {
    const stepTitle = renderTemplate(step.title || '', context.variables);
    const stepText = renderTemplate(step.text || '', context.variables);

    return `
      <div class="next-step">
        <div class="step-number">${index + 1}</div>
        <div class="step-content">
          <h4 class="step-title">${stepTitle}</h4>
          <p class="step-text">${stepText}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="block-next-steps">
      <h2 class="section-title">${title}</h2>
      <div class="next-steps-list">
        ${stepsHtml}
      </div>
    </div>
  `;
}

// Renderizar bloco Parceria
function renderPartnershipBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Parceria Estratégica', context.variables);
  const supplier = renderTemplate(props.supplier || '', context.variables);
  const client = renderTemplate(props.client || '', context.variables);
  const pillars = props.pillars || [];

  const pillarsHtml = pillars.map((pillar: any) => {
    const pillarTitle = renderTemplate(pillar.title || '', context.variables);
    const pillarText = renderTemplate(pillar.text || '', context.variables);

    return `
      <div class="partnership-pillar">
        <h4 class="pillar-title">${pillarTitle}</h4>
        <p class="pillar-text">${pillarText}</p>
      </div>
    `;
  }).join('');

  return `
    <div class="block-partnership">
      <h2 class="section-title">${title}</h2>
      <div class="partnership-header">
        <div class="partnership-supplier">${supplier}</div>
        <div class="partnership-arrow">→</div>
        <div class="partnership-client">${client}</div>
      </div>
      <div class="partnership-pillars">
        ${pillarsHtml}
      </div>
    </div>
  `;
}

// Renderizar bloco Termos
function renderTermsBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Condições & Validade', context.variables);
  const validade = renderTemplate(props.validade || '', context.variables);
  const condicoes = renderTemplate(props.condicoes || '', context.variables);
  const legal = renderTemplate(props.legal || '', context.variables);

  return `
    <div class="block-terms">
      <h2 class="section-title">${title}</h2>
      <div class="terms-content">
        ${validade ? `<div class="term-item"><strong>Validade:</strong> ${validade}</div>` : ''}
        ${condicoes ? `<div class="term-item"><strong>Condições:</strong> ${condicoes}</div>` : ''}
        ${legal ? `<div class="term-legal">${legal}</div>` : ''}
      </div>
    </div>
  `;
}

// Renderizar bloco Assinatura
function renderSignatureBlock(props: any, context: TemplateContext): string {
  const cta = renderTemplate(props.cta || 'Aceitar e Assinar', context.variables);
  const signerName = renderTemplate(props.signer_name || '', context.variables);
  const signerEmail = renderTemplate(props.signer_email || '', context.variables);

  return `
    <div class="block-signature">
      <div class="signature-content">
        <h3 class="signature-title">${cta}</h3>
        <div class="signature-fields">
          <div class="signature-field">
            <label>Nome:</label>
            <input type="text" value="${signerName}" readonly />
          </div>
          <div class="signature-field">
            <label>Email:</label>
            <input type="email" value="${signerEmail}" readonly />
          </div>
        </div>
        <div class="signature-area">
          <canvas id="signature-canvas" width="400" height="200"></canvas>
          <div class="signature-actions">
            <button type="button" class="btn-clear">Limpar</button>
            <button type="button" class="btn-type">Digitar</button>
          </div>
        </div>
        <button type="submit" class="btn-sign">Assinar Proposta</button>
      </div>
    </div>
  `;
}

// Renderizar bloco Header
function renderHeaderBlock(props: any, context: TemplateContext): string {
  const content = renderTemplate(props.content || '', context.variables);
  const style = props.style || {};
  
  return `
    <div class="block-header" style="${Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ')}">
      <h1>${content}</h1>
    </div>
  `;
}

// Renderizar bloco Text
function renderTextBlock(props: any, context: TemplateContext): string {
  const content = renderTemplate(props.content || '', context.variables);
  const style = props.style || {};
  
  return `
    <div class="block-text" style="${Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ')}">
      <p>${content}</p>
    </div>
  `;
}

// Renderizar bloco Section
function renderSectionBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || '', context.variables);
  const content = renderTemplate(props.content || '', context.variables);
  
  return `
    <div class="block-section">
      <h2>${title}</h2>
      <div>${content}</div>
    </div>
  `;
}

// Renderizar bloco Pricing Table
function renderPricingTableBlock(props: any, context: TemplateContext): string {
  const title = renderTemplate(props.title || 'Preços', context.variables);
  const items = props.items || [];
  
  const itemsHtml = items.map((item: any) => `
    <tr>
      <td>${renderTemplate(item.name || '', context.variables)}</td>
      <td>${item.quantity || 1}</td>
      <td>${formatCurrency(item.unit_price || 0, 'BRL')}</td>
      <td>${formatCurrency((item.quantity || 1) * (item.unit_price || 0), 'BRL')}</td>
    </tr>
  `).join('');
  
  return `
    <div class="block-pricing-table">
      <h2>${title}</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qtd</th>
            <th>Valor Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>
  `;
}

// Função auxiliar para formatar moeda
function formatCurrency(value: number, currency: string): string {
  if (typeof value !== 'number') return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency === 'BRL' ? 'BRL' : 'USD'
  }).format(value);
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
