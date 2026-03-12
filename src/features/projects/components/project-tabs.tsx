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
            <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-10 w-full justify-start gap-8">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="relative rounded-none border-b-2 border-transparent px-0 pb-3 h-full data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-mono font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:text-primary/70 gap-2"
                    >
                        <tab.icon className="size-3.5" />
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
