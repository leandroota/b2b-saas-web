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
          {/* Main Content Area: Dashboard */}
          <ScrollArea className="flex-1">
            <div className="max-w-[1400px] mx-auto">
              <PermissionGuard role="ADMIN" fallback={
                <div className="p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black font-mono tracking-tighter uppercase">Bem-vindo, Colaborador</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs italic">Você faz parte da elite produtiva da Flyprod.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 rounded-3xl border border-border/50 bg-card/10 backdrop-blur-sm space-y-4">
                      <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <FolderKanban className="size-6 text-primary" />
                      </div>
                      <h3 className="font-bold font-mono uppercase tracking-tight">Seus Projetos</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">Acompanhe as entregas e discussões nos canais específicos onde você está alocado.</p>
                    </div>
                    <div className="p-8 rounded-3xl border border-border/50 bg-card/10 backdrop-blur-sm space-y-4">
                      <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <MessageSquare className="size-6 text-blue-500" />
                      </div>
                      <h3 className="font-bold font-mono uppercase tracking-tight">Pulso Social</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">Fique por dentro das atualizações do time no feed à direita.</p>
                    </div>
                  </div>
                </div>
              }>
                <ManagementDashboard />
              </PermissionGuard>
            </div>
          </ScrollArea>

          {/* Social Hub Area: Global Feed */}
          <aside className="w-[450px] shrink-0 border-l border-border/50 bg-card/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="size-4 text-primary" />
                <h2 className="text-xs font-black font-mono tracking-widest uppercase text-primary">Live Workspace Pulse</h2>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter italic">Merge de atividades de todos os seus projetos</p>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <PermissionGuard role="ADMIN">
                <div className="px-6 py-4 bg-muted/5 border-b border-border/30">
                  <Publisher />
                </div>
              </PermissionGuard>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  <ActivityFeed />
                </div>
              </ScrollArea>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
