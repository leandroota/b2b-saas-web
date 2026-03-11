"use client";

import { useState, useRef, useEffect } from "react";
import {
    Sparkles,
    Send,
    X,
    Zap,
    MessageSquare,
    Lightbulb,
    Command,
    Plus,
    RefreshCcw,
    Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CopilotMessage } from "../lib/copilot-schema";

const INITIAL_MESSAGES: CopilotMessage[] = [
    {
        id: "m1",
        role: "assistant",
        content: "Olá! Como posso ajudar você no workspace do **Flyprod** hoje?",
        createdAt: new Date().toISOString(),
    }
];

const SUGGESTIONS = [
    "Resumir tarefas do dia",
    "Criar plano de entrega",
    "Analisar bloqueios no board",
    "Explicar arquitetura FSD"
];

export function CopilotChat() {
    const [messages, setMessages] = useState<CopilotMessage[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (text?: string) => {
        const finalContent = text || inputValue;
        if (!finalContent.trim()) return;

        const userMsg: CopilotMessage = {
            id: Math.random().toString(36).substr(2, 9),
            role: "user",
            content: finalContent,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI behavior
        setTimeout(() => {
            const aiMsg: CopilotMessage = {
                id: Math.random().toString(36).substr(2, 9),
                role: "assistant",
                content: "Com base no contexto do seu projeto, analisei que você tem 3 tarefas em atraso e 2 discussões não resolvidas no chat. Gostaria que eu criasse um resumo para o time?",
                createdAt: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <div className="flex h-full flex-col bg-background/80 backdrop-blur-xl relative border-l border-border shadow-2xl overflow-hidden">
            {/* Copilot Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-primary/5 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <Sparkles className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black font-mono tracking-tighter uppercase flex items-center gap-1.5">
                            Fly Copilot
                            <Badge variant="outline" className="text-[9px] font-mono h-4 border-primary/30 text-primary uppercase">v1.0</Badge>
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">IA Conectada ao Projeto</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon-xs" className="size-8 text-muted-foreground hover:text-foreground">
                    <RefreshCcw className="size-3.5" />
                </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                <div className="flex flex-col gap-6 py-6 pb-32">
                    {messages.map((message) => {
                        const isAI = message.role === "assistant";
                        return (
                            <div key={message.id} className={cn(
                                "flex gap-4 group",
                                isAI ? "flex-row" : "flex-row-reverse"
                            )}>
                                <div className={cn(
                                    "shrink-0 size-8 rounded-lg flex items-center justify-center border",
                                    isAI ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                                )}>
                                    {isAI ? <Bot className="size-4" /> : <Command className="size-4" />}
                                </div>

                                <div className={cn(
                                    "flex flex-col gap-2 max-w-[85%]",
                                    isAI ? "items-start" : "items-end"
                                )}>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all",
                                        isAI
                                            ? "bg-card border border-border/50 rounded-tl-none"
                                            : "bg-primary text-primary-foreground rounded-tr-none"
                                    )}>
                                        {message.content}
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Alpha Intelligence • {new Date(message.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="shrink-0 size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <Bot className="size-4" />
                            </div>
                            <div className="bg-muted/30 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                <span className="size-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="size-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="size-1.5 bg-primary/50 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Floating Action Bar - Fixed relative to bottom container */}
            <div className="p-6 bg-gradient-to-t from-background via-background to-transparent absolute bottom-0 left-0 right-0">
                {/* Suggestion Chips */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                    {SUGGESTIONS.map(suggestion => (
                        <button
                            key={suggestion}
                            onClick={() => handleSendMessage(suggestion)}
                            className="shrink-0 h-8 px-4 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-all text-[11px] font-bold uppercase tracking-tight flex items-center gap-2"
                        >
                            <Lightbulb className="size-3" />
                            {suggestion}
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Pergunte ao Copilot..."
                        className="h-12 pl-6 pr-14 bg-card/50 border-border/50 rounded-2xl shadow-xl focus-visible:ring-primary/20 text-sm font-medium"
                    />
                    <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 top-2 size-8 rounded-lg shadow-lg"
                        size="icon"
                    >
                        <Send className="size-3.5" />
                    </Button>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-1.5">
                        <Zap className="size-2.5" /> Contexto: Tarefas + Wiki
                    </span>
                </div>
            </div>
        </div>
    );
}
