"use client";

import { useAppStore } from "@/store/use-app-store";
import { useState, useMemo } from "react";
import {
    FolderKanban, Star, MoreHorizontal, ArrowRight, Plus, Clock,
    Search, LayoutGrid, List, CheckCircle2, AlertTriangle, TrendingUp,
    Filter, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "closed";
type HealthFilter = "all" | "on-time" | "ahead" | "delayed";

const healthConfig = {
    "on-time": { label: "No Prazo", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
    "ahead":   { label: "Adiantado", color: "text-blue-500",    bg: "bg-blue-500/10 border-blue-500/20",    icon: TrendingUp },
    "delayed": { label: "Atrasado",  color: "text-red-500",     bg: "bg-red-500/10 border-red-500/20",      icon: AlertTriangle },
};

export default function ProjectsPage() {
    const { projects, currentUser } = useAppStore();
    const isAdmin = currentUser.role === "ADMIN";

    const [view, setView] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
    const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
    const [methodFilter, setMethodFilter] = useState("all");

    const baseProjects = isAdmin
        ? projects
        : projects.filter(p => p.involvedMembers.includes(currentUser.email));

    const filtered = useMemo(() => {
        return baseProjects.filter(p => {
            const isClosed = p.completionRate >= 100;
            if (statusFilter === "active" && isClosed) return false;
            if (statusFilter === "closed" && !isClosed) return false;
            if (healthFilter !== "all" && p.health !== healthFilter) return false;
            if (methodFilter !== "all" && p.methodology?.toUpperCase() !== methodFilter) return false;
            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [baseProjects, statusFilter, healthFilter, methodFilter, search]);

    const counts = useMemo(() => ({
        all: baseProjects.length,
        active: baseProjects.filter(p => p.completionRate < 100).length,
        closed: baseProjects.filter(p => p.completionRate >= 100).length,
    }), [baseProjects]);

    const methodologies = useMemo(() => {
        const methods = [...new Set(baseProjects.map(p => p.methodology).filter(Boolean))] as string[];
        return methods;
    }, [baseProjects]);

    return (
        <div className="flex flex-col h-full bg-background/50 overflow-hidden">
            {/* Header */}
            <header className="shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-5 z-20">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black font-mono tracking-[0.2em] uppercase text-primary mb-0.5">Workspace Directory</p>
                        <h1 className="text-2xl font-black font-mono tracking-tighter uppercase text-foreground">Projetos</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                <Star className="size-3.5 text-orange-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Admin</span>
                            </div>
                        )}
                        <Button className="gap-2 font-mono font-bold uppercase tracking-widest text-[10px] h-9 px-5 rounded-xl shadow-lg shadow-primary/20">
                            <Plus className="size-4" />
                            Novo Projeto
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar projeto..."
                            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/60 bg-background/50 text-xs font-bold placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                    </div>

                    {/* Status tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40">
                        {([["all", "Todos", counts.all], ["active", "Ativos", counts.active], ["closed", "Encerrados", counts.closed]] as const).map(([val, label, count]) => (
                            <button
                                key={val}
                                onClick={() => setStatusFilter(val)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 h-7 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === val
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {label}
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-full font-black",
                                    statusFilter === val ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                                )}>{count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Health filter */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40">
                        <button
                            onClick={() => setHealthFilter("all")}
                            className={cn("px-3 h-7 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", healthFilter === "all" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >Todos</button>
                        {(["on-time", "ahead", "delayed"] as const).map(h => (
                            <button
                                key={h}
                                onClick={() => setHealthFilter(h)}
                                className={cn(
                                    "px-3 h-7 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    healthFilter === h ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {healthConfig[h].label}
                            </button>
                        ))}
                    </div>

                    {/* Methodology filter — admin only */}
                    {isAdmin && methodologies.length > 0 && (
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40">
                            <button
                                onClick={() => setMethodFilter("all")}
                                className={cn("px-3 h-7 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", methodFilter === "all" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >Método</button>
                            {methodologies.map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMethodFilter(m.toUpperCase())}
                                    className={cn(
                                        "px-3 h-7 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        methodFilter === m.toUpperCase() ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >{m}</button>
                            ))}
                        </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* View toggle */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40">
                        <button
                            onClick={() => setView("grid")}
                            className={cn("size-7 rounded-lg flex items-center justify-center transition-all", view === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        ><LayoutGrid className="size-3.5" /></button>
                        <button
                            onClick={() => setView("list")}
                            className={cn("size-7 rounded-lg flex items-center justify-center transition-all", view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        ><List className="size-3.5" /></button>
                    </div>
                </div>

                {/* Results count */}
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    {filtered.length} {filtered.length === 1 ? "projeto" : "projetos"} encontrado{filtered.length === 1 ? "" : "s"}
                    {search && <span> para "<span className="text-primary">{search}</span>"</span>}
                </p>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                        <FolderKanban className="size-10 text-muted-foreground/20" />
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/40">Nenhum projeto encontrado</p>
                        <p className="text-xs text-muted-foreground/30">Tente ajustar os filtros</p>
                    </div>
                ) : view === "grid" ? (
                    /* ─── GRID VIEW ─── */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.map((project) => {
                            const health = healthConfig[project.health] ?? healthConfig["on-time"];
                            const isClosed = project.completionRate >= 100;
                            return (
                                <Link key={project.id} href={`/projects/${project.id}`} className="block group">
                                    <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                                            <FolderKanban className="size-32" />
                                        </div>

                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform", isClosed ? "bg-muted-foreground/30" : project.color)}>
                                                    <FolderKanban className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-mono font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{project.name}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                        <Badge variant="outline" className={cn("text-[9px] font-mono h-4 px-1.5 uppercase", isClosed ? "border-muted-foreground/20 text-muted-foreground" : "border-primary/20 text-primary")}>
                                                            {isClosed ? "Encerrado" : "Ativo"}
                                                        </Badge>
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1", health.color)}>
                                                            <health.icon className="size-3" />
                                                            {health.label}
                                                        </span>
                                                        {project.methodology && (
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{project.methodology}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="space-y-1.5 relative z-10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Conclusão</span>
                                                <span className="text-xs font-black font-mono text-primary">{project.completionRate}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all", isClosed ? "bg-muted-foreground/40" : "bg-primary")}
                                                    style={{ width: `${project.completionRate}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-border/50 flex items-center justify-between relative z-10">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((i) => (
                                                    <Avatar key={i} className="size-7 border-2 border-background ring-1 ring-border/50">
                                                        <AvatarImage src={`https://avatar.vercel.sh/${project.id}_${i}`} />
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {project.involvedMembers.length > 3 && (
                                                    <div className="size-7 rounded-full bg-muted flex items-center justify-center border-2 border-background ring-1 ring-border/50">
                                                        <span className="text-[9px] font-bold">+{project.involvedMembers.length - 3}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-mono text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                Abrir
                                                <ArrowRight className="size-3" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    /* ─── LIST VIEW ─── */
                    <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
                        {/* Table header */}
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px_80px] gap-4 px-5 py-3 border-b border-border/50 bg-muted/20">
                            {["Projeto", "Status", "Saúde", "Método", "Progresso", ""].map((h) => (
                                <span key={h} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{h}</span>
                            ))}
                        </div>
                        {filtered.map((project, idx) => {
                            const health = healthConfig[project.health] ?? healthConfig["on-time"];
                            const isClosed = project.completionRate >= 100;
                            return (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className={cn("grid grid-cols-[2fr_1fr_1fr_1fr_120px_80px] gap-4 px-5 py-4 items-center hover:bg-muted/30 transition-colors group border-b border-border/30 last:border-0")}
                                >
                                    {/* Name */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn("size-8 rounded-xl flex items-center justify-center text-white shrink-0", isClosed ? "bg-muted-foreground/30" : project.color)}>
                                            <FolderKanban className="size-4" />
                                        </div>
                                        <span className="font-mono font-bold text-xs uppercase tracking-tight truncate group-hover:text-primary transition-colors">{project.name}</span>
                                    </div>

                                    {/* Status */}
                                    <Badge variant="outline" className={cn("text-[9px] font-mono h-5 px-2 w-fit uppercase", isClosed ? "border-muted-foreground/20 text-muted-foreground" : "border-primary/20 text-primary")}>
                                        {isClosed ? "Encerrado" : "Ativo"}
                                    </Badge>

                                    {/* Health */}
                                    <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", health.color)}>
                                        <health.icon className="size-3 shrink-0" />
                                        {health.label}
                                    </span>

                                    {/* Methodology */}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                                        {project.methodology ?? "—"}
                                    </span>

                                    {/* Progress */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full", isClosed ? "bg-muted-foreground/40" : "bg-primary")}
                                                style={{ width: `${project.completionRate}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black font-mono text-primary shrink-0 w-8 text-right">{project.completionRate}%</span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center justify-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                            Abrir <ArrowRight className="size-3" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
