"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft, Users, MessageSquare, ThumbsUp, Send, Lock,
    Image as ImageIcon, Calendar, Play, Video,
    MapPin, Monitor, Clock, ChevronRight, CheckCircle2, Plus,
    Heart, Bookmark, Share2,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { formatDistanceToNow, format, isFuture, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "timeline" | "midia" | "agenda" | "membros";

interface AgendaEvent {
    id: string;
    title: string;
    description: string;
    type: "online" | "presencial";
    date: Date;
    time: string;
    duration: string;
    host: string;
    hostId: string;
    location?: string;
    link?: string;
    rsvpCount: number;
    rsvpd: boolean;
}

// ─── Mock agenda per community ────────────────────────────────────────────────

const AGENDA: Record<string, AgendaEvent[]> = {
    comm_01: [
        {
            id: "ev_01a", title: "Workshop: Gatilhos Cognitivos no Design",
            description: "Estudo guiado sobre o livro 'Hooked' com discussão prática de como aplicar ética nos padrões de engajamento.",
            type: "online", date: new Date(Date.now() + 2 * 86400000), time: "19:00", duration: "2h",
            host: "Felipe Designer", hostId: "user_1", link: "#", rsvpCount: 11, rsvpd: false,
        },
        {
            id: "ev_01b", title: "Café & UX — Encontro Presencial",
            description: "Bate-papo descontraído sobre as tendências de UX Research em 2025. Vamos tomar um café e trocar experiências.",
            type: "presencial", date: new Date(Date.now() + 8 * 86400000), time: "10:00", duration: "3h",
            host: "Sarah Chen", hostId: "user_3", location: "WeWork Faria Lima · Sala 203", rsvpCount: 7, rsvpd: true,
        },
        {
            id: "ev_01c", title: "Pesquisa Qualitativa ao Vivo",
            description: "Sessão de user testing aberta — acompanhe ao vivo e dê feedback em tempo real.",
            type: "online", date: new Date(Date.now() - 3 * 86400000), time: "15:00", duration: "1h30",
            host: "Carla Mendes", hostId: "user_5", link: "#", rsvpCount: 18, rsvpd: true,
        },
    ],
    comm_02: [
        {
            id: "ev_02a", title: "One-Shot D&D 5e — A Caverna Esquecida",
            description: "Aventura de one-shot para 4 jogadores. Sistema 5e, personagens pré-prontos disponíveis. Iniciantes bem-vindos!",
            type: "online", date: new Date(Date.now() + 1 * 86400000), time: "20:00", duration: "3h",
            host: "Alex Rivera", hostId: "user_2", link: "#", rsvpCount: 4, rsvpd: false,
        },
        {
            id: "ev_02b", title: "Board Game Night — Presencial",
            description: "Noite de jogos de mesa no escritório. Levaremos Wingspan, Terraforming Mars e mais. BYOB 🍺",
            type: "presencial", date: new Date(Date.now() + 14 * 86400000), time: "18:30", duration: "4h",
            host: "Alex Rivera", hostId: "user_2", location: "Escritório Principal · Sala de Reunião Gamma", rsvpCount: 12, rsvpd: true,
        },
    ],
    comm_03: [
        {
            id: "ev_03a", title: "Discussão: 'Sapiens' — Capítulos 8-12",
            description: "Continuação da leitura mensal. Não deixe para última hora — os capítulos são ricos!",
            type: "online", date: new Date(Date.now() + 5 * 86400000), time: "20:00", duration: "1h30",
            host: "user_1", hostId: "user_1", link: "#", rsvpCount: 14, rsvpd: false,
        },
    ],
    comm_04: [
        {
            id: "ev_04a", title: "Corrida em Grupo — Parque Ibirapuera",
            description: "5km tranquilos para todos os níveis. Ponto de encontro: entrada da Portaria 3.",
            type: "presencial", date: new Date(Date.now() + 3 * 86400000), time: "07:00", duration: "1h",
            host: "user_3", hostId: "user_3", location: "Parque Ibirapuera · Portaria 3", rsvpCount: 9, rsvpd: true,
        },
        {
            id: "ev_04b", title: "Meditação Guiada Online",
            description: "20 minutos de meditação guiada para começar a semana bem. Nenhum equipamento necessário.",
            type: "online", date: new Date(Date.now() + 6 * 86400000), time: "08:00", duration: "30min",
            host: "Carla Mendes", hostId: "user_5", link: "#", rsvpCount: 22, rsvpd: false,
        },
    ],
};

// ─── Category mesh gradient (dark base + radial accents, same pattern as profile) ─

const categoryMesh: Record<string, string> = {
    "Design":           "radial-gradient(circle at 20% 30%, #7c3aed 0, transparent 55%), radial-gradient(circle at 80% 70%, #6366f1 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
    "Tecnologia":       "radial-gradient(circle at 20% 30%, #0ea5e9 0, transparent 55%), radial-gradient(circle at 80% 70%, #6366f1 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
    "Hobbies":          "radial-gradient(circle at 80% 20%, #f59e0b 0, transparent 55%), radial-gradient(circle at 20% 80%, #ea580c 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
    "Cultura":          "radial-gradient(circle at 80% 20%, #ec4899 0, transparent 55%), radial-gradient(circle at 20% 80%, #e11d48 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
    "Saúde & Bem-estar":"radial-gradient(circle at 20% 30%, #10b981 0, transparent 55%), radial-gradient(circle at 80% 70%, #0ea5e9 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
    "Esportes":         "radial-gradient(circle at 20% 30%, #84cc16 0, transparent 55%), radial-gradient(circle at 80% 70%, #10b981 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
    "Carreira":         "radial-gradient(circle at 80% 20%, #6366f1 0, transparent 55%), radial-gradient(circle at 20% 80%, #3b82f6 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
    "Outros":           "radial-gradient(circle at 20% 30%, #475569 0, transparent 55%), radial-gradient(circle at 80% 70%, #334155 0, transparent 55%), linear-gradient(135deg, #020617 0, #0f172a 100%)",
};

// ─── Derived members (mock) ───────────────────────────────────────────────────

const COMMUNITY_MEMBERS: Record<string, Array<{ id: string; name: string; role: string; online?: boolean }>> = {
    comm_01: [
        { id: "user_1",  name: "Felipe Designer", role: "UI Designer",        online: true },
        { id: "user_3",  name: "Sarah Chen",       role: "Líder de QA",       online: true },
        { id: "user_5",  name: "Carla Mendes",     role: "Product Manager",   online: false },
        { id: "user_6",  name: "João Pereira",     role: "UX Researcher",     online: false },
        { id: "user_7",  name: "Ana Lima",         role: "Dev Frontend",      online: true },
        { id: "user_8",  name: "Bruno Castro",     role: "Copywriter",        online: false },
    ],
    comm_02: [
        { id: "user_2",  name: "Alex Rivera",      role: "Eng. Frontend",     online: true },
        { id: "user_4",  name: "Luiz Augusto",     role: "Product Designer",  online: false },
        { id: "user_9",  name: "Diego Matos",      role: "Backend Dev",       online: true },
        { id: "user_10", name: "Priya Sharma",     role: "Data Analyst",      online: false },
    ],
    comm_03: [
        { id: "user_1",  name: "Felipe Designer",  role: "UI Designer",       online: true },
        { id: "user_5",  name: "Carla Mendes",     role: "Product Manager",   online: false },
        { id: "user_6",  name: "João Pereira",     role: "UX Researcher",     online: false },
        { id: "user_11", name: "Fernanda Rocha",   role: "Scrum Master",      online: true },
    ],
    comm_04: [
        { id: "user_3",  name: "Sarah Chen",       role: "Líder de QA",       online: true },
        { id: "user_5",  name: "Carla Mendes",     role: "Product Manager",   online: false },
        { id: "user_7",  name: "Ana Lima",         role: "Dev Frontend",      online: false },
        { id: "user_9",  name: "Diego Matos",      role: "Backend Dev",       online: false },
        { id: "user_12", name: "Tiago Ferreira",   role: "DevOps",            online: true },
    ],
    comm_05: [
        { id: "user_2",  name: "Alex Rivera",      role: "Eng. Frontend",     online: true },
        { id: "user_6",  name: "João Pereira",     role: "UX Researcher",     online: false },
        { id: "user_8",  name: "Bruno Castro",     role: "Copywriter",        online: true },
        { id: "user_10", name: "Priya Sharma",     role: "Data Analyst",      online: false },
        { id: "user_13", name: "Mariana Silva",    role: "Marketing",         online: true },
    ],
    comm_06: [
        { id: "u1",      name: "Luiz Augusto",     role: "Product Designer",  online: true },
        { id: "user_2",  name: "Alex Rivera",      role: "Eng. Frontend",     online: true },
        { id: "user_9",  name: "Diego Matos",      role: "Backend Dev",       online: false },
        { id: "user_12", name: "Tiago Ferreira",   role: "DevOps",            online: true },
        { id: "user_10", name: "Priya Sharma",     role: "Data Analyst",      online: false },
    ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommunityDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { communities, communityPosts, joinedCommunityIds, joinCommunity, leaveCommunity, currentUser, addCommunityPost } = useAppStore();

    const [tab, setTab] = useState<Tab>("timeline");
    const [postContent, setPostContent] = useState("");
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
    const [rsvpdIds, setRsvpdIds] = useState<Set<string>>(new Set());
    const [lightbox, setLightbox] = useState<string | null>(null);

    const community = communities.find(c => c.id === id);
    const posts = communityPosts.filter(p => p.communityId === id);
    const isJoined = joinedCommunityIds.includes(id);
    const events = AGENDA[id] ?? [];
    const members = COMMUNITY_MEMBERS[id] ?? [];

    const upcomingEvents = events.filter(e => isFuture(e.date));
    const pastEvents = events.filter(e => isPast(e.date));

    const allMedia = useMemo(() =>
        posts
            .filter(p => p.mediaUrls && p.mediaUrls.length > 0)
            .flatMap(p => (p.mediaUrls ?? []).map(url => ({ url, type: p.mediaType ?? "image", post: p }))),
        [posts]
    );

    if (!community) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-5xl">😕</div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Grupo não encontrado</p>
                <Link href="/communities">
                    <Button variant="ghost" className="gap-2 font-black uppercase text-[10px] tracking-widest">
                        <ArrowLeft className="size-4" /> Voltar para Grupos
                    </Button>
                </Link>
            </div>
        );
    }

    const mesh = categoryMesh[community.category] ?? categoryMesh["Outros"];

    function handlePost() {
        if (!postContent.trim()) return;
        addCommunityPost({
            communityId: community!.id,
            communityName: community!.name,
            communityEmoji: community!.emoji,
            userId: currentUser.id,
            userName: currentUser.name,
            userRole: currentUser.role,
            content: postContent.trim(),
        });
        setPostContent("");
    }

    function toggleLike(postId: string) {
        setLikedIds(prev => {
            const next = new Set(prev);
            next.has(postId) ? next.delete(postId) : next.add(postId);
            return next;
        });
    }

    function toggleRsvp(eventId: string) {
        setRsvpdIds(prev => {
            const next = new Set(prev);
            next.has(eventId) ? next.delete(eventId) : next.add(eventId);
            return next;
        });
    }

    const TABS: { key: Tab; label: string; icon: any }[] = [
        { key: "timeline", label: "Timeline",  icon: MessageSquare },
        { key: "midia",    label: "Mídia",     icon: ImageIcon },
        { key: "agenda",   label: "Agenda",    icon: Calendar },
        { key: "membros",  label: "Membros",   icon: Users },
    ];

    return (
        <div className="h-full flex flex-col bg-background overflow-hidden">

            {/* ── Cover + Header ────────────────────────────────────────────── */}
            <div className="shrink-0 relative flex flex-col justify-end" style={{ background: mesh }}>
                {/* Grid texture */}
                <div className="absolute inset-0 bg-[size:32px_32px] bg-grid-white/[0.03] pointer-events-none" />
                {/* Bottom fade for readability — same as profile page */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                <div className="relative max-w-[1440px] mx-auto px-6 sm:px-8 w-full">
                    {/* Back button */}
                    <div className="pt-4 pb-2">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white/90 transition-colors"
                        >
                            <ArrowLeft className="size-3.5" />
                            Grupos
                        </button>
                    </div>

                    {/* Community identity */}
                    <div className="flex items-end justify-between gap-6 pb-6 pt-2">
                        <div className="flex items-end gap-5">
                            {/* Big emoji */}
                            <div className="size-20 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-2xl shrink-0">
                                {community.emoji}
                            </div>
                            <div className="pb-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                                        {community.category}
                                    </span>
                                    {community.isPrivate && (
                                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white/40">
                                            <Lock className="size-2.5" /> Privado
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none mb-2">
                                    {community.name}
                                </h1>
                                <p className="text-sm text-white/70 font-medium leading-relaxed max-w-xl">
                                    {community.description}
                                </p>
                                {community.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {community.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/10 text-white/60 border border-white/10">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats + action */}
                        <div className="flex flex-col items-end gap-3 shrink-0 pb-1">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
                                    <Users className="size-3.5" />
                                    {community.memberCount} membros
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
                                    <MessageSquare className="size-3.5" />
                                    {posts.length} posts
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
                                    <Calendar className="size-3.5" />
                                    {upcomingEvents.length} eventos
                                </span>
                            </div>
                            {isJoined ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => leaveCommunity(community.id)}
                                    className="h-9 px-5 rounded-xl font-black uppercase text-[10px] tracking-widest bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300 transition-all"
                                >
                                    Sair do Grupo
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() => joinCommunity(community.id)}
                                    className="h-9 px-5 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90 shadow-lg"
                                >
                                    <Plus className="size-3.5 mr-1.5" />
                                    Participar
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sticky tab bar ────────────────────────────────────────────── */}
            <div className="shrink-0 border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
                    <div className="flex items-center gap-1">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all relative",
                                    tab === t.key
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <t.icon className="size-3.5" />
                                {t.label}
                                {tab === t.key && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Tab content ──────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                        >

                            {/* ════════════════════ TIMELINE ════════════════════ */}
                            {tab === "timeline" && (
                                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

                                    {/* Feed */}
                                    <div className="space-y-4 min-w-0">

                                        {/* Composer */}
                                        {isJoined && (
                                            <Card className="border-border/50 bg-card/50">
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex gap-3">
                                                        <Avatar className="size-9 shrink-0 mt-0.5">
                                                            <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                                            <AvatarFallback className="text-xs font-black">{currentUser.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <textarea
                                                            value={postContent}
                                                            onChange={e => setPostContent(e.target.value)}
                                                            placeholder={`Compartilhe algo com ${community.name}...`}
                                                            className="flex-1 min-h-[80px] resize-none rounded-xl border border-border/50 bg-background/50 p-3 text-sm font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button
                                                            onClick={handlePost}
                                                            disabled={!postContent.trim()}
                                                            className="h-8 px-4 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest gap-2 disabled:opacity-30"
                                                        >
                                                            <Send className="size-3" />
                                                            Publicar
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Posts */}
                                        {posts.length === 0 ? (
                                            <div className="flex flex-col items-center py-20 gap-3">
                                                <span className="text-5xl">{community.emoji}</span>
                                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">
                                                    {isJoined ? "Seja o primeiro a postar!" : "Entre no grupo para ver e criar posts"}
                                                </p>
                                            </div>
                                        ) : (
                                            posts.map(post => {
                                                const liked = likedIds.has(post.id);
                                                return (
                                                    <Card key={post.id} className="border-border/40 bg-card/40 hover:bg-card/60 transition-all">
                                                        <CardContent className="p-5 space-y-4">
                                                            {/* Author */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="size-9">
                                                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${post.userId}`} />
                                                                        <AvatarFallback className="text-xs font-black">{post.userName[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="text-[11px] font-black uppercase tracking-tight">{post.userName}</p>
                                                                        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                                            {post.userRole} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button className="size-7 rounded-lg flex items-center justify-center text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                                                                    <Bookmark className="size-3.5" />
                                                                </button>
                                                            </div>

                                                            {/* Content */}
                                                            <p className="text-sm font-medium leading-relaxed text-foreground/80">
                                                                {post.content}
                                                            </p>

                                                            {/* Media */}
                                                            {post.mediaUrls && post.mediaUrls.length > 0 && (
                                                                <div className={cn(
                                                                    "grid gap-2 rounded-xl overflow-hidden",
                                                                    post.mediaUrls.length === 1 ? "grid-cols-1" :
                                                                    post.mediaUrls.length === 2 ? "grid-cols-2" :
                                                                    "grid-cols-2"
                                                                )}>
                                                                    {post.mediaUrls.map((url, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className={cn(
                                                                                "relative overflow-hidden rounded-xl cursor-pointer group",
                                                                                post.mediaUrls!.length === 3 && i === 0 ? "col-span-2" : "",
                                                                                post.mediaType === "video" ? "bg-black" : ""
                                                                            )}
                                                                            onClick={() => post.mediaType === "image" && setLightbox(url)}
                                                                        >
                                                                            {post.mediaType === "video" ? (
                                                                                <div className="relative aspect-video">
                                                                                    <video
                                                                                        src={url}
                                                                                        className="w-full h-full object-cover"
                                                                                        controls
                                                                                        preload="metadata"
                                                                                    />
                                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                                        <div className="size-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                                                            <Play className="size-5 text-white ml-0.5" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <img
                                                                                    src={url}
                                                                                    alt=""
                                                                                    className={cn(
                                                                                        "w-full object-cover group-hover:scale-105 transition-transform duration-300",
                                                                                        post.mediaUrls!.length === 1 ? "max-h-96" : "aspect-video"
                                                                                    )}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-1 pt-1 border-t border-border/30">
                                                                <button
                                                                    onClick={() => toggleLike(post.id)}
                                                                    className={cn(
                                                                        "flex items-center gap-1.5 h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                                        liked
                                                                            ? "text-red-500 bg-red-500/10"
                                                                            : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                                                    )}
                                                                >
                                                                    <Heart className={cn("size-3.5", liked && "fill-current")} />
                                                                    {post.likesCount + (liked ? 1 : 0)}
                                                                </button>
                                                                <button className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                                                                    <MessageSquare className="size-3.5" />
                                                                    {post.commentsCount}
                                                                </button>
                                                                <button className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all ml-auto">
                                                                    <Share2 className="size-3.5" />
                                                                    Compartilhar
                                                                </button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-4">

                                        {/* Upcoming events */}
                                        {upcomingEvents.length > 0 && (
                                            <Card className="border-border/40 bg-card/30">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Próximos eventos</p>
                                                        <button onClick={() => setTab("agenda")} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1">
                                                            Ver todos <ChevronRight className="size-2.5" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {upcomingEvents.slice(0, 2).map(ev => (
                                                            <div key={ev.id} className="flex gap-3 p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setTab("agenda")}>
                                                                <div className={cn(
                                                                    "size-8 rounded-xl flex items-center justify-center shrink-0",
                                                                    ev.type === "online" ? "bg-blue-500/10" : "bg-emerald-500/10"
                                                                )}>
                                                                    {ev.type === "online"
                                                                        ? <Monitor className="size-4 text-blue-500" />
                                                                        : <MapPin className="size-4 text-emerald-500" />
                                                                    }
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{ev.title}</p>
                                                                    <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">
                                                                        {format(ev.date, "dd/MM", { locale: ptBR })} · {ev.time}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Online members */}
                                        <Card className="border-border/40 bg-card/30">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Membros</p>
                                                    <button onClick={() => setTab("membros")} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1">
                                                        Ver todos <ChevronRight className="size-2.5" />
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {members.slice(0, 5).map(m => (
                                                        <div key={m.id} className="flex items-center gap-2.5">
                                                            <div className="relative shrink-0">
                                                                <Avatar className="size-7">
                                                                    <AvatarImage src={`https://i.pravatar.cc/100?u=${m.id}`} />
                                                                    <AvatarFallback className="text-[9px] font-black">{m.name[0]}</AvatarFallback>
                                                                </Avatar>
                                                                {m.online && <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 border-2 border-background" />}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[10px] font-black uppercase tracking-tight truncate">{m.name}</p>
                                                                <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate">{m.role}</p>
                                                            </div>
                                                            {m.online && (
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">online</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* ════════════════════ MÍDIA ════════════════════ */}
                            {tab === "midia" && (
                                <div>
                                    {allMedia.length === 0 ? (
                                        <div className="flex flex-col items-center py-24 gap-3">
                                            <ImageIcon className="size-12 text-muted-foreground/15" />
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/30">Nenhuma mídia compartilhada</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between mb-5">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                                    {allMedia.length} arquivo{allMedia.length !== 1 ? "s" : ""} compartilhado{allMedia.length !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                                {allMedia.map((m, i) => (
                                                    <div
                                                        key={i}
                                                        className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-muted/20"
                                                        onClick={() => m.type === "image" && setLightbox(m.url)}
                                                    >
                                                        {m.type === "video" ? (
                                                            <div className="w-full h-full flex items-center justify-center bg-black/50">
                                                                <Video className="size-8 text-white/50" />
                                                                <span className="absolute bottom-2 left-2 text-[8px] font-black uppercase tracking-widest text-white/60 bg-black/40 px-1.5 py-0.5 rounded-md">Vídeo</span>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={m.url}
                                                                alt=""
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
                                                            <div className="flex items-center gap-1.5">
                                                                <Avatar className="size-5">
                                                                    <AvatarImage src={`https://i.pravatar.cc/100?u=${m.post.userId}`} />
                                                                    <AvatarFallback className="text-[7px] font-black">{m.post.userName[0]}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-[8px] font-black text-white/80 uppercase tracking-wide">{m.post.userName.split(" ")[0]}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ════════════════════ AGENDA ════════════════════ */}
                            {tab === "agenda" && (
                                <div className="max-w-2xl space-y-8">

                                    {/* Upcoming */}
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
                                            Próximos eventos · {upcomingEvents.length}
                                        </p>
                                        {upcomingEvents.length === 0 ? (
                                            <div className="flex flex-col items-center py-12 gap-3 border border-dashed border-border/40 rounded-2xl">
                                                <Calendar className="size-8 text-muted-foreground/15" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Nenhum evento agendado</p>
                                                {isJoined && (
                                                    <button className="flex items-center gap-2 h-8 px-4 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                                                        <Plus className="size-3.5" />
                                                        Criar evento
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {upcomingEvents.map(ev => {
                                                    const rsvpd = ev.rsvpd || rsvpdIds.has(ev.id);
                                                    const removedRsvp = !ev.rsvpd && ev.rsvpd === false && rsvpdIds.has(ev.id) === false && ev.rsvpd;
                                                    return (
                                                        <EventCard
                                                            key={ev.id}
                                                            event={ev}
                                                            rsvpd={rsvpd}
                                                            onToggleRsvp={() => toggleRsvp(ev.id)}
                                                            past={false}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Past */}
                                    {pastEvents.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-4">
                                                Eventos anteriores · {pastEvents.length}
                                            </p>
                                            <div className="space-y-3">
                                                {pastEvents.map(ev => (
                                                    <EventCard key={ev.id} event={ev} rsvpd={ev.rsvpd} onToggleRsvp={() => {}} past={true} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ════════════════════ MEMBROS ════════════════════ */}
                            {tab === "membros" && (
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                                {community.memberCount} membros
                                            </p>
                                            <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-widest mt-0.5">
                                                {members.filter(m => m.online).length} online agora
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                        {members.map(m => (
                                            <div
                                                key={m.id}
                                                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all group cursor-pointer"
                                            >
                                                <div className="relative">
                                                    <Avatar className="size-14 border-2 border-border/30 group-hover:border-primary/30 transition-all">
                                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${m.id}`} />
                                                        <AvatarFallback className="text-sm font-black">{m.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    {m.online && (
                                                        <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-background" />
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{m.name}</p>
                                                    <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5 leading-tight">{m.role}</p>
                                                </div>
                                                {m.online && (
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                                        online
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Lightbox ─────────────────────────────────────────────────── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 cursor-zoom-out"
                        onClick={() => setLightbox(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={lightbox}
                            alt=""
                            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Event Card sub-component ─────────────────────────────────────────────────

function EventCard({
    event,
    rsvpd,
    onToggleRsvp,
    past,
}: {
    event: AgendaEvent;
    rsvpd: boolean;
    onToggleRsvp: () => void;
    past: boolean;
}) {
    return (
        <div className={cn(
            "flex gap-4 p-4 rounded-2xl border transition-all",
            past
                ? "border-border/20 bg-muted/10 opacity-60"
                : "border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/60"
        )}>
            {/* Date block */}
            <div className="shrink-0 w-12 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                    {format(event.date, "MMM", { locale: ptBR })}
                </span>
                <span className="text-2xl font-black font-mono leading-none">
                    {format(event.date, "dd")}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/40">
                    {format(event.date, "EEE", { locale: ptBR })}
                </span>
            </div>

            <div className="w-px bg-border/30 shrink-0" />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                event.type === "online"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-emerald-500/10 text-emerald-500"
                            )}>
                                {event.type === "online"
                                    ? <><Monitor className="size-2.5" /> Online</>
                                    : <><MapPin className="size-2.5" /> Presencial</>
                                }
                            </span>
                        </div>
                        <p className="text-sm font-black uppercase tracking-tight leading-snug">{event.title}</p>
                    </div>
                    {!past && (
                        <button
                            onClick={onToggleRsvp}
                            className={cn(
                                "shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                rsvpd
                                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/20"
                                    : "border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"
                            )}
                        >
                            {rsvpd ? <><CheckCircle2 className="size-3" /> Confirmado</> : <><Plus className="size-3" /> Confirmar</>}
                        </button>
                    )}
                </div>

                <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed mb-2 line-clamp-2">
                    {event.description}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        <Clock className="size-3" />
                        {event.time} · {event.duration}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        <Users className="size-3" />
                        {event.rsvpCount} confirmados
                    </span>
                    {event.location && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                            <MapPin className="size-3" />
                            {event.location}
                        </span>
                    )}
                    {event.link && event.type === "online" && (
                        <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-500/60 hover:text-blue-500 transition-colors"
                        >
                            <Monitor className="size-3" />
                            Acessar link
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
