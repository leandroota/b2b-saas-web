"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/store/use-app-store";
import {
    Bell, CheckCircle2, AlertTriangle, Clock, Zap,
    MessageSquare, TrendingUp, AlertCircle, FolderKanban,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type NotifCategory = "all" | "task" | "project" | "team";

interface Notification {
    id: string;
    category: Exclude<NotifCategory, "all">;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    title: string;
    body: string;
    time: Date;
    href?: string;
    avatarId?: string;
    read: boolean;
}

export function NotificationPanel() {
    const { tasks, projects, activities, currentUser } = useAppStore();
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<NotifCategory>("all");

    const notifications = useMemo((): Notification[] => {
        const list: Notification[] = [];

        // ── Derived from real store data ──────────────────────────────────

        // Tasks stuck in REVIEW
        tasks
            .filter(t => t.status === "REVIEW")
            .forEach(t => {
                const proj = projects.find(p => p.id === t.projectId);
                list.push({
                    id: `review_${t.id}`,
                    category: "task",
                    icon: AlertCircle,
                    iconColor: "text-blue-500",
                    iconBg: "bg-blue-500/10",
                    title: "Aguardando revisão",
                    body: `"${t.title}" está parada aguardando aprovação${proj ? ` em ${proj.name}` : ""}`,
                    time: new Date(Date.now() - 2 * 3600000),
                    href: `/projects/${t.projectId}`,
                    read: false,
                });
            });

        // Delayed projects
        projects
            .filter(p => p.health === "delayed")
            .slice(0, 2)
            .forEach((p, i) => {
                list.push({
                    id: `delayed_${p.id}`,
                    category: "project",
                    icon: AlertTriangle,
                    iconColor: "text-red-500",
                    iconBg: "bg-red-500/10",
                    title: "Projeto em atraso",
                    body: `${p.name} está abaixo do cronograma com ${p.completionRate}% concluído`,
                    time: new Date(Date.now() - (i + 1) * 5 * 3600000),
                    href: `/projects/${p.id}`,
                    read: false,
                });
            });

        // Task completed events from activity feed
        activities
            .filter(a => a.type === "TASK_COMPLETED")
            .slice(0, 2)
            .forEach(a => {
                list.push({
                    id: `act_${a.id}`,
                    category: "team",
                    icon: CheckCircle2,
                    iconColor: "text-emerald-500",
                    iconBg: "bg-emerald-500/10",
                    title: "Tarefa concluída",
                    body: `${a.user.name} ${a.content}`,
                    time: new Date(a.createdAt),
                    href: `/projects/${a.projectId}`,
                    avatarId: a.user.id,
                    read: false,
                });
            });

        // ── Illustrative mock examples ────────────────────────────────────

        // Someone assigned a task to you
        list.push({
            id: "mock_assigned",
            category: "task",
            icon: Zap,
            iconColor: "text-primary",
            iconBg: "bg-primary/10",
            title: "Tarefa atribuída a você",
            body: `Sarah Chen atribuiu "Implementar Rate Limit no Gateway" para você em Backend Scalability`,
            time: new Date(Date.now() - 28 * 60000),
            href: "/tasks",
            avatarId: "user_3",
            read: false,
        });

        // Task deadline today
        list.push({
            id: "mock_deadline",
            category: "task",
            icon: Clock,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-500/10",
            title: "Prazo vence hoje",
            body: `"Validar tokens JWT no Middleware" vence hoje às 18h — ainda em andamento`,
            time: new Date(Date.now() - 3 * 3600000),
            href: "/tasks",
            read: false,
        });

        // Mention in a comment
        list.push({
            id: "mock_mention",
            category: "team",
            icon: MessageSquare,
            iconColor: "text-violet-500",
            iconBg: "bg-violet-500/10",
            title: "Você foi mencionado",
            body: `Alex Rivera: "@${currentUser.name} pode dar uma olhada nessa implementação antes do deploy?"`,
            time: new Date(Date.now() - 90 * 60000),
            href: "/communities",
            avatarId: "user_2",
            read: false,
        });

        // Project milestone reached
        list.push({
            id: "mock_milestone",
            category: "project",
            icon: TrendingUp,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-500/10",
            title: "Marco atingido",
            body: `Marketing Q3 chegou a 88% — sprint final em andamento, entrega prevista para semana que vem`,
            time: new Date(Date.now() - 4.5 * 3600000),
            href: "/projects/proj_03",
            read: true,
        });

        // Team member finished a monitored task
        list.push({
            id: "mock_monitored_done",
            category: "team",
            icon: CheckCircle2,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-500/10",
            title: "Tarefa monitorada concluída",
            body: `Felipe Designer terminou "Redesign da tela de Onboarding" que você estava acompanhando`,
            time: new Date(Date.now() - 7 * 3600000),
            href: "/projects/p9",
            avatarId: "user_1",
            read: true,
        });

        // Project health changed (got worse)
        list.push({
            id: "mock_health_change",
            category: "project",
            icon: FolderKanban,
            iconColor: "text-orange-500",
            iconBg: "bg-orange-500/10",
            title: "Saúde do projeto alterada",
            body: `Legacy Migration saiu de "No Prazo" para "Em Risco" — apenas 5% concluído`,
            time: new Date(Date.now() - 11 * 3600000),
            href: "/projects/p11",
            read: true,
        });

        // Sort by time desc
        return list.sort((a, b) => b.time.getTime() - a.time.getTime());
    }, [tasks, projects, activities, currentUser.name]);

    const filtered = filter === "all" ? notifications : notifications.filter(n => n.category === filter);
    const unreadCount = notifications.filter(n => !n.read && !readIds.has(n.id)).length;

    function markAllRead() {
        setReadIds(new Set(notifications.map(n => n.id)));
    }

    function markRead(id: string) {
        setReadIds(prev => new Set([...prev, id]));
    }

    const TABS: { key: NotifCategory; label: string }[] = [
        { key: "all", label: "Todos" },
        { key: "task", label: "Tarefas" },
        { key: "project", label: "Projetos" },
        { key: "team", label: "Equipe" },
    ];

    return (
        <div className="w-[380px] flex flex-col max-h-[540px]">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                    <Bell className="size-3.5 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">Notificações</span>
                    {unreadCount > 0 && (
                        <span className="size-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                    >
                        Marcar todas
                    </button>
                )}
            </div>

            {/* ── Filter tabs ── */}
            <div className="flex items-center gap-1 px-3 pb-3 shrink-0">
                {TABS.map(tab => {
                    const count = tab.key === "all"
                        ? unreadCount
                        : notifications.filter(n => n.category === tab.key && !n.read && !readIds.has(n.id)).length;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={cn(
                                "h-6 px-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
                                filter === tab.key
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            )}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span className={cn(
                                    "size-3.5 rounded-full text-[8px] font-black flex items-center justify-center leading-none",
                                    filter === tab.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary"
                                )}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="w-full h-px bg-border/40 shrink-0" />

            {/* ── Notification list ── */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                {filtered.length === 0 && (
                    <div className="py-12 flex flex-col items-center gap-2">
                        <Bell className="size-8 text-muted-foreground/15" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                            Sem notificações
                        </p>
                    </div>
                )}

                {filtered.map(notif => {
                    const isRead = notif.read || readIds.has(notif.id);
                    return (
                        <div
                            key={notif.id}
                            onClick={() => markRead(notif.id)}
                            className={cn(
                                "flex gap-3 mx-2 px-3 py-3 rounded-xl transition-all cursor-pointer group relative",
                                isRead
                                    ? "hover:bg-muted/30"
                                    : "bg-primary/[0.04] hover:bg-primary/[0.08] border border-primary/10"
                            )}
                        >
                            {/* Unread indicator */}
                            {!isRead && (
                                <span className="absolute right-3 top-3.5 size-1.5 rounded-full bg-primary shrink-0" />
                            )}

                            {/* Icon / avatar */}
                            <div className={cn(
                                "size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 overflow-hidden",
                                notif.avatarId ? "" : notif.iconBg
                            )}>
                                {notif.avatarId ? (
                                    <Avatar className="size-8 rounded-xl">
                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${notif.avatarId}`} />
                                        <AvatarFallback className="text-[9px] font-black rounded-xl">{notif.title[0]}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <notif.icon className={cn("size-4", notif.iconColor)} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1 pr-4">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", notif.iconColor)}>
                                        {notif.title}
                                    </span>
                                    <span className="text-[9px] font-bold text-muted-foreground/30 shrink-0 whitespace-nowrap">
                                        {formatDistanceToNow(notif.time, { locale: ptBR, addSuffix: false })}
                                    </span>
                                </div>
                                <p className={cn(
                                    "text-[11px] font-medium leading-snug line-clamp-2",
                                    isRead ? "text-foreground/50" : "text-foreground/80"
                                )}>
                                    {notif.body}
                                </p>
                                {notif.href && (
                                    <Link
                                        href={notif.href}
                                        onClick={e => e.stopPropagation()}
                                        className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary/50 hover:text-primary transition-colors"
                                    >
                                        Ver →
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
