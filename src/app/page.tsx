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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { Publisher } from "@/features/social/components/publisher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { NextTasks } from "@/components/home/next-tasks";
import { ProjectGoalMonitor } from "@/components/home/project-goal-monitor";

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
      {/* 1. Dashboard Header - Pinned to Edges, No Centering */}
      <header className="shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-5 z-20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-sm font-black font-mono tracking-[0.2em] uppercase text-primary mb-0.5">Workspace Intelligence</h1>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-auto p-0 hover:bg-transparent group outline-none border-none ring-0 focus:ring-0">
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

          {/* LADO ESQUERDO (50%): ENGENHO DE EXECUÇÃO - Left Aligned, High Density */}
          <div className="w-1/2 h-full flex flex-col border-r border-border/30 bg-card/5">
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-10">
                <PermissionGuard role="ADMIN" fallback={
                  <div className="space-y-10">
                    {/* 1. Welcome Header - Left Aligned Title/Sub, Right Aligned Stats */}
                    <div className="flex items-end justify-between gap-6 pb-6 border-b border-border/30">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <h1 className="text-4xl font-black font-mono tracking-tighter uppercase">Foco no Fluxo</h1>
                          <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px] shadow-primary" />
                        </div>
                        <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] italic">Sua zona de execução elite na Flyprod.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(v => (
                            <div key={v} className="size-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                              <img src={`https://avatar.vercel.sh/${v}`} alt="" className="size-full object-cover" />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase">+12 ONLINE</span>
                      </div>
                    </div>

                    {/* 2. Tasks Grid (Next 2) */}
                    <NextTasks />

                    {/* 3. Strategy Header - Pinned Left */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Activity className="size-4 text-primary" />
                          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Monitor de Metas Estratégicas</h2>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black tracking-widest uppercase border-primary/20 text-primary">Status Global</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <ProjectGoalMonitor />
                      </div>
                    </div>
                  </div>
                }>
                  {/* Admin View: Full Management Dashboard on Left */}
                  <ManagementDashboard />
                </PermissionGuard>
              </div>
            </ScrollArea>
          </div>

          {/* LADO DIREITO (50%): PULSO DO WORKSPACE - High Density Feed */}
          <div className="w-1/2 h-full flex flex-col bg-background/30">
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px] shadow-primary" />
                    <h2 className="text-xs font-black font-mono tracking-[0.3em] uppercase text-muted-foreground">Atividades do Workspace</h2>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-black tracking-[0.2em] uppercase border-primary/20 text-primary">Ao Vivo</Badge>
                </div>

                <div className="space-y-8">
                  <Publisher />
                  <div className="bg-card/20 rounded-2xl border border-border/40 p-1">
                    <ActivityFeed />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

        </div>
      </main>
    </div>
  );
}
