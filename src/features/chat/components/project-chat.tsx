"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Hash, Users, Pin, MoreHorizontal, Smile, Paperclip, Search, ChevronDown, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "../lib/chat-schema";
import { cn } from "@/lib/utils";

const MOCK_MESSAGES: ChatMessage[] = [
    {
        id: "msg_1",
        content: "Olá time! Acabei de atualizar o board com as novas tarefas do sprint.",
        senderId: "user_1",
        senderName: "Felipe Designer",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        type: "TEXT",
    },
    {
        id: "msg_2",
        content: "Excelente! Vou revisar os requisitos agora.",
        senderId: "user_2",
        senderName: "Carla Product",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        type: "TEXT",
    },
    {
        id: "msg_3",
        content: "Não esqueçam de marcar as prioridades como URGENT onde for necessário.",
        senderId: "user_1",
        senderName: "Felipe Designer",
        createdAt: new Date(Date.now() - 900000).toISOString(),
        type: "TEXT",
    },
    {
        id: "msg_4",
        content: "Pode deixar. Já estou alterando as tarefas de infra.",
        senderId: "user_3",
        senderName: "Robo Dev",
        createdAt: new Date(Date.now() - 300000).toISOString(),
        type: "TEXT",
    },
];

export function ProjectChat() {
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="flex h-full flex-col bg-background relative border-r border-border max-w-[400px] xl:max-w-[450px]" />;
    }

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            content: inputValue,
            senderId: "current_user",
            senderName: "Você",
            createdAt: new Date().toISOString(),
            type: "TEXT",
        };

        setMessages([...messages, newMessage]);
        setInputValue("");
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex h-full flex-col bg-background relative border-r border-border max-w-[400px] xl:max-w-[450px]">
            {/* Chat Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Hash className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-mono tracking-tight flex items-center gap-1.5 uppercase">
                            Geral
                            <ChevronDown className="size-3 text-muted-foreground" />
                        </h3>
                        <div className="flex items-center gap-1.5">
                            <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">3 ativos</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-xs" className="size-8 text-muted-foreground hover:text-foreground">
                        <Search className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" className="size-8 text-muted-foreground hover:text-foreground">
                        <Users className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" className="size-8 text-muted-foreground hover:text-foreground">
                        <Pin className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                <div className="flex flex-col gap-6 py-6 pb-24">
                    {messages.map((message, index) => {
                        const isMine = message.senderId === "current_user";
                        const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;

                        return (
                            <div key={message.id} className={cn(
                                "flex gap-3 max-w-[85%]",
                                isMine ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}>
                                <div className="shrink-0 pt-1">
                                    {showAvatar ? (
                                        <Avatar className="size-8 border border-border">
                                            <AvatarImage src={`https://avatar.vercel.sh/${message.senderId}`} />
                                            <AvatarFallback className="text-[10px] font-mono">{message.senderName[0]}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="size-8" />
                                    )}
                                </div>

                                <div className={cn(
                                    "flex flex-col gap-1",
                                    isMine ? "items-end" : "items-start"
                                )}>
                                    {showAvatar && (
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-bold font-mono uppercase tracking-wide text-foreground/80">
                                                {message.senderName}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {mounted ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                            </span>
                                        </div>
                                    )}

                                    <div className={cn(
                                        "px-3 py-2 rounded-2xl text-sm leading-relaxed",
                                        isMine
                                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm shadow-primary/20"
                                            : "bg-muted/50 border border-border/10 rounded-tl-none"
                                    )}>
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Chat Input - Fixed at bottom */}
            <div className="p-4 bg-background border-t border-border absolute bottom-0 left-0 right-0">
                <div className="bg-muted/30 border border-border rounded-xl p-2 focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Conversar em #geral..."
                        className="border-none bg-transparent shadow-none focus-visible:ring-0 px-2 h-8 text-[13px]"
                    />
                    <div className="flex items-center justify-between mt-1 px-1">
                        <div className="flex items-center gap-0.5">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                                        <Paperclip className="size-3.5" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Anexar arquivo</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                                        <Smile className="size-3.5" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Emojis</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                                        <AtSign className="size-3.5" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Mencionar</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            size="icon-xs"
                            className="size-7 rounded-lg shadow-sm"
                        >
                            <Send className="size-3.5" />
                        </Button>
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 px-1 text-center font-medium uppercase tracking-[0.05em]">
                    Pressione <span className="font-mono bg-muted px-1 rounded">Enter</span> para enviar
                </p>
            </div>
        </div>
    );
}
