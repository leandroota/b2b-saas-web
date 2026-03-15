"use client";

import { useState, useMemo } from "react";
import {
    FolderKanban, AlertTriangle, CheckCircle2, TrendingUp, Zap,
    Users, MessageSquare, ArrowRight, Clock, Play, Filter,
    Send, ChevronDown, ExternalLink, MessagesSquare, Radio,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const healthConfig = {
    "on-time": { label: "No Prazo",   color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    "ahead":   { label: "Adiantado",  color: "text-blue-500",    bg: "bg-blue-500/10 border-blue-500/20" },
    "delayed": { label: "Atrasado",   color: "text-red-500",     bg: "bg-red-500/10 border-red-500/20" },
};

const priorityConfig = {
    URGENT: { label: "Urgente", color: "text-red-500",    bg: "bg-red-500/10 border-red-500/20" },
    HIGH:   { label: "Alta",    color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
    MEDIUM: { label: "Média",   color: "text-blue-500",   bg: "bg-blue-500/10 border-blue-500/20" },
    LOW:    { label: "Baixa",   color: "text-muted-foreground", bg: "bg-muted/30 border-border/40" },
};

type ProjectFilter = "all" | "delayed" | "ahead" | "on-time";

export function ManagementDashboard() {
    const { projects, tasks, teamStatus, currentUser, openMessaging, openConversation } = useAppStore();
    const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
    const [postText, setPostText] = useState("");
    const [postSent, setPostSent] = useState(false);

    /* ─── KPIs ─── */
    const activeProjects = projects.filter(p => p.completionRate < 100);
    const delayedProjects = projects.filter(p => p.health === "delayed");
    const criticalTasks = tasks.filter(t =>
        (t.priority === "URGENT" || t.priority === "HIGH") &&
        t.status !== "DONE"
    );
    const blockedTasks = tasks.filter(t => t.status === "REVIEW");

    /* ─── Filtered projects ─── */
    const filteredProjects = useMemo(() => {
        const base = activeProjects;
        if (projectFilter === "all") return base;
        return base.filter(p => p.health === projectFilter);
    }, [activeProjects, projectFilter]);

    /* ─── Top critical tasks (urgent/high, not done) ─── */
    const topCritical = useMemo(() =>
        tasks
            .filter(t => (t.priority === "URGENT" || t.priority === "HIGH") && t.status !== "DONE")
            .sort((a, b) => (a.priority === "URGENT" ? -1 : 1))
            .slice(0, 6),
        [tasks]
    );

    /* ─── Resolve assignee name from id ─── */
    function resolveAssignee(assigneeId: string | undefined): { name: string; id: string } | null {
        if (!assigneeId) return null;
        if (assigneeId === currentUser.id) return { name: currentUser.name, id: currentUser.id };
        const member = teamStatus.find(m => m.userId === assigneeId);
        if (member) return { name: member.userName, id: member.userId };
        return { name: assigneeId, id: assigneeId }; // fallback: show raw id
    }

    function handleSendPost() {
        if (!postText.trim()) return;
        setPostSent(true);
        setPostText("");
        setTimeout(() => setPostSent(false), 3000);
    }

    function handleChatWith(member: typeof teamStatus[number]) {
        openConversation({
            id: member.userId,
            name: member.userName,
            role: member.userRole,
            avatar: `https://i.pravatar.cc/100?u=${member.userId}`,
            lastMsg: "",
            time: "",
            unread: 0,
        });
    }

    return (
        <div className="p-6 xl:p-8 space-y-6 overflow-y-auto h-full">

            {/* ─── Page title ─── */}
            <div>
                <p className="text-[10px] font-black font-mono tracking-[0.2em] uppercase text-primary mb-0.5">Admin · Management Suite</p>
                <h1 className="text-2xl font-black font-mono tracking-tighter uppercase text-foreground">Visão Executiva</h1>
            </div>

            {/* ─── KPI row ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Projetos Ativos",
                        value: activeProjects.length,
                        sub: `${delayedProjects.length} em atraso`,
                        icon: FolderKanban,
                        accent: "text-primary",
                        bg: "bg-primary/5 border-primary/10",
                        alert: delayedProjects.length > 0,
                    },
                    {
                        label: "Tarefas Críticas",
                        value: criticalTasks.length,
                        sub: `Urgente + Alta prioridade`,
                        icon: AlertTriangle,
                        accent: "text-red-500",
                        bg: "bg-red-500/5 border-red-500/10",
                        alert: criticalTasks.length > 3,
                    },
                    {
                        label: "Aguardando Review",
                        value: blockedTasks.length,
                        sub: "tarefas em revisão",
                        icon: Clock,
                        accent: "text-amber-500",
                        bg: "bg-amber-500/5 border-amber-500/10",
                        alert: blockedTasks.length > 2,
                    },
                    {
                        label: "Time Ativo Agora",
                        value: teamStatus.length,
                        sub: "membros trabalhando",
                        icon: Radio,
                        accent: "text-emerald-500",
                        bg: "bg-emerald-500/5 border-emerald-500/10",
                        alert: false,
                    },
                ].map((kpi) => (
                    <Card key={kpi.label} className={cn("border relative overflow-hidden", kpi.bg)}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <kpi.icon className={cn("size-5", kpi.accent)} />
                                {kpi.alert && <span className="size-2 rounded-full bg-red-500 animate-pulse" />}
                            </div>
                            <p className="text-3xl font-black font-mono tracking-tighter">{kpi.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{kpi.label}</p>
                            <p className="text-[10px] text-muted-foreground/50 font-bold mt-0.5">{kpi.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ─── Main grid ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ── Project Health (2/3) ── */}
                <Card className="xl:col-span-2 border-border/50 bg-card/30">
                    <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Monitoramento</p>
                            <h2 className="text-sm font-black uppercase tracking-tight">Saúde dos Projetos</h2>
                        </div>
                        {/* Filter pills */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40">
                            {(["all", "delayed", "on-time", "ahead"] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setProjectFilter(f)}
                                    className={cn(
                                        "px-2.5 h-6 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                        projectFilter === f ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {f === "all" ? "Todos" : healthConfig[f as keyof typeof healthConfig]?.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="space-y-0.5">
                            {/* Table header */}
                            <div className="grid grid-cols-[2fr_1fr_1fr_100px_80px] gap-3 px-3 py-2">
                                {["Projeto", "Saúde", "Método", "Progresso", ""].map(h => (
                                    <span key={h} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{h}</span>
                                ))}
                            </div>
                            {filteredProjects.length === 0 && (
                                <p className="text-xs text-muted-foreground/40 text-center py-6 font-bold uppercase tracking-widest">Nenhum projeto</p>
                            )}
                            {filteredProjects.map(project => {
                                const health = healthConfig[project.health];
                                return (
                                    <div
                                        key={project.id}
                                        className="grid grid-cols-[2fr_1fr_1fr_100px_80px] gap-3 px-3 py-3 rounded-xl hover:bg-muted/30 transition-colors group items-center"
                                    >
                                        {/* Name */}
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={cn("size-7 rounded-lg flex items-center justify-center text-white shrink-0", project.color)}>
                                                <FolderKanban className="size-3.5" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                                {project.name}
                                            </span>
                                        </div>
                                        {/* Health */}
                                        <span className={cn("text-[10px] font-bold uppercase tracking-wide flex items-center gap-1", health.color)}>
                                            {project.health === "delayed" && <AlertTriangle className="size-3 shrink-0" />}
                                            {project.health === "ahead" && <TrendingUp className="size-3 shrink-0" />}
                                            {project.health === "on-time" && <CheckCircle2 className="size-3 shrink-0" />}
                                            {health.label}
                                        </span>
                                        {/* Methodology */}
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                                            {project.methodology ?? "—"}
                                        </span>
                                        {/* Progress */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full", project.health === "delayed" ? "bg-red-500/60" : "bg-primary")}
                                                    style={{ width: `${project.completionRate}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black font-mono shrink-0">{project.completionRate}%</span>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/projects/${project.id}`}>
                                                <button className="size-6 rounded-lg flex items-center justify-center hover:bg-primary/10 text-primary transition-colors">
                                                    <ExternalLink className="size-3" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Critical Tasks (1/3) ── */}
                <Card className="border-border/50 bg-card/30 flex flex-col">
                    <CardHeader className="px-5 pt-5 pb-3 space-y-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Atenção Imediata</p>
                        <h2 className="text-sm font-black uppercase tracking-tight">Tarefas Críticas</h2>
                        <p className="text-[10px] text-muted-foreground/50 font-bold">{topCritical.length} tarefas urgente / alta</p>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 space-y-2 overflow-y-auto scrollbar-hide" style={{ maxHeight: "calc(100% - 88px)" }}>
                        {topCritical.length === 0 && (
                            <div className="flex flex-col items-center py-8 gap-2">
                                <CheckCircle2 className="size-8 text-emerald-500/40" />
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">Tudo sob controle</p>
                            </div>
                        )}
                        {topCritical.map(task => {
                            const proj = projects.find(p => p.id === task.projectId);
                            const prio = priorityConfig[task.priority];
                            const assignee = resolveAssignee(task.assigneeId);
                            return (
                                <div key={task.id} className="p-3 rounded-xl border border-border/40 bg-background/40 hover:border-primary/20 transition-all group space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <Badge variant="outline" className={cn("text-[9px] font-black uppercase h-5 px-2 border", prio.bg, prio.color)}>
                                            {prio.label}
                                        </Badge>
                                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate">
                                            {proj?.name ?? "—"}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                        {task.title}
                                    </p>
                                    {/* Assignee row */}
                                    <div className="flex items-center gap-1.5">
                                        {assignee ? (
                                            <>
                                                <Avatar className="size-4 shrink-0">
                                                    <AvatarImage src={`https://i.pravatar.cc/100?u=${assignee.id}`} />
                                                    <AvatarFallback className="text-[8px] font-black">{assignee.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-[10px] font-bold text-muted-foreground/70 truncate">{assignee.name}</span>
                                            </>
                                        ) : (
                                            <Badge variant="outline" className="text-[9px] font-black uppercase border-amber-500/30 text-amber-500 bg-amber-500/10 h-4 px-1.5">
                                                Sem Responsável
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Link href={`/projects/${task.projectId}`} className="flex-1">
                                            <button className="w-full h-7 rounded-lg border border-border/50 text-[10px] font-black uppercase tracking-widest hover:bg-muted/40 hover:border-primary/20 transition-all flex items-center justify-center gap-1">
                                                <ExternalLink className="size-3" />
                                                Ver Tarefa
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                const member = assignee ? teamStatus.find(m => m.userId === assignee.id) : undefined;
                                                member ? handleChatWith(member) : openMessaging();
                                            }}
                                            className="h-7 px-3 rounded-lg border border-border/50 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:border-primary/20 text-primary transition-all flex items-center gap-1"
                                        >
                                            <MessageSquare className="size-3" />
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* ─── Bottom grid ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* ── Team Status ── */}
                <Card className="border-border/50 bg-card/30">
                    <CardHeader className="px-5 pt-5 pb-3 space-y-0 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Tempo Real</p>
                            <h2 className="text-sm font-black uppercase tracking-tight">Time em Ação</h2>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{teamStatus.length} ativos</span>
                        </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 space-y-2">
                        {teamStatus.length === 0 && (
                            <p className="text-xs text-muted-foreground/40 text-center py-6 font-bold uppercase tracking-widest">Nenhum membro ativo</p>
                        )}
                        {teamStatus.map(member => {
                            const elapsed = formatDistanceToNow(new Date(member.startedAt), { locale: ptBR, addSuffix: false });
                            return (
                                <div key={member.userId} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group">
                                    <div className="relative shrink-0">
                                        <Avatar className="size-9 border-2 border-border/50">
                                            <AvatarImage src={`https://i.pravatar.cc/100?u=${member.userId}`} />
                                            <AvatarFallback className="text-xs font-black">{member.userName[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-black uppercase tracking-tight truncate">{member.userName}</p>
                                        <p className="text-[10px] text-muted-foreground/60 font-bold truncate">{member.taskTitle}</p>
                                        <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest">{member.projectName} · {elapsed}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                            onClick={() => handleChatWith(member)}
                                            className="size-7 rounded-lg border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 text-primary transition-all"
                                            title="Abrir chat"
                                        >
                                            <MessageSquare className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* ── Quick Post to Mural ── */}
                <Card className="border-border/50 bg-card/30">
                    <CardHeader className="px-5 pt-5 pb-3 space-y-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Comunicação Rápida</p>
                        <h2 className="text-sm font-black uppercase tracking-tight">Publicar no Mural</h2>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 space-y-3">
                        <div className="flex items-start gap-3">
                            <Avatar className="size-8 shrink-0 mt-0.5">
                                <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                <AvatarFallback className="text-xs font-black">{currentUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <textarea
                                value={postText}
                                onChange={e => setPostText(e.target.value)}
                                placeholder="Compartilhe uma atualização com o time..."
                                className="flex-1 min-h-[100px] resize-none rounded-xl border border-border/50 bg-background/50 p-3 text-xs font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 h-7 px-3 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/20 hover:text-primary transition-all">
                                    <Users className="size-3" />
                                    Todo o Time
                                    <ChevronDown className="size-3" />
                                </button>
                            </div>
                            <AnimatePresence mode="wait">
                                {postSent ? (
                                    <motion.div
                                        key="sent"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        Publicado!
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="btn"
                                        onClick={handleSendPost}
                                        disabled={!postText.trim()}
                                        className="flex items-center gap-2 h-8 px-4 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Send className="size-3" />
                                        Publicar
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Quick shortcuts */}
                        <div className="pt-2 border-t border-border/40 flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">Ações rápidas:</span>
                            <button
                                onClick={() => openMessaging()}
                                className="flex items-center gap-1.5 h-6 px-2.5 rounded-lg bg-muted/40 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            >
                                <MessagesSquare className="size-3" />
                                Abrir Chat
                            </button>
                            <Link href="/communities">
                                <button className="flex items-center gap-1.5 h-6 px-2.5 rounded-lg bg-muted/40 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                                    <Users className="size-3" />
                                    Ver Grupos
                                </button>
                            </Link>
                            <Link href="/projects">
                                <button className="flex items-center gap-1.5 h-6 px-2.5 rounded-lg bg-muted/40 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                                    <FolderKanban className="size-3" />
                                    Projetos
                                </button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
