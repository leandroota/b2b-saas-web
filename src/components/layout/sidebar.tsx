"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { ModeToggle } from "@/components/mode-toggle";
import {
    Home,
    FolderKanban,
    MessageSquare,
    Activity,
    BookText,
    LayoutDashboard,
    Zap,
    Settings,
    Brain,
    Plus,
    ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PermissionGuard } from "@/components/auth/permission-guard";

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", role: 'ADMIN' },
    { icon: FolderKanban, label: "Projetos", href: "/projects" },
    { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCopilotOpen, toggleCopilot, currentUser, setUserRole, projects } = useAppStore();

    return (
        <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col h-full shrink-0">
            {/* Workspace Header */}
            <div className="h-14 flex items-center px-4 border-b border-sidebar-border shrink-0">
                <div className="flex items-center gap-2 font-mono font-semibold text-sidebar-foreground">
                    <div className="size-6 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px]">
                        Fl
                    </div>
                    Flyprod
                </div>
            </div>

            {/* Primary Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item: any) => {
                    const isActive = false; // Placeholder for actual router logic

                    const content = (
                        <div key={item.href} className="group flex flex-col">
                            <div className="flex items-center justify-between group/row">
                                <Link href={item.href} className="flex-1">
                                    <span
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                            "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                                        )}
                                    >
                                        <item.icon className="size-4" />
                                        {item.label}
                                    </span>
                                </Link>
                            </div>

                            {/* Nested Projects (Level 2) - Only for "Projetos" */}
                            {item.label === "Projetos" && (
                                <div className="mt-1 ml-7 flex flex-col space-y-0.5 border-l border-border/40 pl-2">
                                    {projects.map((proj) => (
                                        <Link key={proj.id} href={`/projects/${proj.id === 'p1' ? 'proj_01' : proj.id === 'p2' ? 'proj_02' : 'proj_03'}`}>
                                            <span className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-tight text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                                                <div className={cn("size-1.5 rounded-full", proj.color || "bg-primary")} />
                                                {proj.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );

                    if (item.role) {
                        return (
                            <PermissionGuard key={item.href} role={item.role}>
                                {content}
                            </PermissionGuard>
                        );
                    }

                    return content;
                })}
            </nav>

            {/* User Footer */}
            <div className="p-3 border-t border-sidebar-border shrink-0 space-y-3">
                {/* Role Switcher Test */}
                <div className="flex items-center justify-between px-3 py-1 bg-muted/30 rounded-lg">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cargo</span>
                    <select
                        className="bg-transparent text-[10px] font-bold uppercase focus:outline-none"
                        value={currentUser.role}
                        onChange={(e) => setUserRole(e.target.value as any)}
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                    </select>
                </div>

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
                    <ModeToggle />
                    <Settings className="size-4 text-sidebar-foreground/50 shrink-0" />
                </div>
            </div>
        </aside>
    );
}
