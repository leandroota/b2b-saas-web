"use client";

import { useAppStore } from "@/store/use-app-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, FolderKanban, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentChatsWidget() {
    const { projects, openConversation } = useAppStore();

    // Derive the 5 "recent" chats (mix of some people and projects for high density)
    const recentItems = [
        { id: 'u1', name: 'Ana Luiza', type: 'person', context: 'Designer Sênior', avatar: 'https://avatar.vercel.sh/1', status: 'online' },
        { id: 'p1', name: 'Projeto Alpha', type: 'project', context: 'Sprint Alpha v2', color: 'text-primary' },
        { id: 'u2', name: 'Felipe Silva', type: 'person', context: 'Produtor Executivo', avatar: 'https://avatar.vercel.sh/2', status: 'online' },
        { id: 'p3', name: 'Marketing Q3', type: 'project', context: 'Campaign Launch', color: 'text-blue-500' },
        { id: 'u3', name: 'Sarah Chen', type: 'person', context: 'Líder de QA', avatar: 'https://avatar.vercel.sh/3', status: 'online' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MessageSquare className="size-4 text-primary" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-left">Conversas Recentes</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {recentItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => openConversation({
                            id: item.id,
                            type: item.type,
                            name: item.name,
                            context: item.context,
                            status: item.status,
                            avatar: item.avatar
                        })}
                        className="group flex items-center gap-3 p-3 rounded-2xl bg-card/30 border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer active:scale-[0.98]"
                    >
                        {item.type === 'person' ? (
                            <div className="relative">
                                <Avatar className="size-10 rounded-full border border-border/50">
                                    <AvatarImage src={item.avatar} />
                                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                                </Avatar>
                                {item.status === 'online' && (
                                    <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
                                )}
                            </div>
                        ) : (
                            <div className={cn(
                                "size-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center",
                                item.color
                            )}>
                                <FolderKanban className="size-5" />
                            </div>
                        )}

                        <div className="flex flex-col flex-1 min-w-0 text-left">
                            <span className="text-[11px] font-black uppercase tracking-tight group-hover:text-primary transition-colors">{item.name}</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{item.context}</span>
                        </div>

                        <div className="size-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <MessageSquare className="size-4 text-primary" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
