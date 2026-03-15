"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MessagingDrawer } from "@/features/chat/components/messaging-drawer";
import { useAppStore } from "@/store/use-app-store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageSquare, MessagesSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Last unread preview — mirrors the first unread in MOCK_DM_CONVS
const LAST_UNREAD = {
    id: "dm1",
    name: "Sarah Jordão",
    role: "UI Designer",
    avatar: "https://avatar.vercel.sh/sarah",
    lastMsg: "Obrigada pelo feedback no protótipo!",
    time: "10:45",
    unread: 2,
};

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    const [isVisible, setIsVisible] = useState(false);
    const { isMessagingOpen, openMessaging, openConversation, unreadCount } = useAppStore();

    useEffect(() => {
        if (isMessagingOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isMessagingOpen]);

    // Floating chat panel + FAB — rendered on all pages
    const floatingChat = (
        <>
            {/* Chat panel — bottom-right card */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        drag
                        dragMomentum={false}
                        dragConstraints={{ top: -400, left: -600, right: 0, bottom: 0 }}
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className={cn(
                            "fixed bottom-[5.5rem] right-6 h-[560px] w-[400px] z-50",
                            "bg-background border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]",
                            "rounded-[2rem] overflow-hidden flex flex-col",
                            "cursor-default active:cursor-grabbing"
                        )}
                    >
                        <MessagingDrawer />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB — floating chat preview card */}
            <AnimatePresence>
                {!isMessagingOpen && (
                    <motion.div
                        initial={{ y: 16, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 16, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 22, stiffness: 280 }}
                        className="fixed bottom-6 right-6 z-50 flex items-stretch rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-border/60 bg-background"
                    >
                        {/* Preview — click opens that conversation */}
                        <button
                            onClick={() => openConversation(LAST_UNREAD)}
                            className="flex items-center gap-3 pl-3 pr-4 py-3 hover:bg-muted/40 transition-colors group"
                        >
                            <div className="relative shrink-0">
                                <Avatar className="size-10 rounded-full border-2 border-border/50">
                                    <AvatarImage src={LAST_UNREAD.avatar} />
                                    <AvatarFallback className="text-xs font-black">{LAST_UNREAD.name[0]}</AvatarFallback>
                                </Avatar>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center border border-background">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="text-left min-w-0 max-w-[180px]">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                        {LAST_UNREAD.name}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground/50 font-bold shrink-0">{LAST_UNREAD.time}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground truncate">{LAST_UNREAD.lastMsg}</p>
                            </div>
                        </button>

                        {/* Divider */}
                        <div className="w-px bg-border/50 shrink-0" />

                        {/* Open inbox */}
                        <button
                            onClick={openMessaging}
                            className="px-4 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/40 transition-colors shrink-0"
                            title="Abrir todas as mensagens"
                        >
                            <MessagesSquare className="size-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    // All pages: global header + sidebar on inner pages
    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden bg-background">
            <Header />

            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 overflow-y-auto bg-background/50 relative">
                    {children}
                </main>
            </div>
            {floatingChat}
        </div>
    );
}
