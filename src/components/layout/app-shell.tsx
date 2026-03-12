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
                            <>
                                {/* Subtle Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => useAppStore.getState().closeMessaging()}
                                    className="fixed inset-0 bg-background/20 backdrop-blur-[2px] z-40"
                                />

                                <motion.aside
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className={cn(
                                        "fixed top-0 right-0 h-full w-[420px] border-l border-border bg-background z-50 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.2)]",
                                    )}
                                >
                                    {/* Render based on current open state or fallback to last active during exit */}
                                    {renderedComponent === 'copilot' ? (
                                        <CopilotChat />
                                    ) : renderedComponent === 'messaging' ? (
                                        <MessagingDrawer />
                                    ) : null}
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
