import {
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle,
    Users,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Rocket,
    Target,
    ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function ExecutionInsights() {
    return (
        <aside className="w-96 shrink-0 border-l border-border bg-card/10 flex flex-col h-full overflow-hidden">
            <div className="p-8 space-y-8 overflow-y-auto">
                {/* 0. Weekly Goals (Relocated) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Target className="size-3.5 text-primary" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Metas da Semana</h3>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4 relative overflow-hidden group hover:bg-primary/[0.08] transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Performance</p>
                                <h4 className="text-2xl font-black font-mono tracking-tighter">82<span className="text-primary text-sm">%</span></h4>
                            </div>
                            <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Zap className="size-5 text-primary animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-60">
                                <span>Sprint Completion</span>
                                <span>24/30 Tasks</span>
                            </div>
                            <Progress value={82} className="h-1 bg-primary/10" />
                        </div>
                    </div>
                </div>

                {/* 1. Project Health */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Activity className="size-3.5 text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status do Projeto</h3>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-1.5 h-4">SAUDÁVEL</Badge>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-background border border-border shadow-2xl shadow-primary/5 space-y-6">
                        <div className="space-y-2 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Progresso Total</p>
                            <h4 className="text-4xl font-black font-mono tracking-tighter">74<span className="text-primary text-xl">%</span></h4>
                            <Progress value={74} className="h-1.5" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-2xl bg-muted/30 text-center space-y-1">
                                <p className="text-2xl font-black font-mono">14</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Abertos</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-muted/30 text-center space-y-1">
                                <p className="text-2xl font-black font-mono">128</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Fechados</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Upcoming Milestones */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Rocket className="size-3.5 text-orange-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Próximas Entregas</h3>
                    </div>

                    <div className="space-y-2">
                        {[
                            { title: "Doc. de API V2", time: "Hoje, 17:00", color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/20" },
                            { title: "Reunião Retrospectiva", time: "Amanhã, 10:00", color: "text-indigo-500", bg: "bg-indigo-500/5", border: "border-indigo-500/20" },
                        ].map((item) => (
                            <div key={item.title} className={`p-4 rounded-2xl border ${item.border} ${item.bg} group cursor-pointer hover:scale-[1.02] transition-all flex items-center justify-between gap-4`}>
                                <div className="space-y-1">
                                    <h4 className={`text-[11px] font-bold ${item.color} uppercase tracking-tight`}>{item.title}</h4>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Clock className="size-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{item.time}</span>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Presence Hub */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Users className="size-3.5 text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quem está Online</h3>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">8 ativos</span>
                    </div>

                    <div className="flex items-center gap-2 px-1">
                        <div className="flex -space-x-3 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <Avatar key={i} className="size-9 border-4 border-background ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
                                    <AvatarImage src={`https://i.pravatar.cc/100?u=user${i}`} />
                                    <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <button className="size-9 rounded-full bg-muted/50 border border-dashed border-border flex items-center justify-center hover:bg-muted transition-colors">
                            <span className="text-[10px] font-black text-muted-foreground">+4</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
