"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Users,
    Settings2,
    Share2,
    Star,
    MoreHorizontal,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectTabs } from "@/features/projects/components/project-tabs";
import { ProjectMethodology } from "@/features/projects/lib/project-schema";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/features/projects/components/kanban-board";
import { TaskListView } from "@/features/projects/components/task-list-view";
import { Task } from "@/features/projects/lib/task-schema";
import { ProjectChat } from "@/features/chat/components/project-chat";
import { WikiView } from "@/features/wiki/components/wiki-view";
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
    const { currentUser } = useAppStore();

    // Fallback to avoid error if id not in mock
    const projectData = mockProjects[id] || mockProjects["proj_01"];
    const [activeTab, setActiveTab] = useState("");

    // Set initial tab based on methodology
    useEffect(() => {
        if (projectData.methodology === "AGILE") setActiveTab("kanban");
        else if (projectData.methodology === "KANBAN") setActiveTab("kanban");
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
                                            <h1 className="text-2xl font-black font-mono tracking-tighter uppercase">{projectData.name}</h1>
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
                            {activeTab === "kanban" ? (
                                <KanbanBoard tasks={MOCK_TASKS} />
                            ) : activeTab === "list" ? (
                                <TaskListView tasks={MOCK_TASKS} />
                            ) : activeTab === "wiki" ? (
                                <WikiView />
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

            {/* 3. Integrated Project Chat Sidebar */}
            <motion.aside
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden lg:flex w-[350px] xl:w-[450px] shrink-0 flex-col bg-card/10 border-l border-border h-full relative"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
                <ProjectChat />
            </motion.aside>
        </div>
    );
}
