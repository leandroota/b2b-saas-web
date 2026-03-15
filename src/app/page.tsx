"use client";

import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { Publisher } from "@/features/social/components/publisher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    FolderKanban,
    CheckCircle2,
    Users,
    Activity,
    ChevronRight,
    TrendingUp,
    Zap,
    Calendar,
    Monitor,
    MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FLAT_AGENDA } from "@/features/communities/lib/agenda-mock";

// ─── Escala tipográfica WCAG-compliant ────────────────────────────────────────
// display-num : text-2xl font-black font-mono          → KPIs de destaque
// section-ttl : text-xs font-black uppercase tracking-[0.18em]  → título de widget (12px)
// item-title  : text-xs font-bold uppercase tracking-tight       → nome de item (12px)
// body        : text-xs font-medium leading-relaxed              → corpo legível (12px)
// meta        : text-[11px] font-bold uppercase tracking-widest  → info suplementar bold (11px)
// badge       : text-[10px] font-black uppercase tracking-widest → pills/badges curtos (10px)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Focus Mode View types ────────────────────────────────────────────────────
type FocusTask = {
    id: string;
    title: string;
    priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
    projectId: string;
    assigneeId: string;
    story?: string;
    dueDate?: string;
};
type FocusUser = { id: string; name: string; email: string; role: 'ADMIN' | 'MEMBER'; jobTitle?: string; };

// ─── Focus Mode View ─────────────────────────────────────────────────────────
function FocusModeView({ tasks, currentUser, toggleFocusMode }: {
    tasks: FocusTask[];
    currentUser: FocusUser;
    toggleFocusMode: () => void;
}) {
    const priorityConfig: Record<FocusTask['priority'], { label: string; className: string }> = {
        URGENT: { label: "Urgente", className: "bg-red-500/15 text-red-500 border-red-500/30" },
        HIGH:   { label: "Alta",    className: "bg-orange-500/15 text-orange-500 border-orange-500/30" },
        MEDIUM: { label: "Média",   className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" },
        LOW:    { label: "Baixa",   className: "bg-muted text-muted-foreground border-border" },
    };

    const orderMap: Record<FocusTask['priority'], number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const focusTasks = tasks
        .filter((t: FocusTask) => t.assigneeId === currentUser.id && t.status !== "DONE")
        .sort((a: FocusTask, b: FocusTask) => orderMap[a.priority] - orderMap[b.priority]);

    return (
        <motion.div
            key="focus-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 min-h-0 overflow-y-auto"
        >
            <div className="max-w-2xl mx-auto px-6 py-10">
                {/* Header do modo foco */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="size-4 text-primary fill-primary" />
                            <span className="text-xs font-black uppercase tracking-[0.18em] text-primary">Modo Foco</span>
                        </div>
                        <h2 className="text-xl font-black">
                            {focusTasks.length} {focusTasks.length === 1 ? "tarefa" : "tarefas"} pendentes
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            Boa tarde, {currentUser.name.split(" ")[0]}. Foco total.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFocusMode}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                        Sair do Foco
                    </Button>
                </div>

                {/* Lista de tarefas */}
                {focusTasks.length === 0 ? (
                    <div className="text-center py-20">
                        <CheckCircle2 className="size-12 mx-auto text-primary mb-3" />
                        <p className="text-sm font-black">Tudo em dia! ✨</p>
                        <p className="text-xs text-muted-foreground mt-1">Nenhuma tarefa pendente. Aproveite.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {focusTasks.map((task, i) => {
                            const cfg = priorityConfig[task.priority];
                            return (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.2 }}
                                >
                                    <Card className="border-border/50 bg-card rounded-2xl hover:border-primary/30 transition-colors group cursor-pointer">
                                        <CardContent className="px-4 py-3.5 flex items-start gap-3">
                                            {/* Checkbox visual */}
                                            <div className="mt-0.5 size-4 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary/50 transition-colors shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold leading-snug">{task.title}</p>
                                                {task.story && (
                                                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{task.story}</p>
                                                )}
                                                {task.dueDate && (
                                                    <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest mt-1">
                                                        Vence {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: ptBR })}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn("text-[10px] font-black uppercase tracking-widest shrink-0", cfg.className)}
                                            >
                                                {cfg.label}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── Widget wrapper ───────────────────────────────────────────────────────────
function Widget({
    title,
    icon: Icon,
    action,
    children,
    className,
    delay = 0,
}: {
    title: string;
    icon?: React.ElementType;
    action?: { label: string; href: string };
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay }}
        >
            <Card className={cn("border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden", className)}>
                <CardHeader className="px-4 pt-4 pb-3 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="size-3.5 text-primary" />}
                        {/* section-ttl: 12px */}
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-foreground/80">
                            {title}
                        </span>
                    </div>
                    {action && (
                        <Link href={action.href}>
                            {/* link interativo: 12px mínimo */}
                            <span className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-0.5">
                                {action.label}
                                <ChevronRight className="size-3" />
                            </span>
                        </Link>
                    )}
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const { projects, tasks, currentUser, communities, joinedCommunityIds, communityPosts, focusMode, toggleFocusMode } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <div className="h-full bg-background" />;

    // Project metrics
    const myProjects = currentUser.role === 'ADMIN'
        ? projects
        : projects.filter(p => p.involvedMembers.includes(currentUser.email));
    const onTime = myProjects.filter(p => p.health === 'on-time' || p.health === 'ahead').length;
    const delayed = myProjects.filter(p => p.health === 'delayed').length;
    const avgCompletion = myProjects.length
        ? Math.round(myProjects.reduce((s, p) => s + p.completionRate, 0) / myProjects.length)
        : 0;

    // Tasks
    const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'DONE');
    const urgentTasks = myTasks.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH').slice(0, 3);

    // Communities
    const joinedComms = communities.filter(c => joinedCommunityIds.includes(c.id));
    const discoverComms = communities.filter(c => !joinedCommunityIds.includes(c.id)).slice(0, 2);

    // Agenda — upcoming events from joined communities, sorted by date
    const upcomingAgenda = FLAT_AGENDA
        .filter(e => joinedCommunityIds.includes(e.communityId) && isFuture(e.date))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 2);
    const recentCommPosts = communityPosts
        .filter(p => joinedCommunityIds.includes(p.communityId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

    return (
        <div className="flex flex-col h-full bg-muted/30 overflow-hidden">
            <AnimatePresence mode="wait">
                {focusMode ? (
                    <FocusModeView
                        key="focus"
                        tasks={tasks}
                        currentUser={currentUser}
                        toggleFocusMode={toggleFocusMode}
                    />
                ) : (
                    <motion.div
                        key="normal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex-1 min-h-0 overflow-y-auto"
                    >
            <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-5">
                    {/*
                     * Layout responsivo:
                     *   < lg  (< 1024px) : só coluna central
                     *     lg  (1024px+)  : coluna esq + central
                     *     xl  (1280px+)  : todas as 3 colunas
                     */}
                    <div className="flex gap-5 items-start">

                        {/* ─── LEFT COLUMN — oculta em telas < lg ─── */}
                        <aside className="hidden lg:block w-[320px] shrink-0 sticky top-5 max-h-[calc(100vh-3.5rem)]">
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-3.5rem)] pt-1 -mt-1 pb-5 scrollbar-hide px-1 -mx-1">

                            {/* Profile card — compact */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut", delay: 0 }}
                            >
                                <Card className="border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
                                    <CardContent className="px-4 pt-4 pb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-12 rounded-full border-2 border-border/50 shrink-0">
                                                <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                                <AvatarFallback className="text-sm font-black">{currentUser.name?.[0] ?? "U"}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black uppercase tracking-tight truncate">{currentUser.name}</p>
                                                <p className="text-[11px] font-bold text-muted-foreground truncate">{currentUser.jobTitle}</p>
                                                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest truncate">{currentUser.email}</p>
                                            </div>
                                        </div>
                                        {currentUser.jobObjective && (
                                            <p className="text-xs text-muted-foreground/70 leading-relaxed mt-3 line-clamp-2">{currentUser.jobObjective}</p>
                                        )}
                                        <div className="grid grid-cols-3 gap-2 mt-3">
                                            <div className="p-2 rounded-xl bg-muted/40 text-center space-y-0.5">
                                                <p className="text-base font-black font-mono leading-none">{myProjects.length}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Projetos</p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-muted/40 text-center space-y-0.5">
                                                <p className="text-base font-black font-mono leading-none">{myTasks.length}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tarefas</p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-muted/40 text-center space-y-0.5">
                                                <p className="text-base font-black font-mono leading-none">{joinedComms.length}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Grupos</p>
                                            </div>
                                        </div>
                                        <Link href="/tasks">
                                            <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-[11px] font-black uppercase tracking-widest rounded-xl">
                                                Ver Perfil Completo
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Tasks widget */}
                            <Widget title="Foco Imediato" icon={Zap} action={{ label: "Ver tudo", href: "/tasks" }} delay={0.05}>
                                {urgentTasks.length === 0 ? (
                                    <div className="flex items-center gap-3 py-2 text-muted-foreground">
                                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                        <p className="text-xs font-bold uppercase tracking-wide">Tudo em dia!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 pt-1">
                                        {urgentTasks.map((task) => {
                                            const proj = projects.find(p => p.id === task.projectId);
                                            const isUrgent = task.priority === 'URGENT';
                                            return (
                                                <div
                                                    key={task.id}
                                                    className={cn(
                                                        "p-3 rounded-xl border transition-all cursor-pointer group",
                                                        isUrgent
                                                            ? "bg-primary/5 border-primary/20 hover:border-primary/40"
                                                            : "bg-muted/30 border-border/40 hover:border-border"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] font-black uppercase px-1.5 h-5 shrink-0",
                                                                isUrgent ? "bg-primary text-white border-transparent" : "border-primary/20 text-primary"
                                                            )}
                                                        >
                                                            {task.priority}
                                                        </Badge>
                                                        <span className="text-[11px] font-bold text-muted-foreground/60 uppercase truncate">{proj?.name}</span>
                                                    </div>
                                                    <p className="text-xs font-bold uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                                        {task.title}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Widget>

                            {/* Projects widget */}
                            <Widget title="Projetos" icon={FolderKanban} action={{ label: "Ver todos", href: "/projects" }} delay={0.1}>
                                {/* KPI row */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="p-2.5 rounded-xl bg-muted/50 text-center space-y-1">
                                        <p className="text-xl font-black font-mono leading-none">{myProjects.length}</p>
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Ativos</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                                        <p className="text-xl font-black font-mono text-emerald-500 leading-none">{onTime}</p>
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/70">Prazo</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-destructive/5 border border-destructive/20 text-center space-y-1">
                                        <p className="text-xl font-black font-mono text-destructive leading-none">{delayed}</p>
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-destructive/70">Atraso</p>
                                    </div>
                                </div>

                                {/* Completion bar */}
                                <div className="mb-4 space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Conclusão média</span>
                                        <span className="text-xs font-black font-mono text-primary">{avgCompletion}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${avgCompletion}%` }}
                                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                                            className="h-full bg-primary rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Project list */}
                                <div className="space-y-0.5 -mx-1">
                                    {myProjects.slice(0, 4).map((proj) => (
                                        <Link key={proj.id} href={`/projects/${proj.id}`}>
                                            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                                <div className={cn("size-2 rounded-full shrink-0", proj.color)} />
                                                <span className="text-xs font-bold uppercase tracking-tight truncate flex-1 group-hover:text-primary transition-colors">
                                                    {proj.name}
                                                </span>
                                                <span className="text-xs font-black font-mono text-muted-foreground">{proj.completionRate}%</span>
                                            </div>
                                        </Link>
                                    ))}
                                    {myProjects.length > 4 && (
                                        <Link href="/projects">
                                            <p className="text-xs font-bold uppercase tracking-widest text-center text-muted-foreground hover:text-primary transition-colors py-2">
                                                +{myProjects.length - 4} projetos
                                            </p>
                                        </Link>
                                    )}
                                </div>
                            </Widget>

                        </div>
                        </aside>

                        {/* ─── CENTER COLUMN: Feed ─── */}
                        <main className="flex-1 min-w-0 space-y-3">
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                            >
                                <Card className="border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
                                    <Publisher />
                                </Card>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                            >
                                <Card className="border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
                                    <ActivityFeed projectId="all" communityFilter="all" />
                                </Card>
                            </motion.div>
                        </main>

                        {/* ─── RIGHT COLUMN — oculta em telas < xl ─── */}
                        <aside className="hidden xl:block w-[320px] shrink-0 sticky top-5 max-h-[calc(100vh-3.5rem)]">
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-3.5rem)] pt-1 -mt-1 pb-5 scrollbar-hide px-1 -mx-1">

                            {/* My communities widget */}
                            {joinedComms.length > 0 && (
                                <Widget title="Seus Grupos" icon={Users} action={{ label: "Ver tudo", href: "/communities" }} delay={0.1}>
                                    <div className="space-y-0.5 pt-1 -mx-1">
                                        {joinedComms.map((comm) => {
                                            const lastPost = communityPosts
                                                .filter(p => p.communityId === comm.id)
                                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                                            return (
                                                <Link key={comm.id} href={`/communities/${comm.id}`}>
                                                    <div className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                                        <span className="text-xl shrink-0 mt-0.5">{comm.emoji}</span>
                                                        <div className="min-w-0 flex-1">
                                                            {/* item-title: 12px */}
                                                            <p className="text-xs font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                                                {comm.name}
                                                            </p>
                                                            {lastPost ? (
                                                                /* preview: 12px — conteúdo legível */
                                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                                    <span className="font-bold">{lastPost.userName.split(' ')[0]}:</span> {lastPost.content}
                                                                </p>
                                                            ) : (
                                                                /* meta: 11px */
                                                                <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                                                                    {comm.memberCount} membros
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </Widget>
                            )}

                            {/* Recent community posts widget */}
                            {recentCommPosts.length > 0 && (
                                <Widget title="Últimas Publicações" icon={Activity} delay={0.15}>
                                    <div className="space-y-3 pt-1">
                                        {recentCommPosts.map((post) => (
                                            <Link key={post.id} href={`/communities/${post.communityId}`}>
                                                <div className="group cursor-pointer space-y-1.5 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">{post.communityEmoji}</span>
                                                        {/* badge: 10px */}
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                            {post.communityName}
                                                        </span>
                                                        {/* meta: 11px — timestamp */}
                                                        <span className="text-[11px] font-medium text-muted-foreground/50 ml-auto shrink-0">
                                                            {mounted ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: false, locale: ptBR }) : ''}
                                                        </span>
                                                    </div>
                                                    {/* body: 12px — conteúdo legível */}
                                                    <p className="text-xs font-medium leading-relaxed text-foreground/70 line-clamp-2 group-hover:text-foreground transition-colors">
                                                        {post.content}
                                                    </p>
                                                    {/* meta: 11px */}
                                                    <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                        {post.userName.split(' ')[0]}
                                                        {post.likesCount > 0 && ` · ${post.likesCount} curtidas`}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </Widget>
                            )}

                            {/* Agenda widget */}
                            {upcomingAgenda.length > 0 && (
                                <Widget title="Agenda dos Grupos" icon={Calendar} action={{ label: "Ver tudo", href: "/tasks?tab=agenda" }} delay={0.18}>
                                    <div className="space-y-2 pt-1">
                                        {upcomingAgenda.map((ev) => (
                                            <Link key={ev.id} href={`/communities/${ev.communityId}`}>
                                                <div className="group flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                                    {/* Date block */}
                                                    <div className="shrink-0 w-9 flex flex-col items-center rounded-lg bg-primary/10 border border-primary/20 py-1 px-1">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/70 leading-none">
                                                            {format(ev.date, "MMM", { locale: ptBR })}
                                                        </span>
                                                        <span className="text-lg font-black font-mono text-primary leading-tight">
                                                            {format(ev.date, "d")}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors leading-snug">
                                                            {ev.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                                {ev.communityEmoji} {ev.communityName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            {ev.type === "online" ? (
                                                                <Monitor className="size-3 text-primary/50 shrink-0" />
                                                            ) : (
                                                                <MapPin className="size-3 text-orange-500/60 shrink-0" />
                                                            )}
                                                            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest truncate">
                                                                {ev.time} · {ev.duration}
                                                                {ev.type === "presencial" && ev.location ? ` · ${ev.location.split('·')[0].trim()}` : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </Widget>
                            )}

                            {/* Discover widget */}
                            {discoverComms.length > 0 && (
                                <Widget title="Descubra Grupos" icon={TrendingUp} action={{ label: "Explorar", href: "/communities" }} delay={0.2}>
                                    <div className="space-y-3 pt-1">
                                        {discoverComms.map((comm) => (
                                            <div key={comm.id} className="space-y-2 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-xl shrink-0">{comm.emoji}</span>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-black uppercase tracking-tight truncate">{comm.name}</p>
                                                        {/* meta: 11px */}
                                                        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{comm.memberCount} membros</p>
                                                    </div>
                                                </div>
                                                {/* body: 12px */}
                                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{comm.description}</p>
                                                <Link href={`/communities/${comm.id}`}>
                                                    {/* botão: 12px — elemento interativo */}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full h-8 text-xs font-bold uppercase tracking-wider rounded-lg border-primary/30 text-primary hover:bg-primary/5"
                                                    >
                                                        Ver Grupo
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </Widget>
                            )}

                        </div>
                        </aside>

                    </div>
                </div>
            </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
