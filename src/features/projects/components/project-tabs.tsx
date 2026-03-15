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
    Sparkles,
    Activity
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
            { id: "feed", label: "Atividades", icon: Activity },
            { id: "wiki", label: "Wiki", icon: BookText },
            { id: "files", label: "Arquivos", icon: FileCode },
            { id: "ai-agents", label: "Agentes IA", icon: Sparkles },
        ];

        switch (method) {
            case "AGILE":
                return [
                    { id: "feed", label: "Atividades", icon: Activity },
                    { id: "backlog", label: "Backlog", icon: Layers },
                    { id: "kanban", label: "Kanban", icon: Columns3 },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    ...baseTabs.filter(t => t.id !== "feed"),
                ];
            case "LIST":
                return [
                    { id: "feed", label: "Atividades", icon: Activity },
                    { id: "list", label: "Lista", icon: ListTodo },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    ...baseTabs.filter(t => t.id !== "feed"),
                ];
            case "PLANNING":
                return [
                    { id: "feed", label: "Atividades", icon: Activity },
                    { id: "wiki", label: "Planejamento (Wiki)", icon: BookText },
                    { id: "goals", label: "Objetivos", icon: Target },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    { id: "chat", label: "Chat", icon: MessageSquare },
                ];
            case "KANBAN":
            default:
                return [
                    { id: "feed", label: "Atividades", icon: Activity },
                    { id: "kanban", label: "Kanban", icon: Columns3 },
                    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
                    ...baseTabs.filter(t => t.id !== "feed"),
                ];
        }
    };

    const tabs = getTabsForMethodology(methodology);

    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="h-11 bg-muted/30 border border-border/50 p-1 gap-1 rounded-xl w-fit flex justify-center bg-clip-padding backdrop-blur-sm mx-auto">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="relative rounded-lg px-4 h-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm font-mono font-black text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-background/50 hover:text-primary/70 gap-2"
                    >
                        <tab.icon className="size-3" />
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
