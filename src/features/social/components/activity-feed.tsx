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
    Link as LinkIcon,
    UserPlus,
    ShieldCheck,
    AlertCircle,
    TrendingUp,
    Plus,
    Rocket,
    ArrowUpRight,
    PlusCircle,
    Trophy,
    ThumbsUp,
    Repeat2
} from "lucide-react";
import { Activity, ActivityType } from "../lib/activity-schema";
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
        projectName: "Flyprod Dashboard",
        content: "concluiu a tarefa: 'Definir paleta de cores primária'",
        createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
        id: "act_2",
        userId: "user_2",
        userName: "Carla Product",
        type: "PROJECT_MEMBER_ADDED",
        projectName: "Flyprod Dashboard",
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
        projectName: "Flyprod Dashboard",
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
        default: return <Clock className="size-4 text-muted-foreground" />;
    }
};

interface ActivityFeedProps {
    projectId?: string | 'all';
}

export function ActivityFeed({ projectId = 'all' }: ActivityFeedProps) {
    const { currentUser, activities, projects } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter projects based on involvement for logic context
    const involvedProjectIds = projects
        .filter(p => p.involvedMembers.includes(currentUser.email))
        .map(p => p.id);

    // Filter activities based on role and projectId
    const displayedActivities = activities.filter(a => {
        // 1. Role-based visibility
        const isVisibleByRole = currentUser.role === 'ADMIN' || involvedProjectIds.includes(a.projectId);
        if (!isVisibleByRole) return false;

        // 2. Project-based filtering
        if (projectId && projectId !== 'all') {
            return a.projectId === projectId;
        }

        return true;
    });

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Feed Header */}
            <div className="py-6 border-b border-border bg-transparent">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold font-mono uppercase tracking-tight">Atividade do Workspace</h2>
                    <Badge variant="secondary" className="font-mono text-[10px] uppercase">Ao vivo</Badge>
                </div>

                {/* Stories/Status Row */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="size-14 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <PlusCircle className="size-5 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Seu Status</span>
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                            <div
                                onClick={() => useAppStore.getState().openConversation({
                                    id: `u${i + 10}`,
                                    type: 'person',
                                    name: `Membro ${i}`,
                                    context: i === 1 ? "Product Manager" : i === 2 ? "Analista de Dados" : "Suporte Técnico",
                                    status: 'online',
                                    avatar: `https://avatar.vercel.sh/${i + 10}`
                                })}
                                className="size-14 rounded-full p-0.5 border-2 border-primary cursor-pointer active:scale-95 transition-all hover:scale-105"
                            >
                                <Avatar className="size-full">
                                    <AvatarImage src={`https://avatar.vercel.sh/${i + 10}`} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Membro {i}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feed Content */}
            <ScrollArea className="flex-1">
                <div className="py-6 space-y-6">
                    {displayedActivities.map((activity) => (
                        <div key={activity.id} className="relative pl-8 group">
                            {/* Timeline Connector */}
                            <div className="absolute left-3 top-2 bottom-[-24px] w-px bg-border group-last:bg-transparent" />

                            {/* Activity Icon Node */}
                            <div className="absolute left-0 top-1.5 size-6 rounded-full bg-card border border-border flex items-center justify-center z-10 shadow-sm">
                                {getActivityIcon(activity.type as ActivityType)}
                            </div>

                            <Card className="border-border bg-card/50 hover:bg-card transition-all duration-300 group-hover:shadow-md">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-8 ring-2 ring-primary/10">
                                                <AvatarImage src={`https://i.pravatar.cc/100?u=${activity.user.id}`} />
                                                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-0.5">
                                                <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{activity.user.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{activity.user.role} • {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: ptBR })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {activity.type === 'DEPLOY' && (
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg">NOVO DEPLOY</Badge>
                                        )}
                                        {activity.type === 'BUG_FIX' && (
                                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg">BUG CORRIGIDO</Badge>
                                        )}
                                    </div>

                                    <div className="mt-4 text-xs font-medium leading-relaxed text-foreground/80 pl-11 border-l-2 border-primary/10 ml-4">
                                        {activity.content}
                                    </div>

                                    {/* Activity Contextual Assets (Stats, Code, etc.) */}
                                    {activity.type === 'DEPLOY' && (
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
                                            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover/deploy:opacity-100 group-hover/deploy:translate-x-1 group-hover/deploy:-translate-y-1 transition-all" />
                                        </div>
                                    )}

                                    {activity.type === 'BUG_FIX' && (
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
                                                id: activity.user.id,
                                                type: 'person',
                                                name: activity.user.name,
                                                context: `Discussão sobre: ${activity.content}`,
                                                status: 'online',
                                                avatar: `https://i.pravatar.cc/100?u=${activity.user.id}`
                                            })}
                                        >
                                            <MessageSquare className="size-3" />
                                            Comentar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
