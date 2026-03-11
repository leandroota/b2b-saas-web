"use client";

import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    Users,
    Trophy,
    Target,
    Zap,
    MoreHorizontal,
    TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { DashboardSkeleton } from "@/components/layout/skeletons";

const MOCK_KPIS = [
    { label: "Projetos Ativos", value: "12", change: "+2", indicator: "up", icon: LayoutDashboard },
    { label: "Tarefas Bloqueadas", value: "08", change: "-15%", indicator: "down", icon: AlertCircle },
    { label: "Velocidade Média", value: "48", valueSuffix: "pts/wk", change: "+12%", indicator: "up", icon: Zap },
    { label: "Taxa de Entrega", value: "92%", change: "+5%", indicator: "up", icon: Trophy },
];

const MOCK_PROJECT_HEALTH = [
    { name: "Expansão LATAM", progress: 75, status: "Healthy", team: 5, lastUpdate: "2h atrás" },
    { name: "IA Copilot Engine", progress: 45, status: "At Risk", team: 3, lastUpdate: "30m atrás" },
    { name: "Flyprod Mobile V1", progress: 90, status: "Healthy", team: 8, lastUpdate: "5h atrás" },
    { name: "Refatoração Core", progress: 20, status: "Critical", team: 2, lastUpdate: "1d atrás" },
];

export function ManagementDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black font-mono tracking-tighter uppercase text-foreground">
                    Insights Executivos
                </h1>
                <p className="text-muted-foreground text-sm font-medium tracking-wide">
                    Visão geral de performance, riscos e saúde do workspace.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_KPIS.map((kpi, i) => (
                    <Card key={i} className="border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <kpi.icon className="size-12" />
                        </div>
                        <CardHeader className="pb-2 space-y-0">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {kpi.label}
                            </CardDescription>
                            <CardTitle className="text-3xl font-black font-mono tracking-tight">
                                {kpi.value}
                                <span className="text-sm font-medium ml-1 text-muted-foreground">{kpi.valueSuffix}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1.5">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-[10px] font-mono border-none h-5 px-1.5",
                                        kpi.indicator === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                    )}
                                >
                                    {kpi.indicator === "up" ? <ArrowUpRight className="size-3 mr-0.5" /> : <ArrowDownRight className="size-3 mr-0.5" />}
                                    {kpi.change}
                                </Badge>
                                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">vs mês passado</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Health Table */}
                <Card className="lg:col-span-2 border-border/50 bg-card/20 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-6">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-bold font-mono uppercase tracking-tight flex items-center gap-2">
                                <Target className="size-4 text-primary" />
                                Saúde dos Projetos
                            </CardTitle>
                            <CardDescription className="text-xs uppercase tracking-wider">Monitoramento de avanço e riscos</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {MOCK_PROJECT_HEALTH.map((project, i) => (
                                <div key={i} className="flex items-center gap-6 group">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors cursor-pointer capitalize">
                                                {project.name}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground">{project.progress}%</span>
                                        </div>
                                        <Progress value={project.progress} className="h-1.5 bg-muted/30" />
                                    </div>
                                    <div className="w-24 text-right">
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "text-[9px] font-bold uppercase tracking-widest border-none",
                                                project.status === "Healthy" && "bg-emerald-500/10 text-emerald-500",
                                                project.status === "At Risk" && "bg-amber-500/10 text-amber-500",
                                                project.status === "Critical" && "bg-rose-500/10 text-rose-500"
                                            )}
                                        >
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <div className="hidden md:flex items-center gap-4 w-32 border-l border-border/50 pl-4">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, j) => (
                                                <div key={j} className="size-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">
                                                    {String.fromCharCode(65 + j)}
                                                </div>
                                            ))}
                                            {project.team > 3 && (
                                                <div className="size-6 rounded-full border-2 border-background bg-primary/20 text-primary flex items-center justify-center text-[8px] font-bold">
                                                    +{project.team - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Feed */}
                <Card className="border-border/50 bg-card/20 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold font-mono uppercase tracking-tight flex items-center gap-2">
                            <TrendingUp className="size-4 text-primary" />
                            Gargalos Ativos
                        </CardTitle>
                        <CardDescription className="text-xs uppercase tracking-wider">Itens exigindo atenção imediata</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <ScrollArea className="h-[350px] px-6">
                            <div className="space-y-4">
                                {[
                                    { title: "Bug crítico no processamento de pagamentos", project: "Expansão LATAM", type: "Blocker", time: "10m atrás" },
                                    { title: "Review de design pendente (Board)", project: "IA Copilot", type: "Waiting", time: "45m atrás" },
                                    { title: "Deploy em staging falhou (CI/CD)", project: "Expansão LATAM", type: "Critical", time: "2h atrás" },
                                    { title: "Vaga de Dev Senior sem aplicantes", project: "RH Internal", type: "Risk", time: "5h atrás" },
                                    { title: "Documentação da API incompleta", project: "Refatoração Core", type: "Waiting", time: "1d atrás" },
                                ].map((item, i) => (
                                    <div key={i} className="p-3 rounded-xl border border-border/50 bg-background/40 space-y-2 hover:border-primary/20 transition-all cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className={cn(
                                                "text-[8px] font-mono border-none h-4",
                                                item.type === "Blocker" && "bg-rose-500/20 text-rose-500",
                                                item.type === "Waiting" && "bg-sky-500/20 text-sky-500",
                                                item.type === "Critical" && "bg-orange-500/20 text-orange-500",
                                                item.type === "Risk" && "bg-amber-500/20 text-amber-500"
                                            )}>
                                                {item.type}
                                            </Badge>
                                            <span className="text-[9px] text-muted-foreground font-mono">{item.time}</span>
                                        </div>
                                        <p className="text-xs font-bold leading-tight line-clamp-2">{item.title}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium italic">{item.project}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
