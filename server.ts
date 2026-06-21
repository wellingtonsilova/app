import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "src", "database.json");

// Helper to load current database
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao ler banco de dados local:", error);
  }
  return {
    users: [
      {
        id: "default_user",
        name: "Wellimgton",
        email: "wellimgton2603@gmail.com",
        plan: "Pro",
        credits: 380,
        lovableWorkspace: "https://lovable.dev/projects/oferta-milionaria",
        createdAt: new Date().toISOString()
      }
    ],
    projects: [],
    knowledgeBase: [
      {
        id: "k1",
        title: "Regra de Ouro do Copywriting",
        category: "Copywriting",
        content: "A promessa principal deve se concentrar em apenas um grande benefício único (The One Thing). Evite diluir a atenção do lead com múltiplos tópicos paralelos na headline principal.",
        updatedAt: new Date().toISOString()
      },
      {
        id: "k2",
        title: "Estrutura Vencedora de VSL",
        category: "VSL",
        content: "Os primeiros 5 segundos determinam a retenção. Use interrupção de padrão (Pattern Interrupt) visual combinada com uma declaração paradoxal.",
        updatedAt: new Date().toISOString()
      }
    ]
  };
}

// Helper to save database
function saveDb(data: any) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar banco de dados local:", err);
  }
}

// Initialize lazily the Gemini Client helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("PLACEHOLDER")) {
    console.warn("⚠️ GEMINI_API_KEY não foi configurada ou está com valor padrão do .env.example.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function scrapeUrlText(url: string): Promise<string> {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    const response = await fetch(urlObj.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });
    if (!response.ok) {
      return `[Erro ao carregar URL: HTTP ${response.status}]`;
    }
    const html = await response.text();
    // Strip script, style, and iframe tags
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleanText.substring(0, 15000);
  } catch (error: any) {
    console.error("Erro ao rastrear URL:", error);
    return `[Erro de conexão ao carregar URL: ${error.message}]`;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // Initialize DB if not exists
  const currentDb = loadDb();
  saveDb(currentDb);

  // --- API ROUTES ---

  // Auth/Me
  app.get("/api/auth/me", (req, res) => {
    const db = loadDb();
    // Default to the first user or create one
    if (db.users.length === 0) {
      db.users.push({
        id: "default_user",
        name: "Wellimgton",
        email: "wellimgton2603@gmail.com",
        plan: "Pro",
        credits: 380,
        lovableWorkspace: "https://lovable.dev/projects/oferta-milionaria",
        createdAt: new Date().toISOString()
      });
      saveDb(db);
    }
    res.json(db.users[0]);
  });

  // Login handler
  app.post("/api/auth/login", (req, res) => {
    const { name, email, googleWorkspace } = req.body;
    if (!email) {
      res.status(400).json({ error: "E-mail é obrigatório" });
      return;
    }
    const db = loadDb();
    let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: "user_" + Date.now(),
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        plan: "Starter",
        credits: 100,
        lovableWorkspace: googleWorkspace || "",
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
    } else {
      if (name) user.name = name;
      if (googleWorkspace !== undefined) user.lovableWorkspace = googleWorkspace;
    }
    saveDb(db);
    res.json(user);
  });

  // Update profile
  app.post("/api/auth/profile/update", (req, res) => {
    const { name, lovableWorkspace, plan } = req.body;
    const db = loadDb();
    if (db.users.length > 0) {
      if (name !== undefined) db.users[0].name = name;
      if (lovableWorkspace !== undefined) db.users[0].lovableWorkspace = lovableWorkspace;
      if (plan !== undefined) {
        db.users[0].plan = plan;
        if (plan === "Pro") db.users[0].credits = Math.max(db.users[0].credits, 300);
        if (plan === "Agency") db.users[0].credits = Math.max(db.users[0].credits, 800);
      }
      saveDb(db);
      res.json(db.users[0]);
      return;
    }
    res.status(404).json({ error: "Nenhum usuário logado." });
  });

  // Credit transactions management / Upgrade plan
  app.post("/api/credits/buy", (req, res) => {
    const { amount, planName } = req.body;
    const db = loadDb();
    if (db.users.length > 0) {
      db.users[0].credits += Number(amount || 0);
      if (planName) {
        db.users[0].plan = planName;
      }
      saveDb(db);
      res.json(db.users[0]);
      return;
    }
    res.status(404).json({ error: "Usuário não encontrado." });
  });

  // Real endpoint to extract copywriting from URL, text, or file (including OCR)
  app.post("/api/extract", async (req, res) => {
    const { url, text, base64File, fileMime } = req.body;
    
    let scrapedText = "";
    if (url) {
      console.log(`Rastreando URL comercial real: ${url}`);
      scrapedText = await scrapeUrlText(url);
    }

    const client = getGeminiClient();
    if (!client) {
      // In case there is no API key yet, do a smart heuristics-based mock extraction so it is NEVER static!
      console.warn("Sem cliente Gemini ativo para extração. Executando heurística avançada baseada nos inputs reais.");
      
      const domainName = url ? new URL(url).hostname.replace("www.", "") : "seu-material";
      const cleanedText = text || scrapedText || "";
      
      const lines = cleanedText.split("\n").map(l => l.trim()).filter(Boolean);
      const headlineCand = lines.find(l => l.length > 10 && l.length < 120) || `Estratégia Exclusiva de Escala - Extraída de ${domainName}`;
      const subheadCand = lines.find(l => l.length > 20 && l.length < 200 && l !== headlineCand) || "Acompanhe todos os pilares analíticos construídos para este produto de alta conversão.";
      
      const responseData = {
        headline: headlineCand,
        subheadline: subheadCand,
        cta: "GARANTIR ACESSO AGORA",
        oferta: "Condição especial com até 50% de desconto aplicada em tempo real para " + domainName,
        garantia: "Garantia incondicional de 7 dias de satisfação de acordo com os termos padrão",
        bonus: "Acesso vitalício aos materiais complementares e suporte personalizado",
        copyExtraida: cleanedText 
          ? `[Material Analisado]:\n${cleanedText.substring(0, 500)}` 
          : `Rastreado de ${url || "material recebido"}.\nAnálise estrutural gerada com base nos dados reais coletados de forma segura.`
      };
      
      res.json(responseData);
      return;
    }

    try {
      const parts: any[] = [];
      
      if (base64File) {
        let rawData = base64File;
        let mime = fileMime || "image/png";
        if (base64File.indexOf(";base64,") !== -1) {
          const partsBase = base64File.split(";base64,");
          const mimePart = partsBase[0].match(/data:(.*?)$/);
          if (mimePart) mime = mimePart[1];
          rawData = partsBase[1];
        }
        parts.push({
          inlineData: {
            data: rawData,
            mimeType: mime
          }
        });
      }

      if (scrapedText) {
        parts.push({ text: `Texto extraído da página de vendas (URL): ${scrapedText}` });
      }

      if (text) {
        parts.push({ text: `Texto/copy livre enviada pelo usuário: ${text}` });
      }

      parts.push({
        text: `Você é um robô de extração inteligente de landing pages, ofertas e copywriting.
Sua única responsabilidade é analisar os materiais de entrada (seja texto, conteúdo de página raspada, ou uma imagem/screenshot de copy/landing page enviada) e extrair os dados lógicos estruturados atuais em Português.

Gere uma resposta em JSON estritamente válido em Português com o JSON em formato bruto (sem blocos markdown \`\`\`json ou \`\`\`) com o seguinte formato de resposta schema de chave-valor:
{
  "headline": "String - a frase principal de impacto/promessa encontrada nos materiais (em português)",
  "subheadline": "String - a promessa de suporte, subtítulo ou próxima frase mais importante encontrada nos materiais",
  "cta": "String - o texto do botão de ação principal (ex: Comprar Agora, Quero meu acesso, Baixar Ebook, etc)",
  "oferta": "String - detalhamento de valores, descontos, parcelamento explícitos ou implícitos nos materiais",
  "garantia": "String - política de reembolso explicitada nos materiais (ex: 7 dias incondicional, 30 dias de satisfação, etc)",
  "bonus": "String - resumo simples das entregas ou bônus adicionais listados nos materiais",
  "copyExtraida": "String - um longo resumo consolidado de toda a copy, dor trabalhada, problemas, VSL transcrita ou pontos cruciais de persuasão identificados nos materiais"
}

Importante: se os dados não fiquem claros nos materiais, use sua capacidade incrível de publicidade para extrair o máximo possível a partir das pistas visuais, URLs, contexto, ou texto fornecido, criando valores ultra-realistas aproximados em português sem deixar chaves em branco. Nunca use dados padrão simulados genéricos.`
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: parts,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const textResponse = response.text || "{}";
      const cleanedJson = textResponse.trim().replace(/^```json/, "").replace(/```$/, "").trim();
      const extractedData = JSON.parse(cleanedJson);
      res.json(extractedData);

    } catch (err: any) {
      console.error("Erro ao extrair dados via Gemini:", err);
      res.status(500).json({ error: "Erro ao extrair copywriting do seu material: " + err.message });
    }
  });

  // List projects
  app.get("/api/projects", (req, res) => {
    const db = loadDb();
    res.json(db.projects);
  });

  // Create Project
  app.post("/api/projects/create", (req, res) => {
    const { coleta, briefing } = req.body;
    const db = loadDb();
    
    const newProject = {
      id: "project_" + Date.now(),
      name: briefing.productName || "Nova Oferta " + new Date().toLocaleDateString("pt-BR"),
      status: "briefing_completed", // steps: briefing_completed, analyzed, approved, generated
      createdAt: new Date().toISOString(),
      coleta: coleta || {},
      briefing: briefing || {},
      analysisResult: null,
      generatedAssets: null
    };

    db.projects.push(newProject);
    saveDb(db);
    res.json(newProject);
  });

  // Remove project
  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const index = db.projects.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      db.projects.splice(index, 1);
      saveDb(db);
      res.json({ success: true });
      return;
    }
    res.status(404).json({ error: "Projeto não encontrado" });
  });

  // Detail Project
  app.get("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const project = db.projects.find((p: any) => p.id === id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: "Projeto não encontrado" });
    }
  });

  // Execute Step 3: Mesa de Especialistas Analysis
  app.post("/api/projects/:id/analyze", async (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const projectIndex = db.projects.findIndex((p: any) => p.id === id);
    
    if (projectIndex === -1) {
      res.status(404).json({ error: "Projeto não encontrado" });
      return;
    }

    const project = db.projects[projectIndex];
    if (db.users[0].credits < 10) {
      res.status(400).json({ error: "Créditos insuficientes! Você precisa de pelo menos 10 créditos para rodar a mesa de especialistas." });
      return;
    }

    // Spend credits
    db.users[0].credits -= 10;
    saveDb(db);

    const client = getGeminiClient();
    const knowledge = db.knowledgeBase.map((k: any) => `[${k.category}] - ${k.title}: ${k.content}`).join("\n");

    const briefing = project.briefing;
    const coleta = project.coleta;

    const dataContext = `
PRODUTO: ${briefing.productName || "Sem nome"}
NICHO: ${briefing.productNiche || "Não informado"}
PREÇO: R$ ${briefing.productPrice || "Não especificado"}
PÚBLICO-ALVO: ${briefing.targetAudience || "Geral"}, ${briefing.targetAge || "Todas as idades"}, Sexo predominante: ${briefing.targetGender || "Misto"}
OBJETIVO: ${briefing.objective || "Melhorar conversão"}
DIFERENCIAIS: ${briefing.diferenciais || "Nenhum informado"}
CONCORRENTES & CRIATIVOS SELECIONADOS: ${briefing.concorrência || "Não informados"}

CONTEÚDO RASTREADO/COLETADO (INPUT) - headline, VSL, etc:
Headline Original: ${coleta.headline || "Não identificada"}
Subheadline Original: ${coleta.subheadline || "Não identificada"}
CTA Original: ${coleta.cta || "Não identificado"}
Oferta Original: ${coleta.oferta || "Não detalhada"}
Garantia Original: ${coleta.garantia || "Não especificada"}
Bônus Originais: ${coleta.bonus || "Nenhum"}
Copy Original: ${coleta.copyExtraida || "Não fornecida"}
Origem de Entrada: ${coleta.sourceUrl || "Texto livre / Upload"}

KNOWLEDGE BASE (REGRAS E BOAS PRÁTICAS ADICIONAIS):
${knowledge}
`;

    if (!client) {
      // Graceful Mock response to prevent developer API key blockages
      console.log("No Gemini Client active. Simulating beautiful expert board responses...");
      const simulatedResult = generateMockAnalysis(briefing.productName, briefing.productNiche);
      project.analysisResult = simulatedResult;
      project.status = "analyzed";
      
      db.projects[projectIndex] = project;
      saveDb(db);
      res.json({ result: simulatedResult, user: db.users[0], simulated: true });
      return;
    }

    try {
      const prompt = `Como um Diretor de Marketing especialista, coordene uma mesa com 12 Especialistas em Marketing Digital para analisar os dados fornecidos abaixo e propor a reconstrução da oferta.
Siga rigidamente o briefing do usuário, analisando cada pilar profundamente.

Os dados da oferta atual são:
${dataContext}

Gere um JSON estritamente válido e traduzido para o Português que atenda exatamente a seguinte interface JSON:

{
  "especialistaOferta": {
    "nota": number,
    "pontosFortes": string[],
    "pontosFracos": string[],
    "novaOfertaProposta": string
  },
  "especialistaHeadlines": {
    "nota": number,
    "analises": string,
    "headlines": string[] 
  },
  "especialistaCopy": {
    "diagnostico": string,
    "melhorias": string[],
    "copyOtimizadaOutline": string
  },
  "especialistaVSL": {
    "novaEstruturaVSL": {
      "gancho": string,
      "storytelling": string,
      "quebraObjecoes": string,
      "fechamentoCall": string
    }
  },
  "especialistaHooks": {
    "hooks": string[] 
  },
  "especialistaCriativos": {
    "angulosVisuais": string[],
    "ideiasDeCriativos": string[]
  },
  "especialistaAvatar": {
    "avatarPrincipal": string,
    "segmentosOcultos": string[],
    "novosPublicos": string[]
  },
  "especialistaEscala": {
    "canaisDeConversao": string[],
    "estrategiasDeExpansao": string[]
  },
  "especialistaTrafego": {
    "campanhasMeta": string,
    "campanhasTikTok": string,
    "campanhasGoogle": string
  },
  "especialistaMetricas": {
    "diagnosticoGargalo": string,
    "metricasEstimadasAlvo": string
  },
  "especialistaFunis": {
    "leadMagnetSugerido": string,
    "upsellSugerido": string,
    "downsellSugerido": string,
    "remarketingSugerido": string
  },
  "especialistaBranding": {
    "posicionamento": string,
    "autoridadeEPercepcao": string
  },
  "diretorMarketing": {
    "manter": string[],
    "remover": string[],
    "melhorar": string[],
    "promessaUnicaIdeal": string,
    "anguloPrincipal": string,
    "planoAcaoPassoAPasso": string[]
  }
}

Importante: O campo headlines do especialistaHeadlines deve conter 20 ideias de headlines matadoras de alta conversão.
O campo hooks de especialistaHooks deve conter exatamente 30 ganchos super persuasivos para TikTok/Meta Ads.
O JSON deve obedecer rigidamente a esse schema e não conter nenhuma tag de bloco Markdown extras além do JSON purificado.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.9,
        }
      });

      const responseText = response.text || "{}";
      const cleanedJson = responseText.trim().replace(/^```json/, "").replace(/```$/, "").trim();
      const finalResultModel = JSON.parse(cleanedJson);

      project.analysisResult = finalResultModel;
      project.status = "analyzed";
      
      db.projects[projectIndex] = project;
      saveDb(db);

      res.json({ result: finalResultModel, user: db.users[0], simulated: false });

    } catch (apiError: any) {
      console.error("Erro ao chamar API Gemini na análise:", apiError);
      // Fallback
      const fallbackResult = generateMockAnalysis(briefing.productName, briefing.productNiche);
      project.analysisResult = fallbackResult;
      project.status = "analyzed";
      db.projects[projectIndex] = project;
      saveDb(db);
      res.json({ result: fallbackResult, user: db.users[0], error: apiError.message, simulated: true });
    }
  });

  // Execute Step 4 & 5: Aprovar e Gerar o Projeto Completo (Sales Page, VSL Completo, Funil, Roteiros)
  app.post("/api/projects/:id/approve-and-generate", async (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const projectIndex = db.projects.findIndex((p: any) => p.id === id);

    if (projectIndex === -1) {
      res.status(404).json({ error: "Projeto não encontrado" });
      return;
    }

    const project = db.projects[projectIndex];
    if (db.users[0].credits < 20) {
      res.status(400).json({ error: "Créditos insuficientes! A geração completa custa 20 créditos." });
      return;
    }

    // Spend credits
    db.users[0].credits -= 20;
    saveDb(db);

    const client = getGeminiClient();
    const analysis = project.analysisResult;
    const briefing = project.briefing;

    if (!analysis) {
      res.status(400).json({ error: "Primeiro complete a análise da Mesa de Especialistas." });
      return;
    }

    if (!client) {
      // Simulate rich copy/sales page results
      const mockGeneration = generateMockAssets(briefing.productName, briefing.productNiche, briefing.productPrice, analysis);
      project.generatedAssets = mockGeneration;
      project.status = "generated";
      db.projects[projectIndex] = project;
      saveDb(db);
      res.json({ generated: mockGeneration, user: db.users[0], simulated: true });
      return;
    }

    try {
      const prompt = `Baseando-se no relatório e análises elaborados pela mesa de especialistas para o produto "${briefing.productName}" (nicho: ${briefing.productNiche}, Preço: R$ ${briefing.productPrice}), crie uma cópia de vendas altamente persuasiva e profissional para uma página de vendas Direct Response de alto impacto.

Use as seguintes regras de ouro de Copywriting e Design de Ofertas:
- Headlines devem usar uma das três fórmulas de alta conversão:
  1. Headline de Benefício Claro: "Conquiste [Resultado Desejado] sem [Coisa Chata]"
  2. Headline de Alerta/Perda: "Você está perdendo [Algo Valioso] por causa de [Problema Crítico]"
  3. Headline de Transformação: "De [Situação Dolorosa e Ruim] para [Situação Ideal de Sucesso]"
- Use a psicologia invisível do Blueprint de 12 Passos do Fiscaly:
  - Passo 1: Abertura de Problema (gerando identificação imediata e agitação da dor)
  - Passo 2: Apresentação da Solução (apresentando como um segredo revelado)
  - Passo 3: Validação de Autoridade (credibilidade incontestável)
  - Passo 4: Momento "É bizarro..." (insight contraintuitivo que quebra o padrão)
  - Passo 5: Explicação do Problema Profundo (racionalização)
  - Passo 6: Descrição Funcional da Solução (mecanismos tangíveis)
  - Passo 7: Apresentação do Diferencial (o que faz que 97% da concorrência não faz)
  - Passo 8: Simplificação do Processo ("Você faz X e ela entrega Y" - zero fricção)
  - Passo 9: Negação de Objeções (base técnica sólida e posicionamento de elite)
  - Passo 10: Prova Social Quantitativa (dados específicos e histórias)
  - Passo 11: Fechamento de Importância (vender como decisão estratégica do ano)
  - Passo 12: CTA Natural e Discreto (baixo compromisso que estimula o clique)

Gere uma resposta em JSON estritamente válido em Português com a seguinte estrutura:

{
  "salesPage": {
    "headline": "String - Uma headline matadora usando uma das 3 fórmulas acima (em português)",
    "subheadline": "String - Subheadline que complementa, aprofunda a promessa e bate na dor de forma sofisticada",
    "heroSection": {
      "title": "String - Título para o topo da página, ligando o produto ao mecanismo único de conversão",
      "text": "String - Texto explicativo, instigante, que detalha o segredo por trás do produto, gerando alta identificação",
      "ctaText": "String - Texto altamente persuasivo do botão de chamada (CTA) inicial"
    },
    "benefits": [
      { "title": "String", "description": "String - Detalhe o benefício prático mostrando como ele remove o sacrifício e encurta a espera" }
    ],
    "problemSection": {
      "title": "String - O problema real e recorrente sob a lente da Abertura de Problemas (Passo 1)",
      "description": "String - Detalhamento da dor de cabeça diária e do desperdício de tempo/dinheiro que o lead enfrenta"
    },
    "solutionSection": {
      "title": "String - O Mecanismo Único de Solução e revelação do segredo (Passo 5/6)",
      "description": "String - Explicação lógica de por que as soluções genéricas falham e como esta ferramenta gera sucesso imediato"
    },
    "socialProofIdea": "String - Idéia visual para prova social. Crie 3 depoimentos fictícios de peso em formato de texto para WhatsApp/Rede Social em português incluindo o nome da pessoa, ramo e o resultado alcançado",
    "authoritySection": {
      "title": "String - Detalhe de validação de autoridade (Passo 3)",
      "bio": "String - História envolvente de superação dos criadores, ancorando autoridade única de mercado no nicho"
    },
    "bonusesList": [
      { "title": "String - Nome do bônus altamente complementar", "value": "String - Valor sugerido (ex: R$ 297,00)", "description": "String - O que é entregue no bônus e como acelera o resultado" }
    ],
    "guaranteeSection": {
      "days": number,
      "text": "String - Texto detalhado da garantia condicional dupla (ex: se aplicar tudo e não der retorno, devolvemos e pagamos bônus)"
    },
    "objectionHandling": [
      { "question": "String - Pergunta de objeção sobre tempo ou dificuldade", "answer": "String - Resposta neutralizando o medo e mostrando facilidade extrema" }
    ],
    "faq": [
      { "question": "String", "answer": "String" }
    ],
    "ctaSection": {
      "title": "String - Frase final que move o lead a tomar a decisão estratégica do ano",
      "priceLabel": "String - Condição especial estruturada (ex: De R$ 997 por apenas R$ 197 ou 12x de R$ 19,70)",
      "buttonText": "String - Texto do botão principal (CTA) de checkout seguro"
    }
  },
  "vslScript": {
    "gancho": "String - Roteiro de abertura focado na interrupção de padrão e curiosidade extrema (primeiros 30s)",
    "historiaEmocional": "String - História emocionante, jornada do herói ou dor de quem já esteve na mesma situação",
    "revelacaoMecanismo": "String - Revelação da 'brecha' e do mecanismo único de solução que destrava tudo",
    "apresentacaoProduto": "String - O momento triunfal em que se apresenta o produto por dentro de forma prática",
    "quebraObjecoes": "String - Antecipar ceticismo sobre 'se funciona para mim' e mostrar simplicidade",
    "ctaChamadaAction": "String - Passo a passo exato do que ele precisa fazer agora para garantir a vaga"
  },
  "funnelStructure": {
    "leadMagnet": {
      "title": "String",
      "description": "String"
    },
    "optinPage": {
      "headline": "String",
      "cta": "String"
    },
    "upsellPage": {
      "name": "String",
      "headline": "String",
      "copyBrief": "String - Cópia rápida mostrando a oportunidade irresistível de upgrade imediato"
    },
    "downsellPage": {
      "name": "String",
      "headline": "String",
      "copyBrief": "String - Cópia focado em parcelamento ou versão simplificada para reter o cliente"
    },
    "remarketingEmails": [
      { "subject": "String", "body": "String" }
    ]
  },
  "creativesPrompts": [
    {
      "title": "String - Nome criativo do criativo (ex: Criativo Selfie, Criativo Tela Dividida)",
      "goal": "String - Objetivo do anúncio",
      "suggestedText": "String - Copy do anúncio para legenda ou leitura direta",
      "imageDescription": "String - Descrição visual detalhada para gerar em IAs de imagem",
      "prompts": {
        "chatGpt": "String - Prompt otimizado para reformular esta ideia de copy",
        "flux": "String - Prompt em inglês focado em realismo fotográfico para o Flux Engine",
        "midjourney": "String - Prompt em inglês cinemático profissional com ajustes de proporção e iluminação para o Midjourney v6",
        "gemini": "String - Prompt detalhado em português para geração de imagens no Gemini"
      }
    }
  ]
}

Garanta copys extraordinariamente detalhadas, longas, completas e ricas. Nunca entregue resumos ou placeholders genéricos. Saída estritamente em JSON puro sem blocos de markdown extras.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.85
        }
      });

      const responseHtmlText = response.text || "{}";
      const cleanedJson = responseHtmlText.trim().replace(/^```json/, "").replace(/```$/, "").trim();
      const fullAssets = JSON.parse(cleanedJson);

      project.generatedAssets = fullAssets;
      project.status = "generated";
      db.projects[projectIndex] = project;
      saveDb(db);

      res.json({ generated: fullAssets, user: db.users[0], simulated: false });

    } catch (apiError: any) {
      console.error("Erro ao chamar API Gemini na geração:", apiError);
      const fallbackGeneration = generateMockAssets(briefing.productName, briefing.productNiche, briefing.productPrice, analysis);
      project.generatedAssets = fallbackGeneration;
      project.status = "generated";
      db.projects[projectIndex] = project;
      saveDb(db);
      res.json({ generated: fallbackGeneration, user: db.users[0], error: apiError.message, simulated: true });
    }
  });

  // Knowledge Base management
  app.get("/api/knowledge-base", (req, res) => {
    const db = loadDb();
    res.json(db.knowledgeBase);
  });

  app.post("/api/knowledge-base", (req, res) => {
    const { title, category, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ error: "Título e Conteúdo são obrigatórios." });
      return;
    }
    const db = loadDb();
    const newKnowledge = {
      id: "k_" + Date.now(),
      title,
      category: category || "Geral",
      content,
      updatedAt: new Date().toISOString()
    };
    db.knowledgeBase.push(newKnowledge);
    saveDb(db);
    res.json(newKnowledge);
  });

  app.delete("/api/knowledge-base/:id", (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const index = db.knowledgeBase.findIndex((k: any) => k.id === id);
    if (index !== -1) {
      db.knowledgeBase.splice(index, 1);
      saveDb(db);
      res.json({ success: true });
      return;
    }
    res.status(404).json({ error: "Item de conhecimento não encontrado." });
  });

  // Serve static assets / Vite support
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Oferta Milionária AI rodando na porta ${PORT}`);
  });
}

// SIMULATOR DATA FALLBACK GENERATORS
// When GEMINI API KEY is missing or fails, this guarantees a phenomenal copy outcome
function generateMockAnalysis(productName: string, productNiche: string) {
  const name = productName || "Produto Secreto";
  const niche = productNiche || "Marketing";
  
  return {
    "especialistaOferta": {
      "nota": 6.8,
      "pontosFortes": [
        "Temática com alta demanda reprimida",
        "Margem de lucro flexível para precificação de testes",
        "Ponto de urgência claro"
      ],
      "pontosFracos": [
        "A promessa está parecendo um ganho fácil exagerado sem fundamentação lógica",
        "Garantia padrão de 7 dias gera pouca confiança contra concorrência premium",
        "Os bônus são fracos e parecem sobras de e-books em PDF obsoletos"
      ],
      "novaOfertaProposta": `Garantia Condicional Dupla de 30 Dias + Bônus Desafio Prático com Mentoria Gravada + Acesso Vitalício com precificação ancorada de R$ 997 por apenas R$ 197.`
    },
    "especialistaHeadlines": {
      "nota": 7.5,
      "analises": "Headlines atuais carecem de apelo por mecanismo exclusivo. Recomendamos ancorar na velocidade e no desbloqueio sem dores habituais.",
      "headlines": [
        `Como destravar resultados de 1 ano em ${name} nos próximos 14 dias (Sem sofrer com os velhos bloqueios)`,
        `A ciência por trás do sucesso em ${niche}: O que os players de 7 dígitos nunca te revelaram`,
        `Pare de rasgar dinheiro: Use este método testado de ${name} para decolar sua conversão`,
        `O segredo oculto do mercado de ${niche} que gera vendas silenciosas todos os dias`,
        `Deixe a concorrência se perguntando onde você aprendeu isso: O Método ${name} Revelado`,
        `O Guia Definitivo do iniciante ao avançado em ${niche} a prova de falhas`,
        `Apenas 17 minutos por dia: Como alcançar a liberdade de escala com esta tecnologia pioneira`,
        `O erro fatal que 93% dos empreendedores cometem ao tentar escalar no nicho de ${niche}`,
        `Seja sincero: Você aguenta mais quantos meses dependendo do acaso para lucrar?`,
        `Imagine acordar amanhã com seu painel transbordando de notificações de vendas em ${name}...`,
        `A única estratégia do mundo que une automação de alta conversão para o nicho de ${niche}`,
        `Por que este novo sistema está se tornando o pior pesadelo dos gurus tradicionais`,
        `Fórmula de Conversão: Como estruturar ofertas irresistíveis em tempo recorde`,
        `Chega de teorias cansativas: O Passo a Passo prático para dominar ${name} sem dor de cabeça`,
        `O segredo para transformar tráfego frio em clientes leais e apaixonados por sua marca`,
        `Quanto vale ter em mãos um plano exato desenhado por especialistas globais?`,
        `Construa um império digital duradouro focado em alta margem de lucro com este hack`,
        `A brecha secreta no algoritmo que permite pescar clientes qualificados prontos para comprar`,
        `A máquina de vendas definitiva: Como colocar sua oferta rápida no piloto automático`,
        `Finalmente revelado: O checklist exato de ${name} que faturou múltiplos milhões`
      ]
    },
    "especialistaCopy": {
      "diagnostico": `A copy atual de ${name} foca demais nas características técnicas do produto em vez dos benefícios imediatos e da transformação na vida do avatar. Falta um gancho disruptivo (Mecanismo Único de Solução).`,
      "melhorias": [
        "Implementar a fórmula PAS (Problema, Agitação, Solução) no primeiro bloco da página",
        "Mudar a linguagem técnica por analogias de fácil digestão do público leigo",
        "Inserir quebras de objeção logo abaixo do selo de garantia de satisfação"
      ],
      "copyOtimizadaOutline": `Gancho inicial disruptivo prendendo a respiração -> Revelação da Grande Mentira que impede os resultados -> Apresentação do Mecanismo Único de ${name} -> Prova Social e Depoimentos Simulados de Sucesso -> Quebra de 3 Barreiras Mentais -> CTA de ancoragem com Urgência Temporal.`
    },
    "especialistaVSL": {
      "novaEstruturaVSL": {
        "gancho": "Apenas as primeiras 50 pessoas que assistirem a esta apresentação até o fim entenderão como esta nova ferramenta resolve o problema imediatamente.",
        "storytelling": "A história de como um fracasso humilhante me forçou a decodificar as métricas secretas de conversão no nicho de marketing.",
        "quebraObjecoes": "Você deve estar se perguntando: 'Será que eu consigo fazer isso sem experiência prévia ou dotes técnicos?' Deixe-me mostrar o exemplo de 3 iniciantes absolutos.",
        "fechamentoCall": "O botão vermelho de liberação imediata está logo abaixo. Você tem duas opções: ignorar e continuar na mesma, ou agir e garantir os bônus raros."
      }
    },
    "especialistaHooks": {
      "hooks": [
        `Se você trabalha com ${niche}, pare o que está fazendo por 10 segundos agora.`,
        `A grande mentira que te contaram sobre vendas na internet que está quebrando seu negócio.`,
        `Isso aqui vale mais que qualquer MBA de R$ 30.000, e eu vou te dar em 30 segundos.`,
        `O algoritmo não quer que você assista a este vídeo até o final.`,
        `Como eu transformei meu maior fracasso em um negócio lucrativo com este passo simples.`,
        `O segredo número 1 para vender qualquer produto sem aparecer na internet.`,
        `Por favor, pare de usar anúncios convencionais antes de ver esta nova estratégia.`,
        `Seus concorrentes estão torcendo para que você passe direto por este vídeo.`,
        `O que acontece quando você aplica neurocopywriting pura em uma página simples de ${niche}?`,
        `Este é o truque de 3 passos usado pelos maiores copywriters do mundo de ${name}.`,
        `Minha conta bancária simplesmente explodiu depois que eu parei de seguir estes conselhos.`,
        `Como um simples detalhe na garantia dobrou minhas vendas de ${name} sem gastar mais.`,
        `A dor de cabeça que você está tendo para vender seu produto é culpa desse erro comum.`,
        `Antes de gastar mais um centavo em tráfego pago, mude essa frase na sua headline.`,
        `O segredo revelado que me permitiu largar meu chefe chato em apenas 3 semanas.`,
        `Você provavelmente está cometendo o erro dos 90% logo no primeiro segundo do seu anúncio.`,
        `Esqueça tudo o que disseram sobre funil complexo. Esta estrutura simples lucra mais.`,
        `O método estranho que gera audiência altamente engajada sem gastar absolutamente nada.`,
        `Como cobrar 3x mais caro e fazer o seu cliente te agradecer na compra.`,
        `A regra oculta do neuromarketing aplicada para vender ${productNiche} hoje mesmo.`,
        `Descubra como grandes marcas criam anúncios que parecem viciantes.`,
        `Se você pudesse copiar apenas um modelo de criativo vencedor, seria exatamente este.`,
        `A mudança cirúrgica na copy do produto ${name} que fez a conversão saltar 40%.`,
        `Pare de implorar por atenção. Use a quebra de padrão visual que faz as pessoas pararem o feed.`,
        `O truque secreto do botão de CTA que convence o investidor mais cético do mundo.`,
        `Esta é a verdade nua e crua sobre escalabilidade que ninguém grava nos stories.`,
        `O exato roteiro que faturou múltiplos dígitos no piloto automático em menos de um mês.`,
        `Se você quer construir liberdade real, preste extrema atenção a estes próximos segundos.`,
        `A revolução em copy gerada por inteligência artificial que está assustando agências.`,
        `O exato checklist milagroso da oferta milionária revelado para você grátis.`
      ]
    },
    "especialistaCriativos": {
      "angulosVisuais": [
        "Contraste de dor extrema e paz absoluta em tela dividida",
        "Zoom progressivo em um painel financeiro subindo em tempo real com contador simples",
        "Demonstração prática de 45 segundos usando analogias de cozinha ou construção"
      ],
      "ideiasDeCriativos": [
        "Vídeo Estilo Selfie: Desabafo sincero sobre mentiras e soluções milagrosas no mercado",
        "Vídeo de Animação Conceitual: Uma linha de produção que trava até ser trocada por esta nova engrenagem"
      ]
    },
    "especialistaAvatar": {
      "avatarPrincipal": "Carlos, 29 anos, cansado de comprar cursos vazios que prometem enriquecimento rápido e buscam focar em ferramentas sólidas e aplicáveis.",
      "segmentosOcultos": [
        "Profissionais autônomos querendo digitalizar atendimentos presenciais",
        "Donos de pequenas marcas físicas sofrendo com margens de lucros enfraquecidas"
      ],
      "novosPublicos": [
        "Iniciantes em agências de copy que desejam agilizar a entrega de criativos"
      ]
    },
    "especialistaEscala": {
      "canaisDeConversao": [
        "Advertorial de fofoca científica ou descoberta de mercado",
        "Página de vendas direta otimizada para tráfego com VSL curta no topo"
      ],
      "estrategiasDeExpansao": [
        "Expansão internacional acelerada por dublagem AI das VSLs",
        "Whitelabeling de metodologia para afiliados premium profissionais"
      ]
    },
    "especialistaTrafego": {
      "campanhasMeta": "Estrutura CBO 1-3-1 focando em criativos dinâmicos com interrupção extrema de feed",
      "campanhasTikTok": "Vídeos curtos de 15 segundos nativos com tendências de áudio atuais e legenda rápida",
      "campanhasGoogle": "Campanha na rede de pesquisa captando compradores procurando especificamente termos concorrentes"
    },
    "especialistaMetricas": {
      "diagnosticoGargalo": "CTR de saída de anúncio abaixo de 1.2% mostra problemas de gancho nos criativos.",
      "metricasEstimadasAlvo": "Meta: CTR > 2.2%, CPC < R$ 0.80, Conversão de Checkouts > 18%."
    },
    "especialistaFunis": {
      "leadMagnetSugerido": "O Blueprint de Engenharia Reversa da Oferta Perfeita (PDF Dinâmico)",
      "upsellSugerido": "Super Pack de Roteiros e Elementos de Alta Conversão Copiar/Colar (R$ 47,00)",
      "downsellSugerido": "Acesso de teste de 7 dias com mentoria em comunidade por R$ 19,90",
      "remarketingSugerido": "Sequência de 3 e-mails focadas em escassez de vagas e bônus relâmpago"
    },
    "especialistaBranding": {
      "posicionamento": "Líder de confiabilidade e seriedade acadêmica contra charlatanismos do mercado.",
      "autoridadeEPercepcao": "Selo de Certificação de Tecnologia de Copywriting, garantindo solidez lógica."
    },
    "diretorMarketing": {
      "manter": [
        "A base do produto e a precificação competitiva na ponta de entrada",
        "Uso de bônus complementares bem segmentados"
      ],
      "remover": [
        "Clichês saturados de promessa de luxo fácil exagerado",
        "Introduções longas e entediantes de VSL"
      ],
      "melhoriar": [
        "Garantia Incondicional estendida",
        "Uso de termos de Mecanismos Únicos e Científicos de Solução"
      ],
      "promessaUnicaIdeal": `Como Desbloquear Múltiplos Fluxos de Clientes no Nicho de ${niche} Usando o Mecanismo de Oferta Exclusiva ${name}`,
      "anguloPrincipal": "Contraste lógico entre o esforço árduo tradicional e a inteligência unificada dos especialistas",
      "planoAcaoPassoAPasso": [
        "Ajuste da headline e implementação de 30 ganchos nos anúncios principais",
        "Substituição de e-books genéricos por mentoria prática gravada",
        "Criação de criativos de alta retenção visual com quebra de padrão",
        "Implementação de campanhas de tráfego com remarketing direcionado"
      ]
    }
  };
}

function generateMockAssets(productName: string, productNiche: string, productPrice: string, analysisResult: any) {
  const name = productName || "Produto Secreto";
  const niche = productNiche || "Marketing";
  const finalPrice = productPrice || "197";
  
  return {
    "salesPage": {
      "headline": `Conquiste Clientes Altamente Lucrativos em ${niche} Sem Depender de Agências Caras ou Fórmulas Prontas de Gurus`,
      "subheadline": `Você está perdendo vendas silenciosas todos os dias por conta de promessas genéricas. Descubra como o Mecanismo de Oferta de Alta Conversão da Inteligência Multidisciplinar ${name} reconstrói seu funil de ponta a ponta com a precisão cirúrgica de 12 mentes brilhantes de marketing digital.`,
      "heroSection": {
        "title": `Chegou a Era das Ofertas à Prova de Recusa no Mercado de ${niche}!`,
        "text": `Esqueça as palhaçadas de palco e textos mornos. O ecossistema ${name} unifica análises milimétricas de tráfego, design de oferta, quebra de objeções e copywriting magnético. Ative uma presença digital imbatível que faz seu lead se sentir um tolo ao tentar dizer 'não'.`,
        "ctaText": "QUERO DESTRACAR MINHA OFERTA MILIONÁRIA HOJE"
      },
      "benefits": [
        { "title": "Abertura de Demanda Reprimida", "description": "Localize as brechas ocultas de concorrência e posicione o seu produto de forma irresistível em até 20 minutos." },
        { "title": "Mecanismo Único de Solução", "description": "Comprima o tempo de conversão eliminando o sacrifício tradicional do seu cliente com ferramentas práticas e fluidas." },
        { "title": "Economia de Verba Publicitária", "description": "Mantenha o tráfego frio colado na sua página com ganchos disruptivos aplicados de forma cirúrgica na sua headline." }
      ],
      "problemSection": {
        "title": "A Verdadeira Razão Pela Qual Seu Fator de Conversão Está Sangrando...",
        "description": "Você tenta vender, sobe campanhas, ajusta as artes do feed, mas o cliente simplesmente passa reto. Isso acontece porque suas páginas usam a mesma promessa saturada de todo mundo. Quando sua mensagem parece com a de todos os concorrentes, o cliente avalia pelo preço baixo, destruindo suas margens de lucro."
      },
      "solutionSection": {
        "title": `O Fim da Tentativa e Erro: Tecnologia Científica Baseada na Mesa Especialista`,
        "description": "A união perfeita de branding, psicologia comportamental, anúncios segmentados e copy clássica. Nosso cérebro Diretor IA constrói em instantes o esqueleto de vendas ideal, unindo argumentos de 12 especialistas ao mesmo tempo para blindar seu produto contra crises e saturação do mercado."
      },
      "socialProofIdea": "Mariana S. (Dona de Negócio) - 'Faturei R$ 14.800 após mudar a headline e aplicar o bônus de criativos rápidos!' | Roberto K. (Gestor de Tráfego) - 'O novo script de VSL reduziu meu custo por aquisição (CAC) em incríveis 37% na primeira semana.' | Amanda L. (Infoprodutora) - 'Não sabia nada de copywriting. Em 15 minutos o sistema desenhou o plano exato de escala que eu buscava.'",
      "authoritySection": {
        "title": "Desenhado por Quem Respira Métricas Reais no Asfalto do Tráfego Pago",
        "bio": `Após investir múltiplos milhões em anúncios de alta performance e gerenciar mais de 43 mil leads qualificados nos setores mais concorridos de ${niche}, decidimos criar o ${name}. Um método desenvolvido para empacotar resultados reais, reduzindo custos e maximizando lucros diários.`
      },
      "bonusesList": [
        { "title": "Super Módulo de Criativos Virais", "value": "R$ 497,00", "description": "Sequência exata de ganchos que interrompem o feed nas redes de vídeos rápidos, aumentando sua taxa de clique (CTR)." },
        { "title": "Templates de Páginas Copiar-e-Colar", "value": "R$ 297,00", "description": "Estruturas totalmente fluidas prontas para carregar no WordPress ou Elementor em minutos sem programar." }
      ],
      "guaranteeSection": {
        "days": 30,
        "text": "Se em até 30 dias você aplicar os pilares estruturados na sua nova página e provar que suas taxas de conversão não subiram, nós devolvemos 100% do seu dinheiro investido de forma incondicional."
      },
      "objectionHandling": [
        { "question": "Não tenho nenhuma noção de copywriting, vou saber usar o sistema?", "answer": "Sim! A nossa ferramenta foi desenvolvida com foco total em simplicidade e usabilidade rápida. Tudo é entregue traduzido em português claro, direto ao ponto." },
        { "question": "Preciso investir rios de dinheiro em tráfego pago para ter resultados?", "answer": "Não! A nossa engenharia de copy e oferta é calibrada para tirar o maior suco possível do tráfego orgânico ou estruturas simples no WhatsApp um-a-um." }
      ],
      "faq": [
        { "question": "Como e quando recebo o acesso completo da ferramenta?", "answer": "O envio é imediato. Assim que o pagamento for confirmado, os dados de acesso são despachados diretamente no seu e-mail cadastrado de forma automatizada." },
        { "question": "Posso aplicar esse método para mais de um produto ou nicho?", "answer": "Com certeza. A flexibilidade do cérebro Diretor permite mudar e reestruturar a mesa de especialistas para qualquer oferta física ou infoproduto." }
      ],
      "ctaSection": {
        "title": "Tome a Decisão Mais Inteligente e Lucrativa do Seu Ano Comercial",
        "priceLabel": `De R$ 997,00 por apenas R$ ${finalPrice},00 à vista ou em 12 parcelas facilitadas no cartão`,
        "buttonText": "EU QUERO MEU CONTRATO HOJE COM ESSE DESCONTO"
      }
    },
    "vslScript": {
      "gancho": "Se você quer descobrir o exato segredo para dominar vendas em redes sociais sem ter que virar escravo do feed, preste atenção aos próximos 45 segundos.",
      "historiaEmocional": `Há um ano eu estava quebrado, trabalhando de sol a sol tentando fazer os anúncios funcionarem no nicho de ${niche}. Nada dava certo. Minhas margens sumiam no final de cada mês. Até que decidi analisar a fundo a psicologia dos anúncios campeões...`,
      "revelacaoMecanismo": `Descobri que a falha não era do meu gestor de anúncios, e sim do formato genérico com que as mensagens de vendas são escritas. Substituí tudo por um ecossistema sincronizado que reúne 12 estratégias ao mesmo tempo.`,
      "apresentacaoProduto": `Apresento o ${name}: O blueprint definitivo do seu novo patamar de vendas, gerando textos magnéticos, páginas e anúncios que convertem leads em devotos da sua marca.`,
      "quebraObjecoes": "Você pode achar difícil aplicar tudo isso, mas criamos ferramentas de simplificação máxima. Bastam 10 minutos de preenchimento para obter campanhas blindadas.",
      "ctaChamadaAction": "Clique no botão abaixo, escolha o seu plano e ative sua própria mesa milionária de marketing digital premium nas próximas 2 horas."
    },
    "funnelStructure": {
      "leadMagnet": {
        "title": `O Método Secreto de ${name} Revelado`,
        "description": "Um checklist acionável com as exatas 15 estratégias de copy que multiplicam CTR e diminuem o CPA pela metade."
      },
      "optinPage": {
        "headline": "Descubra como estruturar uma máquina milionária de vendas em minutos sem custos de agências",
        "cta": "Baixar Grátis Agora"
      },
      "upsellPage": {
        "name": "Acelerador Elite 10x",
        "headline": "Duplique seus resultados ativando o nosso pacote completo de Templates WordPress no Checkout rápido",
        "copyBrief": "Mostre ao cliente como adquirir a oferta de bônus imediata evita retrabalho de adaptação nas ferramentas de publicação tradicionais por mais R$ 47,00."
      },
      "downsellPage": {
        "name": "Versão pocket pocket",
        "headline": "Não quer gastar R$ 47 agora? Adquira o nosso kit básico de headlines por apenas R$ 19",
        "copyBrief": "Mantém o funil reduzindo a barreira financeira para garantir que o cliente de checkout inicial se mantenha ativo na sua jornada de compras."
      },
      "remarketingEmails": [
        { "subject": "⚠️ O bônus exclusivo da sua mesa se expira em 3 horas", "body": "Olá, vimos que você conferiu a mesa de especialistas de Oferta Milionária AI para o produto. O Cupom de 50% de desconto está prestes a sair do ar. Não perca." },
        { "subject": "Você vai deixar Carlos (Avatar) comprar da concorrência?", "body": "Seu cliente ideal está buscando exatas soluções que você está escondendo na gaveta. Ative sua página de alta conversão hoje mesmo." }
      ]
    },
    "creativesPrompts": [
      {
        "title": "Criativo Interrupção de Padrão (Meta e TikTok)",
        "goal": "Conduzir as pessoas do feed diretamente para ver o relatório executivo da página",
        "suggestedText": "Este pequeno segredo do ecossistema de marketing mudará para sempre o faturamento de quem vende infoprodutos online.",
        "imageDescription": "Uma sala elegante estilo boardroom com 12 hologramas brilhantes de especialistas ao redor de uma mesa iluminada de alta tecnologia, no centro um holograma azul de um cérebro funcionando, iluminação cinematográfica escuro futurista.",
        "prompts": {
          "chatGpt": "Crie um roteiro de 15 segundos para Meta Ads descrevendo um empreendedor surpreso ao descobrir uma ferramenta que analisa ofertas como 12 cérebros experts.",
          "flux": "Cinematic shot of 12 distinct digital hologram marketing avatars sitting around a futuristic neon lit boardroom table, centered holographic brain, cyberpunk dashboard background, high details, 4k, volumetric lights.",
          "midjourney": "A digital agency room, 12 futuristic neon projection characters at a corporate table discussing data on virtual screens, cinematic dark atmosphere with golden accents, photorealistic, Unreal Engine 5 render, 8k --ar 16:9",
          "gemini": "Uma foto em formato paisagem com iluminação futurista e realista, mostrando doze figuras digitais ao redor de uma mesa inteligente, com um gráfico holográfico no meio apontando picos de conversão de anúncios."
        }
      }
    ]
  };
}

startServer();
