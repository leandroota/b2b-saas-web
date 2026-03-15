"use client";

import { useState } from "react";
import {
    Slack,
    Github,
    MessageSquare,
    Webhook,
    ArrowRight,
    CheckCircle2,
    Circle,
    Power,
    Zap,
    ExternalLink,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
    {
        id: "slack",
        name: "Slack",
        description: "Envie notificações de tarefas e comentários diretamente para seus canais.",
        icon: Slack,
        category: "Comunicação",
        status: "disconnected",
        color: "hover:border-[#4A154B]/50 hover:bg-[#4A154B]/5"
    },
    {
        id: "github",
        name: "GitHub",
        description: "Sincronize Issues e Pull Requests com seus cartões no Kanban.",
        icon: Github,
        category: "Desenvolvimento",
        status: "connected",
        color: "hover:border-foreground/50 hover:bg-foreground/5"
    },
    {
        id: "jira",
        name: "Atlassian Jira",
        description: "Importe épicos e sprints para visualização executiva no Flyproj.",
        icon: MessageSquare,
        category: "Gestão",
        status: "pending",
        color: "hover:border-[#0052CC]/50 hover:bg-[#0052CC]/5"
    },
    {
        id: "zapier",
        name: "Zapier",
        description: "Conecte o Flyproj a mais de 5.000 aplicativos externos.",
        icon: Webhook,
        category: "Automações",
        status: "disconnected",
        color: "hover:border-[#FF4F00]/50 hover:bg-[#FF4F00]/5"
    }
];

export function IntegrationsGallery() {
    const [integrations, setIntegrations] = useState(INTEGRATIONS);
    const [connectingId, setConnectingId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        const item = integrations.find(i => i.id === id);
        if (!item) return;

        if (item.status === "disconnected") {
            setConnectingId(id);
            setTimeout(() => {
                setIntegrations(prev => prev.map(i =>
                    i.id === id ? { ...i, status: "connected" } : i
                ));
                setConnectingId(null);
            }, 1500);
        } else {
            setIntegrations(prev => prev.map(i =>
                i.id === id ? { ...i, status: "disconnected" } : i
            ));
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500">
                {integrations.map((item) => (
                    <Card key={item.id} className={cn(
                        "bg-card/30 border-border transition-all duration-300 group",
                        item.color
                    )}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <item.icon className="size-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base font-bold">{item.name}</CardTitle>
                                        <Badge variant="outline" className="text-[9px] uppercase font-mono py-0 h-4 border-muted-foreground/20 text-muted-foreground">
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs leading-relaxed max-w-[240px]">
                                        {item.description}
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {item.status === "connected" ? (
                                    <Badge className="bg-emerald-500 text-white border-0 text-[9px] font-bold uppercase tracking-widest px-2">
                                        Conectado
                                    </Badge>
                                ) : item.status === "pending" ? (
                                    <Badge className="bg-orange-500 text-white border-0 text-[9px] font-bold uppercase tracking-widest px-2 animate-pulse">
                                        Configuração Pendente
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest px-2">
                                        Não Conectado
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/50">
                                <Zap className="size-3 text-primary" />
                                <span className="uppercase tracking-widest">
                                    {item.id === "github" ? "Webhooks + REST API 2.0" : "OAuth 2.0 + Real-time Sync"}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 border-t border-border/50 bg-muted/5 flex justify-between items-center">
                            <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs text-muted-foreground hover:text-primary">
                                Documentação <ExternalLink className="size-3" />
                            </Button>
                            <Button
                                variant={item.status === "connected" ? "outline" : "default"}
                                size="sm"
                                className="h-8 min-w-[100px] font-bold uppercase text-[10px] tracking-widest"
                                onClick={() => handleToggle(item.id)}
                                disabled={connectingId === item.id || item.status === "pending"}
                            >
                                {connectingId === item.id ? "Aguarde..." :
                                    item.status === "connected" ? "Desconectar" : "Conectar"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Advanced Section */}
            <div className="mt-12 p-8 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4 bg-primary/5">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Webhook className="size-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-mono font-bold uppercase tracking-widest">Webhook Playground</h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                        Crie endpoints personalizados para receber dados de qualquer ferramenta externa ou envie disparos automáticos para APIs customizadas.
                    </p>
                </div>
                <Button variant="outline" className="gap-2 font-mono text-[10px] font-bold uppercase tracking-widest px-8">
                    Abrir Configurador de Webhooks <ArrowRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
