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
        <div className="flex h-full bg-background overflow-hidden">
            {/* Main Content: Header + View */}
            <div className="flex-1 flex flex-col min-w-0 bg-background/50">
                {/* Project Header */}
                <div className="px-8 pt-8 pb-6 border-b border-border bg-background">
                    <div className="flex items-start justify-between mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-mono font-bold tracking-tight">{projectData.name}</h1>
                                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-yellow-500">
                                    <Star className="size-4" />
                                </Button>
                                <Badge variant={projectData.status === "Crítico" ? "destructive" : "secondary"}>
                                    {projectData.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                                {projectData.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2 mr-4">
                                {[1, 2, 3].map((i) => (
                                    <Avatar key={i} className="size-8 border-2 border-background">
                                        <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
                                        <AvatarFallback>U{i}</AvatarFallback>
                                    </Avatar>
                                ))}
                                <Button variant="outline" size="icon-sm" className="size-8 rounded-full border-dashed bg-muted/50">
                                    <Plus className="size-3" />
                                </Button>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="size-4" />
                                Compartilhar
                            </Button>
                            <Button variant="outline" size="icon-sm">
                                <Settings2 className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <ProjectTabs
                        methodology={projectData.methodology}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === "kanban" ? (
                        <KanbanBoard tasks={MOCK_TASKS} />
                    ) : activeTab === "list" ? (
                        <TaskListView tasks={MOCK_TASKS} />
                    ) : (
                        <div className="p-8 h-full overflow-auto">
                            <div className="rounded-xl border-2 border-dashed border-border h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                                <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                                    <Settings2 className="size-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-mono font-semibold">Módulo {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} em construção</h2>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                        Este módulo faz parte da {projectData.methodology} e será implementado nos próximos sprints.
                                    </p>
                                </div>
                                <Button variant="secondary">Saiba mais sobre {projectData.methodology}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Sidebar Area */}
            <aside className="hidden lg:flex w-[350px] xl:w-[450px] shrink-0 flex-col bg-background border-l border-border h-full">
                <ProjectChat />
            </aside>
        </div>
    );
}
