import React from "react";
import { 
  Coins, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  HelpCircle,
  TrendingDown,
  LineChart,
  UserCheck,
  Zap,
  Check
} from "lucide-react";
import { UserProfile } from "../types";

interface CreditsPanelProps {
  user: UserProfile | null;
  onUpgrade: (amount: number, planName: string) => Promise<void>;
  loading: boolean;
}

export default function CreditsPanel({ user, onUpgrade, loading }: CreditsPanelProps) {
  const plans = [
    {
      name: "Starter",
      credits: 100,
      price: "R$ 49",
      period: "/mês",
      desc: "Ideal para testadores e validadores de ofertas rápidas no mercado digital.",
      features: [
        "Acesso à Mesa de Especialistas",
        "Até 3 projetos ativos salvos",
        "Análise básica de headlines & ofertas",
        "Suporte por e-mail",
      ],
      badge: "Iniciante",
      buttonText: "Assinar Starter",
      accent: "border-slate-800 bg-slate-900/10 text-slate-400",
      btnStyle: "border border-slate-700 hover:border-slate-600 text-slate-300",
      amountToAdd: 100
    },
    {
      name: "Pro",
      credits: 350,
      price: "R$ 97",
      period: "/mês",
      desc: "Inclusão de todos os 12 especialistas em marketing, geradores de VSLs e funis.",
      features: [
        "Acesso completo a todos os 12 especialistas",
        "Análises de VSL e Roteiros ilimitadas",
        "Módulo RAG de Conhecimento ativado",
        "Exportador de prompts para Lovable",
        "Prioridade em novas integrações de APIs",
      ],
      badge: "Popular (Foco)",
      buttonText: "Comprar / Simular Pro",
      accent: "border-amber-500/50 bg-amber-500/5 text-amber-400",
      btnStyle: "bg-amber-500 hover:bg-amber-605 text-slate-950 font-bold",
      amountToAdd: 350
    },
    {
      name: "Agency",
      credits: 1000,
      price: "R$ 197",
      period: "/mês",
      desc: "Para agências, copywriters profissionais e equipes de lançadores premium.",
      features: [
        "1.000 créditos incluídos mensais",
        "Análises prioritárias com latência mínima",
        "Projetos e pastas estruturadas ilimitadas",
        "Opções whitelabel de relatórios em PDF",
        "Suporte preferencial por WhatsApp 24/7",
      ],
      badge: "Alta Performance",
      buttonText: "Simular Agency Turbo",
      accent: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
      btnStyle: "border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 font-bold",
      amountToAdd: 1000
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Intro Header */}
      <div className="space-y-1">
        <span className="text-[10px] bg-zinc-900 border border-white/5 text-amber-500 px-2.5 py-0.5 rounded-lg font-mono font-bold uppercase tracking-wider">PREÇOS E ASSINATURA</span>
        <h2 className="font-display font-light text-2xl text-white flex items-center gap-2">
          <Coins className="w-6 h-6 text-amber-500 animate-pulse" /> Planos de Assinatura & Consumo de Créditos
        </h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Fatura baseada no valor que cada módulo gera. Adicione tokens em segundos para expandir seus testes estratégicos de marketing.
        </p>
      </div>

      {/* Credit usage summary banner */}
      <div className="p-5 rounded-xl border border-white/5 bg-zinc-950/40 backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono text-neutral-400">
        <div className="p-3 bg-black/40 rounded-xl border border-white/5">
          <span className="text-amber-500 font-bold font-mono">10 CRÉDITOS:</span>
          <p className="text-neutral-300 text-[11px] mt-1 font-sans">Análise da Mesa de Especialistas IA</p>
        </div>
        <div className="p-3 bg-black/40 rounded-xl border border-white/5">
          <span className="text-amber-500 font-bold font-mono">20 CRÉDITOS:</span>
          <p className="text-neutral-300 text-[11px] mt-1 font-sans">Geração de Páginas e Copy Completa</p>
        </div>
        <div className="p-3 bg-black/40 rounded-xl border border-white/5">
          <span className="text-emerald-400 font-bold font-mono">0 CRÉDITOS:</span>
          <p className="text-neutral-300 text-[11px] mt-1 font-sans">Adição de Conhecimento RAG</p>
        </div>
        <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-neutral-400 font-bold font-sans">SEU SALDO ATUAL:</span>
            <p className="text-white text-sm font-black mt-0.5 font-mono">{user?.credits} cr</p>
          </div>
          <Zap className="w-5 h-5 text-amber-500 animate-bounce" />
        </div>
      </div>

      {/* Plans comparison list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {plans.map((plan) => {
          const isUserPlan = user?.plan.toLowerCase() === plan.name.toLowerCase();
          // Custom treatment for plans
          const isPro = plan.name === "Pro";
          const premiumBorder = isPro ? "border border-amber-500/30 shadow-lg shadow-amber-500/2 bg-zinc-950/50" : "border border-white/5 bg-zinc-950/40";
          return (
            <div 
              key={plan.name}
              className={`p-6 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-white/10 transition duration-200 ${premiumBorder}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-medium text-lg text-white">{plan.name}</h3>
                    <span className="text-[10px] font-mono text-neutral-400 block mt-0.5 leading-relaxed">{plan.desc}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-lg text-amber-500 shrink-0">
                    {plan.badge}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-2xl font-bold font-display text-white">{plan.price}</span>
                  <span className="text-xs text-neutral-500">{plan.period}</span>
                </div>

                {/* Tokens indicator */}
                <div className="p-2.5 rounded-xl bg-black/45 border border-white/5 text-xs font-mono flex items-center justify-between text-neutral-200">
                  <span>Créditos Inclusos:</span>
                  <span className="font-bold text-amber-500">{plan.credits}</span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
                  <span className="text-[10px] font-mono text-neutral-500 font-bold block uppercase tracking-wider">O QUE ESTÁ INCLUÍDO:</span>
                  <div className="space-y-2">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-neutral-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase activation simulation */}
              <button
                onClick={() => onUpgrade(plan.amountToAdd, plan.name as any)}
                disabled={loading}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isPro 
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold" 
                    : "border border-white/10 hover:border-white/20 text-neutral-200"
                }`}
              >
                {isUserPlan ? "Plano Ativo (Adicionar Crédito)" : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/20 text-xs text-neutral-500 leading-relaxed font-sans">
        <span className="font-semibold text-neutral-400">Nota sobre Cobranças:</span> Esta área de pagamentos é uma simulação de alta fidelidade ligada diretamente ao banco de dados no seu container local. Toda vez que você escolhe adquirir um plano ou adicionar créditos, o saldo é atualizado em tempo real na barra de navegação para que você possa continuar gerando e testando as comissões dos 12 Especialistas sem nenhum custo real de pagamento!
      </div>
    </div>
  );
}
