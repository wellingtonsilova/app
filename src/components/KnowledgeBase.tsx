import React, { useState } from "react";
import { 
  BookOpen, 
  CloudUpload, 
  Trash2, 
  Check, 
  Plus, 
  Layers, 
  Sparkles, 
  FileText,
  BadgeAlert
} from "lucide-react";
import { KnowledgeItem } from "../types";

interface KnowledgeBaseProps {
  knowledgeBase: KnowledgeItem[];
  onAddKnowledge: (title: string, category: string, content: string) => Promise<void>;
  onDeleteKnowledge: (id: string) => Promise<void>;
  loading: boolean;
}

export default function KnowledgeBase({ 
  knowledgeBase, 
  onAddKnowledge, 
  onDeleteKnowledge, 
  loading 
}: KnowledgeBaseProps) {
  const categoriesList = [
    "Copywriting",
    "Headlines",
    "Hooks",
    "VSL",
    "Ofertas",
    "Funis",
    "Branding",
    "Escala",
    "Tráfego",
    "Criativos",
    "Páginas Vencedoras"
  ];

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("Todos");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form input states
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Copywriting");
  const [newContent, setNewContent] = useState("");
  const [fileuploadName, setFileuploadName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      alert("Por favor, preencha o Título e o Conteúdo do Recurso.");
      return;
    }
    try {
      await onAddKnowledge(newTitle, newCategory, newContent);
      setNewTitle("");
      setNewContent("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate file upload RAG indexing
  const simulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileuploadName(file.name);
      setUploadProgress(true);

      setTimeout(() => {
        // Mock extraction
        const catSimulated = file.name.toLowerCase().includes("hooks") ? "Hooks" 
                           : file.name.toLowerCase().includes("vsl") ? "VSL" 
                           : file.name.toLowerCase().includes("tráfego") ? "Tráfego"
                           : "Copywriting";

        onAddKnowledge(
          `Conhecimento RAG de ${file.name.split(".")[0]}`,
          catSimulated,
          `Conteúdo extraído e resumido do documento inteligente ${file.name}. Boas práticas identificadas: Concentre ganchos fortes de contraste visual em anúncios móveis rápidos e reforce garantias baseadas em resultados acumulados em testes.`
        );
        setUploadProgress(false);
        setFileuploadName("");
      }, 2000);
    }
  };

  const filteredItems = activeCategoryFilter === "Todos"
    ? knowledgeBase
    : knowledgeBase.filter((item) => item.category === activeCategoryFilter);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Header Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display font-light text-2xl text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500 animate-pulse" /> Base de Conhecimento (RAG)
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Adicione regramentos, depoimentos, dados de tráfego, ou PDFs de frameworks vencedores de copy.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 shadow-lg shadow-amber-500/5 animate-shimmer"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Inserir Conhecimento Manual</span>
        </button>
      </div>

      {/* Sync indicator */}
      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-2 text-xs text-emerald-400">
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Sincronização Ativa:</strong> Todos os ativos salvos acima são alimentados automaticamente como contexto heurístico RAG no cérebro central dos 12 Especialistas durante debates.
        </p>
      </div>

      {/* Insert manual form overlay/card */}
      {showAddForm && (
        <form onSubmit={handleManualSubmit} className="p-5 rounded-2xl border border-white/5 bg-zinc-950/45 backdrop-blur-md space-y-4">
          <div className="border-b border-white/5 pb-2.5 flex justify-between items-center">
            <h4 className="text-xs font-bold font-mono text-amber-500 uppercase">INSERIR NOVO ARTIGO DIGITAL</h4>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="text-xs text-neutral-400 hover:text-white font-semibold cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1 font-medium">Título do Artigo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fórmula de Gancho Estilo Curiosidade"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500/30"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-medium">Categoria de Destino</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500/30 font-semibold"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat} className="bg-neutral-900 text-white">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-neutral-300 block mb-1 font-medium">Diretrizes ou Copy Exonerações (RAG Text)</label>
              <textarea
                required
                rows={5}
                placeholder="Insira regras completas no estilo 'Sempre faça anúncios de Reels ligando à dor de obesidade do personagem principal...' para que os consultores as aprendam."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-black/40 border border-white/5 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500/30 font-mono text-[11px] leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 font-bold text-black px-5 py-2 rounded-xl text-xs transition cursor-pointer"
            >
              Salvar Artigo
            </button>
          </div>
        </form>
      )}

      {/* Grid containing categories and file upload simulated box */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Categories filters column */}
        <div className="lg:col-span-1 space-y-4 font-sans">
          <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/20 space-y-3">
            <span className="text-[10px] font-mono font-bold text-neutral-500 block uppercase tracking-wider">FILTRAR CATEGORIAS</span>
            
            <div className="space-y-1 text-xs">
              {["Todos", ...categoriesList].map((cat) => {
                const isSelected = activeCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition cursor-pointer ${
                      isSelected 
                        ? "bg-amber-500/10 text-amber-500 font-bold border-l-2 border-amber-500" 
                        : "text-neutral-400 hover:bg-zinc-900/40 hover:text-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload PDF Box in sidebar */}
          <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/40 text-center space-y-2">
            <span className="text-[10px] font-mono font-bold text-neutral-500 block uppercase">UPLOAD EXECUTIVOS (PDF / DOCX / TXT)</span>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Arraste relatórios de vendas em PDF ou rascunhos em DOCX para indexar via RAG inteligente.
            </p>
            
            <input
              type="file"
              id="rag-file"
              accept=".pdf,.txt,.docx"
              disabled={uploadProgress}
              onChange={simulateFileUpload}
              className="hidden"
            />
            <label
              htmlFor="rag-file"
              className="mt-2 w-full p-3.5 border-2 border-dashed border-white/10 hover:border-amber-500/20 hover:bg-zinc-900/10 rounded-xl cursor-pointer block text-xs"
            >
              <CloudUpload className="w-6 h-6 text-neutral-400 mx-auto mb-1 animate-pulse" />
              <span className="font-semibold text-neutral-300">Anexar Documento</span>
              <span className="text-[10px] text-neutral-500 block mt-0.5">PDF ou TXT</span>
            </label>

            {uploadProgress && (
              <div className="p-2 bg-black border border-white/5 text-[11px] text-neutral-300 flex items-center justify-center gap-1.5 rounded-lg animate-pulse">
                <span>Processando {fileuploadName}...</span>
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Base items grid */}
        <div className="lg:col-span-3 space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">Contendo {filteredItems.length} recursos de conhecimento salvos</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 border border-white/5 rounded-xl bg-black/10">
              <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-neutral-300">Nenhum recurso encontrado</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Não há itens de conhecimento cadastrados nesta pasta. Crie artigos manuais ou faça upload de rascunhos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-xl border border-white/5 bg-zinc-950/40 hover:bg-neutral-900/10 hover:border-white/10 transition duration-200 flex flex-col justify-between space-y-3.5 group relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[9px] font-mono bg-zinc-900 border border-white/5 text-amber-500 px-2 py-0.5 rounded-lg uppercase font-semibold">
                        {item.category}
                      </span>

                      <button
                        onClick={() => onDeleteKnowledge(item.id)}
                        className="p-1 border border-transparent hover:border-red-500/20 hover:bg-red-500/5 rounded-lg text-neutral-700 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                        title="Remover Recurso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-200">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-mono leading-relaxed max-h-24 overflow-y-auto pr-1">
                      {item.content}
                    </p>
                  </div>

                  <div className="text-[9px] font-mono text-neutral-500 border-t border-white/5 pt-2 text-right">
                    Refinado: {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
