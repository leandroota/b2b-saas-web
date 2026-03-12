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
  UserPlus
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
import { RecentChatsWidget } from "@/components/home/recent-chats-widget";
import { cn } from "@/lib/utils";

export default function Home() {
  const { projects } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pulseFilter, setPulseFilter] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full bg-background" />;

  return (
    <div className="flex flex-col h-full bg-background/50 overflow-hidden relative">
      {/* 1. Dashboard Header - Pinned to Edges, No Centering, Absolute Left Grid */}
      <header className="shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-6 z-20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black font-mono tracking-tighter uppercase">Foco no Fluxo</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] italic">Sua zona de execução elite na Flyprod.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-4 border-r border-border/30">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(v => (
                  <div
                    key={v}
                    onClick={() => useAppStore.getState().openConversation({
                      id: `u${v}`,
                      type: 'person',
                      name: v === 1 ? "Ana Luiza" : v === 2 ? "Felipe Silva" : "Sarah Chen",
                      context: v === 1 ? "Designer Sênior" : v === 2 ? "Produtor Executivo" : "Líder de QA",
                      status: 'online',
                      avatar: `https://avatar.vercel.sh/${v}`
                    })}
                    className="size-8 rounded-full border-2 border-background bg-muted overflow-hidden cursor-pointer hover:scale-110 hover:z-30 transition-all active:scale-95"
                  >
                    <img src={`https://avatar.vercel.sh/${v}`} alt="" className="size-full object-cover" />
                  </div>
                ))}
              </div>
              <span
                onClick={() => useAppStore.getState().openMessaging()}
                className="text-[10px] font-black text-muted-foreground uppercase cursor-pointer hover:text-primary transition-colors"
              >
                +12 ONLINE
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full border border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                title="Convidar Colaborador"
              >
                <UserPlus className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Button>
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

                    {/* 2. Tasks Grid (Next 2) */}
                    <NextTasks />

                    {/* 3. Execution & Strategy Feed */}
                    <div className="space-y-12">
                      <ProjectGoalMonitor />
                      <RecentChatsWidget />
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
                    <div className="flex flex-col">
                      <h2 className="text-[10px] font-black font-mono tracking-[0.3em] uppercase text-muted-foreground">Workspace Pulse</h2>
                      <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">Atividade Global</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-7 items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 hover:bg-primary/10 transition-all outline-none">
                      <Activity className="size-3 text-primary" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                        {pulseFilter === 'all' ? 'Todos os Projetos' : projects.find(p => p.id === pulseFilter)?.name || 'Projeto'}
                      </span>
                      <ChevronDown className="size-3 text-primary transition-transform" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl p-1">
                      <DropdownMenuItem
                        onClick={() => setPulseFilter('all')}
                        className={cn(
                          "rounded-lg py-2 gap-2 cursor-pointer font-bold text-[9px] uppercase tracking-wider",
                          pulseFilter === 'all' && "bg-primary/10 text-primary"
                        )}
                      >
                        <LayoutDashboard className="size-3" />
                        Todos os Projetos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/50 my-1" />
                      {projects.map((proj) => (
                        <DropdownMenuItem
                          key={proj.id}
                          onClick={() => setPulseFilter(proj.id)}
                          className={cn(
                            "rounded-lg py-2 gap-2 cursor-pointer font-bold text-[9px] uppercase tracking-wider",
                            pulseFilter === proj.id && "bg-primary/10 text-primary"
                          )}
                        >
                          <FolderKanban className="size-3" />
                          {proj.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-8">
                  <Publisher />
                  <div className="bg-card/20 rounded-2xl border border-border/40 p-1">
                    <ActivityFeed projectId={pulseFilter} />
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
