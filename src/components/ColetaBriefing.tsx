import React, { useState } from "react";
import { 
  FileText, 
  Globe, 
  ChevronRight, 
  CloudUpload, 
  CheckCircle, 
  HelpCircle,
  Sparkles,
  Link,
  Target,
  ArrowLeft
} from "lucide-react";
import { ColetaInput, BriefingInput, Project } from "../types";

interface ColetaBriefingProps {
  onSave: (coleta: ColetaInput, briefing: BriefingInput) => Promise<Project>;
  onCancel: () => void;
  userCredits: number;
}

export default function ColetaBriefing({ onSave, onCancel, userCredits }: ColetaBriefingProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [simulatedLoad, setSimulatedLoad] = useState("");

  // Step 1: Coleta States
  const [sourceUrl, setSourceUrl] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  const [oferta, setOferta] = useState("");
  const [garantia, setGarantia] = useState("");
  const [bonus, setBonus] = useState("");
  const [copyExtraida, setCopyExtraida] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Step 2: Briefing States
  const [productName, setProductName] = useState("");
  const [productNiche, setProductNiche] = useState("Marketing Digital");
  const [productPrice, setProductPrice] = useState("197");
  const [targetAudience, setTargetAudience] = useState("");
  const [targetAge, setTargetAge] = useState("25-45");
  const [targetGender, setTargetGender] = useState("Ambos");
  const [objective, setObjective] = useState<"conversao" | "criativos" | "escala" | "nova_oferta">("conversao");
  const [concorrência, setConcorrência] = useState("");
  const [diferenciais, setDiferenciais] = useState("");

  // Real material extractor from URL, text, or file (including images via OCR)
  const processMaterialContent = async (options: { url?: string; text?: string; file?: File }) => {
    setLoading(true);
    setSimulatedLoad("Analisando material enviado por Inteligência Artificial (Gemini Multi-Modal)...");
    
    try {
      let base64File = "";
      let fileMime = "";
      let fileText = "";

      if (options.file) {
        fileMime = options.file.type;
        // If it's a plain text file, we can read the text content directly in-browser
        if (options.file.type === "text/plain" || options.file.name.endsWith(".txt")) {
          fileText = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string || "");
            reader.onerror = (e) => reject(new Error("Erro ao ler arquivo de texto."));
            reader.readAsText(options.file!);
          });
        } else if (options.file.type.startsWith("image/")) {
          // If it is an image, we base64 encode it so the server can run OCR via multimodal Gemini
          base64File = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string || "");
            reader.onerror = (e) => reject(new Error("Erro ao codificar imagem."));
            reader.readAsDataURL(options.file!);
          });
        }
      }

      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: options.url || "",
          text: fileText || options.text || "",
          base64File: base64File,
          fileMime: fileMime
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.headline) setHeadline(data.headline);
        if (data.subheadline) setSubheadline(data.subheadline);
        if (data.cta) setCta(data.cta);
        if (data.oferta) setOferta(data.oferta);
        if (data.garantia) setGarantia(data.garantia);
        if (data.bonus) setBonus(data.bonus);
        if (data.copyExtraida) setCopyExtraida(data.copyExtraida);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Houve um erro de processamento do material.");
      }
    } catch (err: any) {
      console.error("Erro na leitura/envio de arquivo:", err);
      alert("Falha na extração de copy: " + err.message);
    } finally {
      setLoading(false);
      setSimulatedLoad("");
    }
  };

  const handleUrlExtraction = () => {
    if (!sourceUrl) return;
    processMaterialContent({ url: sourceUrl });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFiles((prev) => [...prev, file.name]);
      processMaterialContent({ file });
    }
  };

  const triggerManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFiles((prev) => [...prev, file.name]);
      processMaterialContent({ file });
    }
  };

  const currentObjectiveLabel = () => {
    switch(objective) {
      case "conversao": return "Aumentar Conversão de Página";
      case "criativos": return "Melhorar e Gerar Ângulos Criativos";
      case "escala": return "Escalar Oferta para Amplo Tráfego";
      case "nova_oferta": return "Desenhar uma Nova Oferta do Zero";
    }
  };

  const handleSubmit = async () => {
    if (!productName) {
      alert("Por favor, preencha o Nome do Produto.");
      return;
    }
    setLoading(true);
    setSimulatedLoad("Registrando briefings estruturados na nuvem...");
    try {
      const coletaObj: ColetaInput = {
        sourceUrl,
        headline,
        subheadline,
        cta,
        oferta,
        garantia,
        bonus,
        copyExtraida,
        uploadedFiles
      };
      const briefingObj: BriefingInput = {
        productName,
        productNiche,
        productPrice,
        targetAudience,
        targetAge,
        targetGender,
        objective,
        concorrência,
        diferenciais
      };
      await onSave(coletaObj, briefingObj);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSimulatedLoad("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header Wizard Progress */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-200 transition font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> VOLTAR AO DASHBOARD
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-white/5 rounded-full px-4 py-1.5 text-xs text-neutral-400">
            <span className={`w-2.5 h-2.5 rounded-full ${step === 1 ? "bg-amber-500" : "bg-emerald-500"}`} />
            <span className="font-mono">Passo {step} de 2</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
          <h4 className="text-lg font-display font-semibold text-white">Configurando Projeto...</h4>
          <p className="text-xs text-amber-500 font-mono mt-1.5 animate-pulse">{simulatedLoad}</p>
        </div>
      )}

      {/* STEP 1: COLETA CONTÉUDO E LINKS */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-light text-2xl text-white">Etapa 1 — Coleta de Recursos Inteligente</h3>
            <p className="text-neutral-400 text-sm">
              Copie o link atual de vendas, anexe roteiros em PDF, ou informe de forma rascunhada as copys originais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input URL direct */}
            <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-amber-500" />
                <h4 className="text-sm font-semibold text-neutral-200">Rastrear Link Comercial (Kiwify, Hotmart, VSL, Insta)</h4>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                O sistema tentará simular e extrair automaticamente a estrutura de headlines, CTAs, bônus e ofertas da página informada.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://exemplo.kiwify.com.br/meu-produto"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/30 font-mono"
                />
                <button
                  type="button"
                  onClick={handleUrlExtraction}
                  className="bg-zinc-900 hover:bg-zinc-800 text-amber-500 px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1 shrink-0 duration-200"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Extrair
                </button>
              </div>

              {/* Drag and Drop documents upload */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="text-[11px] font-mono text-neutral-500 font-bold uppercase block">Upload de Documento (KNOWLEDGE / COPY)</span>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition duration-200 ${
                    isDragging 
                      ? "border-amber-500 bg-amber-500/5" 
                      : "border-white/5 hover:border-white/15 bg-black/40"
                  }`}
                >
                  <input
                    type="file"
                    id="doc-upload"
                    multiple
                    accept=".pdf,.txt,.docx,image/*"
                    onChange={triggerManualUpload}
                    className="hidden"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer space-y-1 block">
                    <CloudUpload className="w-8 h-8 text-neutral-400 mx-auto" />
                    <span className="text-xs text-neutral-300 font-semibold block">Arrastar ou Escolher Arquivo</span>
                    <span className="text-[10px] text-neutral-500 block">Imagens/Print, PDF, DOCX, TXT até 20MB</span>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {uploadedFiles.map((fn, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900 border border-white/5 text-xs text-neutral-300">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate flex-1 font-mono text-[11px]">{fn}</span>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Manual Fields Extracted */}
            <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-505 text-amber-500 font-bold uppercase">Dados Coletados da Oferta Corrente</span>
                <HelpCircle className="w-4 h-4 text-neutral-500" title="Altere se desejar refinar o rascunho de entrada" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Headline Atual</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Headline principal que está sendo analisada..."
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Subheadline Atual</label>
                  <input
                    type="text"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    placeholder="Promessa secundária ou subtítulo..."
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-neutral-400 block mb-1">CTA Principal</label>
                    <input
                      type="text"
                      value={cta}
                      onChange={(e) => setCta(e.target.value)}
                      placeholder="Ex: QUERO APRENDER"
                      className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Garantia Oferecida</label>
                    <input
                      type="text"
                      value={garantia}
                      onChange={(e) => setGarantia(e.target.value)}
                      placeholder="Ex: 7 dias incondicional"
                      className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Bônus & Oferta Detalhada</label>
                  <input
                    type="text"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    placeholder="Listagem de bônus, e-books adicionais, etc..."
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Copy Inteira / Anotações de Copy</label>
                  <textarea
                    rows={4}
                    value={copyExtraida}
                    onChange={(e) => setCopyExtraida(e.target.value)}
                    placeholder="Cole aqui textos longos da oferta atual, VSL, anúncios ou ideias a serem consolidadas."
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer transition duration-200"
            >
              <span>Continuar para o Briefing</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BRIEFING INTELIGENTE */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-light text-2xl text-white">Etapa 2 — Briefing Inteligente da Oferta</h3>
            <p className="text-neutral-400 text-sm">
              Responda às perguntas obrigatórias do projeto. Essas perguntas orientarão a análise dos 12 Especialistas simultaneamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 space-y-4 backdrop-blur-md">
              <span className="text-xs font-mono text-amber-500 font-bold uppercase block">Informações de Produto</span>
              
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Nome do Produto <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Método Afiliado de Elite"
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">Nicho do Produto</label>
                    <input
                      type="text"
                      value={productNiche}
                      onChange={(e) => setProductNiche(e.target.value)}
                      placeholder="Ex: Finanças / Emagrecimento"
                      className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">Preço Final Sugerido (R$)</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="Ex: 197"
                      className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30 font-mono text-[13px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Diferenciais e Proposta Única de Valor (Unique Hook)</label>
                  <textarea
                    rows={4}
                    value={diferenciais}
                    onChange={(e) => setDiferenciais(e.target.value)}
                    placeholder="O que o seu produto tem de diferente do resto do mercado? (Ex: Garantia incondicional estendida, suporte um pra um pelo WhatsApp, metodologia proprietária, etc.)"
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 space-y-4 backdrop-blur-md">
              <span className="text-xs font-mono text-amber-500 font-bold uppercase block">Audiência & Metas de Venda</span>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Público-Alvo Principal</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ex: Donos de agência, Afiliados frustrados, Iniciantes"
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">Faixa Etária</label>
                    <input
                      type="text"
                      value={targetAge}
                      onChange={(e) => setTargetAge(e.target.value)}
                      placeholder="Ex: 25-45 anos"
                      className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-300 block mb-1 font-medium">Sexo Predominante</label>
                    <select
                      value={targetGender}
                      onChange={(e) => setTargetGender(e.target.value)}
                      className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30 font-medium"
                    >
                      <option value="Ambos" className="bg-neutral-900">Misto (Ambos)</option>
                      <option value="Masculino" className="bg-neutral-900">Masculino</option>
                      <option value="Feminino" className="bg-neutral-900">Feminino</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Análise de Concorrência e Criativos de Exemplo</label>
                  <input
                    type="text"
                    value={concorrência}
                    onChange={(e) => setConcorrência(e.target.value)}
                    placeholder="Ex: Concorrente X cobra 297 mas não dá bônus, Criativo Y usa story"
                    className="w-full bg-black/60 border border-white/5 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/30"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Objetivos Estratégicos Principais</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {[
                      { id: "conversao", label: "Aumentar Conversão" },
                      { id: "criativos", label: "Melhorar Criativos" },
                      { id: "escala", label: "Escalar Vendas" },
                      { id: "nova_oferta", label: "Criar Nova Oferta" }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setObjective(btn.id as any)}
                        className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition duration-200 ${
                          objective === btn.id
                            ? "bg-amber-500/10 border-amber-500 text-amber-500"
                            : "bg-black/60 border-white/5 hover:border-white/10 text-neutral-450 text-neutral-400"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="border border-white/15 hover:border-white/20 text-neutral-305 text-neutral-300 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>

            <button
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Salvar e Avançar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
