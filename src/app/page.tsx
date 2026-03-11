"use client";

import {
  ArrowRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { InboxCard } from "@/features/chat/components/inbox-card";
import { CopilotCard } from "@/features/copilot/components/copilot-card";
import { useAppStore } from "@/store/use-app-store";

export default function Home() {
  const { isCopilotOpen, isMessagingOpen, currentUser, projects, activities } = useAppStore();
  const isChatActive = isCopilotOpen || isMessagingOpen;

  // Filter projects based on role
  const displayedProjects = currentUser.role === 'ADMIN'
    ? projects
    : projects.filter(p => p.involvedMembers.includes(currentUser.email));

  // Filter activities for metrics (simulated)
  const displayedActivities = currentUser.role === 'ADMIN'
    ? activities
    : activities.filter(a => displayedProjects.some(p => p.id === a.projectId));

  return (
    <div className="flex h-full bg-background/50 overflow-hidden">
      {/* Main Column: Feed */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        {/* Workspace Header */}
        <div className="px-8 py-6 border-b border-border bg-background">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-mono font-bold tracking-tight text-foreground">
                Bom dia, {currentUser.name.split(' ')[0]}.
              </h2>
              <p className="text-muted-foreground mt-2 font-medium">
                O pulso do seu workspace em tempo real.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CreateProjectModal />
            </div>
          </div>
        </div>

        {/* Dynamic Activity Feed */}
        <div className="flex-1 overflow-hidden">
          <ActivityFeed />
        </div>
      </div>

      {/* Persistent Sidebar Slot to prevent layout jumps */}
      <div className="hidden xl:flex w-[380px] shrink-0 flex-col relative border-l border-border overflow-hidden">
        <aside className="absolute inset-0 flex flex-col bg-background p-8 space-y-8 overflow-y-auto animate-in fade-in duration-500">
          <h3 className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-muted-foreground">Insights Rápidos</h3>

          {/* Quick Metrics */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card/50 p-4 shadow-sm hover:bg-card transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-destructive/10 text-destructive rounded-lg group-hover:scale-110 transition-transform">
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bloqueios</p>
                  <h3 className="text-xl font-bold font-mono mt-0.5">
                    {displayedProjects.some(p => p.status === "Risco") ? "1" : "0"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-4 shadow-sm hover:bg-card transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tarefas Hoje</p>
                  <h3 className="text-xl font-bold font-mono mt-0.5">
                    {currentUser.role === 'ADMIN' ? '5' : '2'}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-4 shadow-sm hover:bg-card transition-all group border-l-4 border-l-primary">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-secondary text-secondary-foreground rounded-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Velocidade</p>
                  <h3 className="text-xl font-bold font-mono mt-0.5">
                    {currentUser.role === 'ADMIN' ? '+24%' : '+12%'}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold font-mono uppercase tracking-[0.2em] text-muted-foreground">Projetos Ativos</h3>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider hover:text-primary">Ver todos</Button>
            </div>
            <div className="space-y-2">
              {displayedProjects.map((project) => (
                <div key={project.name} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 cursor-pointer transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`size-2.5 rounded-full ${project.color} shadow-[0_0_8px] shadow-current/30`} />
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase tracking-tight text-foreground">{project.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{project.status}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Interaction Hub */}
          <div className="pt-6 border-t border-border mt-auto flex flex-col gap-3">
            <InboxCard />
            <CopilotCard />
          </div>
        </aside>
      </div>
    </div>
  );
}
