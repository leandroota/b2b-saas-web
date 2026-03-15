"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore, UserRole } from "@/store/use-app-store";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/auth/permission-guard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Home,
    FolderKanban,
    LayoutDashboard,
    ListTodo,
    Users,
    Settings,
    Search,
    Bell,
    LogOut,
    UserCircle,
    ChevronRight,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/features/notifications/components/notification-panel";

const navItems: Array<{ icon: React.ElementType; label: string; href: string; role?: UserRole }> = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", role: "ADMIN" },
    { icon: FolderKanban, label: "Projetos", href: "/projects" },
    { icon: ListTodo, label: "Tarefas", href: "/tasks?tab=tasks" },
    { icon: Users, label: "Grupos", href: "/communities" },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, setUserRole, focusMode, toggleFocusMode } = useAppStore();

    const NavItem = ({ item }: { item: typeof navItems[number] }) => {
        const itemPath = item.href.split("?")[0];
        const isActive = pathname === itemPath || (itemPath !== "/" && pathname.startsWith(itemPath));
        return (
            <Link
                href={item.href}
                className={cn(
                    "flex flex-col items-center gap-0.5 px-3 sm:px-4 py-2 rounded-xl transition-all relative",
                    isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
            >
                <item.icon className={cn("size-5 transition-all", isActive && "text-primary")} />
                <span className={cn(
                    "hidden sm:block text-[9px] font-black uppercase tracking-widest transition-all",
                    isActive ? "text-primary" : "text-muted-foreground/70"
                )}>
                    {item.label}
                </span>
                {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-t-full" />
                )}
            </Link>
        );
    };

    return (
        <header className="h-14 shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center px-4 sm:px-6 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
                <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-black shadow-inner shadow-primary/10">
                    Fl
                </div>
                <span className="font-mono font-black text-sm uppercase tracking-tighter hidden sm:block">Flyproj</span>
            </Link>

            {/* Center Nav */}
            <nav className="flex-1 flex items-center justify-center gap-0.5">
                {navItems.map((item) =>
                    item.role ? (
                        <PermissionGuard key={item.href} role={item.role}>
                            <NavItem item={item} />
                        </PermissionGuard>
                    ) : (
                        <NavItem key={item.href} item={item} />
                    )
                )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                {/* Focus Mode Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFocusMode}
                    className={cn(
                        "hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                        focusMode
                            ? "bg-primary/10 text-primary hover:bg-primary/15"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Modo Foco"
                >
                    <Zap className={cn("size-3.5", focusMode && "fill-primary")} />
                    <span>Foco</span>
                </Button>

                <Button variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground hover:text-foreground">
                    <Search className="size-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="relative size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all focus:outline-none">
                        <Bell className="size-4" />
                        <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full animate-pulse" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="bottom"
                        align="end"
                        sideOffset={8}
                        className="p-0 rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                    >
                        <NotificationPanel />
                    </DropdownMenuContent>
                </DropdownMenu>

                <ModeToggle />

                {/* Profile dropdown */}
                <div className="ml-1 sm:ml-2 pl-2 sm:pl-3 border-l border-border/50 flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger className="relative rounded-full focus:outline-none group block">
                        <Avatar className="size-8 rounded-full border border-border/50 group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                            <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                            <AvatarFallback className="text-xs font-black">{currentUser.name?.[0] ?? "U"}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-background pointer-events-none" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        side="bottom"
                        align="end"
                        sideOffset={8}
                        className="w-64 rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-2"
                    >
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
            </div>
        </header>
    );
}
