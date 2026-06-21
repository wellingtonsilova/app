import React, { useState } from "react";
import { 
  Users, 
  Sparkles, 
  Play, 
  Bot, 
  UserCheck, 
  Flame, 
  HelpCircle,
  TrendingUp,
  LineChart,
  ShieldAlert,
  ArrowRight,
  Award
} from "lucide-react";
import { Project, ProjectAnalysis, UserProfile } from "../types";

interface MesaEspecialistasProps {
  project: Project;
  user: UserProfile | null;
  onAnalyze: () => Promise<void>;
  loading: boolean;
  onApproveAndProceed: () => void;
}

export default function MesaEspecialistas({ 
  project, 
  user, 
  onAnalyze, 
  loading, 
  onApproveAndProceed 
}: MesaEspecialistasProps) {
  const [activeExpertId, setActiveExpertId] = useState<string>("oferta");
  
  // Simulated step index for loading animation
  const [loadingAgentIndex, setLoadingAgentIndex] = useState(-1);

  const startAnalysisDebate = async () => {
    // Run loading tick simulation for visual rhythm, then call live analysis
    setLoadingAgentIndex(0);
    const interval = setInterval(() => {
      setLoadingAgentIndex((old) => {
        if (old >= 11) {
          clearInterval(interval);
          return 11;
        }
        return old + 1;
      });
    }, 1800);

    try {
      await onAnalyze();
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(interval);
      setLoadingAgentIndex(-1);
    }
  };

  const specialistsList = [
    { id: "oferta", label: "Oferta", desc: "Estruturação & Preços", field: "especialistaOferta", avatarColor: "bg-amber-500/10 border-amber-500 text-amber-400" },
    { id: "headlines", label: "Headlines", desc: "Clareza & Atração", field: "especialistaHeadlines", avatarColor: "bg-red-500/10 border-red-500 text-red-400" },
    { id: "copy", label: "Copywriting", desc: "Estruturas de Influência", field: "especialistaCopy", avatarColor: "bg-orange-500/10 border-orange-500 text-orange-400" },
    { id: "vsl", label: "VSL", desc: "Ganchos de Vídeo e Story", field: "especialistaVSL", avatarColor: "bg-yellow-500/10 border-yellow-500 text-yellow-400" },
    { id: "hooks", label: "Hooks", desc: "Interrupção de Feed", field: "especialistaHooks", avatarColor: "bg-emerald-500/10 border-emerald-500 text-emerald-400" },
    { id: "criativos", label: "Criativos", desc: "Ângulos de Anúncios", field: "especialistaCriativos", avatarColor: "bg-teal-500/10 border-teal-500 text-teal-400" },
    { id: "avatar", label: "Avatar", desc: "Dores de Público", field: "especialistaAvatar", avatarColor: "bg-cyan-500/10 border-cyan-500 text-cyan-400" },
    { id: "escala", label: "Escala", desc: "Internacionalização & Canais", field: "especialistaEscala", avatarColor: "bg-blue-500/10 border-blue-500 text-blue-400" },
    { id: "trafego", label: "Tráfego Pago", desc: "Meta, Google & TikTok", field: "especialistaTrafego", avatarColor: "bg-indigo-500/10 border-indigo-500 text-indigo-400" },
    { id: "metricas", label: "Métricas", desc: "Gargalos de CPC e CTR", field: "especialistaMetricas", avatarColor: "bg-purple-500/10 border-purple-500 text-purple-400" },
    { id: "funis", label: "Funis", desc: "LTV, Upsell & Downsell", field: "especialistaFunis", avatarColor: "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400" },
    { id: "branding", label: "Branding", desc: "Posicionamento de Autoridade", field: "especialistaBranding", avatarColor: "bg-pink-500/10 border-pink-500 text-pink-400" },
  ];

  const analysis: ProjectAnalysis | null = project.analysisResult;

  const renderActiveReport = () => {
    if (!analysis) return null;

    switch (activeExpertId) {
      case "oferta":
        const o = analysis.especialistaOferta;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Especialista em Ofertas e Precificação
              </h5>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold">
                Nota: {o?.nota || "7.0"}/10
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[11px] font-mono text-emerald-400 font-bold block uppercase mt-0.5">PONTOS FORTES</span>
                <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4 leading-relaxed">
                  {o?.pontosFortes?.map((pt, idx) => <li key={idx}>{pt}</li>)}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[11px] font-mono text-red-400 font-bold block uppercase mt-0.5">PONTOS FRACOS</span>
                <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4 leading-relaxed">
                  {o?.pontosFracos?.map((pt, idx) => <li key={idx}>{pt}</li>)}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
              <span className="text-xs font-mono text-amber-400 font-semibold block uppercase">NOVA ESTRUTURA DE OFERTA RECOMENDADA</span>
              <p className="text-xs text-neutral-200 leading-relaxed font-mono whitespace-pre-wrap">
                {o?.novaOfertaProposta}
              </p>
            </div>
          </div>
        );

      case "headlines":
        const h = analysis.especialistaHeadlines;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" /> Especialista em Headlines de Conversão
              </h5>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 font-mono font-bold">
                Nota: {h?.nota}/10
              </span>
            </div>

            <p className="text-xs text-neutral-400 italic leading-relaxed">
              {h?.analises}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-500 font-bold uppercase block">20 Headlines de Impacto Geradas:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {h?.headlines?.map((hl, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5 hover:border-white/10 transition duration-200">
                    <span className="w-5 h-5 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center font-mono text-[10px] text-neutral-500 shrink-0 mt-0.5">{idx + 1}</span>
                    <span className="text-neutral-200 font-medium leading-relaxed">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "copy":
        const c = analysis.especialistaCopy;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-orange-400" /> Especialista em Neurocopywriting
              </h5>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-mono text-orange-400 font-bold block uppercase">DIAGNÓSTICO DA COPY</span>
              <p className="text-xs text-neutral-350 leading-relaxed bg-black/40 p-4 border border-white/5 rounded-xl">
                {c?.diagnostico}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-neutral-400 font-bold block uppercase">MELHORIAS CIRÚRGICAS RECOMENDADAS:</span>
              <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-4 leading-relaxed">
                {c?.melhorias?.map((melhor, idx) => <li key={idx}>{melhor}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-xs font-mono text-neutral-500 block">Esqueleto Estrutural da Copy Ideal:</span>
              <p className="text-xs text-neutral-300 font-mono italic leading-relaxed">
                {c?.copyOtimizadaOutline}
              </p>
            </div>
          </div>
        );

      case "vsl":
        const v = analysis.especialistaVSL?.novaEstruturaVSL;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-yellow-400" /> Especialista em Roteiros de VSL
              </h5>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-black/45 border border-white/5 rounded-xl">
                <span className="font-mono text-yellow-400 font-bold uppercase block text-[10px] mb-1"> GANCHO DO LOCUTOR (0 - 30s)</span>
                <p className="text-neutral-200 leading-relaxed italic">&quot;{v?.gancho}&quot;</p>
              </div>

              <div className="p-3 bg-black/45 border border-white/5 rounded-xl">
                <span className="font-mono text-neutral-400 font-bold uppercase block text-[10px] mb-1"> JORNADA EMOCIONAL / STORYTELLING</span>
                <p className="text-neutral-300 leading-relaxed">{v?.storytelling}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-black/45 border border-white/5 rounded-xl">
                  <span className="font-mono text-purple-400 font-bold uppercase block text-[10px] mb-1"> QUEBRA DE OBJEÇÃO FUNDAMENTAL</span>
                  <p className="text-neutral-300 leading-relaxed">{v?.quebraObjecoes}</p>
                </div>
                <div className="p-3 bg-black/45 border border-white/5 rounded-xl">
                  <span className="font-mono text-emerald-400 font-bold uppercase block text-[10px] mb-1"> FECHAMENTO & CTA</span>
                  <p className="text-neutral-200 leading-relaxed font-semibold">{v?.fechamentoCall}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "hooks":
        const hk = analysis.especialistaHooks;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Especialista em Ganchos Virais (Hooks)
              </h5>
            </div>

            <p className="text-xs text-neutral-400 mb-2 leading-relaxed">
              Os ganchos abaixo são desenhados para capturar a atenção exclusiva no feed do Meta Ads e TikTok Ads nos primeiros 3 segundos.
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {hk?.hooks?.map((hook, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/45 border border-white/5 flex items-center gap-2.5 hover:border-white/10 transition duration-200">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-lg">HOOK {idx+1}</span>
                    <span className="text-neutral-300 font-sans text-xs leading-relaxed select-all">
                      {hook}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "criativos":
        const cr = analysis.especialistaCriativos;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" /> Especialista de Direção Creatives
              </h5>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-black/45 border border-white/5 space-y-2">
                <span className="text-xs font-mono text-teal-400 font-semibold block uppercase">ÂNGULOS VISUAIS PARA IMAGENS</span>
                <ul className="text-xs text-neutral-305 text-neutral-300 list-disc pl-4 space-y-1.5 leading-relaxed">
                  {cr?.angulosVisuais?.map((ang, idx) => <li key={idx}>{ang}</li>)}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-black/45 border border-white/5 space-y-2">
                <span className="text-xs font-mono text-teal-400 font-semibold block uppercase">RÁPIDAS IDEIAS DE CRIATIVOS</span>
                <ul className="text-xs text-neutral-305 text-neutral-300 list-disc pl-4 space-y-1.5 leading-relaxed">
                  {cr?.ideiasDeCriativos?.map((id, idx) => <li key={idx}>{id}</li>)}
                </ul>
              </div>
            </div>
          </div>
        );

      case "avatar":
        const av = analysis.especialistaAvatar;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> Especialista em Mapeamento de Avatar
              </h5>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl bg-black/45 border border-white/5 space-y-1.5">
                <span className="font-mono text-cyan-400 font-bold block text-[10px] uppercase">AVATAR PRINCIPAL DETALHADO</span>
                <p className="text-neutral-200 leading-relaxed">
                  {av?.avatarPrincipal}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/45 border border-white/5 space-y-1.5">
                  <span className="font-mono text-neutral-400 font-bold block text-[10px] uppercase">SEGMENTOS OCULTOS RELEVADOS</span>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-300 leading-relaxed">
                    {av?.segmentosOcultos?.map((seg, idx) => <li key={idx}>{seg}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-black/45 border border-white/5 space-y-1.5">
                  <span className="font-mono text-neutral-400 font-bold block text-[10px] uppercase">NOVOS PÚBLICOS SUGERIDOS</span>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-300 leading-relaxed">
                    {av?.novosPublicos?.map((pub, idx) => <li key={idx}>{pub}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // Render simple fallback mapping for scale, ads, funnels, branding
        const indexMap: Record<string, string> = {
          escala: "especialistaEscala",
          trafego: "especialistaTrafego",
          metricas: "especialistaMetricas",
          funis: "especialistaFunis",
          branding: "especialistaBranding"
        };
        const activeField = indexMap[activeExpertId];
        const dataNode = activeField ? (analysis as any)[activeField] : null;

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h5 className="font-display font-semibold text-lg text-white capitalize">
                Especialista em {activeExpertId}
              </h5>
            </div>

            {dataNode ? (
              <div className="p-4 bg-black/45 border border-white/5 rounded-xl space-y-3.5 text-xs text-neutral-300">
                {Object.entries(dataNode).map(([key, val]: any, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-mono text-amber-500 uppercase font-semibold block">{key.replace(/([A-Z])/g, ' $1')}</span>
                    {Array.isArray(val) ? (
                      <ul className="list-disc pl-4 space-y-1 text-neutral-300 leading-relaxed">
                        {val.map((item, id) => <li key={id}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="leading-relaxed bg-black/20 p-2 rounded-xl border border-white/5">{val}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Nenhum dado estrito retornado por esse agente.</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Product Title Banner */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-white/5 boardroom-grid backdrop-blur-md relative overflow-hidden shadow-xl shadow-amber-500/2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-500 font-bold tracking-widest block">MESA ATIVA</span>
            <h3 className="font-display font-light text-2xl text-white">{project.name}</h3>
            <p className="text-neutral-400 text-xs truncate max-w-xl">
              Nicho: {project.briefing?.productNiche} | Preço sugerido: R$ {project.briefing?.productPrice} | Audiência: {project.briefing?.targetAudience}
            </p>
          </div>

          <div className="shrink-0 font-sans">
            {!analysis ? (
              <button
                onClick={startAnalysisDebate}
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:bg-zinc-900 disabled:text-neutral-600 text-black font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 select-none shadow-xl shadow-amber-500/10 cursor-pointer transition longevity"
              >
                <Play className="w-4.5 h-4.5 fill-current" />
                <span>Ativar Debate Inteligente (10cr)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <UserCheck className="w-4.5 h-4.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">Debate Concluído</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-6 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Bot className="w-5 h-5 text-amber-500 animate-bounce" />
            <span className="text-sm font-semibold text-white">Reunindo os Especialistas ao Redor da Mesa...</span>
          </div>

          {/* Specialists debate ticker simulation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            {specialistsList.map((spec, index) => {
              const itemLoadingState = index === loadingAgentIndex;
              const itemDoneState = index < loadingAgentIndex;
              return (
                <div 
                  key={spec.id} 
                  className={`p-2.5 rounded-xl border text-left transition duration-300 ${
                    itemLoadingState 
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : itemDoneState
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-450 text-emerald-400"
                        : "border-white/5 bg-black/20 text-neutral-600"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase truncate">{spec.label}</div>
                  <div className="text-[9px] mt-0.5 truncate text-neutral-500">
                    {itemLoadingState ? "Analisando..." : itemDoneState ? "Consolidado" : "Aguardando"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Analysis Display Board */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circular Specialists selection bar */}
          <div className="lg:col-span-1 p-5 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md space-y-3">
            <span className="text-[11px] font-mono text-neutral-500 uppercase font-bold block">INTEGRANTES DA MESA</span>
            
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {specialistsList.map((spec) => {
                const isSelected = activeExpertId === spec.id;
                const scoreNode = (analysis as any)[spec.field]?.nota;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setActiveExpertId(spec.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition duration-200 ${
                      isSelected 
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-500 font-medium" 
                        : "border-white/5 bg-black/20 text-neutral-400 hover:bg-zinc-900/40 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${spec.avatarColor}`}>
                        {spec.label.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-neutral-200 block truncate">{spec.label}</span>
                        <span className="text-[9px] text-neutral-500 block truncate leading-tight">{spec.desc}</span>
                      </div>
                    </div>

                    {scoreNode && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-lg bg-black/60 border border-white/5 text-neutral-300 font-bold shrink-0">
                        ★ {scoreNode}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Expert details column */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md">
            {renderActiveReport()}
          </div>
        </div>
      )}

      {/* IA Director of Marketing Speech Bubble */}
      {analysis && analysis.diretorMarketing && (
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/45 backdrop-blur-md relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-display font-medium text-white text-base">Diretor de Marketing IA</h4>
              <p className="text-[10px] font-mono text-amber-500/80 uppercase font-semibold">Cérebro Consolidador Central</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3.5 rounded-xl border border-white/5 bg-black/40">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase mb-1">O QUE MANTER:</span>
              <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                {analysis.diretorMarketing.manter?.map((i, id) => <li key={id}>{i}</li>)}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-white/5 bg-black/40">
              <span className="text-[10px] font-mono text-red-400 font-bold block uppercase mb-1">O QUE REMOVER:</span>
              <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                {analysis.diretorMarketing.remover?.map((i, id) => <li key={id}>{i}</li>)}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-white/5 bg-black/40">
              <span className="text-[10px] font-mono text-amber-500 font-bold block uppercase mb-1">O QUE MELHORAR:</span>
              <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px] leading-relaxed">
                {analysis.diretorMarketing.melhorar?.map((i, id) => <li key={id}>{i}</li>)}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-amber-500 font-bold uppercase block">PROMESSA PRINCIPAL ELEITA:</span>
              <p className="text-white font-medium font-display italic text-base leading-relaxed">
                &quot;{analysis.diretorMarketing.promessaUnicaIdeal}&quot;
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase block">ÂNGULO DE ATRAÇÃO CHAVE:</span>
              <p className="text-neutral-300 leading-relaxed text-[11px]">
                {analysis.diretorMarketing.anguloPrincipal}
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase block">PLANO DE AÇÃO EXECUTIVO RECOMENDADO:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {analysis.diretorMarketing.planoAcaoPassoAPasso?.map((passo, idx) => (
                <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl">
                  <span className="font-mono text-amber-500 font-bold">Fase {idx+1}:</span> <span className="text-neutral-300">{passo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action trigger button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onApproveAndProceed}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 transition longevity"
            >
              <span>Aprovar Relatório e Gerar Oferta (20cr)</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
