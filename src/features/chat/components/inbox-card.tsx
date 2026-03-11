"use client";

import { MessageSquare, User, MoreHorizontal } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function InboxCard() {
    const { unreadCount, openMessaging, isMessagingOpen } = useAppStore();

    return (
        <button
            className={cn(
                "group relative w-full p-5 rounded-2xl flex flex-col gap-4 transition-all active:scale-[0.99] outline-none overflow-hidden border text-left",
                isMessagingOpen
                    ? "bg-secondary border-secondary shadow-[0_10px_30px_rgba(var(--secondary),0.3)]"
                    : "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:border-primary/40"
            )}
            onClick={openMessaging}
        >
            <div className="relative z-10 flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <MessageSquare className={cn(
                        "size-4",
                        isMessagingOpen ? "text-white" : "text-primary"
                    )} />
                    <span className={cn(
                        "text-[10px] font-black font-mono uppercase tracking-[0.2em]",
                        isMessagingOpen ? "text-white/80" : "text-primary/70"
                    )}>
                        Inbox Mensagens
                    </span>
                </div>

                {unreadCount > 0 && !isMessagingOpen && (
                    <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground animate-pulse border-2 border-background">
                        {unreadCount}
                    </div>
                )}
            </div>

            {/* Information "Leitura" section - Preview of last message */}
            <div className="relative z-10 flex items-center gap-3">
                <Avatar className="size-10 border-2 border-background shadow-sm">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">AL</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className={cn(
                            "text-xs font-bold font-mono uppercase truncate",
                            isMessagingOpen ? "text-white" : "text-foreground"
                        )}>
                            Ana Luiza
                        </p>
                        <span className={cn(
                            "text-[9px] font-mono",
                            isMessagingOpen ? "text-white/60" : "text-muted-foreground"
                        )}>
                            14:20
                        </span>
                    </div>
                    <p className={cn(
                        "text-[11px] leading-tight truncate mt-0.5 font-medium",
                        isMessagingOpen ? "text-white/80" : "text-muted-foreground"
                    )}>
                        John, você revisou os mocks de UI?
                    </p>
                </div>
            </div>

            {/* Background Decorative Element */}
            {!isMessagingOpen && (
                <div className="absolute -right-4 -top-4 size-20 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors" />
            )}
        </button>
    );
}
