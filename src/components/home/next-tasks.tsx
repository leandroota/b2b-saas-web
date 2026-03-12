"use client";

import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function NextTasks() {
    const { tasks, projects, currentUser } = useAppStore();

    // Filter tasks for current user and not done
    const userTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'DONE');

    // Sort by priority logic: URGENT (0) > HIGH (1) > MEDIUM (2) > LOW (3)
    const priorityMap = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    const sortedTasks = [...userTasks].sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);

    const topTasks = sortedTasks.slice(0, 2);

    if (topTasks.length === 0) {
        return (
            <div className="p-8 rounded-3xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-3 bg-muted/5">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-sm uppercase tracking-tight">Tudo em dia!</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Não há tarefas urgentes pendentes no momento.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Foco Imediato</h3>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-primary hover:no-underline">
                    Ver Tudo
                    <ChevronRight className="size-3 ml-1" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topTasks.map((task, idx) => {
                    const project = projects.find(p => p.id === task.projectId);
                    const isUrgent = task.priority === 'URGENT';

                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "group relative p-5 rounded-[2rem] border transition-all duration-500 overflow-hidden",
                                isUrgent
                                    ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5 active:scale-[0.98]"
                                    : "bg-card/30 border-border/50 hover:border-primary/30 hover:bg-card/50"
                            )}
                        >
                            {isUrgent && (
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="size-1.5 rounded-full bg-primary animate-ping" />
                                </div>
                            )}

                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[8px] font-black uppercase tracking-widest px-2 h-4",
                                            isUrgent ? "bg-primary text-white border-transparent" : "border-primary/20 text-primary"
                                        )}
                                    >
                                        {task.priority}
                                    </Badge>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                                        {project?.name}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="font-bold text-xs uppercase leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {task.title}
                                    </h4>
                                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter italic">
                                        Story: {task.story || 'General Execution'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <Clock className="size-3 text-muted-foreground" />
                                    <span className="text-[10px] font-bold text-muted-foreground">AGORA</span>
                                </div>
                            </div>

                            {/* Background Glow for Urgent */}
                            {isUrgent && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
