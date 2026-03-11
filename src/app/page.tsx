"use client";

import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar"; // We'll keep the import for logic or if we want to refactor parts
import { Publisher } from "@/features/social/components/publisher";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { ExecutionInsights } from "@/features/dashboard/components/execution-insights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Target,
  Users,
  FileText,
  Calendar,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { currentUser, projects } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full bg-background" />;

  return (
    <div className="flex flex-col h-full bg-background/50 overflow-hidden">
      {/* 1. Integrated Premium Header */}
      <header className="shrink-0 border-b border-border bg-background px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
          {/* Project Identity */}
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-[1.25rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 ring-1 ring-white/10">
              <FolderKanban className="size-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black font-mono tracking-tighter uppercase">Projeto Alpha</h1>
                <Badge variant="outline" className="text-[8px] font-black tracking-widest px-1.5 h-4 bg-primary/5 border-primary/20 text-primary">SPRINT 12</Badge>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Users className="size-3 text-primary/60" /> 8 Membros</span>
                <span className="flex items-center gap-1.5"><FileText className="size-3 text-primary/60" /> 42 Docs</span>
                <span className="flex items-center gap-1.5 border-l border-border pl-3 text-primary"><Calendar className="size-3" /> Cronograma Ativo</span>
              </div>
            </div>
          </div>

          {/* Weekly Goals Widget (Horizontal) */}
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-6 px-6 py-3 rounded-2xl bg-muted/30 border border-border/50 relative overflow-hidden group">
            <div className="flex items-center gap-3 shrink-0">
              <div className="size-8 rounded-full bg-background flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Target className="size-4 text-primary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground w-20 leading-tight">Metas da Semana</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black font-mono">
                <span className="text-muted-foreground">TASKS FINALIZADAS</span>
                <span className="text-primary">82%</span>
              </div>
              <Progress value={82} className="h-1.5" />
            </div>
            <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Center Column: Social Pulse & Timeline */}
        <main className="flex-1 flex flex-col min-w-0 border-r border-border h-full overflow-hidden bg-card/5">
          <Publisher />

          <div className="flex-1 relative overflow-hidden">
            <ScrollArea className="h-full">
              <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
                <div className="flex items-center gap-3 px-4 mb-4">
                  <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px] shadow-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Postagens do Projeto</h3>
                </div>
                <ActivityFeed />
              </div>
            </ScrollArea>
          </div>
        </main>

        {/* 3. Right Column: Execution Intelligence */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden xl:block shrink-0 h-full"
        >
          <ExecutionInsights />
        </motion.div>
      </div>
    </div>
  );
}
