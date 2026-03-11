"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Users,
    Settings2,
    Share2,
    Star,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectTabs } from "@/features/projects/components/project-tabs";
import { ProjectMethodology } from "@/features/projects/lib/project-schema";
import { Badge } from "@/components/ui/badge";

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

export default function ProjectPage() {
    const params = useParams();
    const id = params.id as string;

    const [project, setProject] = useState(mockProjects[id] || mockProjects["proj_01"]);
    const [activeTab, setActiveTab] = useState("");

    // Set initial tab based on methodology
    useEffect(() => {
        if (project.methodology === "AGILE") setActiveTab("backlog");
        else if (project.methodology === "KANBAN") setActiveTab("kanban");
        else if (project.methodology === "LIST") setActiveTab("list");
        else if (project.methodology === "PLANNING") setActiveTab("wiki");
        else setActiveTab("overview");
    }, [project.methodology]);

    return (
        <div className="flex flex-col h-full bg-background/50">
            {/* Project Header */}
            <div className="px-8 pt-8 pb-6 border-b border-border bg-background">
                <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-mono font-bold tracking-tight">{project.name}</h1>
                            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-yellow-500">
                                <Star className="size-4" />
                            </Button>
                            <Badge variant={project.status === "Crítico" ? "destructive" : "secondary"}>
                                {project.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                            {project.description}
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
                        <Button variant="outline" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </div>
                </div>

                <ProjectTabs
                    methodology={project.methodology}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Tab Content Placeholder */}
            <div className="flex-1 overflow-auto p-8">
                <div className="rounded-xl border-2 border-dashed border-border h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                        <Settings2 className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="text-lg font-mono font-semibold">Módulo {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} em construção</h2>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                            Este módulo faz parte da {project.methodology} e será implementado nos próximos sprints.
                        </p>
                    </div>
                    <Button variant="secondary">Saiba mais sobre {project.methodology}</Button>
                </div>
            </div>
        </div>
    );
}

import { Plus } from "lucide-react";
