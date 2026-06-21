import React from "react";
import { 
  Users, 
  Coins, 
  Layers, 
  Plus, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LineChart,
  Trash2,
  FileText,
  Clock
} from "lucide-react";
import { Project, UserProfile } from "../types";

interface DashboardProps {
  projects: Project[];
  user: UserProfile | null;
  onSelectProject: (p: Project) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Dashboard({ 
  projects, 
  user, 
  onSelectProject, 
  onNewProject, 
  onDeleteProject, 
  setCurrentTab 
}: DashboardProps) {
  const statCards = [
    {
      title: "Projetos de Ofertas",
      value: projects.length,
      desc: "Análises de ofertas salvas",
      icon: Layers,
      color: "text-amber-500 bg-zinc-900/30 border-white/5",
    },
    {
      title: "Mesa de Especialistas",
      value: "12 Agentes",
      desc: "Simulações simultâneas",
      icon: Users,
      color: "text-emerald-500 bg-zinc-900/30 border-white/5",
    },
    {
      title: "Créditos Disponíveis",
      value: user?.credits || 0,
      desc: `Plano ${user?.plan || "Starter"}`,
      icon: Coins,
      color: "text-amber-500 bg-zinc-900/30 border-white/5",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-light text-3xl text-white tracking-tight">
            Olá, <span className="text-amber-500 font-bold">{user?.name || "Parceiro"}</span>!
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Seja bem-vindo ao cérebro inteligente da sua próxima oferta de múltiplos 7 dígitos.
          </p>
        </div>
        <button
          onClick={onNewProject}
          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all duration-200 cursor-pointer h-fit"
        >
          <Plus className="w-4 h-4" />
          Analisar Nova Oferta
        </button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 rounded-xl border backdrop-blur-md flex items-start justify-between ${stat.color}`}
            >
              <div className="space-y-1">
                <span className="text-[#999] text-[10px] font-mono tracking-wider block uppercase">{stat.title}</span>
                <span className="text-2xl font-bold font-display text-white block">{stat.value}</span>
                <span className="text-xs text-neutral-500 block">{stat.desc}</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/5 rounded-xl">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-neutral-200">Projetos Recentes</h3>
            <span className="text-xs text-neutral-500 bg-zinc-900/50 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
              Total: {projects.length}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-2xl border border-white/5 bg-zinc-900/10 backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-5 h-5 text-neutral-500" />
              </div>
              <h4 className="text-sm font-semibold text-neutral-300">Nenhum projeto cadastrado</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Envie os dados do seu produto (link, VSL, ou rascunho de copy) para iniciar a análise dos 12 Especialistas.
              </p>
              <button
                onClick={onNewProject}
                className="mt-4 border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-xs px-4 py-2 rounded-xl font-bold transition duration-200"
              >
                Criar Primeiro Projeto
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="p-4 rounded-xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-white/10 transition-all duration-300 group flex items-center justify-between gap-4 backdrop-blur-sm"
                >
                  <div className="flex-1 min-w-0 space-y-1 cursor-pointer" onClick={() => onSelectProject(project)}>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-amber-500 transition-colors truncate">
                        {project.name}
                      </h4>
                      <span className="text-[10px] bg-zinc-900 text-neutral-400 px-2 py-0.5 rounded border border-white/5 font-mono">
                        {project.briefing?.productNiche}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-amber-500 font-medium">
                        R$ {project.briefing?.productPrice}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-600" />
                        {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    {/* Step Badges */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Briefing</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        project.status !== "briefing_completed" 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                          : "bg-zinc-900 text-neutral-500 border border-white/5"
                      }`}>Mesa Especialistas</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        project.status === "generated" 
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                          : "bg-zinc-900 text-neutral-500 border border-white/5"
                      }`}>Páginas & Copys</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs px-3 py-1.5 border border-white/10 hover:border-white/20 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-neutral-300 font-medium flex items-center gap-1 transition"
                    >
                      <span>Abrir</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 border border-transparent hover:border-red-500/20 hover:bg-red-500/5 rounded-xl text-neutral-600 hover:text-red-400 transition"
                      title="Excluir Projeto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integration and Platform Insights Side Panel */}
        <div className="space-y-6">
          {/* Lovable Flow Integration banner */}
          <div className="p-5 rounded-2xl bg-zinc-950/45 border border-amber-500/20 relative overflow-hidden backdrop-blur-md shadow-lg shadow-amber-500/1">
            <div className="absolute right-0 bottom-0 opacity-10">
              <Sparkles className="w-32 h-32 text-amber-400" />
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 px-2 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold tracking-wider">
                FLUXO RECOMENDADO
              </div>
            </div>

            <h4 className="font-display font-medium text-base text-white">
              Conexão com a Lovable
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed mt-2">
              Gerencie a estratégia e copy na nossa mesa de 12 cérebros e exporte o código direto para seu Workspace no Lovable!
            </p>

            <div className="space-y-2 mt-4 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <span className="font-mono text-amber-500 font-bold">1.</span>
                <span>Copie a proposta reconstruída pelo Diretor IA.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-amber-500 font-bold">2.</span>
                <span>Clique em &quot;Criou Prompt Lovable&quot; em 1 clique.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-amber-500 font-bold">3.</span>
                <span>Cole na Lovable para renderizar em segundos.</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab("credits")}
              className="mt-4 w-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/10 text-xs py-2 rounded-xl font-medium text-neutral-200 transition flex items-center justify-center gap-1.5"
            >
              <span>Vincular Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Method Banner */}
          <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/20 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-neutral-200">Marketing de Conversão</h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Diferente de IAs chatas que apenas dão respostas genéricas, o <strong>Oferta Milionária AI</strong> divide as frentes analíticas para dar diagnósticos precisos de especialistas reais.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-500">
              <div className="p-2 border border-white/5 bg-zinc-900/20 rounded-lg">
                ⚡ Copy Otimizada
              </div>
              <div className="p-2 border border-white/5 bg-zinc-900/20 rounded-lg">
                🎯 Roteiros VSL
              </div>
              <div className="p-2 border border-white/5 bg-zinc-900/20 rounded-lg">
                📌 Ganchos e Criativos
              </div>
              <div className="p-2 border border-white/5 bg-zinc-900/20 rounded-lg">
                ⚙️ Funis de Lucro
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
