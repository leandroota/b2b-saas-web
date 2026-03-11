"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CopilotChat } from "@/features/copilot/components/copilot-chat";
import { MessagingDrawer } from "@/features/chat/components/messaging-drawer";
import { useAppStore } from "@/store/use-app-store";
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

                    {/* Global Interaction Sidebar (3rd Column) */}
                    {mounted && (
                        <aside
                            className={cn(
                                "absolute top-0 right-0 h-full w-[380px] border-l border-border bg-background z-20 flex flex-col shadow-[[-10px_0_30px_rgba(0,0,0,0.1)]] transition-transform duration-300 ease-in-out",
                                isVisible
                                    ? "translate-x-0"
                                    : "translate-x-full"
                            )}
                        >
                            {/* Render based on current open state or fallback to last active during exit */}
                            {renderedComponent === 'copilot' ? (
                                <CopilotChat />
                            ) : renderedComponent === 'messaging' ? (
                                <MessagingDrawer />
                            ) : null}
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
