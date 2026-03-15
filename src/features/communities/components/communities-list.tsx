"use client";

import { useState } from "react";
import { useAppStore } from "@/store/use-app-store";
import { CommunityCard } from "./community-card";
import { CreateCommunityModal } from "./create-community-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users } from "lucide-react";
import { COMMUNITY_CATEGORIES } from "../lib/community-schema";
import { cn } from "@/lib/utils";

export function CommunitiesList() {
    const { communities, joinedCommunityIds, joinCommunity, leaveCommunity } = useAppStore();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("Todas");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const categories = ["Todas", ...COMMUNITY_CATEGORIES];

    const filtered = communities.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase()) ||
            c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = activeCategory === "Todas" || c.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const joined = filtered.filter(c => joinedCommunityIds.includes(c.id));
    const discover = filtered.filter(c => !joinedCommunityIds.includes(c.id));

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black font-mono tracking-tighter uppercase">Grupos</h1>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">
                        Conecte-se por interesses além dos projetos
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 gap-2 active:scale-95 transition-all"
                >
                    <Plus className="size-4" />
                    Novo Grupo
                </Button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 py-4 px-5 rounded-2xl bg-card/50 border border-border/50">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="size-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-lg font-black font-mono">{communities.length}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Grupos</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                    <p className="text-lg font-black font-mono">{joinedCommunityIds.length}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Participando</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                    <p className="text-lg font-black font-mono">
                        {communities.reduce((sum, c) => sum + c.memberCount, 0)}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Membros Totais</p>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome, descrição ou tag..."
                        className="pl-10 h-11 rounded-xl bg-muted/30 border-border/50 font-medium text-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border",
                                activeCategory === cat
                                    ? "bg-primary/10 text-primary border-primary/30"
                                    : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Joined Communities */}
            {joined.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[11px] font-black uppercase tracking-widest text-foreground">Seus Grupos</h2>
                        <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                            {joined.length}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {joined.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                isJoined={true}
                                onJoin={joinCommunity}
                                onLeave={leaveCommunity}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Discover */}
            {discover.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[11px] font-black uppercase tracking-widest text-foreground">Descobrir</h2>
                        <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 bg-muted/60 text-muted-foreground border-border/50">
                            {discover.length}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {discover.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                isJoined={false}
                                onJoin={joinCommunity}
                                onLeave={leaveCommunity}
                            />
                        ))}
                    </div>
                </div>
            )}

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                    <div className="text-4xl">🔍</div>
                    <p className="text-sm font-bold text-muted-foreground">Nenhuma comunidade encontrada</p>
                    <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                        Tente outros termos ou crie uma nova!
                    </p>
                </div>
            )}

            <CreateCommunityModal open={showCreateModal} onOpenChange={setShowCreateModal} />
        </div>
    );
}
