"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CopilotChat } from "@/features/copilot/components/copilot-chat";
import { MessagingDrawer } from "@/features/chat/components/messaging-drawer";
import { useAppStore } from "@/store/use-app-store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { isCopilotOpen, isMessagingOpen } = useAppStore();
    const shouldShow = isCopilotOpen || isMessagingOpen;

    // Track which component was last visible to keep it during slide-out
    const [renderedComponent, setRenderedComponent] = useState<'copilot' | 'messaging' | null>(null);

    useEffect(() => {
        if (shouldShow) {
            setMounted(true);
            setRenderedComponent(isCopilotOpen ? 'copilot' : 'messaging');
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setMounted(false);
                setRenderedComponent(null);
            }, 350); // Slightly longer than transition to be safe
            return () => clearTimeout(timer);
        }
    }, [shouldShow, isCopilotOpen, isMessagingOpen]);

    return (
        <div className="flex h-full w-full relative overflow-hidden bg-background">
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 relative">
                <Header />

                <div className="flex flex-1 overflow-hidden relative">
                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto bg-background/50 relative">
                        {children}
                    </main>

                    {/* Global Interaction Sidebar (3rd Column) - TRUE OVERLAY */}
                    <AnimatePresence>
                        {isVisible && (
                            <motion.div
                                drag
                                dragMomentum={false}
                                dragConstraints={{ top: 0, left: -1000, right: 0, bottom: 0 }}
                                initial={{ x: 440, opacity: 0, scale: 0.95 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: 440, opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className={cn(
                                    "fixed top-20 right-6 bottom-6 w-[420px] z-50",
                                    "bg-background border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]",
                                    "rounded-[2.5rem] overflow-hidden flex flex-col",
                                    "cursor-default active:cursor-grabbing"
                                )}
                            >
                                <div className="h-full flex flex-col relative">
                                    {/* Render based on current open state or fallback to last active during exit */}
                                    {renderedComponent === 'copilot' ? (
                                        <CopilotChat />
                                    ) : renderedComponent === 'messaging' ? (
                                        <MessagingDrawer />
                                    ) : null}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
