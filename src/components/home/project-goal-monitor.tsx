"use client";

import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function ProjectGoalMonitor() {
    const { projects, currentUser } = useAppStore();

    // Filter projects for members: only where they are involved
    // For admins: all projects
    const visibleProjects = (currentUser.role === 'ADMIN'
        ? projects
        : projects.filter(p => p.involvedMembers.includes(currentUser.email))).slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Target className="size-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Monitor de Metas</h3>
                </div>
                <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary uppercase h-5">
                    {visibleProjects.length} PROJETOS
                </Badge>
            </div>

            <div className="space-y-3">
                {visibleProjects.map((project, idx) => {
                    const isDelayed = project.health === 'delayed';
                    const isAhead = project.health === 'ahead';

                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-[11px] uppercase tracking-tighter group-hover:text-primary transition-colors">
                                        {project.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "text-[8px] font-bold px-1.5 h-4 uppercase tracking-tighter",
                                                isDelayed && "bg-destructive/10 text-destructive",
                                                isAhead && "bg-emerald-500/10 text-emerald-500",
                                                !isDelayed && !isAhead && "bg-primary/10 text-primary"
                                            )}
                                        >
                                            {project.health === 'ahead' ? 'Adiantado' : project.health === 'delayed' ? 'Atrasado' : 'No Prazo'}
                                        </Badge>
                                        <span className="text-[9px] font-mono text-muted-foreground uppercase">
                                            {project.methodology}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[11px] font-black font-mono text-primary">
                                    {project.completionRate}%
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${project.completionRate}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            isDelayed ? "bg-destructive" : isAhead ? "bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500/20" : "bg-primary shadow-[0_0_8px] shadow-primary/20"
                                        )}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <div className="flex items-center gap-1">
                                        <Clock className="size-2.5" />
                                        <span>ENTREGA EM 4D</span>
                                    </div>
                                    <span>SPRINT 12</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
