"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LayoutDashboard,
    ListTodo,
    Columns3,
    BookText,
    MessageSquare,
    Target,
    Layers,
    FileCode,
    Sparkles
} from "lucide-react";
import { ProjectMethodology } from "../lib/project-schema";

interface ProjectTabsProps {
    methodology: ProjectMethodology;
    activeTab: string;
    onTabChange: (value: string) => void;
}

export function ProjectTabs({ methodology, activeTab, onTabChange }: ProjectTabsProps) {
    // Define tabs based on methodology
    const getTabsForMethodology = (method: ProjectMethodology) => {
        const baseTabs = [
            { id: "wiki", label: "Wiki", icon: BookText },
            { id: "files", label: "Arquivos", icon: FileCode },
            { id: "ai-agents", label: "Agentes IA", icon: Sparkles },
        ];

        switch (method) {
            case "AGILE":
                return [
                    { id: "backlog", label: "Backlog", icon: Layers },
                    { id: "kanban", label: "Kanban", icon: Columns3 },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    ...baseTabs,
                ];
            case "LIST":
                return [
                    { id: "list", label: "Lista", icon: ListTodo },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    ...baseTabs,
                ];
            case "PLANNING":
                return [
                    { id: "wiki", label: "Planejamento (Wiki)", icon: BookText },
                    { id: "goals", label: "Objetivos", icon: Target },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    { id: "chat", label: "Chat", icon: MessageSquare },
                ];
            case "KANBAN":
            default:
                return [
                    { id: "kanban", label: "Kanban", icon: Columns3 },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    ...baseTabs,
                ];
        }
    };

    const tabs = getTabsForMethodology(methodology);

    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="h-10 bg-transparent p-0 gap-6 border-b border-border w-full justify-start rounded-none">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 h-full gap-2 transition-all"
                    >
                        <tab.icon className="size-4" />
                        <span className="font-medium">{tab.label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
