import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Sparkles, 
  BookOpen, 
  Coins, 
  Settings, 
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile | null;
  onOpenSettings: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, user, onOpenSettings }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "new-project", label: "Criar Nova Oferta", icon: PlusCircle },
    { id: "specialists", label: "Mesa de Especialistas", icon: Users },
    { id: "generation", label: "Relatório & Geração", icon: Sparkles },
    { id: "knowledge", label: "Base de Conhecimento", icon: BookOpen },
    { id: "credits", label: "Plano & Créditos", icon: Coins },
  ];

  return (
    <aside className="w-80 h-screen bg-black border-r border-white/5 flex flex-col justify-between text-neutral-100 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/5">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-light text-xl tracking-tight text-white">
              Oferta <span className="font-bold text-amber-500">Milionária</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500/80 font-bold">
              Mesa de Especialistas AI
            </span>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-500 px-3 mb-2 font-bold">
          Módulos Principais
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-amber-500/10 text-amber-500 font-semibold border-l-2 border-amber-500"
                  : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-amber-400" : "text-neutral-500"}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-amber-400/80" />}
            </button>
          );
        })}
      </nav>

      {/* Lovable Direct Workspace Box */}
      {user && user.lovableWorkspace && (
        <div className="mx-4 my-2 p-3.5 rounded-xl bg-zinc-900/40 border border-white/5">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5">
            <span>Lovable Workspace</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <a
            href={user.lovableWorkspace}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 font-medium truncate"
          >
            <span className="truncate max-w-[170px]">{user.lovableWorkspace}</span>
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          </a>
        </div>
      )}

      {/* User Footer Profile */}
      <div className="p-4 border-t border-white/5 bg-zinc-950/40 font-sans">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5">
                <User className="w-5 h-5 text-neutral-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-200 truncate pr-2">
                  {user.name}
                </h4>
                <p className="text-xs text-neutral-400 truncate">
                  {user.email}
                </p>
              </div>
              <button 
                onClick={onOpenSettings}
                className="p-1 px-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg text-neutral-300 transition-colors cursor-pointer"
                title="Configurações da Conta"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Credit Progress */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-white/5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-400 font-medium">Saldo de Créditos</span>
                <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" /> {user.credits}
                </span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (user.credits / 500) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-amber-500/70" /> Plano {user.plan}
                </span>
                <button
                  onClick={() => setCurrentTab("credits")}
                  className="text-[10px] text-amber-400 hover:underline font-bold"
                >
                  UPGRADE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-500">
            Carregando conta...
          </div>
        )}
      </div>
    </aside>
  );
}
