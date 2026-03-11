"use client";

import { useState } from "react";
import {
    Search,
    ChevronRight,
    FileText,
    Clock,
    Plus,
    Filter,
    Edit3,
    Check,
    X,
    History,
    MoreVertical,
    ArrowLeft,
    Book,
    Layers,
    Save,
    Star
} from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { WikiPage } from "../lib/wiki-schema";
import { cn } from "@/lib/utils";

const MOCK_PAGES: WikiPage[] = [
    {
        id: "p1",
        title: "Diretrizes de Design",
        slug: "design-guidelines",
        category: "Design",
        content: "# Diretrizes de Design\n\nEste documento detalha o sistema visual do projeto, incluindo paleta de cores, tipografia e componentes base. Utilizamos o Radix UI como fundação para acessibilidade e Tailwind CSS para estilização utilitária.\n\n## Cores Primárias\n- **Deep Navy**: #0F172A\n- **Electric Indigo**: #6366F1\n- **Cyber Mint**: #10B981",
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
        content: "## Como configurar o projeto localmente\n\n1. Clone o repositório\n2. Instale as dependências: `pnpm install`\n3. Configure as variáveis de ambiente em `.env.local`\n4. Execute o servidor de desenvolvimento: `pnpm dev`",
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
        content: "Nossa estrutura segue o Feature-Sliced Design (FSD). Esta metodologia nos ajuda a manter o código modular e escalável.\n\n### Camadas:\n- **App**: Configuração global, roteamento.\n- **Pages**: Views completas.\n- **Features**: Funcionalidades de negócio reutilizáveis.\n- **Entities**: Lógica de domínio.\n- **Shared**: Componentes e utilitários comuns.",
        authorId: "u2",
        authorName: "Mike T.",
        lastUpdatedAt: new Date(Date.now() - 3600000).toISOString(),
        tags: ["Docs", "Architecture"],
    },
    {
        id: "p4",
        title: "Roadmap de Produto",
        slug: "product-roadmap",
        category: "Produto",
        content: "Visão estratégica para Q3 e Q4. Foco total em IA Generativa e Colaboração em tempo real.\n\n- [ ] Lançamento Fly AI Beta\n- [ ] Dashboards Executivos\n- [ ] Integração com Slack/Discord",
        authorId: "u3",
        authorName: "Ana L.",
        lastUpdatedAt: new Date(Date.now() - 600000).toISOString(),
        tags: ["Strategy", "Q3"],
    }
];

export function WikiView() {
    const [pages, setPages] = useState<WikiPage[]>(MOCK_PAGES);
    const [selectedPage, setSelectedPage] = useState<WikiPage>(MOCK_PAGES[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const { setWikiContext } = useAppStore();

    // Broadcast wiki context for AI
    useEffect(() => {
        setWikiContext({
            pageCount: pages.length,
            lastPageTitle: selectedPage.title
        });
    }, [pages, selectedPage, setWikiContext]);

    const categories = ["Geral", "Design", "Engenharia", "Produto"];

    const filteredPages = pages.filter((page: WikiPage) => {
        const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            page.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !activeCategory || page.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = () => {
        setEditedContent(selectedPage.content);
        setIsEditing(true);
    };

    const handleSave = () => {
        const updatedPages = pages.map((p: WikiPage) =>
            p.id === selectedPage.id ? { ...p, content: editedContent, lastUpdatedAt: new Date().toISOString() } : p
        );
        setPages(updatedPages);
        setSelectedPage({ ...selectedPage, content: editedContent, lastUpdatedAt: new Date().toISOString() });
        setIsEditing(false);
    };

    return (
        <div className="flex h-full bg-background overflow-hidden relative">
            {/* Wiki Navigation Sidebar */}
            <div className="w-72 shrink-0 border-r border-border bg-card/30 flex flex-col">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Book className="size-4 text-primary" />
                            <h3 className="text-sm font-bold font-mono uppercase tracking-tight">Wiki</h3>
                        </div>
                        <Button variant="ghost" size="icon-xs" className="size-7 hover:bg-primary/20 hover:text-primary transition-colors">
                            <Plus className="size-4" />
                        </Button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar na Wiki..."
                            className="pl-9 h-9 bg-background/50 border-border text-xs focus-visible:ring-primary/50"
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
                                {categories.map((cat) => (
                                    <Button
                                        key={cat}
                                        variant="ghost"
                                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                        className={cn(
                                            "w-full justify-between px-3 h-8 text-xs font-medium transition-all",
                                            activeCategory === cat ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Layers className={cn("size-3.5", activeCategory === cat ? "text-primary" : "text-muted-foreground")} />
                                            {cat}
                                        </span>
                                        <Badge variant="outline" className={cn("h-4 px-1 text-[8px]", activeCategory === cat ? "border-primary/50" : "")}>
                                            {pages.filter((p: WikiPage) => p.category === cat).length}
                                        </Badge>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Pages List */}
                        <div>
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Páginas</p>
                            <div className="space-y-0.5">
                                {filteredPages.map((page: WikiPage) => (
                                    <button
                                        key={page.id}
                                        onClick={() => {
                                            setSelectedPage(page);
                                            setIsEditing(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-md transition-all group",
                                            selectedPage.id === page.id
                                                ? "bg-primary/10 text-primary shadow-sm"
                                                : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <FileText className={cn(
                                            "size-4 shrink-0",
                                            selectedPage.id === page.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )} />
                                        <span className="truncate">{page.title}</span>
                                        {selectedPage.id === page.id && <ChevronRight className="ml-auto size-3 animate-pulse" />}
                                    </button>
                                ))}
                                {filteredPages.length === 0 && (
                                    <p className="px-3 py-4 text-[10px] text-muted-foreground italic text-center">Nenhum resultado...</p>
                                )}
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
                        <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider h-5 px-1.5 bg-primary/10 text-primary border-none">
                            {selectedPage.category}
                        </Badge>
                        <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-3.5" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">
                                Atualizado por <strong>{selectedPage.authorName}</strong> em {new Date(selectedPage.lastUpdatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <PermissionGuard role="ADMIN">
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className="size-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                    onClick={handleEdit}
                                >
                                    <Edit3 className="size-3.5" />
                                </Button>
                            </PermissionGuard>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(false)}
                                    className="h-8 gap-2 text-xs font-bold uppercase"
                                >
                                    <X className="size-3.5" />
                                    Cancelar
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleSave}
                                    className="h-8 gap-2 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                >
                                    <Save className="size-3.5" />
                                    Salvar
                                </Button>
                            </>
                        )}
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setShowHistory(!showHistory)}
                            className={cn("size-8 transition-colors", showHistory ? "text-primary bg-primary/10" : "text-muted-foreground")}
                        >
                            <History className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="size-8 text-muted-foreground">
                            <MoreVertical className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Page Body */}
                <ScrollArea className="flex-1">
                    <div className="max-w-4xl mx-auto px-12 py-16">
                        {isEditing ? (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary">Editor de Markdown</h2>
                                    <Textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        className="min-h-[600px] bg-card/30 border-border focus-visible:ring-primary/30 font-mono text-sm leading-relaxed p-6 resize-none"
                                        placeholder="Escreva aqui..."
                                    />
                                </div>
                                <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 text-[10px] font-medium text-primary uppercase tracking-widest">
                                    <Edit3 className="size-3" />
                                    O conteúdo será salvo como uma nova versão no histórico.
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-black font-mono tracking-tighter uppercase text-foreground leading-tight">
                                        {selectedPage.title}
                                    </h1>
                                    <div className="flex gap-2">
                                        {selectedPage.tags.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="text-[10px] font-mono border-dashed bg-muted/20 hover:bg-primary/5 hover:border-primary/50 cursor-pointer transition-colors">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                <div className="prose prose-invert max-w-none">
                                    <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/80 font-medium mb-8 border-l-4 border-primary/40 pl-6 py-1">
                                        {selectedPage.content}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                        <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3 hover:border-primary/30 transition-colors group cursor-pointer shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Tópicos Relacionados</h4>
                                                <ChevronRight className="size-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                                <li className="hover:text-foreground flex items-center gap-2">
                                                    <div className="size-1 rounded-full bg-primary/40" /> Glossário do Sistema
                                                </li>
                                                <li className="hover:text-foreground flex items-center gap-2">
                                                    <div className="size-1 rounded-full bg-primary/40" /> Roadmap de Infra
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3 hover:border-secondary transition-colors group cursor-pointer shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Documentos Finais</h4>
                                                <FileText className="size-3 text-muted-foreground group-hover:scale-110 transition-transform" />
                                            </div>
                                            <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                                <li className="hover:text-foreground flex items-center gap-2">
                                                    <FileText className="size-3 text-secondary" /> SPEC_V1_FINAL.pdf
                                                </li>
                                                <li className="hover:text-foreground flex items-center gap-2">
                                                    <FileText className="size-3 text-secondary" /> BRAND_GUIDE.ase
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Version History Sidebar (Overlay) */}
                {showHistory && (
                    <div className="absolute inset-y-0 right-0 w-80 bg-background/95 backdrop-blur-xl border-l border-border z-20 shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold font-mono uppercase tracking-widest flex items-center gap-2">
                                <History className="size-4 text-primary" />
                                Histórico
                            </h3>
                            <Button variant="ghost" size="icon-xs" onClick={() => setShowHistory(false)}>
                                <X className="size-4" />
                            </Button>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                            {[
                                { v: "v2.4", date: "Hoje, 14:20", user: "Sarah J.", note: "Ajuste na tipografia do header" },
                                { v: "v2.3", date: "Ontem, 09:15", user: "Mike T.", note: "Correção de links quebrados" },
                                { v: "v2.2", date: "08 Mar, 16:45", user: "Sarah J.", note: "Inclusão de paleta Dark Mode" },
                                { v: "v1.1", date: "01 Mar, 10:00", user: "Admin", note: "Publicação inicial" },
                            ].map((version, i) => (
                                <div key={i} className="relative pl-6 pb-2 group cursor-pointer">
                                    <div className="absolute left-0 top-1.5 size-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                    {i < 3 && <div className="absolute left-[3.5px] top-4 bottom-0 w-px bg-border" />}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold font-mono text-primary uppercase">{version.v}</span>
                                            <span className="text-[9px] font-medium text-muted-foreground uppercase">{version.date}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-foreground">{version.user}</p>
                                        <p className="text-[11px] text-muted-foreground leading-snug">{version.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" className="w-full mt-6 text-[10px] font-bold uppercase tracking-widest h-9 border-primary/20 text-primary">
                            Visualizar Todas
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
