"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CheckCircle2,
    PlusCircle,
    MessageSquare,
    UserPlus,
    Trophy,
    Clock,
    ExternalLink,
    ThumbsUp,
    Repeat2
} from "lucide-react";
import { Activity, ActivityType } from "../lib/activity-schema";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

export function ActivityFeed() {
    return (
        <div className="flex flex-col h-full bg-background/50">
            {/* Feed Header */}
            <div className="p-6 border-b border-border bg-background">
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
                            <div className="size-14 rounded-full p-0.5 border-2 border-primary cursor-pointer active:scale-95 transition-all">
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
                <div className="p-6 space-y-6">
                    {MOCK_ACTIVITIES.map((activity) => (
                        <div key={activity.id} className="relative pl-8 group">
                            {/* Timeline Connector */}
                            <div className="absolute left-3 top-2 bottom-[-24px] w-px bg-border group-last:bg-transparent" />

                            {/* Activity Icon Node */}
                            <div className="absolute left-0 top-1.5 size-6 rounded-full bg-card border border-border flex items-center justify-center z-10 shadow-sm">
                                {getActivityIcon(activity.type)}
                            </div>

                            <Card className="border-border bg-card/50 hover:bg-card transition-all duration-300 group-hover:shadow-md">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-8 border border-border">
                                                <AvatarImage src={`https://avatar.vercel.sh/${activity.userId}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold font-mono uppercase tracking-wide text-foreground">
                                                    {activity.userName}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                    <Clock className="size-3" />
                                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: ptBR })}
                                                </div>
                                            </div>
                                        </div>
                                        {activity.projectName && (
                                            <Badge variant="outline" className="text-[10px] font-mono h-5 bg-muted/20 border-border/50 text-muted-foreground">
                                                {activity.projectName}
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="text-sm leading-relaxed text-foreground/90">
                                        <span className="text-muted-foreground font-medium">{activity.content}</span>
                                    </p>

                                    <div className="flex items-center gap-1 pt-1 border-t border-border/50 mt-2">
                                        <Button variant="ghost" size="icon-xs" className="h-7 w-auto px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                                            <ThumbsUp className="size-3" />
                                            Curtir
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" className="h-7 w-auto px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                                            <MessageSquare className="size-3" />
                                            Comentar
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" className="h-7 w-auto px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                                            <Repeat2 className="size-3" />
                                            Republicar
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
