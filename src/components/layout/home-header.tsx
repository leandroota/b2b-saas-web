"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Home,
    FolderKanban,
    ListTodo,
    Users,
    Search,
    Bell,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FolderKanban, label: "Projetos", href: "/projects" },
    { icon: ListTodo, label: "Tarefas", href: "/tasks" },
    { icon: Users, label: "Grupos", href: "/communities" },
];

export function HomeHeader() {
    const pathname = usePathname();
    const { currentUser, focusMode, toggleFocusMode } = useAppStore();

    return (
        <header className="h-14 shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center px-4 sm:px-6 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-2 sm:mr-4">
                <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xs font-black shadow-inner shadow-primary/10">
                    Fl
                </div>
                <span className="font-mono font-black text-sm uppercase tracking-tighter hidden sm:block">Flyproj</span>
            </Link>

            {/* Center Nav */}
            <nav className="flex-1 flex items-center justify-center gap-0.5 sm:gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-3 sm:px-5 py-2 rounded-xl transition-all group relative",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            )}
                        >
                            <item.icon className={cn("size-5 transition-all", isActive && "text-primary")} />
                            {/* Label: oculto em mobile, visível em sm+ */}
                            <span className={cn(
                                "hidden sm:block text-[9px] font-black uppercase tracking-widest transition-all",
                                isActive ? "text-primary" : "text-muted-foreground/70"
                            )}>
                                {item.label}
                            </span>
                            {/* Active indicator — encosta na borda inferior do header */}
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-t-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                {/* Focus Mode toggle — só visível na home */}
                {pathname === "/" && (
                    <Button
                        variant="ghost"
                        size="icon"
                        title={focusMode ? "Sair do Modo Foco" : "Ativar Modo Foco"}
                        onClick={toggleFocusMode}
                        className={cn(
                            "size-9 rounded-xl transition-all",
                            focusMode
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Zap className={cn("size-4 transition-all", focusMode && "fill-primary")} />
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
                >
                    <Search className="size-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-xl text-muted-foreground hover:text-foreground relative"
                >
                    <Bell className="size-4" />
                    <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full" />
                </Button>

                <ModeToggle />

                <div className="ml-1 sm:ml-2 flex items-center gap-2 pl-2 sm:pl-3 border-l border-border/50">
                    <Avatar className="size-8 rounded-full border border-border/50 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                        <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                        <AvatarFallback className="text-xs font-black">{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
