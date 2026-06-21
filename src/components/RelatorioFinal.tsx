import React, { useState, useEffect } from "react";
import { 
  Check, 
  Copy, 
  Download, 
  Sparkles, 
  FileText, 
  Monitor, 
  Video, 
  Layers, 
  Image, 
  ExternalLink,
  ChevronDown,
  HelpCircle,
  FileCode2,
  BookmarkCheck,
  CheckCircle2,
  CornerDownRight,
  Clock,
  ShieldCheck,
  Play,
  Pause,
  ArrowRight,
  Lock,
  Smartphone,
  Users,
  AlertTriangle,
  Star,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkle,
  Zap,
  Award,
  Heart,
  TrendingUp,
  Maximize2,
  Eye
} from "lucide-react";
import { Project, UserProfile, ProjectGeneratedAssets } from "../types";

interface RelatorioFinalProps {
  project: Project;
  user: UserProfile | null;
  onGenerateFull: () => Promise<void>;
  loading: boolean;
}

export default function RelatorioFinal({ 
  project, 
  user, 
  onGenerateFull, 
  loading 
}: RelatorioFinalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"sales" | "vsl" | "funnel" | "creatives" | "export">("sales");
  const [faqOpenState, setFaqOpenState] = useState<Record<number, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  // High-conversion visual interactive controls
  const [salesViewMode, setSalesViewMode] = useState<"visual" | "copy">("visual");
  const [previewTheme, setPreviewTheme] = useState<"cosmic" | "emerald" | "midnight">("cosmic");
  
  // Real-time Countdown timer for scarcity visual effect
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 34); // 14m 34s
  const [toastText, setToastText] = useState("Renato de Belo Horizonte acabou de adquirir a oferta de IA ⭐⭐⭐⭐⭐");
  const [toastVisible, setToastVisible] = useState(true);
  
  // Interactive simulated VSL player state
  const [isVslPlaying, setIsVslPlaying] = useState(false);
  const [vslVolume, setVslVolume] = useState(true);
  
  // Checkout simulator modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<"form" | "paying" | "success">("form");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

  // Countdown clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 15 * 60 + 20; // reset to mimic infinite high-converting ticker
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Floating notifications social-proof effect
  useEffect(() => {
    const alerts = [
      "Renato de Belo Horizonte acabou de adquirir a oferta de IA ⭐⭐⭐⭐⭐",
      "Ana Silva de São Paulo economizou R$ 1.840 no primeiro teste! 💎",
      "Carlos M. de Curitiba migrou da concorrência e aprovou ⚡",
      "Karina de Salvador garantiu vaga no plano vitalício + Bônus 🔥",
      "Mais 4 donos de agência estão consultando esta mesa de especialistas agora"
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setToastVisible(false);
      setTimeout(() => {
        idx = (idx + 1) % alerts.length;
        setToastText(alerts[idx]);
        setToastVisible(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const triggerCopyNotification = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const assets: ProjectGeneratedAssets | null = project.generatedAssets;

  // Simulate HTML Export
  const downloadHtmlLP = () => {
    if (!assets) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${assets.salesPage?.headline || 'Página de Vendas'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;850&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Plus Jakarta Sans', sans-serif; }
      .gradient-title {
        background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    </style>
</head>
<body class="bg-gray-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
    <header class="py-16 md:py-24 border-b border-gray-900 bg-gray-950/90 text-center relative overflow-hidden px-4">
        <span class="text-xs uppercase tracking-widest text-amber-500 font-mono font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Mecanismo Único de Conversão</span>
        <h1 class="text-3xl md:text-5xl font-black text-slate-500 tracking-tight max-w-4xl mx-auto mt-6 leading-tight gradient-title">${assets.salesPage?.headline}</h1>
        <p class="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">${assets.salesPage?.subheadline}</p>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-16 space-y-20">
        <section class="text-center p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl relative overflow-hidden">
            <h2 class="text-2xl font-bold text-slate-100 tracking-tight">${assets.salesPage?.heroSection?.title}</h2>
            <p class="text-slate-300 text-sm mt-4 leading-relaxed">${assets.salesPage?.heroSection?.text}</p>
            <a href="#cta" class="inline-block mt-8 bg-amber-500 hover:bg-amber-600 text-gray-950 font-black px-10 py-5 rounded-2xl text-sm tracking-wide transition-all shadow-xl shadow-amber-500/20 transform hover:-translate-y-0.5">${assets.salesPage?.heroSection?.ctaText}</a>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-8 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-3">
                <span class="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block">O Grande Obstáculo</span>
                <h3 class="text-lg font-bold text-slate-200">${assets.salesPage?.problemSection?.title}</h3>
                <p class="text-slate-400 text-sm leading-relaxed">${assets.salesPage?.problemSection?.description}</p>
            </div>
            <div class="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                <span class="text-xs font-mono font-bold text-emerald-555 text-emerald-500 uppercase tracking-widest block">A Chave da Virada</span>
                <h3 class="text-lg font-bold text-slate-200">${assets.salesPage?.solutionSection?.title}</h3>
                <p class="text-slate-400 text-sm leading-relaxed">${assets.salesPage?.solutionSection?.description}</p>
            </div>
        </section>

        <section class="space-y-6">
            <h3 class="text-xl font-bold text-slate-200 tracking-tight text-center">Benefícios Cientificamente Estruturados</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${assets.salesPage?.benefits?.map((benefit, idx) => `
                <div class="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition">
                    <span class="text-xs font-mono text-amber-500 font-black">0${idx+1}.</span>
                    <h4 class="font-bold text-slate-100 text-sm mt-2">${benefit.title}</h4>
                    <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">${benefit.description}</p>
                </div>
                `).join('')}
            </div>
        </section>

        <section id="cta" class="p-10 rounded-3xl border border-amber-500/30 bg-gray-900 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div class="space-y-2">
                <span class="text-xs tracking-widest font-mono text-amber-500 font-bold uppercase">Acesso Imediato</span>
                <h3 class="text-2xl font-bold text-slate-100">${assets.salesPage?.ctaSection?.title}</h3>
            </div>
            <div class="py-4">
                <span class="text-amber-400 text-4xl md:text-5xl font-mono font-bold tracking-tight block">${assets.salesPage?.ctaSection?.priceLabel}</span>
                <p class="text-xs text-slate-400 mt-2">Garantia integral de ${assets.salesPage?.guaranteeSection?.days} dias. Sem riscos para você.</p>
            </div>
            <button class="bg-amber-500 hover:bg-amber-600 text-gray-950 font-black px-10 py-5 rounded-2xl text-sm tracking-wide transition shadow-xl shadow-amber-500/25">${assets.salesPage?.ctaSection?.buttonText}</button>
        </section>
    </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pagina-de-vendas-${project.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    link.click();
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4 max-w-2xl mx-auto">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-pulse" />
          <div className="absolute inset-x-0 top-0 h-16 w-16 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
        </div>
        <h4 className="text-lg font-display font-semibold text-slate-100">Compilando Oferta Milionária...</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto font-sans">
          Nosso cérebro Diretor está estruturando a página de vendas, os scripts de vídeo, sequências de e-mails de remarketing e prompts de criativos baseando-se nas conclusões da mesa de especialistas.
        </p>
      </div>
    );
  }

  // ETAPA 4: APROVAÇÃO (Draft Checklist before full Generation)
  if (!assets) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-2">
        <div className="p-6 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md boardroom-grid space-y-4 relative overflow-hidden shadow-xl shadow-amber-500/2">
          <div className="flex items-center gap-3">
            <BookmarkCheck className="w-6 h-6 text-amber-500 animate-bounce" />
            <div>
              <h3 className="font-display font-medium text-lg text-white">Etapa 4 — Aprovação & Sincronização Estratégica</h3>
              <p className="text-neutral-400 text-xs font-sans">
                Revise os planos eleitos pela mesa de especialistas para autorizar a geração completa dos materiais.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-black/45 text-xs space-y-3 font-sans leading-relaxed">
            <p className="text-neutral-350 leading-relaxed font-semibold block mb-1">Os seguintes ativos de marketing serão construídos e otimizados pelo Diretor IA:</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Nova Headline da Oferta: <strong className="text-white">({project.analysisResult?.diretorMarketing?.promessaUnicaIdeal || "Calculada pelo Diretor"})</strong></span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Roteiro de VSL (Vídeo de Vendas) baseado no ângulo da Mesa</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Ideias e Prompts de Criativos Infalíveis para Facebook, Midjourney e Flux</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Estrutura de Funil de Remarketing ativa com Upsell / Downsell</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-[11px] font-mono text-neutral-500 font-bold">Custo: 20 créditos</span>
            <button
              onClick={onGenerateFull}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/15"
            >
              <Sparkles className="w-4 h-4 fill-current animate-spin" />
              <span>APROVAR E GERAR ESTRUTURA COMPLETA</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Define Theme Styling Classes
  const getThemeClasses = () => {
    switch (previewTheme) {
      case "emerald":
        return {
          wrapper: "bg-neutral-950 border-emerald-500/10 shadow-emerald-500/5",
          primaryText: "text-emerald-400",
          primaryBg: "bg-emerald-500 hover:bg-emerald-600 text-black",
          primaryBorder: "border-emerald-500/20",
          tagBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          glowBorder: "border-emerald-500/15",
          highlightGradient: "from-emerald-400 via-teal-300 to-emerald-500",
          badgeBorder: "border-emerald-500/30",
          textHighlight: "text-emerald-400",
          accentBg: "bg-emerald-500/5 border-emerald-500/10",
          buttonHover: "hover:shadow-emerald-500/20",
          bulletIcon: "text-emerald-400"
        };
      case "midnight":
        return {
          wrapper: "bg-slate-950 border-purple-500/10 shadow-purple-500/5",
          primaryText: "text-purple-400",
          primaryBg: "bg-purple-600 hover:bg-purple-700 text-white",
          primaryBorder: "border-purple-500/20",
          tagBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          glowBorder: "border-purple-500/15",
          highlightGradient: "from-purple-400 via-fuchsia-300 to-indigo-500",
          badgeBorder: "border-purple-500/30",
          textHighlight: "text-purple-400",
          accentBg: "bg-purple-500/5 border-purple-500/10",
          buttonHover: "hover:shadow-purple-500/20",
          bulletIcon: "text-purple-400"
        };
      case "cosmic":
      default:
        return {
          wrapper: "bg-zinc-950 border-amber-500/10 shadow-amber-500/5",
          primaryText: "text-amber-500",
          primaryBg: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black",
          primaryBorder: "border-amber-500/20",
          tagBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          glowBorder: "border-amber-500/15",
          highlightGradient: "from-amber-400 via-yellow-300 to-amber-500",
          badgeBorder: "border-amber-500/30",
          textHighlight: "text-amber-400",
          accentBg: "bg-amber-500/5 border-amber-505 border-amber-500/10",
          buttonHover: "hover:shadow-amber-505 hover:shadow-amber-500/20",
          bulletIcon: "text-amber-500"
        };
    }
  };

  const themeStyle = getThemeClasses();

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseStep("paying");
    setTimeout(() => {
      setPurchaseStep("success");
    }, 2200);
  };

  // ETAPA 5: GERAÇÃO TOTAL - MENU DETALHADO DOS DELIVERABLES
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Floating sales alert toast */}
      {toastVisible && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md shadow-2xl flex items-center gap-3 animate-fade-in-up max-w-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-[11px] font-sans font-medium text-slate-100">{toastText}</p>
        </div>
      )}

      {/* Tab Navigation header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PROPRIEDADE INTELECTUAL CONSTRUÍDA
          </span>
          <h2 className="font-display font-light text-2xl text-white">{project.name}</h2>
        </div>

        <div className="flex justify-end gap-2 text-xs font-sans">
          <button
            onClick={downloadHtmlLP}
            className="p-2 border border-white/10 bg-zinc-900/60 hover:bg-zinc-900 rounded-xl text-neutral-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>Exportar HTML</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-black p-1 rounded-xl border border-white/5 text-xs font-sans">
        {[
          { id: "sales", label: "Página de Vendas", icon: Monitor },
          { id: "vsl", label: "Roteiro VSL", icon: Video },
          { id: "funnel", label: "Funil de Vendas", icon: Layers },
          { id: "creatives", label: "Criativos Prompts", icon: Image },
          { id: "export", label: "Builders Export (Lovable)", icon: FileCode2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-zinc-900 border border-white/5 text-amber-500 shadow-sm"
                  : "text-neutral-400 hover:bg-zinc-900/40 hover:text-neutral-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE DOCUMENT INTERFACE */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* TAB 1: PÁGINA DE VENDAS COMPLETA */}
        {activeSubTab === "sales" && (
          <div className="space-y-6">
            
            {/* Control Ribbon (Toggle Raw vs Live design & color templates) */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-white/5 bg-zinc-950 gap-4 font-sans">
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-400 font-medium">Modo de Visualização:</span>
                <div className="flex bg-black p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setSalesViewMode("visual")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition ${
                      salesViewMode === "visual"
                        ? "bg-zinc-900 text-amber-500 border border-white/5"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    Simulação Visual Premium
                  </button>
                  <button
                    onClick={() => setSalesViewMode("copy")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition ${
                      salesViewMode === "copy"
                        ? "bg-zinc-900 text-amber-500 border border-white/5"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 inline mr-1" />
                    Cópia Estruturada
                  </button>
                </div>
              </div>

              {salesViewMode === "visual" && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 font-medium">Modelo Comercial / Tema:</span>
                  <div className="flex gap-2">
                    {[
                      { id: "cosmic", label: "Cosmic Gold", color: "bg-amber-500" },
                      { id: "emerald", label: "Cyber Emerald", color: "bg-emerald-500" },
                      { id: "midnight", label: "Royal Amethyst", color: "bg-purple-600" },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setPreviewTheme(theme.id as any)}
                        className={`px-2.5 py-1 text-[11px] rounded-lg border font-semibold flex items-center gap-1.5 transition ${
                          previewTheme === theme.id
                            ? "border-amber-500/40 bg-zinc-900 text-white"
                            : "border-white/5 bg-black text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${theme.color}`}></span>
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* LIVE PREVIEW CONTAINER */}
            {salesViewMode === "visual" ? (
              <div className={`p-1 md:p-8 rounded-3xl border ${themeStyle.wrapper} shadow-2xl relative overflow-hidden transition-all duration-300`}>
                
                {/* Simulated Scarcity Topbar Sticky Bar */}
                <div className="bg-red-500/15 border-b border-red-500/25 p-3 text-center text-xs font-sans font-semibold text-red-200 -mx-1 -mt-1 md:-mx-8 md:-mt-8 flex flex-col md:flex-row items-center justify-center gap-2">
                  <span className="flex items-center gap-1.5 text-red-400">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    ATENÇÃO: OFERTA EXPIRA RE-BREVE!
                  </span>
                  <span>O Diretor IA liberou bônus garantidos para o próximo faturamento por apenas:</span>
                  <span className="font-mono bg-red-500/30 text-white font-black px-2 py-0.5 rounded tracking-wider animate-pulse">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Subheader / Launcher branding */}
                <div className="pt-12 text-center max-w-4xl mx-auto px-4 space-y-4">
                  <span className={`text-[10px] uppercase tracking-widest font-mono font-extrabold px-3.5 py-1.5 rounded-full border ${themeStyle.tagBg}`}>
                    ★ Oferta Blindada Reconstruída da Mesa de 12 Especialistas
                  </span>
                  
                  {/* Dynamic Gradient Landing Page Headline */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-tight pt-2">
                    <span className={`bg-gradient-to-r ${themeStyle.highlightGradient} bg-clip-text text-transparent`}>
                      {assets.salesPage?.headline}
                    </span>
                  </h1>
                  
                  {/* Powerful Subheadline */}
                  <p className="text-sm md:text-base text-neutral-300 font-sans max-w-3xl mx-auto leading-relaxed font-light">
                    {assets.salesPage?.subheadline}
                  </p>
                </div>

                {/* INTERACTIVE MOCK VSL SECTION */}
                <div className="mt-12 max-w-4xl mx-auto px-4">
                  <div className="relative group rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl shadow-black/80 aspect-video">
                    
                    {!isVslPlaying ? (
                      // Mock play screen
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-black via-zinc-950/80 to-transparent">
                        <button 
                          onClick={() => setIsVslPlaying(true)}
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${themeStyle.primaryBg} shadow-2xl font-black transform hover:scale-110 transition cursor-pointer`}
                        >
                          <Play className="w-8 h-8 fill-current ml-1" />
                        </button>
                        <div className="mt-6 space-y-2">
                          <span className="text-[10px] font-mono tracking-wider font-extrabold text-amber-500 uppercase block animate-pulse">ASSISTA AGORA O VÍDEO COMPACTO</span>
                          <h4 className="text-sm font-semibold text-neutral-200">Como funciona o mecanismo secreto revelado pela Mesa Estratégica</h4>
                          <p className="text-xs text-neutral-450 font-mono">Duração: 6:40 • Vídeo com Alta Retenção Comercial</p>
                        </div>
                      </div>
                    ) : (
                      // Dynamic interactive subtitled screen
                      <div className="absolute inset-0 bg-neutral-950 flex flex-col justify-between p-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                            REPRODUZINDO VSL SIMULATOR
                          </span>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setVslVolume(!vslVolume)} className="text-neutral-400 hover:text-white">
                              {vslVolume ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
                            </button>
                            <button onClick={() => setIsVslPlaying(false)} className="text-neutral-400 hover:text-white text-xs font-mono">
                              Reiniciar <RotateCcw className="w-3 h-3 inline ml-1" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive rolling captions of the generated VSL script */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-8 space-y-4">
                          <div className="relative">
                            {/* Waveform indicator */}
                            <div className="flex justify-center items-end gap-1 mb-8 h-12">
                              {[3, 8, 5, 10, 4, 7, 2, 6, 9, 3, 5, 8, 4].map((h, i) => (
                                <span 
                                  key={i} 
                                  style={{ height: `${h * 4}px` }} 
                                  className={`w-1 rounded-full ${themeStyle.primaryText} animate-pulse`} 
                                />
                              ))}
                            </div>
                            <span className="text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase block mb-1">VOZ DO LOCUTOR PRO / AUDIOPLAY</span>
                            <p className="text-xs md:text-sm text-neutral-100 leading-relaxed italic max-w-2xl font-sans font-medium">
                              &quot;{assets.vslScript?.gancho}&quot;
                            </p>
                            <p className="text-[11px] text-neutral-400 mt-2 font-light">
                              {assets.vslScript?.historiaEmocional.substring(0, 160)}...
                            </p>
                          </div>
                        </div>

                        <div className="bg-zinc-900 border border-white/5 p-2 rounded-xl text-center text-[10px] text-neutral-400 leading-tight">
                          💡 O Diretor de Marketing IA organizou o VSL para durar exatamente o tempo de fechamento do lead.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PROBLEM vs SOLUTION SECTION */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 font-sans">
                  
                  {/* Styled Problem Segment */}
                  <div className="p-6 md:p-8 rounded-2xl border border-red-500/10 bg-gradient-to-br from-red-950/10 to-red-950/5 hover:border-red-500/20 transition group">
                    <span className="text-[9px] font-mono font-black text-red-500 border border-red-500/20 bg-red-500/10 px-2.5 py-1 rounded">
                      ESTÁGIO 1: A DOR RECORRENTE
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                      {assets.salesPage?.problemSection?.title}
                    </h3>
                    <p className="text-[12px] md:text-xs text-neutral-400 mt-3 leading-relaxed">
                      {assets.salesPage?.problemSection?.description}
                    </p>
                  </div>

                  {/* Styled Solution Segment */}
                  <div className={`p-6 md:p-8 rounded-2xl border ${themeStyle.primaryBorder} bg-gradient-to-br from-neutral-900 to-black hover:border-white/10 transition group`}>
                    <span className={`text-[9px] font-mono font-black border px-2.5 py-1 rounded ${themeStyle.tagBg}`}>
                      ESTÁGIO 2: O MECANISMO ÚNICO
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-4 flex items-center gap-2">
                      <Sparkles className={`w-5 h-5 ${themeStyle.primaryText} shrink-0`} />
                      {assets.salesPage?.solutionSection?.title}
                    </h3>
                    <p className="text-[12px] md:text-xs text-neutral-300 mt-3 leading-relaxed">
                      {assets.salesPage?.solutionSection?.description}
                    </p>
                  </div>

                </div>

                {/* PERSUASIVE CONVERSION HERO CAPTURE PANEL */}
                <div className="mt-16 p-8 rounded-2xl bg-black/40 border border-white/5 max-w-4xl mx-auto px-4 text-center space-y-3 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-2xl opacity-20 -mr-12 -mt-12 ${previewTheme === 'emerald' ? 'bg-emerald-500' : previewTheme === 'midnight' ? 'bg-purple-500' : 'bg-amber-500'}`}></div>
                  <span className="text-[10px] font-mono text-neutral-500 font-bold block uppercase tracking-wider">HERO SECTION ACT</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">{assets.salesPage?.heroSection?.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                    {assets.salesPage?.heroSection?.text}
                  </p>
                  <div className="pt-2">
                    <a 
                      href="#pricing"
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition shadow ${themeStyle.primaryBg} hover:scale-102 ${themeStyle.buttonHover}`}
                    >
                      <span>{assets.salesPage?.heroSection?.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* BENTO GRID OF SCIENTIFIC BENEFITS */}
                <div className="mt-16 max-w-4xl mx-auto px-4 space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest block">MATRIZ DE EXTRAORDINÁRIAS VANTAGENS</span>
                    <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">Menos Fricção, Mais Escalabilidade</h3>
                    <p className="text-xs text-neutral-400 font-sans max-w-md mx-auto">O enquadramento correto foca em economizar esforço extremo e remover qualquer espécie de sacrifício.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {assets.salesPage?.benefits?.map((benefit, idx) => (
                      <div 
                        key={idx} 
                        className="p-5 rounded-xl bg-black/50 border border-white/5 hover:border-white/15 transition duration-200 hover:-translate-y-0.5"
                      >
                        <span className={`text-xs font-sans font-black flex items-center justify-center w-6 h-6 rounded ${themeStyle.tagBg}`}>
                          0{idx+1}
                        </span>
                        <h4 className="font-bold text-slate-100 text-xs mt-4 tracking-tight">{benefit.title}</h4>
                        <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ICP / WHO IS IT FOR SECTIONS */}
                <div className="mt-16 max-w-4xl mx-auto px-4 p-8 rounded-2xl bg-black border border-white/5">
                  <div className="text-center space-y-2 mb-8">
                    <span className="text-xs font-mono text-neutral-500 font-bold block uppercase">AO ENCONTRO DO ICP</span>
                    <h3 className="text-lg font-bold text-white">Essa Solução Foi Desenhada Sob Medida Para:</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 hover:border-zinc-800 transition">
                      <span className="font-semibold text-white block mb-1">💼 Modelos de Negócio Diretos</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">Empreendedores e marcas que vendem produtos no nicho de <span className="text-amber-500 inline">{project.briefing?.productNiche}</span> com uma oferta ativa.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 hover:border-zinc-800 transition">
                      <span className="font-semibold text-white block mb-1">🎯 Público-Alvo Selecionado ({project.briefing?.targetAudience})</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">Pessoas da faixa etária de {project.briefing?.targetAge} que buscam acelerar os seus resultados sem perder tempo com processos manuais.</p>
                    </div>
                  </div>
                </div>

                {/* GLOWING TESTIMONIALS (REALISTIC INSTANT SOCIAL PROOF) */}
                <div className="mt-16 max-w-4xl mx-auto px-4 space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest block">PROVAS SOCIAIS INTACTAS</span>
                    <h3 className="text-xl font-bold font-display text-white tracking-tight">Depoimentos de Resultados de Peso</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs">
                    {/* Testimonial 1 */}
                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black select-none text-[11px]">WS</div>
                        <div>
                          <h4 className="font-bold text-slate-100 flex items-center gap-1">
                            Wellington Souza 
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 rounded border border-emerald-500/20">✓</span>
                          </h4>
                          <p className="text-[10px] text-neutral-500">Agência Souza & Co.</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array(5).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                      <p className="text-[11px] text-neutral-350 leading-relaxed">
                        &quot;Confesso que no começo achei que seria apenas mais uma automação de texto. Mas quando rodamos o mecanismo único e aplicamos na landing page de estoque do restaurante do meu cliente, o faturamento disparou. Sensacional!&quot;
                      </p>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white select-none text-[11px]">RM</div>
                        <div>
                          <h4 className="font-bold text-slate-100 flex items-center gap-1">
                            Robson Mendes
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 rounded border border-emerald-500/20">✓</span>
                          </h4>
                          <p className="text-[10px] text-neutral-500">Diretor de Ops</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array(5).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                      <p className="text-[11px] text-neutral-350 leading-relaxed font-sans">
                        &quot;O Blueprint de 12 passos incluído na copy do checkout é bizarro! Foi exatamente o que usei na minha publicidade e converteu 3x mais rápido sem objeções complexas. Mudou o patamar da nossa empresa.&quot;
                      </p>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black select-none text-[11px]">AF</div>
                        <div>
                          <h4 className="font-bold text-slate-100 flex items-center gap-1">
                            Aline Faria
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 rounded border border-emerald-500/20">✓</span>
                          </h4>
                          <p className="text-[10px] text-neutral-500">Sócia Marketing</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array(5).fill(0).map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                      </div>
                      <p className="text-[11px] text-neutral-350 leading-relaxed font-sans">
                        &quot;Recomendo de olhos fechados. O nível de sofisticação dos bônus e o detalhamento do público ideal nos salvou de queimar orçamento em tráfego de forma irresponsável.&quot;
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center text-xs text-neutral-400 leading-relaxed max-w-2xl mx-auto font-sans font-light">
                    🎯 <strong className="text-white">Opinião do Diretor Comercial IA:</strong> {assets.salesPage?.socialProofIdea}
                  </div>
                </div>

                {/* THE ULTIMATE BONUS CONTAINER */}
                <div className="mt-16 max-w-4xl mx-auto px-4 space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest block">MESA DE ACELERADORES</span>
                    <h3 className="text-xl font-bold font-display text-white">Bônus Exclusivos Para Ação Rápida</h3>
                    <p className="text-xs text-neutral-400">Garantidos apenas se adquirir antes que o cronograma encerre nesta sessão.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                    {assets.salesPage?.bonusesList?.map((bonus, idx) => (
                      <div 
                        key={idx} 
                        className="p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-zinc-900/80 to-zinc-950 flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <span className={`text-[9px] font-mono font-black border px-2.5 py-0.5 rounded ${themeStyle.tagBg}`}>
                            BÔNUS #0{idx+1} COMPLETO
                          </span>
                          <h4 className="font-bold text-white text-sm tracking-tight mt-3">{bonus.title}</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed">
                            {bonus.description}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                          <span className="text-neutral-500 text-[10px]">Percepção de Valor Estimada:</span>
                          <span className="font-mono font-bold text-emerald-400 bg-emerald-400/5 px-2.5 py-1 rounded-lg border border-emerald-400/10">
                            VALE {bonus.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DOUBLE ACTION GUARANTEE SHIELD */}
                <div className="mt-16 max-w-4xl mx-auto px-4">
                  <div className={`p-6 md:p-8 rounded-3xl border ${themeStyle.badgeBorder} bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-center space-y-4 shadow-xl`}>
                    <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
                      <ShieldCheck className="w-6 h-6 shrink-0" />
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold text-amber-500 uppercase block">CUMPLICIDADE INCONDICIONAL DUPLA</span>
                      <h4 className="text-xl font-bold text-white font-display">{assets.salesPage?.guaranteeSection?.days} Dias de Garantia Protegida</h4>
                      <p className="text-xs text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                        {assets.salesPage?.guaranteeSection?.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE FAQ ACCORDIONS */}
                <div className="mt-16 max-w-4xl mx-auto px-4 space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase block">PERGUNTAS FREQUENTES</span>
                    <h3 className="text-xl font-bold font-display text-white">Limpando Objeções de Encerramento</h3>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-zinc-950 p-4 font-sans space-y-2">
                    {assets.salesPage?.faq?.map((item, idx) => {
                      const isOpen = !!faqOpenState[idx];
                      return (
                        <div key={idx} className="border-b border-white/5 last:border-none pb-2 last:pb-0">
                          <button
                            onClick={() => setFaqOpenState((prev) => ({ ...prev, [idx]: !isOpen }))}
                            className="w-full flex items-center justify-between text-left text-neutral-200 font-bold py-2 hover:text-amber-400 transition cursor-pointer text-xs"
                          >
                            <span>{item.question}</span>
                            <ChevronDown className={`w-4 h-4 text-neutral-500 transform transition ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <p className="text-neutral-400 text-xs leading-relaxed pt-2 pl-2">
                              {item.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* THE LUXURY SECURE PRICING TABLE & CHECKOUT SESSIONS */}
                <div id="pricing" className="mt-16 max-w-xl mx-auto px-4 font-sans">
                  <div className={`p-8 rounded-3xl border-2 ${themeStyle.glowBorder} bg-zinc-900/90 text-center space-y-6 relative overflow-hidden shadow-2xl`}>
                    
                    <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold tracking-widest uppercase border border-emerald-500/25 px-2.5 py-1 rounded">
                      SESSÃO SECURED 100%
                    </span>

                    <div className="space-y-2">
                      <span className="text-[10px] tracking-wider uppercase font-mono text-neutral-500 font-bold block">FECHAMENTO DA OFERTA ESTRELA</span>
                      <h3 className="text-2xl font-black text-white font-display leading-tight">
                        {assets.salesPage?.ctaSection?.title}
                      </h3>
                    </div>

                    <div className="py-4 border-y border-white/5 space-y-2">
                      <span className="text-neutral-500 text-xs block line-through">De R$ 1.250,00 por apenas</span>
                      <span className="text-amber-400 text-3xl md:text-5xl font-mono font-black tracking-tight block">
                        {assets.salesPage?.ctaSection?.priceLabel}
                      </span>
                      <p className="text-[10px] text-neutral-400">
                        *Incluso bônus exclusivos, atualizações de algoritmo e reembolso garantido de {assets.salesPage?.guaranteeSection?.days} dias.
                      </p>
                    </div>

                    <div className="space-y-2.5 text-left text-xs bg-black/40 p-4 rounded-xl border border-white/5">
                      <span className="font-bold text-neutral-400 block mb-1 font-mono uppercase text-[9px]">O que está em jogo:</span>
                      <div className="space-y-1.5 text-neutral-300">
                        <p className="flex items-start gap-1.5 leading-tight">
                          <Check className={`w-3.5 h-3.5 ${themeStyle.bulletIcon} shrink-0`} /> 
                          <span>Estratégia Direct Response Integral</span>
                        </p>
                        <p className="flex items-start gap-1.5 leading-tight">
                          <Check className={`w-3.5 h-3.5 ${themeStyle.bulletIcon} shrink-0`} /> 
                          <span>Matriz de 12 etapas do Fiscaly implementada</span>
                        </p>
                        <p className="flex items-start gap-1.5 leading-tight">
                          <Check className={`w-3.5 h-3.5 ${themeStyle.bulletIcon} shrink-0`} /> 
                          <span>Scripts e prompts de geração de mídia de elite</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => {
                          setBuyerName(user?.name || "Wellington Souza");
                          setBuyerEmail(user?.email || "souza@marketing.com");
                          setPurchaseStep("form");
                          setShowCheckoutModal(true);
                        }}
                        className={`w-full font-black py-4.5 rounded-2xl transition-all shadow-lg tracking-wide ${themeStyle.primaryBg} ${themeStyle.buttonHover} transform hover:-translate-y-0.5 cursor-pointer text-xs uppercase`}
                      >
                        {assets.salesPage?.ctaSection?.buttonText}
                      </button>
                      <span className="text-[9px] text-neutral-500 font-mono block mt-3 flex items-center justify-center gap-1.5">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        CHECKOUT SEGURO INTEGRADO COM KIWIFY / HOTMART
                      </span>
                    </div>

                  </div>
                </div>

                {/* Symmetrical Landing Page Footer */}
                <div className="mt-16 border-t border-white/5 pt-8 text-center text-[10px] font-sans text-neutral-500 space-y-3 pb-8">
                  <div className="flex justify-center gap-4 text-neutral-400 font-semibold font-mono uppercase">
                    <span className="hover:text-white cursor-pointer">Termos de Uso</span>
                    <span>•</span>
                    <span className="hover:text-white cursor-pointer">Privacidade Protegida</span>
                    <span>•</span>
                    <span className="hover:text-white cursor-pointer text-amber-500">Workspace Sincronizado</span>
                  </div>
                  <p className="leading-relaxed max-w-xl mx-auto px-4 font-light">
                    Esta página de vendas foi sintetizada via mecanismos neurais avançados. Todo faturamento comercial ou lucros são variáveis de mercado baseadas no ICP selecionado. DMCA Protected.
                  </p>
                </div>

              </div>
            ) : (
              // RAW TEXT MODE COPY
              <div className="p-6 rounded-2xl border border-white/5 bg-zinc-950/45 backdrop-blur-md space-y-8 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black/40 p-4 rounded-xl border border-white/5 gap-2">
                  <span className="text-xs text-neutral-400 font-mono">Página totalmente otimizada prontas para Hotmart, Kiwify ou Shopify.</span>
                  <button
                    onClick={() => triggerCopyNotification("salesCopy", JSON.stringify(assets.salesPage, null, 2))}
                    className="text-xs text-amber-500 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedStates["salesCopy"] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Objeto JSON</span>
                  </button>
                </div>

                {/* Headline Section */}
                <div className="space-y-2 border-l-2 border-amber-500 pl-4 py-1">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block tracking-wider">HEADLINE PRINCIPAL</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight font-display">{assets.salesPage?.headline}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{assets.salesPage?.subheadline}</p>
                </div>

                {/* Hero Section */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">HERO SECTION COPY</span>
                  <h4 className="text-base font-semibold text-white">{assets.salesPage?.heroSection?.title}</h4>
                  <p className="text-xs text-neutral-350 leading-relaxed">{assets.salesPage?.heroSection?.text}</p>
                  <span className="inline-block mt-2 bg-zinc-900/60 border border-white/5 text-[11px] font-mono px-3 py-1 text-amber-400 rounded-lg">
                    Botão CTA: {assets.salesPage?.heroSection?.ctaText}
                  </span>
                </div>

                {/* Problem Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-red-400 uppercase block">SEÇÃO DE PROBLEMA</span>
                    <h4 className="text-sm font-semibold text-neutral-200">{assets.salesPage?.problemSection?.title}</h4>
                    <p className="text-xs text-neutral-350 leading-relaxed">{assets.salesPage?.problemSection?.description}</p>
                  </div>

                  {/* Solution Section */}
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">SEÇÃO DE SOLUÇÃO</span>
                    <h4 className="text-sm font-semibold text-neutral-200">{assets.salesPage?.solutionSection?.title}</h4>
                    <p className="text-xs text-neutral-350 leading-relaxed">{assets.salesPage?.solutionSection?.description}</p>
                  </div>
                </div>

                {/* Benefits Bento */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">BENEFÍCIOS PRINCIPAIS</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {assets.salesPage?.benefits?.map((benefit, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5 hover:border-white/10 transition duration-200">
                        <span className="text-xs font-mono text-amber-500">0{idx+1}.</span>
                        <h5 className="font-semibold text-white text-xs">{benefit.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authority Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="md:col-span-2 p-5 rounded-xl border border-white/5 bg-black/40 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">BIO DA AUTORIDADE</span>
                    <h4 className="text-sm font-semibold text-neutral-200">{assets.salesPage?.authoritySection?.title}</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">{assets.salesPage?.authoritySection?.bio}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-white/5 bg-black/40 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">PROVAS SOCIAIS INSTRUÇÕES</span>
                    <p className="text-xs text-neutral-400 leading-relaxed">{assets.salesPage?.socialProofIdea}</p>
                  </div>
                </div>

                {/* Bonus Section */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">BÔNUS EXCLUSIVOS</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assets.salesPage?.bonusesList?.map((bonus, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-zinc-900 border border-white/5 text-amber-400 px-2.5 py-0.5 rounded-lg font-mono">BÔNUS 0{idx+1}</span>
                          <h5 className="font-semibold text-white text-xs mt-1.5">{bonus.title}</h5>
                          <p className="text-[11px] text-neutral-400 leading-relaxed">{bonus.description}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0">
                          VFR: {bonus.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guarantee / Objection Accordions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-500/5 space-y-2 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">GARANTIA INCONDICIONAL</span>
                    <h4 className="text-2xl font-bold text-white font-display">{assets.salesPage?.guaranteeSection?.days} Dias de Segurança</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed px-4">{assets.salesPage?.guaranteeSection?.text}</p>
                  </div>

                  {/* Objeções Frequentes */}
                  <div className="p-5 rounded-xl border border-white/5 bg-black/40 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">QUEBRA DE OBJEÇÃO FUNDAMENTAL DE CHECKOUT</span>
                    <div className="space-y-3 pt-1">
                      {assets.salesPage?.objectionHandling?.map((obj, idx) => (
                        <div key={idx} className="space-y-1 text-xs text-neutral-350 leading-relaxed">
                          <span className="font-semibold text-white block">✦ {obj.question}</span>
                          <p className="text-[11px] text-neutral-400 pl-4">{obj.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQ Accordion */}
                <div className="p-5 rounded-xl border border-white/5 bg-black/40 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">PERGUNTAS FREQUENTES (FAQ)</span>
                  
                  <div className="space-y-2 text-xs">
                    {assets.salesPage?.faq?.map((item, idx) => {
                      const isOpen = !!faqOpenState[idx];
                      return (
                        <div key={idx} className="border-b border-white/5 pb-2">
                          <button
                            onClick={() => setFaqOpenState((prev) => ({ ...prev, [idx]: !isOpen }))}
                            className="w-full flex items-center justify-between text-left text-neutral-200 font-semibold py-1 hover:text-amber-400 transition cursor-pointer"
                          >
                            <span>{item.question}</span>
                            <ChevronDown className={`w-4 h-4 text-neutral-500 transform transition ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <p className="text-neutral-400 text-[11px] leading-relaxed pt-1.5 pl-2 fn-sans">
                              {item.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final Offer Section */}
                <div className="p-6 rounded-3xl border border-amber-500/20 bg-zinc-950 text-center space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold block">FECHAMENTO DA OFERTA</span>
                  <h3 className="text-2xl font-bold text-white font-display">{assets.salesPage?.ctaSection?.title}</h3>
                  <p className="text-amber-400 text-3xl font-mono font-black">{assets.salesPage?.ctaSection?.priceLabel}</p>
                  <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 font-bold text-black px-8 py-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer">
                    {assets.salesPage?.ctaSection?.buttonText}
                  </button>
                </div>
              </div>
            )}

            {/* CHECKOUT SIMULATION MODAL */}
            {showCheckoutModal && (
              <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-6 relative overflow-hidden shadow-2xl">
                  
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>

                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-amber-400 uppercase font-black bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                        KIWIFY SECURE GATEWAY
                      </span>
                      <h4 className="text-sm font-bold text-white font-sans">Simulador de Faturamento</h4>
                    </div>
                    <button 
                      onClick={() => setShowCheckoutModal(false)}
                      className="text-xs text-neutral-500 hover:text-white font-mono bg-black/40 border border-white/5 w-6 h-6 flex items-center justify-center rounded-xl"
                    >
                      X
                    </button>
                  </div>

                  {purchaseStep === "form" && (
                    <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs font-sans">
                      <div className="p-4 bg-black/45 border border-white/5 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Produto</span>
                          <span className="font-bold text-white text-xs">{project.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-500 block">Valor Final</span>
                          <span className="font-mono font-black text-amber-400 text-xs">{assets.salesPage?.ctaSection?.priceLabel}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-neutral-400 block mb-1">Seu Nome Completo</label>
                          <input 
                            type="text" 
                            required 
                            className="w-full bg-black border border-white/5 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500/30 text-xs"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-neutral-400 block mb-1">Endereço de E-mail para Recebimento</label>
                          <input 
                            type="email" 
                            required 
                            className="w-full bg-black border border-white/5 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500/30 text-xs font-mono"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-neutral-400 block mb-1">WhatsApp de Contato</label>
                            <input 
                              type="tel" 
                              placeholder="(11) 99999-9999"
                              className="w-full bg-black border border-white/5 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500/30 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-neutral-400 block mb-1">Método Preferencial</label>
                            <select className="w-full bg-black border border-white/5 rounded-xl px-3 py-2 text-slate-150 text-xs select-none">
                              <option>PIX (Instantâneo Liberação)</option>
                              <option>Cartão de Crédito 12x</option>
                              <option>Boleto Bancário</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                        <button
                          type="submit"
                          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-3 rounded-2xl transition text-xs uppercase"
                        >
                          Concluir Simulação de Compra
                        </button>
                        <p className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          Ambiente de teste criptografado. Nenhuma cobrança real será feita.
                        </p>
                      </div>
                    </form>
                  )}

                  {purchaseStep === "paying" && (
                    <div className="py-12 text-center space-y-4 font-sans">
                      <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
                      <h4 className="text-xs font-bold text-white uppercase">Sincronizando com Kiwify e Lovable...</h4>
                      <p className="text-[11px] text-neutral-400">Verificando pagador e liberando arquivos de propriedade intelectual no seu workspace em segundos.</p>
                    </div>
                  )}

                  {purchaseStep === "success" && (
                    <div className="py-8 text-center space-y-5 font-sans">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto text-2xl">
                        ✓
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-white uppercase">Inscrição Efetuada com Sucesso!</h4>
                        <p className="text-xs text-neutral-350 px-6">
                          Excelente escolha, <strong className="text-white">{buyerName}</strong>! Os materiais da oferta para o produto <strong className="text-amber-500">{project.briefing?.productName}</strong> foram processados e autorizados.
                        </p>
                      </div>
                      
                      {user?.lovableWorkspace ? (
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 max-w-sm mx-auto leading-relaxed">
                          Sincronizado! O código de landing page direct response foi enviado para o seu workspace Lovable em: 
                          <span className="block mt-1 font-mono text-[9px] underline text-white break-all">{user.lovableWorkspace}</span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-neutral-400 max-w-xs mx-auto">
                          💡 Quer sincronizar o código desta página em 1 clique direto no seu editor visual Lovable? Configure seu feed nas Configurações da Conta!
                        </div>
                      )}

                      <button
                        onClick={() => setShowCheckoutModal(false)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition border border-white/5"
                      >
                        Retornar ao Dashboard
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ROTEIRO VSL COMPLETO */}
        {activeSubTab === "vsl" && (
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-950/45 backdrop-blur-md space-y-5 font-sans">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-3 gap-2">
              <span className="text-xs text-neutral-400 font-mono">Estrutura de Vídeo de Vendas (VSL). Copie os blocos do Locutor.</span>
              <button
                onClick={() => triggerCopyNotification("vslScript", Object.entries(assets.vslScript).map(([k, v]) => `[${k.toUpperCase()}]: ${v}`).join('\n\n'))}
                className="text-xs text-amber-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copiedStates["vslScript"] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Script Inteiro</span>
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs text-neutral-300">
              {[
                { label: "GANCHO DO VÍDEO (Primeiros 30s de Retenção)", value: assets.vslScript?.gancho, color: "border-red-500" },
                { label: "NARRATIVA E JORNADA DO HERÓI (Storytelling)", value: assets.vslScript?.historiaEmocional, color: "border-orange-550 border-orange-500" },
                { label: "REVELAÇÃO DO MECANISMO ÚNICO DE SOLUÇÃO", value: assets.vslScript?.revelacaoMecanismo, color: "border-amber-500" },
                { label: "APRESENTAÇÃO EXCLUSIVA DO SEU PRODUTO", value: assets.vslScript?.apresentacaoProduto, color: "border-emerald-500" },
                { label: "QUEBRA DE OBJEÇÕES DE COMPRA", value: assets.vslScript?.quebraObjecoes, color: "border-blue-500" },
                { label: "FECHAMENTO COMPACTO & CHAMADA PARA AÇÃO (CTA)", value: assets.vslScript?.ctaChamadaAction, color: "border-pink-500" }
              ].map((vslBlock, i) => (
                <div key={i} className={`p-4 rounded-xl border border-white/5 bg-black/45 space-y-1.5 border-l-4 ${vslBlock.color} leading-relaxed`}>
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">{vslBlock.label}</span>
                  <p className="leading-relaxed whitespace-pre-wrap">{vslBlock.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FUNIL DE VENDAS COMPLETO */}
        {activeSubTab === "funnel" && (
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-950/45 backdrop-blur-md space-y-6 font-sans">
            <span className="text-xs text-neutral-400 font-mono block">Fluxos de Ativos, Páginas de Upgrade, e Sequências de Recuperação de Checkout.</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-neutral-300">
              <div className="p-4 rounded-xl border border-white/5 bg-black/45 space-y-3">
                <span className="text-[10px] font-mono text-amber-500 font-bold block uppercase">LEAD MAGNET (ÍMÃ DE ENTRADA)</span>
                <div>
                  <h4 className="font-semibold text-white">{assets.funnelStructure?.leadMagnet?.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{assets.funnelStructure?.leadMagnet?.description}</p>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="font-mono text-[9px] text-neutral-500">HEADLINE DE CAPTURA:</span>
                  <p className="font-medium text-neutral-300 italic mt-0.5">&quot;{assets.funnelStructure?.optinPage?.headline}&quot;</p>
                  <span className="text-[9px] bg-zinc-900 text-amber-400 px-1.5 py-0.5 rounded border border-white/5 mt-1.5 inline-block">Botão: {assets.funnelStructure?.optinPage?.cta}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-white/5 bg-black/45">
                  <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase">PÁGINA DE UPSELL SESSÃO</span>
                  <h4 className="font-semibold text-white mt-1.5">{assets.funnelStructure?.upsellPage?.name}: {assets.funnelStructure?.upsellPage?.headline}</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{assets.funnelStructure?.upsellPage?.copyBrief}</p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/45">
                  <span className="text-[10px] font-mono text-pink-400 font-bold block uppercase">PÁGINA DE DOWNSELL SESSÃO</span>
                  <h4 className="font-semibold text-white mt-1.5">{assets.funnelStructure?.downsellPage?.name}: {assets.funnelStructure?.downsellPage?.headline}</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{assets.funnelStructure?.downsellPage?.copyBrief}</p>
                </div>
              </div>
            </div>

            {/* Email Autoresponders Sequence */}
            <div className="p-5 rounded-xl border border-white/5 bg-black/45 space-y-4">
              <span className="text-[10px] font-mono text-neutral-500 font-bold block uppercase">SEQUÊNCIA DE E-MAILS DE REMARKETING (RECUPERAÇÃO ATIVA)</span>

              <div className="space-y-3.5 text-xs">
                {assets.funnelStructure?.remarketingEmails?.map((email, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-white/5 bg-zinc-900/10 space-y-2">
                    <div className="flex gap-2 font-mono text-[11px] items-center">
                      <span className="text-amber-550 text-amber-500 font-bold shrink-0">E-MAIL #0{i+1} ASSUNTO:</span>
                      <span className="text-white font-medium">{email.subject}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 text-neutral-300 text-[11px] leading-relaxed whitespace-pre-wrap font-mono select-all p-2.5 bg-black rounded-lg">
                      {email.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AD CREATIVES PROMPTS */}
        {activeSubTab === "creatives" && (
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-950/45 backdrop-blur-md space-y-6 font-sans">
            <span className="text-xs text-neutral-400 font-mono block">Diretrizes de geração visual para mídias pagos Midjourney, Flux, ChatGPT e Gemini. NOTA: O sistema não gera arquivos de imagem reais — ele planeja a estrutura, texto e de prompts refinados de alto contraste.</span>

            <div className="space-y-6">
              {assets.creativesPrompts?.map((creative, index) => (
                <div key={index} className="p-5 rounded-2xl border border-white/5 bg-black/40 space-y-4">
                  <div className="border-b border-white/5 pb-2.5">
                    <h4 className="text-sm font-bold text-neutral-200">{creative.title}</h4>
                    <span className="text-[10px] font-mono text-amber-500">Objetivo: {creative.goal}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 font-bold block uppercase">TEXTO SUGERIDO (GRAVAÇÃO/COPY ANÚNCIO)</span>
                      <p className="p-3.5 rounded-xl bg-black/50 text-neutral-305 leading-relaxed font-mono italic">
                        &quot;{creative.suggestedText}&quot;
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 font-bold block uppercase">COMPOSIÇÃO VISUAL (TEXT-TO-IMAGE GUIDE)</span>
                      <p className="p-3.5 rounded-xl bg-black/50 text-neutral-300 leading-relaxed text-[11px]">
                        {creative.imageDescription}
                      </p>
                    </div>
                  </div>

                  {/* Specific Engine Prompts */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <span className="text-[10px] font-mono text-neutral-500 font-bold block uppercase">PROMPTS EXCLUSIVOS COPIAR/COLAR EM OUTRAS IAS:</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono">
                      {[
                        { label: "Prompt ChatGPT", key: "chatGpt", val: creative.prompts?.chatGpt },
                        { label: "Prompt Flux Engine", key: "flux", val: creative.prompts?.flux },
                        { label: "Prompt Midjourney v6", key: "midjourney", val: creative.prompts?.midjourney },
                        { label: "Prompt Gemini Advanced", key: "gemini", val: creative.prompts?.gemini }
                      ].map((item, id) => (
                        <div key={id} className="p-2.5 bg-black border border-white/5 rounded-xl relative group">
                          <div className="flex justify-between items-center text-neutral-500 mb-1 font-bold">
                            <span>{item.label}</span>
                            <button
                              onClick={() => triggerCopyNotification(item.key + index, item.val)}
                              className="text-amber-500 hover:text-amber-400 font-semibold cursor-pointer"
                            >
                              {copiedStates[item.key + index] ? "Copiado!" : "Copiar"}
                            </button>
                          </div>
                          <p className="text-neutral-300 leading-relaxed truncate group-hover:whitespace-normal select-all font-mono">
                            {item.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BUILDER EXPORT */}
        {activeSubTab === "export" && (
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-950/45 backdrop-blur-md space-y-6 font-sans">
            <div className="space-y-1">
              <h3 className="font-display font-medium text-lg text-white">Exportadores e Prompt-Builder da Lovable</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Utilize o formato ideal para colocar essa estrutura em instantes para renderizar aplicativos ou landing pages visualmente!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-amber-500/10 bg-black/45 space-y-3 text-center flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-500 uppercase font-bold">RECOMENDADO</span>
                  <h4 className="text-xs font-bold text-neutral-200">Lovable Prompt Sincronizado</h4>
                  <p className="text-[11px] text-neutral-450 leading-relaxed">Gera a diretriz ideal de múltiplos blocos para colar no comando Lovable.</p>
                </div>
                <button
                  onClick={() => triggerCopyNotification("lovablePrompt", `Crie uma Landing Page Premium de Marketing usando Tailwind no estilo bento-grid moderna com fundo escuro. Use a seguinte copy estruturada e ancorada:

Headline de Conversão Extrema:
"${assets.salesPage?.headline}"
Subheadline Auxiliar:
"${assets.salesPage?.subheadline}"

CTA da Seção Principal (Hero Text):
"${assets.salesPage?.heroSection?.title}"
"${assets.salesPage?.heroSection?.text}"
Texto no Botão CTA: "${assets.salesPage?.heroSection?.ctaText}"

Adicione Seção de Dor (Problema):
"${assets.salesPage?.problemSection?.title}"
"${assets.salesPage?.problemSection?.description}"

Seção de Mecanismo de Solução de Alta Conversão:
"${assets.salesPage?.solutionSection?.title}"
"${assets.salesPage?.solutionSection?.description}"

Benefícios Bento (Inclua 3 cartões fluidos):
${assets.salesPage?.benefits?.map((b, i) => `${i+1}. ${b.title}: ${b.description}`).join('\n')}

Módulo de Bônus:
${assets.salesPage?.bonusesList?.map((b, i) => `Bônus ${i+1}: ${b.title} (${b.value}) - ${b.description}`).join('\n')}

Polida Seção de Garantia de Satisfação Estendida de ${assets.salesPage?.guaranteeSection?.days} Dias com o seguinte texto:
"${assets.salesPage?.guaranteeSection?.text}"

Adicione abaixo seção de CTA de Checkout Único:
"${assets.salesPage?.ctaSection?.title}"
Preço: "${assets.salesPage?.ctaSection?.priceLabel}"
Texto do Botão: "${assets.salesPage?.ctaSection?.buttonText}"`)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-[11px] py-2 rounded-lg transition cursor-pointer"
                >
                  {copiedStates["lovablePrompt"] ? "Copiado com Sucesso!" : "Gerar & Copiar Prompt Lovable"}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-black/45 space-y-3 text-center flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">EXP COMPLETA</span>
                  <h4 className="text-xs font-bold text-white">Roteiro WordPress / Shopify Code</h4>
                  <p className="text-[11px] text-neutral-450 leading-relaxed">Copia o esqueleto de blocos clássicos prontos para arrastar em builders tradicionais.</p>
                </div>
                <button
                  onClick={() => triggerCopyNotification("wordpressTags", `[SEÇÃO DE TOPO - HERO]
Headline: "${assets.salesPage?.headline}"
Subheadline: "${assets.salesPage?.subheadline}"
CTA Texto Botão: "${assets.salesPage?.heroSection?.ctaText}"

[SEÇÃO DE DOR]
Título: "${assets.salesPage?.problemSection?.title}"
História: "${assets.salesPage?.problemSection?.description}"

[SEÇÃO DE SOLUÇÃO E MECANISMO]
Título: "${assets.salesPage?.solutionSection?.title}"
Texto: "${assets.salesPage?.solutionSection?.description}"

[BÔNUS VALORIZADOS]
${assets.salesPage?.bonusesList?.map((b, i) => `[Bônus ${i+1}] ${b.title} (${b.value}) - ${b.description}`).join('\n')}`)}
                  className="w-full bg-neutral-900 border border-white/10 hover:bg-neutral-850 text-neutral-300 font-semibold text-[11px] py-2 rounded-lg transition cursor-pointer"
                >
                  {copiedStates["wordpressTags"] ? "Copiado WordPress!" : "Copiar WordPress Structure"}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-black/45 space-y-3 text-center flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">DEV CODE</span>
                  <h4 className="text-xs font-bold text-white">Landing Page HTML/Tailwind</h4>
                  <p className="text-[11px] text-neutral-450 leading-relaxed">Baixe a raiz index.html pronta com biblioteca CDN Tailwind já configurada.</p>
                </div>
                <button
                  onClick={downloadHtmlLP}
                  className="w-full bg-neutral-900 border border-white/10 hover:bg-neutral-850 text-neutral-300 font-semibold text-[11px] py-2 rounded-lg transition cursor-pointer"
                >
                  Baixar Rascunho HTML
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black border border-white/5 space-y-3 text-xs leading-relaxed text-neutral-400">
              <span className="font-mono text-[10px] text-amber-500 font-bold block uppercase animate-pulse">OBSERVAÇÕES DOS DESENVOLVEDORES CO COPYMESTRE:</span>
              <p>
                O exportador Lovable Prompt foi concebido especificamente para traduzir a arquitetura lógica gerada pela nossa mesa de especialistas direto para o editor da Lovable. Este fluxo permite criar o código visual final sem onerar suas faturas em IAs pesadas de design. Apenas copie o prompt refinado e insira-o no campo de comando da Lovable!
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}