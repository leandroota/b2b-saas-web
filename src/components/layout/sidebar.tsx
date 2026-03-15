"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { ModeToggle } from "@/components/mode-toggle";
import {
    Home,
    FolderKanban,
    LayoutDashboard,
    ListTodo,
    Users,
    Settings,
    LogOut,
    UserCircle,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", role: "ADMIN" },
    { icon: FolderKanban, label: "Projetos", href: "/projects" },
    { icon: ListTodo, label: "Tarefas", href: "/tasks" },
    { icon: Users, label: "Grupos", href: "/communities" },
    { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, setUserRole } = useAppStore();
    const [expanded, setExpanded] = useState(false);

    return (
        <TooltipProvider delay={200}>
            <motion.aside
                animate={{ width: expanded ? 220 : 68 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="relative border-r border-sidebar-border bg-sidebar flex flex-col h-full shrink-0 items-center py-3 gap-1 overflow-visible"
            >
                {/* Floating toggle button */}
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 size-6 rounded-full bg-sidebar border border-sidebar-border shadow-md flex items-center justify-center text-sidebar-foreground/50 hover:text-primary hover:border-primary/40 transition-all"
                >
                    {expanded ? <ChevronLeft className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                </button>

                {/* Nav Items */}
                <nav className={cn("flex flex-col gap-1 flex-1 w-full", expanded ? "px-2" : "items-center")}>
                    {navItems.map((item: any) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        const navButton = expanded ? (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 h-11 rounded-2xl transition-all duration-150 cursor-pointer",
                                    isActive
                                        ? "bg-primary/15 text-primary"
                                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}>
                                    <item.icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.08 }}
                                        className="text-xs font-black uppercase tracking-wide truncate"
                                    >
                                        {item.label}
                                    </motion.span>
                                </div>
                            </Link>
                        ) : (
                            <Tooltip key={item.href}>
                                <TooltipTrigger>
                                    <Link href={item.href}>
                                        <div className={cn(
                                            "size-11 rounded-2xl flex items-center justify-center transition-all duration-150 cursor-pointer",
                                            isActive
                                                ? "bg-primary/15 text-primary"
                                                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        )}>
                                            <item.icon className={cn("size-5", isActive && "text-primary")} />
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-bold text-xs uppercase tracking-widest">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );

                        if (item.role) {
                            return (
                                <PermissionGuard key={item.href} role={item.role}>
                                    {navButton}
                                </PermissionGuard>
                            );
                        }

                        return navButton;
                    })}
                </nav>

                {/* Bottom actions */}
                <div className={cn("flex flex-col gap-2 shrink-0 w-full", expanded ? "px-2" : "items-center")}>

                    {/* Mode toggle */}
                    {expanded ? (
                        <div className="flex items-center gap-3 px-3 h-10">
                            <ModeToggle />
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.08 }}
                                className="text-xs font-black uppercase tracking-wide text-sidebar-foreground/60"
                            >
                                Tema
                            </motion.span>
                        </div>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger>
                                <ModeToggle />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-bold text-xs uppercase tracking-widest">
                                Tema
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        {expanded ? (
                            <DropdownMenuTrigger className="flex items-center gap-3 px-3 h-12 rounded-2xl hover:bg-sidebar-accent transition-all w-full focus:outline-none group">
                                <div className="relative shrink-0">
                                    <Avatar className="size-8 border-2 border-transparent group-hover:border-primary/40 transition-all">
                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                        <AvatarFallback className="text-xs font-black bg-primary/10 text-primary">
                                            {currentUser.name?.[0] ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-sidebar pointer-events-none" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.08 }}
                                    className="min-w-0 flex-1 text-left"
                                >
                                    <p className="text-xs font-black uppercase tracking-tight truncate leading-tight">{currentUser.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate">{currentUser.jobTitle}</p>
                                </motion.div>
                                <ChevronRight className="size-3.5 text-muted-foreground/40 shrink-0" />
                            </DropdownMenuTrigger>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger>
                                    <DropdownMenuTrigger className="relative rounded-full focus:outline-none group block">
                                        <Avatar className="size-10 border-2 border-transparent group-hover:border-primary/40 transition-all ring-2 ring-transparent group-hover:ring-primary/10">
                                            <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                            <AvatarFallback className="text-xs font-black bg-primary/10 text-primary">
                                                {currentUser.name?.[0] ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-sidebar pointer-events-none" />
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-bold text-xs uppercase tracking-widest">
                                    Perfil
                                </TooltipContent>
                            </Tooltip>
                        )}

                        <DropdownMenuContent
                            side="right"
                            align="end"
                            sideOffset={8}
                            className="w-64 rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-2"
                        >
                            {/* Profile header */}
                            <div className="flex items-center gap-3 px-3 py-3 mb-1">
                                <Avatar className="size-12 border-2 border-border/50 shrink-0">
                                    <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                    <AvatarFallback className="text-sm font-black">{currentUser.name?.[0] ?? "U"}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-black uppercase tracking-tight truncate">{currentUser.name}</p>
                                    <p className="text-[11px] font-bold text-muted-foreground truncate">{currentUser.jobTitle}</p>
                                    <p className="text-[10px] text-muted-foreground/50 truncate">{currentUser.email}</p>
                                </div>
                            </div>

                            <DropdownMenuSeparator className="bg-border/50 my-1" />

                            <DropdownMenuItem
                                className="rounded-xl py-2.5 gap-3 cursor-pointer font-bold text-xs uppercase tracking-wide"
                                onClick={() => router.push('/tasks')}
                            >
                                <UserCircle className="size-4 text-primary" />
                                Ver Perfil Completo
                                <ChevronRight className="size-3.5 ml-auto text-muted-foreground/40" />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="rounded-xl py-2.5 gap-3 cursor-pointer font-bold text-xs uppercase tracking-wide"
                                onClick={() => router.push('/settings')}
                            >
                                <Settings className="size-4 text-muted-foreground" />
                                Configurações
                                <ChevronRight className="size-3.5 ml-auto text-muted-foreground/40" />
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-border/50 my-1" />

                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                                    Papel: {currentUser.role}
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => setUserRole(currentUser.role === 'ADMIN' ? 'MEMBER' : 'ADMIN')}
                                    className="rounded-xl py-2 gap-3 cursor-pointer font-bold text-[10px] uppercase tracking-wide text-muted-foreground"
                                >
                                    <Users className="size-4" />
                                    Trocar para {currentUser.role === 'ADMIN' ? 'Member' : 'Admin'}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="bg-border/50 my-1" />

                            <DropdownMenuItem
                                variant="destructive"
                                className="rounded-xl py-2.5 gap-3 cursor-pointer font-bold text-xs uppercase tracking-wide"
                            >
                                <LogOut className="size-4" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </motion.aside>
        </TooltipProvider>
    );
}
