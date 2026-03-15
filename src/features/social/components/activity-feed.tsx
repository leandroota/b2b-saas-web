"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Clock,
    CheckCircle2,
    MessageSquare,
    UserPlus,
    PlusCircle,
    Trophy,
    ThumbsUp,
    Rocket,
    ArrowUpRight,
    Users,
    Play,
    Zap,
    FolderKanban,
    HandHelping,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Activity, ActivityType } from "../lib/activity-schema";
import { CommunityPost } from "@/features/communities/lib/community-schema";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAppStore } from "@/store/use-app-store";

const MOCK_ACTIVITIES: Activity[] = [
    {
        id: "act_1",
        userId: "user_1",
        userName: "Felipe Designer",
        type: "TASK_COMPLETED",
        projectName: "Flyproj Dashboard",
        content: "concluiu a tarefa: 'Definir paleta de cores primária'",
        createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
        id: "act_2",
        userId: "user_2",
        userName: "Carla Product",
        type: "PROJECT_MEMBER_ADDED",
        projectName: "Flyproj Dashboard",
        content: "adicionou Robo Dev ao projeto",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: "act_3",
        userId: "user_3",
        userName: "Robo Dev",
        type: "TASK_CREATED",
        projectName: "Infra Alpha",
        content: "criou uma nova tarefa: 'Configurar CI/CD pipeline'",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        id: "act_4",
        userId: "user_1",
        userName: "Felipe Designer",
        type: "PROJECT_MILESTONE",
        projectName: "Flyproj Dashboard",
        content: "alcançou o marco: 'MVP UI Definido'",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
];

const getActivityIcon = (type: ActivityType) => {
    switch (type) {
        case "TASK_COMPLETED": return <CheckCircle2 className="size-4 text-green-500" />;
        case "TASK_CREATED": return <PlusCircle className="size-4 text-blue-500" />;
        case "PROJECT_MEMBER_ADDED": return <UserPlus className="size-4 text-purple-500" />;
        case "PROJECT_MILESTONE": return <Trophy className="size-4 text-yellow-500" />;
        case "TASK_UPDATED": return <Clock className="size-4 text-orange-500" />;
        case "COMMUNITY_POST": return <Users className="size-4 text-primary" />;
        default: return <Clock className="size-4 text-muted-foreground" />;
    }
};

type StoreActivity = {
    id: string;
    type: string;
    content: string;
    createdAt: string;
    projectId: string;
    user: { id: string; name: string; role: string };
};

type FeedItem =
    | { kind: 'activity'; data: StoreActivity; sortKey: number }
    | { kind: 'community'; data: CommunityPost; sortKey: number };

interface ActivityFeedProps {
    projectId?: string | 'all';
    communityFilter?: 'all' | 'communities-only' | string;
}

export function ActivityFeed({ projectId = 'all', communityFilter = 'all' }: ActivityFeedProps) {
    const { currentUser, activities, projects, communityPosts, joinedCommunityIds, teamStatus } = useAppStore();
    const [mounted, setMounted] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const myStatus = teamStatus.find(s => s.userId === currentUser.id);

    const involvedProjectIds = projects
        .filter(p => p.involvedMembers.includes(currentUser.email))
        .map(p => p.id);

    // Build merged feed
    const feedItems: FeedItem[] = [];

    // Add workspace activities (unless filtering to communities only)
    if (communityFilter !== 'communities-only') {
        const displayedActivities = (activities as StoreActivity[]).filter(a => {
            const isVisibleByRole = currentUser.role === 'ADMIN' || involvedProjectIds.includes(a.projectId);
            if (!isVisibleByRole) return false;
            if (projectId && projectId !== 'all') return a.projectId === projectId;
            return true;
        });

        displayedActivities.forEach(a => {
            feedItems.push({
                kind: 'activity',
                data: a,
                sortKey: new Date(a.createdAt).getTime(),
            });
        });
    }

    // Add community posts from joined communities (unless filtering to a specific project)
    if (projectId === 'all') {
        const relevantPosts = communityPosts.filter(p => {
            if (communityFilter === 'communities-only') return joinedCommunityIds.includes(p.communityId);
            if (communityFilter !== 'all') return p.communityId === communityFilter;
            return joinedCommunityIds.includes(p.communityId);
        });

        relevantPosts.forEach(p => {
            feedItems.push({
                kind: 'community',
                data: p,
                sortKey: new Date(p.createdAt).getTime(),
            });
        });
    }

    // Sort by recency descending
    feedItems.sort((a, b) => b.sortKey - a.sortKey);

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Feed Header */}
            <div className="py-6 border-b border-border bg-transparent px-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold font-mono uppercase tracking-tight">Atividade do Workspace</h2>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Acompanhamento de Fluxo em Tempo Real</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px] uppercase bg-primary/10 text-primary border-primary/20 animate-pulse px-3 py-1">Ao vivo</Badge>
                </div>

                {/* Stories/Status Row */}
                <div className="space-y-3">
                    <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
                        {/* My status bubble */}
                        <div className="flex flex-col items-center gap-2 shrink-0 w-[68px]">
                            {myStatus ? (
                                <button
                                    onClick={() => setSelectedStatus(selectedStatus === currentUser.id ? null : currentUser.id)}
                                    className="relative size-14 rounded-full p-0.5 border-2 border-emerald-500 cursor-pointer active:scale-95 transition-all hover:scale-105 focus:outline-none"
                                >
                                    <div className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-background z-10">
                                        <Zap className="size-2.5 text-white fill-white" />
                                    </div>
                                    <Avatar className="size-full">
                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                        <AvatarFallback className="text-xs font-black">{currentUser.name?.[0] ?? "U"}</AvatarFallback>
                                    </Avatar>
                                </button>
                            ) : (
                                <Link href="/tasks">
                                    <div className="size-14 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                        <PlusCircle className="size-5 text-muted-foreground" />
                                    </div>
                                </Link>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center leading-tight w-full truncate">
                                {myStatus ? "Você" : "Seu Status"}
                            </span>
                        </div>

                        {/* Team status bubbles */}
                        {teamStatus.filter(s => s.userId !== currentUser.id).map((status) => (
                            <div key={status.userId} className="flex flex-col items-center gap-2 shrink-0 w-[68px]">
                                <button
                                    onClick={() => setSelectedStatus(selectedStatus === status.userId ? null : status.userId)}
                                    className="relative size-14 rounded-full p-0.5 border-2 border-primary/60 cursor-pointer active:scale-95 transition-all hover:scale-105 hover:border-primary focus:outline-none"
                                >
                                    <div className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-background z-10 animate-pulse" />
                                    <Avatar className="size-full">
                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${status.userId}`} />
                                        <AvatarFallback className="text-xs font-black">{status.userName[0]}</AvatarFallback>
                                    </Avatar>
                                </button>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight w-full truncate">
                                    {status.userName.split(' ')[0]}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Inline expanded status card */}
                    <AnimatePresence>
                        {selectedStatus && (() => {
                            const s = teamStatus.find(st => st.userId === selectedStatus);
                            if (!s) return null;
                            const isMe = s.userId === currentUser.id;
                            const elapsed = mounted ? Math.round((Date.now() - new Date(s.startedAt).getTime()) / 60000) : 0;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: -6, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -6, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                                <Zap className="size-4 text-emerald-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <p className="text-xs font-black uppercase tracking-tight text-foreground">
                                                        {isMe ? "Você está trabalhando em:" : `${s.userName.split(' ')[0]} está trabalhando em:`}
                                                    </p>
                                                    <Badge variant="outline" className="text-[9px] font-mono px-1.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/5">
                                                        há {elapsed}min
                                                    </Badge>
                                                </div>
                                                <p className="text-sm font-black tracking-tight text-foreground/90 truncate">{s.taskTitle}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <FolderKanban className="size-3 text-muted-foreground" />
                                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{s.projectName}</span>
                                                </div>
                                            </div>
                                            {!isMe && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 shrink-0"
                                                    onClick={() => useAppStore.getState().openConversation({
                                                        id: s.userId,
                                                        type: 'person',
                                                        name: s.userName,
                                                        context: `Suporte em: ${s.taskTitle}`,
                                                        status: 'online',
                                                        avatar: `https://i.pravatar.cc/100?u=${s.userId}`,
                                                    })}
                                                >
                                                    <HandHelping className="size-3" />
                                                    Dar Suporte
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                </div>
            </div>

            {/* Feed Content */}
            <ScrollArea className="flex-1">
                <div className="py-6 px-6 space-y-6">
                    {feedItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                            <div className="text-3xl">🌊</div>
                            <p className="text-sm font-bold text-muted-foreground">Nenhuma atividade ainda</p>
                        </div>
                    )}

                    {feedItems.map((item) => {
                        if (item.kind === 'community') {
                            const post = item.data;
                            return (
                                <div key={post.id} className="relative pl-8 group">
                                    <div className="absolute left-3 top-8 bottom-[-18px] w-px bg-border group-last:bg-transparent" />
                                    <div className="absolute left-0 top-1.5 size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center z-10 shadow-sm">
                                        <Users className="size-3.5 text-primary" />
                                    </div>

                                    <Card className="border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all duration-300 group-hover:shadow-md">
                                        <CardContent className="p-4 space-y-3">
                                            {/* Community badge + author */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8 ring-2 ring-primary/10">
                                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${post.userId}`} />
                                                        <AvatarFallback>{post.userName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{post.userName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                {post.userRole} · {mounted ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR }) : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg shrink-0">
                                                    {post.communityEmoji} {post.communityName}
                                                </Badge>
                                            </div>

                                            <div className="text-xs font-medium leading-relaxed text-foreground/80 pl-11 border-l-2 border-primary/20 ml-4">
                                                {post.content}
                                            </div>

                                            {/* Media grid */}
                                            {post.mediaUrls && post.mediaUrls.length > 0 && (
                                                <div className={cn(
                                                    "grid gap-1.5 rounded-2xl overflow-hidden mt-1",
                                                    post.mediaUrls.length === 1 && "grid-cols-1",
                                                    post.mediaUrls.length === 2 && "grid-cols-2",
                                                    post.mediaUrls.length >= 3 && "grid-cols-2",
                                                )}>
                                                    {post.mediaUrls.map((url, idx) => (
                                                        <div key={idx} className={cn(
                                                            "relative rounded-xl overflow-hidden bg-muted/40 cursor-pointer group/media",
                                                            post.mediaUrls!.length === 1 ? "aspect-video" : "aspect-square",
                                                            post.mediaUrls!.length === 3 && idx === 0 && "col-span-2 aspect-video",
                                                        )}>
                                                            {post.mediaType === "video" ? (
                                                                <>
                                                                    <video src={url} className="w-full h-full object-cover opacity-80" />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/media:bg-black/30 transition-colors">
                                                                        <div className="size-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl">
                                                                            <Play className="size-6 text-white fill-white ml-1" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <img
                                                                    src={url}
                                                                    alt=""
                                                                    className="w-full h-full object-cover group-hover/media:scale-[1.02] transition-transform duration-500"
                                                                />
                                                            )}
                                                            {post.mediaUrls!.length > 4 && idx === 3 && (
                                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                    <span className="text-white text-xl font-black">+{post.mediaUrls!.length - 4}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1 pt-1 border-t border-primary/10 mt-2">
                                                <Button variant="ghost" size="icon-xs" className="h-7 w-auto px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                                                    <ThumbsUp className="size-3" />
                                                    {post.likesCount > 0 ? post.likesCount : 'Curtir'}
                                                </Button>
                                                <Button variant="ghost" size="icon-xs" className="h-7 w-auto px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                                                    <MessageSquare className="size-3" />
                                                    {post.commentsCount > 0 ? post.commentsCount : 'Comentar'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        }

                        // Workspace activity item
                        const activity = item.data;
                        return (
                            <div key={activity.id} className="relative pl-8 group">
                                <div className="absolute left-3 top-8 bottom-[-18px] w-px bg-border group-last:bg-transparent" />
                                <div className="absolute left-0 top-1.5 size-6 rounded-full bg-card border border-border flex items-center justify-center z-10 shadow-sm">
                                    {getActivityIcon(activity.type as ActivityType)}
                                </div>

                                <Card className="border-border bg-card/50 hover:bg-card transition-all duration-300 group-hover:shadow-md">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-8 ring-2 ring-primary/10">
                                                    <AvatarImage src={`https://i.pravatar.cc/100?u=${activity.user?.id}`} />
                                                    <AvatarFallback>{activity.user?.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-0.5">
                                                    <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{activity.user?.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {activity.user?.role ?? ''} · {mounted ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: ptBR }) : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {(activity.type as string) === 'DEPLOY' && (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg">NOVO DEPLOY</Badge>
                                            )}
                                            {(activity.type as string) === 'BUG_FIX' && (
                                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg">BUG CORRIGIDO</Badge>
                                            )}
                                        </div>

                                        <div className="mt-4 text-xs font-medium leading-relaxed text-foreground/80 pl-11 border-l-2 border-primary/10 ml-4">
                                            {activity.content}
                                        </div>

                                        {(activity.type as string) === 'DEPLOY' && (
                                            <div className="mt-4 ml-11 p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between group/deploy cursor-pointer hover:bg-muted/50 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                                                        <Rocket className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black font-mono uppercase text-foreground">v2.4.0-production-build</p>
                                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Pipeline finalizado com sucesso</p>
                                                    </div>
                                                </div>
                                                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover/deploy:opacity-100 transition-all" />
                                            </div>
                                        )}

                                        {(activity.type as string) === 'BUG_FIX' && (
                                            <div className="mt-4 ml-11 grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-1">
                                                    <p className="text-xl font-black font-mono text-emerald-500">428</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">Testes Passados</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center space-y-1">
                                                    <p className="text-xl font-black font-mono text-amber-500">0</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60">Bugs Críticos</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1 pt-1 border-t border-border/50 mt-2">
                                            <Button variant="ghost" size="icon-xs" className="h-7 w-auto px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                                                <ThumbsUp className="size-3" />
                                                Curtir
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                className="h-7 w-auto px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
                                                onClick={() => useAppStore.getState().openConversation({
                                                    id: activity.user?.id,
                                                    type: 'person',
                                                    name: activity.user?.name,
                                                    context: `Discussão sobre: ${activity.content}`,
                                                    status: 'online',
                                                    avatar: `https://i.pravatar.cc/100?u=${activity.user?.id}`
                                                })}
                                            >
                                                <MessageSquare className="size-3" />
                                                Comentar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
