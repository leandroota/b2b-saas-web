"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Filter,
    LayoutGrid,
    List,
    MoreHorizontal,
    Calendar,
    MessageSquare,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Camera,
    Image as ImageIcon,
    ChevronDown,
    FolderKanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";
import { Task } from "../lib/task-schema";

const STATUS_OPTIONS = [
    { label: "Todas", value: "ALL" },
    { label: "A Fazer", value: "TODO" },
    { label: "Em Progresso", value: "IN_PROGRESS" },
    { label: "Em Revisão", value: "REVIEW" },
    { label: "Concluído", value: "DONE" },
];

const PRIORITY_OPTIONS = [
    { label: "Todas", value: "ALL" },
    { label: "Urgente", value: "URGENT" },
    { label: "Alta", value: "HIGH" },
    { label: "Média", value: "MEDIUM" },
    { label: "Baixa", value: "LOW" },
];

export function UserTaskCenter() {
    const { tasks, projects, currentUser } = useAppStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [projectFilter, setProjectFilter] = useState("ALL");
    const [coverTheme, setCoverTheme] = useState("custom");

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
            const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
            const matchesProject = projectFilter === "ALL" || task.projectId === projectFilter;
            return matchesSearch && matchesStatus && matchesPriority && matchesProject;
        });
    }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE": return <CheckCircle2 className="size-3.5 text-green-500" />;
            case "IN_PROGRESS": return <Clock className="size-3.5 text-primary" />;
            case "REVIEW": return <AlertCircle className="size-3.5 text-blue-500" />;
            default: return <Clock className="size-3.5 text-muted-foreground" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT": return "bg-destructive/10 text-destructive border-destructive/20";
            case "HIGH": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "MEDIUM": return "bg-primary/10 text-primary border-primary/20";
            default: return "bg-muted text-muted-foreground border-muted-foreground/20";
        }
    };

    const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || "Geral";

    const stats = useMemo(() => {
        return {
            total: filteredTasks.length,
            pending: filteredTasks.filter(t => t.status !== 'DONE').length,
            done: filteredTasks.filter(t => t.status === 'DONE').length
        };
    }, [filteredTasks]);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-background overflow-y-auto">
            {/* Profile Header Area - Height expanded to 2.5x (192px * 2.5 = 480px) */}
            <div className="relative group/cover shrink-0 h-[480px] flex flex-col justify-end">
                {/* Cover Backdrop */}
                <div className={cn(
                    "absolute inset-0 transition-all duration-700",
                    coverTheme === "mesh-1" && "bg-[radial-gradient(circle_at_20%_30%,#0ea5e9_0,transparent_50%),radial-gradient(circle_at_80%_70%,#6366f1_0,transparent_50%),linear-gradient(135deg,#020617_0,#0f172a_100%)]",
                    coverTheme === "mesh-2" && "bg-[radial-gradient(circle_at_80%_20%,#ec4899_0,transparent_50%),radial-gradient(circle_at_20%_80%,#8b5cf6_0,transparent_50%),linear-gradient(135deg,#020617_0,#0f172a_100%)]",
                    coverTheme === "dark" && "bg-slate-950",
                    coverTheme === "custom" && "bg-cover bg-center bg-no-repeat"
                )}
                    style={coverTheme === "custom" ? { backgroundImage: 'url("/images/task-cover.png")' } : {}}
                >
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                </div>

                {/* Edit Cover Action */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div
                            role="button"
                            className="absolute top-4 right-4 bg-background/50 backdrop-blur-md border border-border/50 opacity-0 group-hover/cover:opacity-100 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 h-9 px-4 rounded-xl shadow-xl cursor-pointer hover:bg-background/80 active:scale-95"
                        >
                            <Camera className="size-3.5" />
                            Editar Capa
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 bg-background/80 backdrop-blur-xl">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground">Temas Disponíveis</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setCoverTheme("custom")} className="rounded-xl px-3 py-2 gap-3 cursor-pointer">
                                <div className="size-4 rounded-full bg-cover bg-center border border-border/50" style={{ backgroundImage: 'url("/images/task-cover.png")' }} />
                                <span className="text-xs font-bold uppercase tracking-tight">Personalizado</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCoverTheme("mesh-1")} className="rounded-xl px-3 py-2 gap-3 cursor-pointer">
                                <div className="size-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-border/50" />
                                <span className="text-xs font-bold uppercase tracking-tight">Mesh Blue</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCoverTheme("mesh-2")} className="rounded-xl px-3 py-2 gap-3 cursor-pointer">
                                <div className="size-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border border-border/50" />
                                <span className="text-xs font-bold uppercase tracking-tight">Mesh Pink</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCoverTheme("dark")} className="rounded-xl px-3 py-2 gap-3 cursor-pointer">
                                <div className="size-4 rounded-full bg-slate-950 border border-border/50" />
                                <span className="text-xs font-bold uppercase tracking-tight">Dark Solid</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Identity */}
                <div className="max-w-7xl mx-auto px-8 relative">
                    <div className="flex items-end gap-6 -mt-12 pb-6 border-b border-border/40">
                        <div className="relative group/avatar">
                            <Avatar className="size-28 rounded-full border-4 border-background shadow-2xl ring-1 ring-border/50 overflow-hidden">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">JS</AvatarFallback>
                            </Avatar>
                            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center text-white rounded-full">
                                <Camera className="size-6" />
                            </button>
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-4xl font-black font-mono tracking-tighter uppercase mb-1">
                                {currentUser.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                    {currentUser.email}
                                </p>
                                <div className="h-1 w-1 rounded-full bg-border" />
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest">
                                    {currentUser.role}
                                </Badge>
                            </div>
                        </div>

                        {/* Quick Insights */}
                        <div className="flex gap-8 px-8 py-3 mb-2 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                            {[
                                { label: "Totais", val: stats.total, color: "text-primary" },
                                { label: "Pendentes", val: stats.pending, color: "text-orange-500" },
                                { label: "Concluídas", val: stats.done, color: "text-green-500" }
                            ].map(st => (
                                <div key={st.label} className="text-center">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{st.label}</p>
                                    <p className={cn("text-2xl font-black font-mono tracking-tighter", st.color)}>{st.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Toolbar */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40 py-4">
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Filtrar por nome de tarefa..."
                                className="pl-10 bg-muted/30 border-border/50 h-11 rounded-xl text-sm font-medium focus-visible:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Project Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        role="button"
                                        className="rounded-xl border border-border/50 font-bold text-[10px] uppercase tracking-widest gap-2 h-11 px-4 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
                                    >
                                        <FolderKanban className="size-3.5 text-primary" />
                                        Projeto: <span className="text-primary font-black ml-1">{projectFilter === "ALL" ? "Todos" : getProjectName(projectFilter)}</span>
                                        <ChevronDown className="size-3.5 opacity-50 ml-2" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 rounded-2xl p-2 border-border/50 scrollbar-hide">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => setProjectFilter("ALL")} className="rounded-xl">Todos os Projetos</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {projects.map(p => (
                                            <DropdownMenuItem key={p.id} onClick={() => setProjectFilter(p.id)} className="rounded-xl px-3 py-2 flex items-center gap-2">
                                                <div className={cn("size-2 rounded-full", p.color)} />
                                                <span className="text-xs font-bold uppercase">{p.name}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Status Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        role="button"
                                        className="rounded-xl border border-border/50 font-bold text-[10px] uppercase tracking-widest gap-2 h-11 px-4 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
                                    >
                                        <Filter className="size-3.5 text-muted-foreground" />
                                        Status: <span className="text-foreground font-black ml-1">{STATUS_OPTIONS.find(s => s.value === statusFilter)?.label}</span>
                                        <ChevronDown className="size-3.5 opacity-50 ml-2" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 rounded-2xl p-2 border-border/50">
                                    <DropdownMenuGroup>
                                        {STATUS_OPTIONS.map(s => (
                                            <DropdownMenuItem key={s.value} onClick={() => setStatusFilter(s.value)} className="rounded-xl">{s.label}</DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Button className="h-11 rounded-xl px-6 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95">
                        <Plus className="size-4 mr-2" />
                        Nova Tarefa
                    </Button>
                </div>
            </div>

            {/* Task List Grid */}
            <div className="max-w-7xl mx-auto px-8 py-8 w-full">
                {filteredTasks.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className="group flex items-center gap-6 p-4 rounded-[1.5rem] bg-card/30 border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all duration-300"
                            >
                                <div className="size-10 rounded-xl bg-background flex items-center justify-center border border-border group-hover:border-primary/20 transition-all font-mono text-[10px] font-black text-muted-foreground">
                                    {task.id}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-sm font-black tracking-tight uppercase group-hover:text-primary transition-colors truncate">
                                            {task.title}
                                        </h3>
                                        <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-mono border-primary/20 text-primary/70 uppercase tracking-tighter">
                                            {getProjectName(task.projectId)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="size-3" />
                                            {task.dueDate || "Sem data"}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare className="size-3" />
                                            2 Comentários
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-center gap-1 min-w-[100px]">
                                        <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Prioridade</span>
                                        <Badge variant="outline" className={cn("text-[9px] font-mono border-0 h-5 px-2", getPriorityColor(task.priority))}>
                                            {task.priority}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col items-center gap-1 min-w-[100px]">
                                        <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Status</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(task.status)}
                                            <span className="text-[10px] font-black uppercase tracking-tight">
                                                {task.status.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="size-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-card/10 border border-dashed border-border/50 rounded-[2rem]">
                        <div className="size-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
                            <List className="size-8 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-lg font-black font-mono uppercase tracking-tight mb-1">Nenhuma tarefa encontrada</h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Tente ajustar seus filtros ou busca</p>
                    </div>
                )}
            </div>
        </div>
    );
}
