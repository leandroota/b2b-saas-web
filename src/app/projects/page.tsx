"use client";

import { useAppStore } from "@/store/use-app-store";
import { FolderKanban, Star, MoreHorizontal, ArrowRight, Plus, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProjectsPage() {
    const { projects, currentUser } = useAppStore();

    // Filter projects based on role (consistency with Home)
    const displayedProjects = currentUser.role === 'ADMIN'
        ? projects
        : projects.filter(p => p.involvedMembers.includes(currentUser.email));

    return (
        <div className="flex flex-col h-full bg-background/50 overflow-hidden">
            {/* Premium Standard Header */}
            <header className="shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-6 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black font-mono tracking-[0.2em] uppercase text-primary mb-0.5">Workspace Directory</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black font-mono tracking-tighter uppercase text-foreground">Projetos Ativos</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                            <Star className="size-3.5 text-orange-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Workspace Premium</span>
                        </div>
                        <Button className="gap-2 font-mono font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-primary/20">
                            <Plus className="size-4" />
                            Novo Projeto
                        </Button>
                    </div>
                </div>
            </header>

            {/* Project Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id === 'p1' ? 'proj_01' : project.id === 'p2' ? 'proj_02' : 'proj_03'}`}
                            className="block group"
                        >
                            <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                                {/* Subtle Background Pattern */}
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                                    <FolderKanban className="size-32" />
                                </div>

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-xl ${project.color} flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                                            <FolderKanban className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-mono font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{project.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="outline" className="text-[9px] font-mono h-4 px-1.5 border-primary/20 text-primary uppercase">
                                                    Ativo
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {project.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                    Redesign completo do dashboard principal com foco em usabilidade e performance de renderização.
                                </p>

                                <div className="pt-4 border-t border-border/50 flex items-center justify-between relative z-10">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <Avatar key={i} className="size-7 border-2 border-background ring-1 ring-border/50">
                                                <AvatarImage src={`https://avatar.vercel.sh/${project.id}_${i}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        <div className="size-7 rounded-full bg-muted flex items-center justify-center border-2 border-background ring-1 ring-border/50">
                                            <span className="text-[9px] font-bold">+2</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary font-mono text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                        Abrir Projeto
                                        <ArrowRight className="size-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
