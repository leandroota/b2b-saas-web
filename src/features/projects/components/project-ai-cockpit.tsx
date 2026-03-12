"use client";

import { useState } from "react";
import {
    Sparkles,
    MessageSquare,
    ChevronRight,
    Zap,
    FileText,
    History,
    Plus,
    CheckCircle2,
    Mic,
    Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PM_AGENTS = [
    { id: "prd", name: "Arquiteto de PRD", status: "Pronto", icon: Layout, desc: "Cria especificações completas a partir de notas." },
    { id: "story", name: "Mestre de Estórias", status: "Pronto", icon: MessageSquare, desc: "Quebra requisitos em User Stories e Tarefas." },
    { id: "risk", name: "Analista de Risco", status: "Beta", icon: Zap, desc: "Identifica gargalos e riscos técnicos." },
];

export function ProjectAICockpit() {
    const [generating, setGenerating] = useState(false);
    const [output, setOutput] = useState<string | null>(null);

    const simulateGeneration = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setOutput("PRD_GENERATED");
        }, 2000);
    };

    return (
        <div className="p-8 h-full flex gap-8 overflow-hidden">
            {/* Sidebar de Agentes */}
            <div className="w-72 flex flex-col space-y-6 shrink-0">
                <div className="space-y-1">
                    <h2 className="text-xl font-black font-mono tracking-tighter uppercase flex items-center gap-2">
                        <Sparkles className="size-5 text-primary" />
                        AI Intel
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">PM Super-Assistant Flow</p>
                </div>

                <div className="space-y-3">
                    {PM_AGENTS.map((agent) => (
                        <div key={agent.id} className="p-4 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/50 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between mb-2">
                                <agent.icon className="size-5 text-primary" />
                                <Badge variant="outline" className="text-[8px] font-black tracking-[0.1em] h-4">
                                    {agent.status}
                                </Badge>
                            </div>
                            <h3 className="text-xs font-bold font-mono uppercase tracking-tight">{agent.name}</h3>
                            <p className="text-[10px] text-muted-foreground leading-snug mt-1">{agent.desc}</p>
                        </div>
                    ))}
                </div>

                <Button variant="outline" className="w-full h-10 rounded-xl border-dashed border-border/60 font-bold text-[10px] uppercase tracking-widest">
                    <History className="size-3.5 mr-2" />
                    Histórico de Geração
                </Button>
            </div>

            {/* Area de Trabalho */}
            <div className="flex-1 flex flex-col bg-card/5 border border-border/40 rounded-[2.5rem] overflow-hidden relative shadow-inner">
                <div className="p-8 flex flex-col items-center justify-center flex-1 text-center space-y-8">
                    {!output && !generating && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="max-w-md space-y-6"
                        >
                            <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-xl shadow-primary/5">
                                <Mic className="size-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black font-mono tracking-tighter uppercase">Laboratório de Inteligência</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    Cole uma transcrição de reunião ou anotações brutas. Nossos agentes vão destilar o valor técnico e criar sua estrutura de backlog.
                                </p>
                            </div>
                            <div className="p-1.5 bg-background/50 border border-border/50 rounded-2xl flex items-center">
                                <textarea
                                    placeholder="Comece a digitar ou arraste um arquivo .txt..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] p-4 min-h-[120px] resize-none font-mono"
                                />
                            </div>
                            <Button
                                onClick={simulateGeneration}
                                className="w-full h-12 rounded-2xl bg-primary shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest gap-2"
                            >
                                <Zap className="size-4" />
                                Iniciar Processamento
                            </Button>
                        </motion.div>
                    )}

                    {generating && (
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="relative">
                                <div className="size-24 rounded-full border-2 border-primary/20 animate-[spin_3s_linear_infinite]" />
                                <Sparkles className="size-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black font-mono tracking-tighter uppercase">Sincronizando Neurônios</h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest animate-pulse">Extraindo Histórias, Regras e Tasks...</p>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {output === "PRD_GENERATED" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full h-full flex flex-col text-left p-8 space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-black text-[9px] uppercase tracking-widest">Geração Concluída</Badge>
                                    <Button variant="ghost" size="sm" onClick={() => setOutput(null)} className="h-8 font-bold text-[10px] uppercase">Novo Fluxo</Button>
                                </div>
                                <div className="flex-1 p-6 bg-background rounded-3xl border border-border/50 overflow-hidden flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <FileText className="size-5 text-primary" />
                                        <h4 className="font-mono font-bold text-sm uppercase">Draft: Especificação para Dashboard Administrativo</h4>
                                    </div>
                                    <ScrollArea className="flex-1 pr-4">
                                        <div className="space-y-6 text-[13px] leading-relaxed text-muted-foreground/80 font-mono">
                                            <p className="text-foreground font-bold underline">Resumo Executivo</p>
                                            <p>Este sistema permitirá que administradores gerenciem roles e permissões de forma visual...</p>
                                            <p className="text-foreground font-bold underline">User Stories Identificadas</p>
                                            <ul className="list-disc pl-4 space-y-2">
                                                <li>Como Admin, quero visualizar o log de acessos...</li>
                                                <li>Como Admin, quero restringir edições por geolocalização...</li>
                                            </ul>
                                        </div>
                                    </ScrollArea>
                                    <div className="pt-6 border-t border-border/40 mt-auto flex items-center gap-4">
                                        <Button className="flex-1 h-11 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-primary/20">
                                            Vincular ao Backlog
                                        </Button>
                                        <Button className="flex-1 h-11 rounded-xl bg-primary text-white font-bold text-[10px] uppercase tracking-widest gap-2">
                                            <Plus className="size-3.5" />
                                            Criar Kanban Cards
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
