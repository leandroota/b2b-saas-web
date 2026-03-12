"use client";

import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";
import { ManagementDashboard } from "@/features/dashboard/components/management-dashboard";
import {
  LayoutDashboard,
  ChevronDown,
  Zap,
  Activity,
  FolderKanban,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { Publisher } from "@/features/social/components/publisher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { NextTasks } from "@/components/home/next-tasks";
import { ProjectGoalMonitor } from "@/components/home/project-goal-monitor";
import { Users, MoreHorizontal, Plus } from "lucide-react";

export default function Home() {
  const { projects } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full bg-background" />;

  return (
    <div className="flex flex-col h-full bg-background/50 overflow-hidden relative">
      {/* Unified Hub Header with Project Selector */}
      <header className="shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-4 z-20">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-sm font-black font-mono tracking-[0.2em] uppercase text-primary mb-0.5">Workspace Intelligence</h1>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-auto p-0 hover:bg-transparent group outline-none border-none ring-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black font-mono tracking-tighter uppercase group-hover:text-primary transition-colors">Vision Cockpit</span>
                      <ChevronDown className="size-5 ml-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 rounded-2xl border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl p-2 select-none" align="start">
                    <div className="px-3 py-2 border-b border-border/50 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selecione o Contexto</span>
                      <Badge variant="secondary" className="text-[8px] h-4">Alpha v1.2</Badge>
                    </div>
                    <DropdownMenuItem
                      onClick={() => router.push('/')}
                      className="rounded-xl py-3 gap-3 cursor-pointer group hover:bg-primary/10 transition-all font-bold text-xs uppercase tracking-tight"
                    >
                      <LayoutDashboard className="size-4 text-primary group-hover:scale-110 transition-transform" />
                      Overview Global
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 mx-2 my-2" />

                    <div className="px-3 py-1.5 mb-1">
                      <span className="text-[9px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em]">Seus Projetos</span>
                    </div>

                    {Object.values(projects as any).map((proj: any) => (
                      <DropdownMenuItem
                        key={proj.id}
                        className="rounded-xl py-3 gap-3 cursor-pointer group hover:bg-primary/5 transition-all"
                        onClick={() => router.push(`/projects/${proj.id === 'p1' ? 'proj_01' : proj.id === 'p2' ? 'proj_02' : 'proj_03'}`)}
                      >
                        <div className={`size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 ${proj.color || 'text-primary'}`}>
                          <FolderKanban className="size-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[11px] uppercase tracking-tighter group-hover:text-primary transition-colors">{proj.name}</span>
                          <span className="text-[8px] text-muted-foreground uppercase font-mono">{proj.status} • {proj.methodology}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
              <Zap className="size-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">82% Efficiency</span>
            </div>
            <Button variant="secondary" className="h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 border border-border/50">
              Relatórios Export
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex overflow-hidden">
          {/* Main Content Area: Dashboard & Exec Center */}
          <ScrollArea className="flex-1">
            <div className="max-w-[1600px] mx-auto p-8">
              <PermissionGuard role="ADMIN" fallback={
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-4xl font-black font-mono tracking-tighter uppercase">Foco no Fluxo</h1>
                        <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px] shadow-primary" />
                      </div>
                      <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] italic">Bem-vindo à elite produtiva da Flyprod.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(v => (
                          <div key={v} className="size-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                            <img src={`https://avatar.vercel.sh/${v}`} alt="" className="size-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">+12 ONLINE</span>
                    </div>
                  </div>

                  {/* Immediate Action: Next 2 Tasks */}
                  <NextTasks />

                  {/* Context Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="p-8 rounded-[2.5rem] border border-border/50 bg-card/10 backdrop-blur-sm space-y-4 hover:bg-card/20 transition-all group">
                      <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FolderKanban className="size-6 text-primary" />
                      </div>
                      <h3 className="font-bold font-mono uppercase tracking-tight">Estratégia</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tight font-medium">Acompanhe as entregas e discussões nos canais específicos onde você está alocado.</p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-border/50 bg-card/10 backdrop-blur-sm space-y-4 hover:bg-card/20 transition-all group">
                      <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="size-6 text-blue-500" />
                      </div>
                      <h3 className="font-bold font-mono uppercase tracking-tight">Comunicação</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tight font-medium">Pulso social centralizado. Reaja, comente e colabore em tempo real.</p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-border/50 bg-primary/5 backdrop-blur-sm space-y-4 hover:bg-primary/10 transition-all group relative overflow-hidden">
                      <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                        <Zap className="size-6 text-white" />
                      </div>
                      <h3 className="font-bold font-mono uppercase tracking-tight">Impacto</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-tight font-medium">Mantenha seu ritmo de entrega acima da média e suba no ranking do workspace.</p>
                      <div className="absolute -bottom-4 -right-4 size-24 bg-primary/5 rounded-full blur-3xl" />
                    </div>
                  </div>
                </div>
              }>
                <ManagementDashboard />
              </PermissionGuard>
            </div>
          </ScrollArea>

          {/* Combined Execution Hub & Social Pulse */}
          <aside className="w-[500px] shrink-0 border-l border-border/50 bg-card/5 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1">
                <div className="flex flex-col min-h-full">
                  {/* Execution Monitor Section */}
                  <div className="p-8 border-b border-border/30 bg-primary/5">
                    <ProjectGoalMonitor />
                  </div>

                  {/* Live Pulse Section */}
                  <div className="flex-1">
                    <div className="p-8 border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="size-4 text-primary" />
                        <h2 className="text-xs font-black font-mono tracking-widest uppercase text-primary">Live Workspace Pulse</h2>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter italic opacity-60">Merge de atividades de todos os seus projetos</p>
                    </div>

                    <PermissionGuard role="ADMIN">
                      <div className="px-8 py-4 bg-muted/5 border-b border-border/30">
                        <Publisher />
                      </div>
                    </PermissionGuard>

                    <div className="p-8">
                      <ActivityFeed />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
