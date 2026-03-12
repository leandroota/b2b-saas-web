"use client";

import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";
import { ManagementDashboard } from "@/features/dashboard/components/management-dashboard";
import {
  LayoutDashboard,
  ChevronDown,
  Zap,
  Activity,
  FolderKanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
                  <DropdownMenuTrigger className="h-auto p-0 hover:bg-transparent group outline-none">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black font-mono tracking-tighter uppercase group-hover:text-primary transition-colors">Vision Cockpit</span>
                      <ChevronDown className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 rounded-2xl border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl p-2" align="start">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Mudar Contexto</DropdownMenuLabel>
                    <DropdownMenuItem className="rounded-xl py-2.5 gap-3 cursor-pointer">
                      <LayoutDashboard className="size-4 text-primary" />
                      <span className="font-bold text-xs uppercase tracking-tight">Overview Global</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 mx-2 my-1.5" />
                    {Object.values(projects as any).map((proj: any) => (
                      <DropdownMenuItem
                        key={proj.id}
                        className="rounded-xl py-2.5 gap-3 cursor-pointer"
                        onClick={() => router.push(`/projects/${proj.id}`)}
                      >
                        <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FolderKanban className="size-3 text-primary" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-tight">{proj.name}</span>
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

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          <ManagementDashboard />
        </div>
      </main>
    </div>
  );
}
