// Constantes para o Sistema de Fluxogramas v2.0

import { NodeType } from './types'

export const NODE_TYPES: Record<string, NodeType> = {
  // Processos
  process: {
    type: 'process',
    label: 'Processo',
    icon: 'Square',
    category: 'process',
    color: 'bg-blue-500',
    description: 'Ação ou processo',
    defaultSize: { width: 150, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Decisões
  decision: {
    type: 'decision',
    label: 'Decisão',
    icon: 'Diamond',
    category: 'decision',
    color: 'bg-red-500',
    description: 'Ponto de decisão',
    defaultSize: { width: 120, height: 80 },
    editable: true,
    deletable: true,
  },
  
  // Início/Fim
  startEnd: {
    type: 'startEnd',
    label: 'Início/Fim',
    icon: 'Circle',
    category: 'process',
    color: 'bg-green-500',
    description: 'Início ou fim do fluxo',
    defaultSize: { width: 100, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Entrada/Saída
  inputOutput: {
    type: 'inputOutput',
    label: 'Entrada/Saída',
    icon: 'Hexagon',
    category: 'data',
    color: 'bg-yellow-500',
    description: 'Dados de entrada/saída',
    defaultSize: { width: 140, height: 80 },
    editable: true,
    deletable: true,
  },
  
  // Dados
  data: {
    type: 'data',
    label: 'Dados',
    icon: 'Cylinder',
    category: 'data',
    color: 'bg-purple-500',
    description: 'Armazenamento de dados',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Documento
  document: {
    type: 'document',
    label: 'Documento',
    icon: 'FileText',
    category: 'data',
    color: 'bg-indigo-500',
    description: 'Documento ou relatório',
    defaultSize: { width: 130, height: 70 },
    editable: true,
    deletable: true,
  },
  
  // Conector
  connector: {
    type: 'connector',
    label: 'Conector',
    icon: 'Dot',
    category: 'connector',
    color: 'bg-gray-500',
    description: 'Ponto de conexão',
    defaultSize: { width: 80, height: 40 },
    editable: true,
    deletable: true,
  },
  
  // Banco de Dados
  database: {
    type: 'database',
    label: 'Banco de Dados',
    icon: 'Database',
    category: 'data',
    color: 'bg-purple-600',
    description: 'Base de dados',
    defaultSize: { width: 140, height: 80 },
    editable: true,
    deletable: true,
  },
  
  // API
  api: {
    type: 'api',
    label: 'API',
    icon: 'Zap',
    category: 'process',
    color: 'bg-orange-500',
    description: 'Interface de programação',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Timer
  timer: {
    type: 'timer',
    label: 'Timer',
    icon: 'Clock',
    category: 'process',
    color: 'bg-yellow-600',
    description: 'Temporizador ou delay',
    defaultSize: { width: 100, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Usuário
  user: {
    type: 'user',
    label: 'Usuário',
    icon: 'User',
    category: 'process',
    color: 'bg-green-600',
    description: 'Interação do usuário',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Nuvem
  cloud: {
    type: 'cloud',
    label: 'Nuvem',
    icon: 'Cloud',
    category: 'data',
    color: 'bg-sky-500',
    description: 'Serviço em nuvem',
    defaultSize: { width: 120, height: 80 },
    editable: true,
    deletable: true,
  },
  
  // Loop
  loop: {
    type: 'loop',
    label: 'Loop',
    icon: 'RotateCcw',
    category: 'process',
    color: 'bg-indigo-600',
    description: 'Repetição ou ciclo',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Plataformas Digitais
  blog: {
    type: 'blog',
    label: 'Blog',
    icon: 'FileText',
    category: 'platform',
    color: 'bg-blue-500',
    description: 'Blog ou artigos',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  site: {
    type: 'site',
    label: 'Site',
    icon: 'Globe',
    category: 'platform',
    color: 'bg-blue-500',
    description: 'Site web',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  google: {
    type: 'google',
    label: 'Google',
    icon: 'Search',
    category: 'platform',
    color: 'bg-yellow-500',
    description: 'Google Search',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  googleAds: {
    type: 'googleAds',
    label: 'Google ADS',
    icon: 'Target',
    category: 'platform',
    color: 'bg-yellow-500',
    description: 'Google Ads',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  facebook: {
    type: 'facebook',
    label: 'Facebook',
    icon: 'Facebook',
    category: 'platform',
    color: 'bg-purple-500',
    description: 'Facebook',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  metaAds: {
    type: 'metaAds',
    label: 'Meta ADS',
    icon: 'Target',
    category: 'platform',
    color: 'bg-purple-500',
    description: 'Meta Ads',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  youtube: {
    type: 'youtube',
    label: 'YouTube',
    icon: 'Youtube',
    category: 'platform',
    color: 'bg-red-500',
    description: 'YouTube',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  tiktok: {
    type: 'tiktok',
    label: 'TikTok',
    icon: 'Circle',
    category: 'platform',
    color: 'bg-gray-500',
    description: 'TikTok',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  instagram: {
    type: 'instagram',
    label: 'Instagram',
    icon: 'Instagram',
    category: 'platform',
    color: 'bg-orange-500',
    description: 'Instagram',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  ia: {
    type: 'ia',
    label: 'IA',
    icon: 'Bot',
    category: 'platform',
    color: 'bg-pink-500',
    description: 'Inteligência Artificial',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  crm: {
    type: 'crm',
    label: 'CRM',
    icon: 'Users',
    category: 'platform',
    color: 'bg-green-500',
    description: 'Sistema CRM',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  whatsapp: {
    type: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageSquare',
    category: 'platform',
    color: 'bg-green-500',
    description: 'WhatsApp',
    defaultSize: { width: 120, height: 60 },
    editable: true,
    deletable: true,
  },
  
  // Conteúdo editável
  conteudo: {
    type: 'conteudo',
    label: 'Conteúdo',
    icon: 'Type',
    category: 'content',
    color: 'bg-blue-500',
    description: 'Nó de texto editável',
    defaultSize: { width: 200, height: 80 },
    editable: true,
    deletable: true,
  },
}

export const NODE_CATEGORIES = {
  process: {
    label: 'Processos',
    color: 'bg-blue-100',
    icon: 'Square',
  },
  decision: {
    label: 'Decisões',
    color: 'bg-red-100',
    icon: 'Diamond',
  },
  data: {
    label: 'Dados',
    color: 'bg-purple-100',
    icon: 'Database',
  },
  platform: {
    label: 'Plataformas',
    color: 'bg-yellow-100',
    icon: 'Globe',
  },
  content: {
    label: 'Conteúdo',
    color: 'bg-green-100',
    icon: 'Type',
  },
  connector: {
    label: 'Conectores',
    color: 'bg-gray-100',
    icon: 'Dot',
  },
}

export const EXPORT_FORMATS = {
  png: {
    label: 'PNG',
    description: 'Imagem PNG',
    extension: '.png',
  },
  pdf: {
    label: 'PDF',
    description: 'Documento PDF',
    extension: '.pdf',
  },
  svg: {
    label: 'SVG',
    description: 'Vetor SVG',
    extension: '.svg',
  },
  json: {
    label: 'JSON',
    description: 'Dados JSON',
    extension: '.json',
  },
}

export const KEYBOARD_SHORTCUTS = {
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  copy: 'Ctrl+C',
  paste: 'Ctrl+V',
  cut: 'Ctrl+X',
  delete: 'Delete',
  selectAll: 'Ctrl+A',
  save: 'Ctrl+S',
  zoomIn: 'Ctrl++',
  zoomOut: 'Ctrl+-',
  resetZoom: 'Ctrl+0',
}

export const CANVAS_SETTINGS = {
  defaultZoom: 1,
  minZoom: 0.1,
  maxZoom: 4,
  snapToGrid: true,
  snapGrid: [15, 15],
  connectionLineStyle: {
    strokeWidth: 2,
    stroke: '#b1b1b7',
  },
  defaultEdgeOptions: {
    type: 'smoothstep',
    animated: false,
  },
}

export const AUTO_SAVE_INTERVAL = 30000 // 30 segundos

export const MAX_HISTORY_STEPS = 50

export const DEFAULT_FLOWCHART_TITLE = 'Novo Fluxograma'
