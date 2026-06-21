export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Pro" | "Agency";
  credits: number;
  lovableWorkspace: string;
  createdAt: string;
}

export interface ColetaInput {
  sourceUrl?: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
  oferta?: string;
  garantia?: string;
  bonus?: string;
  copyExtraida?: string;
  uploadedFiles?: string[];
}

export interface BriefingInput {
  productName: string;
  productNiche: string;
  productPrice: string;
  targetAudience: string;
  targetAge: string;
  targetGender: string;
  objective: "conversao" | "criativos" | "escala" | "nova_oferta";
  concorrência?: string;
  diferenciais?: string;
}

export interface EspecialistaOferta {
  nota: number;
  pontosFortes: string[];
  pontosFracos: string[];
  novaOfertaProposta: string;
}

export interface EspecialistaHeadlines {
  nota: number;
  analises: string;
  headlines: string[];
}

export interface EspecialistaCopy {
  diagnostico: string;
  melhorias: string[];
  copyOtimizadaOutline: string;
}

export interface EspecialistaVSL {
  novaEstruturaVSL: {
    gancho: string;
    storytelling: string;
    quebraObjecoes: string;
    fechamentoCall: string;
  };
}

export interface EspecialistaHooks {
  hooks: string[];
}

export interface EspecialistaCriativos {
  angulosVisuais: string[];
  ideiasDeCriativos: string[];
}

export interface EspecialistaAvatar {
  avatarPrincipal: string;
  segmentosOcultos: string[];
  novosPublicos: string[];
}

export interface EspecialistaEscala {
  canaisDeConversao: string[];
  estrategiasDeExpansao: string[];
}

export interface EspecialistaTrafego {
  campanhasMeta: string;
  campanhasTikTok: string;
  campanhasGoogle: string;
}

export interface EspecialistaMetricas {
  diagnosticoGargalo: string;
  metricasEstimadasAlvo: string;
}

export interface EspecialistaFunis {
  leadMagnetSugerido: string;
  upsellSugerido: string;
  downsellSugerido: string;
  remarketingSugerido: string;
}

export interface EspecialistaBranding {
  posicionamento: string;
  autoridadeEPercepcao: string;
}

export interface DiretorMarketing {
  manter: string[];
  remover: string[];
  melhorar: string[];
  promessaUnicaIdeal: string;
  anguloPrincipal: string;
  planoAcaoPassoAPasso: string[];
}

export interface ProjectAnalysis {
  especialistaOferta: EspecialistaOferta;
  especialistaHeadlines: EspecialistaHeadlines;
  especialistaCopy: EspecialistaCopy;
  especialistaVSL: EspecialistaVSL;
  especialistaHooks: EspecialistaHooks;
  especialistaCriativos: EspecialistaCriativos;
  especialistaAvatar: EspecialistaAvatar;
  especialistaEscala: EspecialistaEscala;
  especialistaTrafego: EspecialistaTrafego;
  especialistaMetricas: EspecialistaMetricas;
  especialistaFunis: EspecialistaFunis;
  especialistaBranding: EspecialistaBranding;
  diretorMarketing: DiretorMarketing;
}

export interface SalesPageAsset {
  headline: string;
  subheadline: string;
  heroSection: {
    title: string;
    text: string;
    ctaText: string;
  };
  benefits: Array<{ title: string; description: string }>;
  problemSection: {
    title: string;
    description: string;
  };
  solutionSection: {
    title: string;
    description: string;
  };
  socialProofIdea: string;
  authoritySection: {
    title: string;
    bio: string;
  };
  bonusesList: Array<{ title: string; value: string; description: string }>;
  guaranteeSection: {
    days: number;
    text: string;
  };
  objectionHandling: Array<{ question: string; answer: string }>;
  faq: Array<{ question: string; answer: string }>;
  ctaSection: {
    title: string;
    priceLabel: string;
    buttonText: string;
  };
}

export interface VslAsset {
  gancho: string;
  historiaEmocional: string;
  revelacaoMecanismo: string;
  apresentacaoProduto: string;
  quebraObjecoes: string;
  ctaChamadaAction: string;
}

export interface FunnelAsset {
  leadMagnet: { title: string; description: string };
  optinPage: { headline: string; cta: string };
  upsellPage: { name: string; headline: string; copyBrief: string };
  downsellPage: { name: string; headline: string; copyBrief: string };
  remarketingEmails: Array<{ subject: string; body: string }>;
}

export interface CreativePromptAsset {
  title: string;
  goal: string;
  suggestedText: string;
  imageDescription: string;
  prompts: {
    chatGpt: string;
    flux: string;
    midjourney: string;
    gemini: string;
  };
}

export interface ProjectGeneratedAssets {
  salesPage: SalesPageAsset;
  vslScript: VslAsset;
  funnelStructure: FunnelAsset;
  creativesPrompts: CreativePromptAsset[];
}

export interface Project {
  id: string;
  name: string;
  status: "briefing_completed" | "analyzed" | "approved" | "generated";
  createdAt: string;
  coleta: ColetaInput;
  briefing: BriefingInput;
  analysisResult: ProjectAnalysis | null;
  generatedAssets: ProjectGeneratedAssets | null;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
}
