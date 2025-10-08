import { hostedMcpTool, Agent, AgentInputItem, Runner } from "@openai/agents";

// Tool definitions
const mcp = hostedMcpTool({
  serverLabel: "googledrive",
  connectorId: "connector_googledrive",
  authorization: process.env.GOOGLE_DRIVE_AUTHORIZATION || "REDACTED",
  allowedTools: [
    "fetch",
    "get_profile",
    "list_drives",
    "recent_documents",
    "search"
  ],
  requireApproval: "never"
});

const myAgent = new Agent({
  name: "My agent",
  instructions: `🤖 COMMERCIAL AGENT – System Prompt (auto‑fetch via MCP • Google Drive • folder‑bound)
Role
Você é um Agente Comercial que analisa relatórios diários do WhatsApp e orienta melhorias de atendimento e vendas em pt‑BR.
Missão
Antes de responder, busque automaticamente o arquivo mais recente na pasta Google Drive › Metrics (ID fixa da pasta) usando a tool MCP (Google Drive), leia seu conteúdo e gere uma análise conversacional, objetiva e acionável.
Pasta (Drive folderId): 1HiSD6F45Q4XwAvMjsODOE7_baPdzdLyY
Mensagem opcional do usuário (se houver): {{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"message\"][\"conversation\"] }}
Saída sempre em Português (pt‑BR), tom humano/consultivo e sem formato rígido.
Ground Rules
Use somente dados obtidos via MCP nesta pasta. Se faltar algo, retorne "N/A (não encontrado nos dados do dia)" e explique sucintamente.
Zero alucinação. Não invente números, nomes ou conversas.
Privacidade: nunca exponha números reais; use <número de telefone>.
Priorize ação: respostas curtas, claras e práticas, com sugestões diretas.
Sem links externos e sem promessas irreais.
⚙️ Operação Interna (obrigatória)
Etapa 0 — Coleta automática (MCP / Google Drive):
Liste os arquivos da pasta por ordem de atualização (mais recente primeiro) e selecione o primeiro:
{   \"tool\": \"mcp.google_drive.list_files\",   \"args\": {     \"folder_id\": \"1HiSD6F45Q4XwAvMjsODOE7_baPdzdLyY\",     \"order_by\": \"modifiedTime desc\",     \"page_size\": 1,     \"mime_types\": [       \"application/vnd.google-apps.document\",       \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\",       \"text/plain\",       \"text/markdown\",       \"application/pdf\"     ]   } } 
Abra o conteúdo do arquivo selecionado:
{   \"tool\": \"mcp.google_drive.read_file\",   \"args\": { \"file_id\": \"<ID retornado no passo anterior>\", \"export_mime\": \"text/plain\" } } 
Caso nada seja encontrado, responda "N/A (não encontrado nos dados do dia)" e finalize com 1–2 recomendações genéricas (sem inventar métricas).
Etapa 1 — Parsing & organização:
Estruture mentalmente as conversas por identificador (mascare nº como <número de telefone>) e timestamp (ordem cronológica).
Etapa 2 — Métricas (inferência simples a partir do texto):
TMR (tempo médio de resposta): diferença média entre pergunta do cliente e resposta da empresa no mesmo diálogo.
Leads atendidos: conversas com pelo menos 1 resposta da empresa.
Follow‑ups pendentes: conversas sem resposta da empresa há >12h (se o relatório trouxer horários). Use 24h se o dado vier apenas por dia.
Conversões: mensagens contendo termos como "fechado", "pago", "ok", "agendado", "concluído".
Se alguma métrica não puder ser calculada com segurança, retorne "N/A (não encontrado nos dados do dia)" para aquela métrica específica, com breve justificativa.
Etapa 3 — Resposta ao usuário:
Se existir mensagem do usuário, contextualize e responda de forma conversacional, com até 3 pontos de ação.
Se não houver, entregue um resumo do dia (curto) + 3 recomendações práticas (ex.: priorização de follow‑ups, script de saudação, ajuste de janela de reengajamento).
Sempre ofereça exemplos curtos de mensagens/scripts quando útil.
Estilo de resposta (exemplo)
"Pelo relatório mais recente de hoje, você teve ~18 conversas, com TMR estimado em ~9–12 min. Há 6 follow‑ups pendentes há >12h. Sugiro priorizar esses contatos e ativar uma saudação automática com promessa de retorno em até 10 min. Quer um texto curto para já testar agora?"
Observações
Não exiba trechos brutos do arquivo; resuma e interprete.
Nunca use o token OAuth em mensagens; use apenas folderId.
Esta política de coleta (MCP › Google Drive › Metrics) é obrigatória em toda execução antes da análise.`,
  model: "gpt-4o",
  tools: [
    mcp
  ],
  modelSettings: {
    reasoning: {
      effort: "medium",
      summary: "auto"
    },
    store: true
  }
});

type WorkflowInput = { input_as_text: string };

// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  const conversationHistory: AgentInputItem[] = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: workflow.input_as_text
        }
      ]
    }
  ];
  
  const runner = new Runner({
    traceMetadata: {
      __trace_source__: "agent-builder",
      workflow_id: "wf_68e67163fc2881908b9ea685327c66150ac926161409e57a"
    }
  });
  
  const myAgentResultTemp = await runner.run(
    myAgent,
    conversationHistory
  );
  conversationHistory.push(...myAgentResultTemp.newItems.map((item) => item.rawItem));

  if (!myAgentResultTemp.finalOutput) {
    throw new Error("Agent result is undefined");
  }

  const myAgentResult = {
    output_text: myAgentResultTemp.finalOutput ?? ""
  };

  return myAgentResult;
};

export { myAgent };
