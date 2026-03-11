"use client";

import Link from "next/link";
import {
    Home,
    FolderKanban,
    MessageSquare,
    Activity,
    BookText,
    Zap,
    Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from '@/store/use-app-store'; // Added useAppStore import

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FolderKanban, label: "Projetos", href: "/projects" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: Activity, label: "Feed", href: "/feed" },
    { icon: BookText, label: "Wiki", href: "/wiki" },
];

export function Sidebar() {
    const { toggleCopilot } = useAppStore(); // Destructure toggleCopilot

    return (
        <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col h-full shrink-0">
            {/* Workspace Header */}
            <div className="h-14 flex items-center px-4 border-b border-sidebar-border shrink-0">
                <div className="flex items-center gap-2 font-mono font-semibold text-sidebar-foreground">
                    <div className="size-6 rounded bg-primary/20 flex items-center justify-center text-primary">
                        Ac
                    </div>
                    Acme Corp
                </div>
            </div>

            {/* Primary Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <span
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <item.icon className="size-4" />
                            {item.label}
                        </span>
                    </Link>
                ))}

                <div className="pt-4 pb-2">
                    <div className="px-3 text-xs font-mono font-semibold text-sidebar-foreground/50 mb-2">
                        COPILOT
                    </div>
                    {/* Updated Copilot Button */}
                    <Button
                        variant="outline" // Changed variant
                        size="sm" // Changed size
                        className="w-full justify-start border-primary/20 text-primary hover:bg-primary/10 gap-2 font-medium" // Updated className
                        onClick={toggleCopilot} // Added onClick handler
                    >
                        <Zap className="h-4 w-4" /> {/* Changed icon to Zap */}
                        Activar Copilot {/* Changed text */}
                    </Button>
                </div>
            </nav>

            {/* User Footer */}
            <div className="p-3 border-t border-sidebar-border shrink-0">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                    <Avatar className="size-8 rounded-md">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                            JS
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate text-sidebar-foreground">
                            John Smith
                        </span>
                        <span className="text-xs truncate text-sidebar-foreground/50">
                            john@acme.com
                        </span>
                    </div>
                    <Settings className="size-4 text-sidebar-foreground/50" />
                </div>
            </div>
        </aside>
    );
}
