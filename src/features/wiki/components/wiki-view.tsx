"use client";

import { useState } from "react";
import {
    Book,
    FileText,
    Plus,
    Search,
    ChevronRight,
    Clock,
    Edit3,
    MoreVertical,
    Layers,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WikiPage } from "../lib/wiki-schema";
import { cn } from "@/lib/utils";

const MOCK_PAGES: WikiPage[] = [
    {
        id: "p1",
        title: "Diretrizes de Design",
        slug: "design-guidelines",
        category: "Design",
        content: "# Diretrizes de Design\n\nEste documento detalha o sistema visual do projeto...",
        authorId: "u1",
        authorName: "Sarah J.",
        lastUpdatedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ["UI", "Branding"],
    },
    {
        id: "p2",
        title: "Configuração de Ambiente",
        slug: "env-setup",
        category: "Engenharia",
        content: "## Como configurar o projeto localmente...",
        authorId: "u2",
        authorName: "Mike T.",
        lastUpdatedAt: new Date(Date.now() - 172800000).toISOString(),
        tags: ["Dev", "Setup"],
    },
    {
        id: "p3",
        title: "Arquitetura FSD",
        slug: "fsd-architecture",
        category: "Engenharia",
        content: "Nossa estrutura segue o Feature-Sliced Design...",
        authorId: "u2",
        authorName: "Mike T.",
        lastUpdatedAt: new Date(Date.now() - 3600000).toISOString(),
        tags: ["Docs", "Architecture"],
    }
];

export function WikiView() {
    const [selectedPage, setSelectedPage] = useState<WikiPage>(MOCK_PAGES[0]);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex h-full bg-background overflow-hidden">
            {/* Wiki Navigation Sidebar */}
            <div className="w-72 shrink-0 border-r border-border bg-card/30 flex flex-col">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Book className="size-4 text-primary" />
                            <h3 className="text-sm font-bold font-mono uppercase tracking-tight">Wiki</h3>
                        </div>
                        <Button variant="ghost" size="icon-xs" className="size-7">
                            <Plus className="size-4" />
                        </Button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar na Wiki..."
                            className="pl-9 h-9 bg-background/50 border-border text-xs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-2 py-2 space-y-6">
                        {/* Categories */}
                        <div>
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categorias</p>
                            <div className="space-y-1">
                                {["Geral", "Design", "Engenharia", "Produto"].map((cat) => (
                                    <Button
                                        key={cat}
                                        variant="ghost"
                                        className="w-full justify-between px-3 h-8 text-xs font-medium hover:bg-muted/50"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Layers className="size-3.5 text-muted-foreground" />
                                            {cat}
                                        </span>
                                        <Badge variant="outline" className="h-4 px-1 text-[8px]">
                                            {MOCK_PAGES.filter(p => p.category === cat).length}
                                        </Badge>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Pages List */}
                        <div>
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Páginas Recentes</p>
                            <div className="space-y-0.5">
                                {MOCK_PAGES.map((page) => (
                                    <button
                                        key={page.id}
                                        onClick={() => setSelectedPage(page)}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-all group",
                                            selectedPage.id === page.id
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <FileText className={cn(
                                            "size-4 shrink-0",
                                            selectedPage.id === page.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )} />
                                        <span className="truncate">{page.title}</span>
                                        {selectedPage.id === page.id && <ChevronRight className="ml-auto size-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Wiki Content Area */}
            <main className="flex-1 flex flex-col bg-background/50 overflow-hidden">
                {/* Page Header */}
                <div className="h-14 flex items-center justify-between px-8 border-b border-border bg-background sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider h-5 px-1.5">
                            {selectedPage.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-3.5" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">
                                Atualizado por <strong>{selectedPage.authorName}</strong> em {new Date(selectedPage.lastUpdatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-bold uppercase tracking-wider">
                            <Edit3 className="size-3.5" />
                            Editar
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="size-8">
                            <Star className="size-4 text-muted-foreground hover:text-yellow-500 transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="size-8 text-muted-foreground">
                            <MoreVertical className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Page Body */}
                <ScrollArea className="flex-1">
                    <div className="max-w-4xl mx-auto px-12 py-16">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-black font-mono tracking-tighter uppercase text-foreground">
                                    {selectedPage.title}
                                </h1>
                                <div className="flex gap-2">
                                    {selectedPage.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-[10px] font-mono border-dashed bg-muted/20">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Placeholder for MD Content */}
                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg leading-relaxed text-foreground/80 font-medium italic mb-8 border-l-4 border-primary pl-6">
                                    {selectedPage.content}
                                </p>
                                <div className="grid grid-cols-2 gap-8 mt-12">
                                    <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Tópicos Relacionados</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                            <li className="hover:text-foreground cursor-pointer flex items-center gap-2">
                                                <ChevronRight className="size-3" /> Glossário do Sistema
                                            </li>
                                            <li className="hover:text-foreground cursor-pointer flex items-center gap-2">
                                                <ChevronRight className="size-3" /> Roadmap de Infra
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">Documentos Finais</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                            <li className="hover:text-foreground cursor-pointer flex items-center gap-2">
                                                <FileText className="size-3" /> SPEC_V1.pdf
                                            </li>
                                            <li className="hover:text-foreground cursor-pointer flex items-center gap-2">
                                                <FileText className="size-3" /> BRAND_BOOK.ase
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </main>
        </div>
    );
}
