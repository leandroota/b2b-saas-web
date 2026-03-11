import {
    Users,
    FolderKanban,
    Calendar,
    Target,
    ChevronRight,
    CircleDashed,
    FileText,
    Settings,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectSidebar() {
    return (
        <aside className="w-80 shrink-0 border-r border-border bg-card/20 flex flex-col h-full overflow-hidden">
            <div className="p-8 space-y-10">
                {/* 1. Project Identity */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-primary shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center">
                            <FolderKanban className="size-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black font-mono uppercase tracking-tighter">Projeto Alpha</h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Sprint 12 em curso</p>
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        {[
                            { icon: Users, label: "Equipe", count: 8 },
                            { icon: FileText, label: "Arquivos", count: 42 },
                            { icon: Calendar, label: "Cronograma", active: true },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group",
                                    item.active
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-foreground/60 hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("size-4", item.active ? "text-white" : "text-primary/60")} />
                                    <span className="text-xs font-bold">{item.label}</span>
                                </div>
                                {item.count && (
                                    <span className="text-[10px] font-mono opacity-60 font-black">{item.count}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Weekly Goals */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Target className="size-3.5 text-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Metas da Semana</h3>
                    </div>

                    <div className="p-5 rounded-3xl bg-background/50 border border-border/50 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <CircleDashed className="size-16" />
                        </div>

                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>Tasks Finalizadas</span>
                                <span className="text-primary">82%</span>
                            </div>
                            <Progress value={82} className="h-1.5 bg-primary/10" />
                        </div>

                        <p className="text-[9px] text-muted-foreground font-medium italic opacity-70">
                            Faltam 4 entregas críticas para bater a meta.
                        </p>
                    </div>
                </div>

                {/* 3. Quick Actions */}
                <div className="mt-auto pt-6 border-t border-border/40">
                    <Button variant="ghost" className="w-full justify-between text-[10px] font-black uppercase tracking-widest group text-muted-foreground hover:text-primary">
                        Configurações do Projeto
                        <Settings className="size-3 group-hover:rotate-45 transition-transform" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
