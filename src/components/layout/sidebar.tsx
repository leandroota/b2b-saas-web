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
    const { isSidebarCollapsed, toggleSidebar, currentUser, setUserRole, projects } = useAppStore();

    return (
        <aside className={cn(
            "border-r border-sidebar-border bg-sidebar flex flex-col h-full shrink-0 transition-all duration-300 relative group/sidebar",
            isSidebarCollapsed ? "w-20" : "w-64"
        )}>
            {/* Collapse Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 size-6 rounded-full border border-sidebar-border bg-sidebar flex items-center justify-center z-50 hover:bg-sidebar-accent hover:text-primary transition-all opacity-0 group-hover/sidebar:opacity-100 shadow-xl"
            >
                <ChevronRight className={cn("size-3 transition-transform duration-300", !isSidebarCollapsed && "rotate-180")} />
            </button>

            {/* Workspace Header */}
            <div className={cn(
                "h-14 flex items-center border-b border-sidebar-border shrink-0 transition-all",
                isSidebarCollapsed ? "justify-center" : "px-4"
            )}>
                <div className="flex items-center gap-2 font-mono font-semibold text-sidebar-foreground">
                    <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-black shadow-inner shadow-primary/10">
                        Fl
                    </div>
                    {!isSidebarCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Flyprod</span>}
                </div>
            </div>

            {/* Primary Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item: any) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                    const content = (
                        <div key={item.href} className="group flex flex-col">
                            <div className="flex items-center justify-between group/row">
                                <Link href={item.href} className="flex-1">
                                    <span
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                                            "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                            isActive && "bg-primary/10 text-primary font-bold",
                                            isSidebarCollapsed && "justify-center px-0"
                                        )}
                                    >
                                        <item.icon className={cn("size-5", isActive && "text-primary")} />
                                        {!isSidebarCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
                                    </span>
                                </Link>
                            </div>

                            {/* Nested Projects (Level 2) - Only for "Projetos" and NOT collapsed */}
                            {item.label === "Projetos" && !isSidebarCollapsed && (
                                <div className="mt-1 ml-7 flex flex-col space-y-0.5 border-l border-border/40 pl-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {projects.map((proj) => {
                                        const projPath = `/projects/${proj.id === 'p1' ? 'proj_01' : proj.id === 'p2' ? 'proj_02' : 'proj_03'}`;
                                        const isProjActive = pathname === projPath;

                                        return (
                                            <Link key={proj.id} href={projPath}>
                                                <span className={cn(
                                                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-tight transition-all",
                                                    isProjActive
                                                        ? "text-primary bg-primary/5"
                                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                )}>
                                                    <div className={cn(
                                                        "size-1.5 rounded-full",
                                                        proj.color || "bg-primary",
                                                        isProjActive && "ring-2 ring-primary/20 ring-offset-1 ring-offset-transparent"
                                                    )} />
                                                    {proj.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
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
            <div className={cn(
                "p-3 border-t border-sidebar-border shrink-0 space-y-3 transition-all",
                isSidebarCollapsed && "items-center px-2"
            )}>
                <div className={cn(
                    "flex items-center gap-3 rounded-xl transition-all cursor-pointer",
                    !isSidebarCollapsed ? "px-3 py-2 hover:bg-sidebar-accent" : "justify-center p-0 hover:text-primary"
                )}>
                    <Avatar className={cn("rounded-xl transition-all", isSidebarCollapsed ? "size-10" : "size-8")}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                            JS
                        </AvatarFallback>
                    </Avatar>
                    {!isSidebarCollapsed && (
                        <>
                            <div className="flex flex-col flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-sm font-medium truncate text-sidebar-foreground">
                                    John Smith
                                </span>
                                <span className="text-xs truncate text-sidebar-foreground/50">
                                    john@acme.com
                                </span>
                            </div>
                            <ModeToggle />
                            <Settings className="size-4 text-sidebar-foreground/50 shrink-0" />
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
