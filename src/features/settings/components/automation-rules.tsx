"use client";

import { useState } from "react";
import {
    Zap,
    ArrowRight,
    Bell,
    CheckCircle2,
    MessageSquare,
    Plus,
    Trash2,
    Settings2,
    Play,
    Workflow,
    AlertCircle,
    Calendar,
    Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const INITIAL_RULES = [
    {
        id: "r1",
        name: "Notificação de Bloqueio",
        trigger: "Quando tarefa for movida para 'Impedida'",
        action: "Notificar canal #urgente no Slack",
        enabled: true,
        category: "Comunicação"
    },
    {
        id: "r2",
        name: "Sync com GitHub",
        trigger: "Ao fechar Issue no GitHub",
        action: "Mover card para 'Concluído'",
        enabled: true,
        category: "Desenvolvimento"
    },
    {
        id: "r3",
        name: "Lembrete de Inatividade",
        trigger: "Após 3 dias sem atualização",
        action: "Enviar e-mail para o responsável",
        enabled: false,
        category: "Gestão"
    }
];

export function AutomationRules() {
    const [rules, setRules] = useState(INITIAL_RULES);

    const toggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-mono font-bold uppercase tracking-tight">Motor de Regras</h3>
                    <p className="text-sm text-muted-foreground font-medium">Automatize tarefas repetitivas com lógica If-This-Then-That.</p>
                </div>
                <Button className="gap-2 h-11 font-bold uppercase tracking-widest text-[10px] px-8 bg-primary/90 hover:bg-primary transition-all">
                    <Plus className="size-4" />
                    Nova Automação
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-2 duration-500">
                {rules.map((rule) => (
                    <Card key={rule.id} className={cn(
                        "bg-card/20 border-border/50 hover:bg-card/40 transition-all duration-300",
                        !rule.enabled && "opacity-75 grayscale-[0.5]"
                    )}>
                        <div className="p-6 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6 flex-1">
                                <div className={cn(
                                    "size-12 rounded-2xl flex items-center justify-center border transition-colors",
                                    rule.enabled ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                                )}>
                                    <Zap className="size-6" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-base tracking-tight">{rule.name}</h4>
                                        <Badge variant="outline" className="text-[9px] uppercase font-mono py-0 h-4 border-muted-foreground/20 text-muted-foreground">
                                            {rule.category}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                        <span className="bg-muted px-2 py-0.5 rounded border border-border/50">If</span>
                                        <span className="text-foreground/80">{rule.trigger}</span>
                                        <ArrowRight className="size-3 text-primary/50" />
                                        <span className="bg-muted px-2 py-0.5 rounded border border-border/50">Then</span>
                                        <span className="text-foreground/80">{rule.action}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-l border-border/50 pl-6 shrink-0">
                                <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                        {rule.enabled ? "Ativo" : "Inativo"}
                                    </span>
                                    <Switch
                                        checked={rule.enabled}
                                        onCheckedChange={() => toggleRule(rule.id)}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>
                                <Button variant="ghost" size="icon-xs" className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Visual Builder Sketch Interface */}
            <div className="mt-10 p-8 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Workflow className="size-48" />
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Workflow className="size-5" />
                            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em]">Visual Builder (BETA)</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">Crie fluxos complexos em segundos</h3>
                        <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                            Desenhe automações que cruzam múltiplos aplicativos e condições lógicas sem escrever uma única linha de código.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-xl flex items-center gap-4 min-w-[200px]">
                            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                <Clock className="size-5 text-orange-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Gatilho</p>
                                <p className="text-xs font-bold">Todo Dia às 09:00</p>
                            </div>
                        </div>
                        <ArrowRight className="size-5 text-primary/30 shrink-0" />
                        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-xl flex items-center gap-4 min-w-[200px]">
                            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <AlertCircle className="size-5 text-blue-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Condição</p>
                                <p className="text-xs font-bold">Se houver atrasos</p>
                            </div>
                        </div>
                        <ArrowRight className="size-5 text-primary/30 shrink-0" />
                        <div className="p-4 rounded-2xl bg-primary border border-primary/20 shadow-xl shadow-primary/20 flex items-center gap-4 min-w-[200px]">
                            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/20">
                                <Zap className="size-5 text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-white/70 uppercase">Ação</p>
                                <p className="text-xs font-bold text-white">Resumir p/ Discord</p>
                            </div>
                        </div>
                    </div>

                    <Button variant="default" className="font-bold uppercase text-[10px] tracking-widest px-8 shadow-lg shadow-primary/20">
                        Começar a Desenhar Planos
                    </Button>
                </div>
            </div>
        </div>
    );
}
