"use client";

import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { Publisher } from "@/features/social/components/publisher";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { ExecutionInsights } from "@/features/dashboard/components/execution-insights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { currentUser, projects } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full bg-background" />;

  return (
    <div className="flex h-full bg-background/50 overflow-hidden">
      {/* 1. Left Column: Context & Navigation */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:block shrink-0 h-full"
      >
        <ProjectSidebar />
      </motion.div>

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
  );
}
