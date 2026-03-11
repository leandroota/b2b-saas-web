"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    X,
    Smile,
    Paperclip,
    ChevronLeft,
    Search,
    MessageSquare,
    User,
    Users,
    Circle,
    CheckCheck,
    Phone,
    Video,
    MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";

// Mock data for Inbox
const MOCK_DM_CONVS = [
    { id: "dm1", type: "person", name: "Sarah Jordão", role: "UI Designer", context: "Flyprod Dashboard", avatar: "https://avatar.vercel.sh/sarah", status: "online", lastMsg: "Obrigada pelo feedback!", time: "10:45", unread: 2 },
    { id: "dm2", type: "person", name: "Felipe Rodrigues", role: "Product Manager", context: "Marketing Q3", avatar: "", status: "away", lastMsg: "Podemos revisar o backlog amanhã?", time: "Ontem", unread: 0 },
    { id: "dm3", type: "person", name: "Ana Clara", role: "Backend Lead", context: "Integração SSO", avatar: "https://avatar.vercel.sh/ana", status: "offline", lastMsg: "As APIs estão prontas.", time: "Segunda", unread: 0 },
];

const MOCK_PROJECT_CONVS = [
    { id: "p1", type: "project", name: "Projeto Alpha", context: "Grupo de Trabalho", participants: 12, lastMsg: "John: Layout validado para mobile.", time: "14:20", unread: 1 },
    { id: "p2", type: "project", name: "Integração SSO", context: "Core Infra", participants: 4, lastMsg: "Ana: Token de teste expirou.", time: "10:00", unread: 0 },
];

export function MessagingDrawer() {
    const { isMessagingOpen, drawerLevel, activeConversation, closeMessaging, openConversation, backToInbox } = useAppStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (activeConversation) {
            setMessages([
                {
                    id: "m0", content: activeConversation.type === 'person'
                        ? `Olá! Vi que você está trabalhando no contexto do ${activeConversation.context}. Como posso ajudar?`
                        : `Bem-vindo ao chat do ${activeConversation.name}. Aqui discutimos tópicos de ${activeConversation.context}.`,
                    role: "other",
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
            ]);
        }
    }, [activeConversation]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!mounted) return null;

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        const newMsg = {
            id: Date.now().toString(),
            content: inputValue,
            role: "me",
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, newMsg]);
        setInputValue("");
    };

    return (
        <div className="flex h-full flex-col bg-background relative overflow-hidden">
            {drawerLevel === 'inbox' ? (
                /* INBOX LEVEL */
                <>
                    {/* Inbox Header */}
                    <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                    <MessageSquare className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black font-mono tracking-tight uppercase">Mensagens</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Inbox Unificado</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon-xs" onClick={closeMessaging} className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                                <X className="size-4" />
                            </Button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar conversa..."
                                className="pl-10 bg-background/50 h-10 text-xs border-border/50 focus-visible:ring-primary/30"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Inbox Tabs */}
                    <Tabs defaultValue="pessoas" className="flex-1 flex flex-col min-h-0">
                        <div className="px-6 py-2 border-b border-border/50 bg-muted/20">
                            <TabsList className="grid w-full grid-cols-2 h-9 bg-background/50 p-1">
                                <TabsTrigger value="pessoas" className="text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Pessoas</TabsTrigger>
                                <TabsTrigger value="projetos" className="text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Projetos</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="pessoas" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-210px)]">
                                <div className="p-2 space-y-1">
                                    {MOCK_DM_CONVS.map((conv) => (
                                        <button
                                            key={conv.id}
                                            onClick={() => openConversation(conv)}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group text-left"
                                        >
                                            <div className="relative">
                                                <Avatar className="size-11 border border-border/50">
                                                    <AvatarImage src={conv.avatar} />
                                                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                        {conv.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Circle className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 size-3.5 fill-current border-2 border-background rounded-full",
                                                    conv.status === "online" ? "text-green-500" : conv.status === "away" ? "text-orange-500" : "text-muted-foreground/30"
                                                )} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <p className="text-sm font-bold tracking-tight truncate">{conv.name}</p>
                                                    <span className="text-[9px] font-mono text-muted-foreground/60">{conv.time}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground/80 truncate font-medium">{conv.lastMsg}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-muted-foreground/20 font-bold uppercase">{conv.role}</Badge>
                                                    {conv.unread > 0 && <Badge className="size-4 p-0 rounded-full flex items-center justify-center text-[9px] bg-primary">{conv.unread}</Badge>}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="projetos" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-210px)]">
                                <div className="p-2 space-y-1">
                                    {MOCK_PROJECT_CONVS.map((conv) => (
                                        <button
                                            key={conv.id}
                                            onClick={() => openConversation(conv)}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group text-left"
                                        >
                                            <div className="size-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                                <Users className="size-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <p className="text-sm font-bold tracking-tight truncate">{conv.name}</p>
                                                    <span className="text-[9px] font-mono text-muted-foreground/60">{conv.time}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground/80 truncate font-medium">{conv.lastMsg}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{conv.participants} membros</span>
                                                    {conv.unread > 0 && <Badge className="h-3.5 px-1 rounded-sm text-[8px] bg-primary font-bold uppercase transition-all animate-pulse">Novo</Badge>}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </>
            ) : (
                /* CHAT LEVEL */
                <>
                    {/* Chat Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon-xs" onClick={backToInbox} className="size-8 -ml-2 text-muted-foreground">
                                <ChevronLeft className="size-4" />
                            </Button>
                            <div className="relative">
                                {activeConversation?.type === 'person' ? (
                                    <>
                                        <Avatar className="size-9 border border-border/50">
                                            <AvatarImage src={activeConversation.avatar} />
                                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                {activeConversation?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "CM"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Circle className={cn(
                                            "absolute -bottom-0.5 -right-0.5 size-3 fill-current border-2 border-background rounded-full",
                                            activeConversation.status === "online" ? "text-green-500" : "text-orange-500"
                                        )} />
                                    </>
                                ) : (
                                    <div className="size-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                        <Users className="size-5" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-black font-mono tracking-tight uppercase flex items-center gap-2">
                                    {activeConversation?.name || "Conversa"}
                                    <Badge variant="outline" className="text-[8px] font-mono h-3.5 px-1 border-primary/20 text-primary">
                                        {activeConversation?.type === 'person' ? 'TEAM' : 'GROUP'}
                                    </Badge>
                                </h3>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
                                    {activeConversation?.context || "Carregando..."}
                                    {activeConversation?.participants && ` • ${activeConversation.participants} p.`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon-xs" className="size-8 text-muted-foreground">
                                <Phone className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-xs" onClick={closeMessaging} className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                                <X className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <ScrollArea className="flex-1 px-4">
                        <div className="flex flex-col gap-6 py-6 pb-24">
                            {messages.map((msg) => {
                                const isMe = msg.role === "me";
                                return (
                                    <div key={msg.id} className={cn(
                                        "flex flex-col gap-1.5 max-w-[85%]",
                                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                                    )}>
                                        {!isMe && activeConversation?.type === 'project' && (
                                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase ml-1">Membro Externo</span>
                                        )}
                                        <div className={cn(
                                            "p-3.5 rounded-2xl text-sm leading-relaxed transition-all shadow-sm",
                                            isMe
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted/50 border border-border/10 rounded-tl-none hover:bg-muted"
                                        )}>
                                            {msg.content}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-1">
                                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                {mounted ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                            </span>
                                            {isMe && <CheckCheck className="size-3 text-primary/50" />}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Footer / Composer */}
                    <div className="p-4 bg-background border-t border-border absolute bottom-0 left-0 right-0">
                        <div className="bg-muted/30 border border-border rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder={`Conversar em ${activeConversation?.name?.split(' ')[0] || "chat"}...`}
                                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm h-9"
                            />
                            <div className="flex items-center justify-between mt-1 px-1">
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon-xs" className="size-7 text-muted-foreground">
                                        <Paperclip className="size-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon-xs" className="size-7 text-muted-foreground">
                                        <Smile className="size-3.5" />
                                    </Button>
                                    {activeConversation?.type === 'project' && (
                                        <Button variant="ghost" size="icon-xs" className="size-7 text-primary/60">
                                            <Video className="size-3.5" />
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim()}
                                    className="h-8 px-4 rounded-xl shadow-lg shadow-primary/10 font-bold text-[10px] uppercase tracking-widest"
                                >
                                    <Send className="size-3.5 mr-2" />
                                    Enviar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
