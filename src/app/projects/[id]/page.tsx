"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Users,
    Settings2,
    Share2,
    Star,
    MoreHorizontal,
    Plus,
    ChevronDown,
    LayoutDashboard,
    FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ProjectTabs } from "@/features/projects/components/project-tabs";
import { ProjectMethodology } from "@/features/projects/lib/project-schema";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/features/projects/components/kanban-board";
import { TaskListView } from "@/features/projects/components/task-list-view";
import { Task } from "@/features/projects/lib/task-schema";
import { WikiView } from "@/features/wiki/components/wiki-view";
import { ProjectFiles } from "@/features/projects/components/project-files";
import { ProjectAICockpit } from "@/features/projects/components/project-ai-cockpit";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { Publisher } from "@/features/social/components/publisher";
import { ExecutionInsights } from "@/features/dashboard/components/execution-insights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

// Mock data for project recovery
const mockProjects: Record<string, { name: string, methodology: ProjectMethodology, description: string, status: string }> = {
    "proj_01": {
        name: "Projeto Alpha",
        methodology: "AGILE",
        description: "Redesign completo do dashboard principal com foco em usabilidade e performance.",
        status: "Ativo"
    },
    "proj_02": {
        name: "Integração SSO",
        methodology: "KANBAN",
        description: "Implementação de Single Sign-On para clientes corporativos.",
        status: "Crítico"
    },
    "proj_03": {
        name: "Marketing Q3",
        methodology: "LIST",
        description: "Planejamento e execução de campanhas para o terceiro trimestre.",
        status: "Ativo"
    }
};

// Mock tasks for initial state
const MOCK_TASKS: Task[] = [
    {
        id: "T-01",
        title: "Definir paleta de cores primária para Light Mode",
        description: "",
        status: "TODO",
        priority: "HIGH",
        assigneeId: "user_01",
        projectId: "proj_01",
        workspaceId: "wksp_01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        labels: ["UI/UX"]
    },
    {
        id: "T-02",
        title: "Refatorar componentes de formulário para Zod 3.0",
        description: "",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assigneeId: "user_02",
        projectId: "proj_01",
        workspaceId: "wksp_01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        labels: ["Refactor"]
    },
    {
        id: "T-03",
        title: "Implementar testes de acessibilidade no Header",
        description: "",
        status: "REVIEW",
        priority: "URGENT",
        assigneeId: "user_03",
        projectId: "proj_01",
        workspaceId: "wksp_01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        labels: ["QA"]
    },
    {
        id: "T-04",
        title: "Documentação inicial da arquitetura FSD",
        description: "",
        status: "DONE",
        priority: "LOW",
        assigneeId: "user_01",
        projectId: "proj_01",
        workspaceId: "wksp_01",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        labels: ["Docs"]
    }
];

export default function ProjectPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { currentUser, projects } = useAppStore();

    // Fallback to avoid error if id not in mock
    const projectData = mockProjects[id] || mockProjects["proj_01"];
    const [activeTab, setActiveTab] = useState("");

    // Set initial tab based on methodology
    useEffect(() => {
        if (projectData.methodology === "AGILE") setActiveTab("feed");
        else if (projectData.methodology === "KANBAN") setActiveTab("feed");
        else if (projectData.methodology === "LIST") setActiveTab("list");
        else if (projectData.methodology === "PLANNING") setActiveTab("wiki");
        else setActiveTab("overview");
    }, [projectData.methodology]);

    return (
        <div className="flex h-full bg-background/50 backdrop-blur-3xl overflow-hidden perspective-1000">
            {/* Main Content: Header + View */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* 1. Floating Glass Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-8 pt-8 pb-6 z-10"
                >
                    <div className="p-6 rounded-[2rem] bg-card/30 backdrop-blur-md border border-border/50 shadow-2xl shadow-primary/5 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Users className="size-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="h-auto p-0 hover:bg-transparent group outline-none border-none ring-0 focus:ring-0">
                                                    <div className="flex items-center gap-2">
                                                        <h1 className="text-2xl font-black font-mono tracking-tighter uppercase group-hover:text-primary transition-colors">{projectData.name}</h1>
                                                        <ChevronDown className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-80 rounded-2xl border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl p-2 select-none" align="start">
                                                    <div className="px-3 py-2 border-b border-border/50 mb-1 flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Alternar Contexto</span>
                                                        <Badge variant="secondary" className="text-[8px] h-4">Alpha v1.2</Badge>
                                                    </div>
                                                    <DropdownMenuItem
                                                        onClick={() => router.push('/')}
                                                        className="rounded-xl py-3 gap-3 cursor-pointer group hover:bg-primary/10 transition-all font-bold text-xs uppercase tracking-tight"
                                                    >
                                                        <LayoutDashboard className="size-4 text-primary group-hover:scale-110 transition-transform" />
                                                        Overview Global
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-border/50 mx-2 my-2" />
                                                    {projects.map((proj) => (
                                                        <DropdownMenuItem
                                                            key={proj.id}
                                                            className={cn(
                                                                "rounded-xl py-3 gap-3 cursor-pointer group transition-all",
                                                                proj.id === id ? "bg-primary/10" : "hover:bg-primary/5"
                                                            )}
                                                            onClick={() => router.push(`/projects/${proj.id === 'p1' ? 'proj_01' : proj.id === 'p2' ? 'proj_02' : 'proj_03'}`)}
                                                        >
                                                            <div className={`size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 ${proj.color || 'text-primary'}`}>
                                                                <FolderKanban className="size-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-[11px] uppercase tracking-tighter group-hover:text-primary transition-colors">{proj.name}</span>
                                                                <span className="text-[8px] text-muted-foreground uppercase font-mono">{proj.status} • Global Context</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Badge variant="outline" className={cn(
                                                "text-[8px] font-black tracking-widest px-2 h-4 border-primary/20 text-primary",
                                                projectData.status === "Crítico" && "bg-destructive/10 text-destructive border-destructive/20"
                                            )}>
                                                {projectData.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                            {projectData.methodology} • SPRINT ATIVO
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-yellow-500 transition-colors">
                                        <Star className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3 mr-4">
                                    {[1, 2, 3].map((i) => (
                                        <Avatar key={i} className="size-9 border-4 border-background ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer hover:-translate-y-1">
                                            <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
                                            <AvatarFallback>U{i}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <button className="size-9 rounded-full bg-muted/50 border border-dashed border-border flex items-center justify-center hover:bg-muted transition-colors">
                                        <Plus className="size-3 text-muted-foreground" />
                                    </button>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2 h-9 font-bold text-[10px] uppercase tracking-widest rounded-xl border-border/50">
                                    <Share2 className="size-3.5" />
                                    Compartilhar
                                </Button>
                                <Button variant="secondary" size="icon" className="size-9 rounded-xl">
                                    <Settings2 className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border/40">
                            <ProjectTabs
                                methodology={projectData.methodology}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 2. Content Area with Transitions */}
                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.01 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="h-full"
                        >
                            {activeTab === "feed" ? (
                                <div className="h-full flex flex-col overflow-hidden bg-card/5">
                                    <Publisher />
                                    <div className="flex-1 relative overflow-hidden">
                                        <ScrollArea className="h-full">
                                            <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
                                                <div className="flex items-center gap-3 px-4 mb-4">
                                                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px] shadow-primary" />
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Log de Atividades do Projeto</h3>
                                                </div>
                                                <ActivityFeed />
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </div>
                            ) : activeTab === "kanban" ? (
                                <KanbanBoard tasks={MOCK_TASKS} />
                            ) : activeTab === "list" ? (
                                <TaskListView tasks={MOCK_TASKS} />
                            ) : activeTab === "wiki" ? (
                                <WikiView />
                            ) : activeTab === "files" ? (
                                <ProjectFiles />
                            ) : activeTab === "ai-agents" ? (
                                <ProjectAICockpit />
                            ) : (
                                <div className="p-8 h-full overflow-auto">
                                    <div className="rounded-[2.5rem] border-2 border-dashed border-border/40 h-full flex flex-col items-center justify-center text-center p-12 space-y-4 bg-card/5">
                                        <div className="size-16 rounded-[1.5rem] bg-muted/30 flex items-center justify-center border border-border/50">
                                            <Settings2 className="size-8 text-muted-foreground/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-black font-mono tracking-tighter uppercase">Em Construção</h2>
                                            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-widest max-w-xs mx-auto">
                                                O módulo {activeTab} está sendo calibrado para performance máxima.
                                            </p>
                                        </div>
                                        <Button variant="secondary" className="font-bold text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl">
                                            Ver Roadmap
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* 3. Right Column Architecture: Integrated Intelligence Cockpit */}
            <div className="hidden lg:flex h-full overflow-hidden border-l border-border bg-card/5">
                {/* 3.1 Contextual Insights */}
                <div className="w-[380px] shrink-0 relative">
                    <ExecutionInsights />
                </div>
            </div>
        </div>
    );
}
