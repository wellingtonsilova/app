import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Settings, 
  User, 
  Trash2, 
  Check, 
  ChevronRight,
  ExternalLink,
  Bot
} from "lucide-react";
import { 
  Project, 
  UserProfile, 
  KnowledgeItem, 
  ColetaInput, 
  BriefingInput 
} from "./types";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ColetaBriefing from "./components/ColetaBriefing";
import MesaEspecialistas from "./components/MesaEspecialistas";
import RelatorioFinal from "./components/RelatorioFinal";
import KnowledgeBase from "./components/KnowledgeBase";
import CreditsPanel from "./components/CreditsPanel";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Loading indicators
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Account form modal states
  const [editName, setEditName] = useState("");
  const [editWorkspace, setEditWorkspace] = useState("");

  // Load initial settings on component mount
  useEffect(() => {
    fetchMe();
    fetchProjects();
    fetchKnowledgeBase();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setEditName(data.name || "");
        setEditWorkspace(data.lovableWorkspace || "");
      }
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const res = await fetch("/api/knowledge-base");
      if (res.ok) {
        const data = await res.json();
        setKnowledgeBase(data);
      }
    } catch (err) {
      console.error("Erro ao carregar base de conhecimento:", err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const res = await fetch("/api/auth/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, lovableWorkspace: editWorkspace })
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setShowSettingsModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleSaveProject = async (coleta: ColetaInput, briefing: BriefingInput) => {
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coleta, briefing })
      });
      if (res.ok) {
        const newProj = await res.json();
        setProjects((prev) => [newProj, ...prev]);
        setSelectedProject(newProj);
        setCurrentTab("specialists");
        return newProj;
      }
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
    }
  };

  const handleRunDebate = async () => {
    if (!selectedProject) return;
    setLoading((prev) => ({ ...prev, analyze: true }));
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/analyze`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const updatedProj = { ...selectedProject, analysisResult: data.result, status: "analyzed" as any };
          setSelectedProject(updatedProj);
          setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? updatedProj : p));
          if (data.user) {
            setUser(data.user);
          }
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Erro ao executar debate da mesa de especialistas.");
      }
    } catch (err) {
      console.error("Erro ao chamar endpoint analyze:", err);
    } finally {
      setLoading((prev) => ({ ...prev, analyze: false }));
    }
  };

  const handleGenerateAssets = async () => {
    if (!selectedProject) return;
    setLoading((prev) => ({ ...prev, generate: true }));
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/approve-and-generate`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.generated) {
          const updatedProj = { ...selectedProject, generatedAssets: data.generated, status: "generated" as any };
          setSelectedProject(updatedProj);
          setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? updatedProj : p));
          if (data.user) {
            setUser(data.user);
          }
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Créditos insuficientes ou problemas ao gerar ativos.");
      }
    } catch (err) {
      console.error("Erro ao aprovar e gerar ativos:", err);
    } finally {
      setLoading((prev) => ({ ...prev, generate: false }));
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta oferta de forma permanente de sua conta?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (selectedProject?.id === id) {
          setSelectedProject(null);
        }
      }
    } catch (err) {
      console.error("Erro ao deletar projeto:", err);
    }
  };

  const handleBuyCreditsSimulated = async (amount: number, planName: string) => {
    setLoading((prev) => ({ ...prev, upgrade: true }));
    try {
      const res = await fetch("/api/credits/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planName })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert(`Sucesso! Sua conta Wellimgton foi vinculada ao plano ${planName} e de brinde foram creditados +${amount} tokens de simulação!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, upgrade: false }));
    }
  };

  const handleAddKnowledgeItem = async (title: string, category: string, content: string) => {
    try {
      const res = await fetch("/api/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, content })
      });
      if (res.ok) {
        const data = await res.json();
        setKnowledgeBase((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteKnowledgeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge-base/${id}`, { method: "DELETE" });
      if (res.ok) {
        setKnowledgeBase((prev) => prev.filter((k) => k.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectFromDashboard = (proj: Project) => {
    setSelectedProject(proj);
    if (proj.status === "generated") {
      setCurrentTab("generation");
    } else {
      setCurrentTab("specialists");
    }
  };

  const handleNewProjectTrigger = () => {
    setSelectedProject(null);
    setCurrentTab("new-project");
  };

  return (
    <div className="flex h-screen bg-neutral-950 font-sans text-neutral-100 overflow-hidden">
      
      {/* Sidebar navigation module */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Workspace Frame container */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-12 bg-gradient-to-b from-neutral-950 via-zinc-950 to-neutral-950">
        
        {/* Render Dashboard panel */}
        {currentTab === "dashboard" && (
          <Dashboard 
            projects={projects}
            user={user}
            onSelectProject={handleSelectFromDashboard}
            onNewProject={handleNewProjectTrigger}
            onDeleteProject={handleDeleteProject}
            setCurrentTab={setCurrentTab}
          />
        )}

        {/* Render New Offert wizard panel */}
        {currentTab === "new-project" && (
          <ColetaBriefing 
            onSave={handleSaveProject}
            onCancel={() => setCurrentTab("dashboard")}
            userCredits={user?.credits || 0}
          />
        )}

        {/* Render board specialists panel */}
        {currentTab === "specialists" && (
          selectedProject ? (
            <MesaEspecialistas 
              project={selectedProject}
              user={user}
              onAnalyze={handleRunDebate}
              loading={loading.analyze || false}
              onApproveAndProceed={() => setCurrentTab("generation")}
            />
          ) : (
            <div className="text-center py-16 text-slate-500 max-w-sm mx-auto space-y-4">
              <span className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center mx-auto text-amber-500 text-lg">★</span>
              <h4 className="text-sm font-semibold text-slate-355 text-slate-350">Nenhuma oferta ativa selecionada</h4>
              <p className="text-xs">Por favor, selecione um projeto existente no seu dashboard ou construa novos briefings para rodar a mesa de análise.</p>
              <button onClick={() => setCurrentTab("dashboard")} className="mt-4 text-xs font-bold text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded bg-amber-500/5 hover:bg-amber-500/10">Voltar ao Dashboard</button>
            </div>
          )
        )}

        {/* Render final structures copy page outputs */}
        {currentTab === "generation" && (
          selectedProject ? (
            <RelatorioFinal 
              project={selectedProject}
              user={user}
              onGenerateFull={handleGenerateAssets}
              loading={loading.generate || false}
            />
          ) : (
            <div className="text-center py-16 text-slate-500 max-w-sm mx-auto space-y-4">
              <span className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center mx-auto text-amber-500 text-lg">★</span>
              <h4 className="text-sm font-semibold text-slate-350">Nenhuma oferta ativa selecionada</h4>
              <p className="text-xs font-sans">Primeiro configure a mesa de análises de copy para qualificar as re-estruturas da sua landing page.</p>
              <button onClick={() => setCurrentTab("dashboard")} className="mt-4 text-xs font-bold text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded bg-amber-500/5">Voltar ao Dashboard</button>
            </div>
          )
        )}

        {/* Render RAG modules base folder */}
        {currentTab === "knowledge" && (
          <KnowledgeBase 
            knowledgeBase={knowledgeBase}
            onAddKnowledge={handleAddKnowledgeItem}
            onDeleteKnowledge={handleDeleteKnowledgeItem}
            loading={loading.knowledge || false}
          />
        )}

        {/* Render credit logs & active packages selection */}
        {currentTab === "credits" && (
          <CreditsPanel 
            user={user}
            onUpgrade={handleBuyCreditsSimulated}
            loading={loading.upgrade || false}
          />
        )}

      </main>

      {/* LUXURIOUS CONFIG ACCOUNT MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-6 text-slate-100">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 max-w-md w-full space-y-5">
            <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-medium text-slate-100 text-base">Configurações da Conta</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-xs text-slate-500 hover:text-slate-300 font-semibold"
              >
                Fechar [X]
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Seu Nome Comercial</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/30 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Link do seu Workspace Lovable (Sincronização Direct)</label>
                <input
                  type="url"
                  placeholder="https://lovable.dev/projects/meu-projeto-vencedor"
                  value={editWorkspace}
                  onChange={(e) => setEditWorkspace(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/30 font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-500 block mt-1 leading-normal">
                  Insira o link do seu projeto ativo na Lovable para sincronizar os exports de copy e códigos estruturados em 1 clique.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end">
                <button
                  type="submit"
                  disabled={loading.profile}
                  className="bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 px-5 py-2.5 rounded-lg text-xs transition h-fit"
                >
                  {loading.profile ? "Salvando..." : "Salvar Configurações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
