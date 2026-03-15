"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    Filter,
    List,
    MoreHorizontal,
    Calendar,
    MessageSquare,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    Camera,
    ChevronDown,
    FolderKanban,
    Upload,
    Pencil,
    Github,
    Slack,
    Figma,
    Puzzle,
    Play,
    Heart,
    Share2,
    Bookmark,
    Image as ImageIcon,
    Video,
    Monitor,
    MapPin,
    ExternalLink,
    UserCheck,
    ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format, isFuture, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FLAT_AGENDA, type AgendaEventFlat } from "@/features/communities/lib/agenda-mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";
import { Publisher } from "@/features/social/components/publisher";

const STATUS_OPTIONS = [
    { label: "Todas", value: "ALL" },
    { label: "A Fazer", value: "TODO" },
    { label: "Em Progresso", value: "IN_PROGRESS" },
    { label: "Em Revisão", value: "REVIEW" },
    { label: "Concluído", value: "DONE" },
];

const PRIORITY_OPTIONS = [
    { label: "Todas", value: "ALL" },
    { label: "Urgente", value: "URGENT" },
    { label: "Alta", value: "HIGH" },
    { label: "Média", value: "MEDIUM" },
    { label: "Baixa", value: "LOW" },
];

// ─── Teams & Squads data ─────────────────────────────────────────────────────
type MemberLevel = "lead" | "senior" | "pleno" | "junior" | "po" | "pm" | "em";
interface TeamMember { id: string; name: string; role: string; level: MemberLevel; }
interface TeamEntry {
    id: string; name: string; emoji: string;
    type: "time" | "squad";
    description: string;
    color: string; borderColor: string; bgColor: string; badgeColor: string;
    members: TeamMember[];
}

const TEAMS_DATA: TeamEntry[] = [
    {
        id: "time_design",
        name: "Time de Design",
        emoji: "🎨",
        type: "time",
        description: "Designers UX/UI responsáveis pela experiência do produto",
        color: "text-pink-400", borderColor: "border-pink-500/20", bgColor: "bg-pink-500/5", badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
        members: [
            { id: "user_1",  name: "Felipe Designer", role: "UI Designer",        level: "lead"   },
            { id: "user_6",  name: "João Pereira",     role: "UX Research",        level: "senior" },
            { id: "user_4",  name: "Luiz Augusto",     role: "Product Designer",   level: "pleno"  },
            { id: "user_8",  name: "Bruno Castro",     role: "UX Writer",          level: "pleno"  },
        ],
    },
    {
        id: "squad_itau",
        name: "Squad Atendimento Itaú",
        emoji: "🏦",
        type: "squad",
        description: "Produto de atendimento digital para o cliente Itaú",
        color: "text-primary", borderColor: "border-primary/20", bgColor: "bg-primary/5", badgeColor: "bg-primary/10 text-primary border-primary/20",
        members: [
            { id: "user_po", name: "Carla Mendes",   role: "Product Owner",  level: "po"     },
            { id: "user_em", name: "Rafael Torres",  role: "Eng. Manager",   level: "em"     },
            { id: "user_1",  name: "Felipe Designer",role: "UI Designer",    level: "lead"   },
            { id: "user_7",  name: "Ana Lima",        role: "Dev Frontend",   level: "senior" },
            { id: "user_2",  name: "Alex Rivera",     role: "Eng. Frontend",  level: "pleno"  },
            { id: "user_9",  name: "Diego Matos",     role: "Backend Dev",    level: "senior" },
            { id: "user_12", name: "Tiago Ferreira",  role: "DevOps",         level: "senior" },
            { id: "user_3",  name: "Sarah Chen",      role: "QA Lead",        level: "lead"   },
        ],
    },
    {
        id: "squad_vevo",
        name: "Squad Startup VeVo",
        emoji: "🚀",
        type: "squad",
        description: "Squad dedicada ao produto da startup VeVo",
        color: "text-emerald-400", borderColor: "border-emerald-500/20", bgColor: "bg-emerald-500/5", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        members: [
            { id: "user_5",  name: "Carla M.",        role: "PM",              level: "pm"     },
            { id: "user_4",  name: "Luiz Augusto",    role: "Product Designer",level: "pleno"  },
            { id: "user_13", name: "Mariana Silva",   role: "React Dev",       level: "pleno"  },
            { id: "user_10", name: "Priya Sharma",    role: "Data Analyst",    level: "senior" },
            { id: "user_11", name: "Fernanda Rocha",  role: "Scrum Master",    level: "senior" },
            { id: "user_6",  name: "João Pereira",    role: "UX Research",     level: "senior" },
        ],
    },
];

const LEVEL_CONFIG: Record<MemberLevel, { label: string; color: string }> = {
    lead:   { label: "Lead",    color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    senior: { label: "Sênior",  color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    pleno:  { label: "Pleno",   color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    junior: { label: "Júnior",  color: "bg-muted text-muted-foreground border-border/50" },
    po:     { label: "PO",      color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    pm:     { label: "PM",      color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    em:     { label: "EM",      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
};

// ─── Inline editable field ───────────────────────────────────────────────────
function EditableField({
    value,
    onSave,
    as = "input",
    className,
    inputClassName,
}: {
    value: string;
    onSave: (v: string) => void;
    as?: "input" | "textarea";
    className?: string;
    inputClassName?: string;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editing) ref.current?.focus();
    }, [editing]);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    const commit = () => {
        setEditing(false);
        if (draft.trim() !== value) onSave(draft.trim());
    };

    if (editing) {
        const shared = {
            ref,
            value: draft,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
            onBlur: commit,
            onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" && as === "input") commit();
                if (e.key === "Escape") { setDraft(value); setEditing(false); }
            },
            className: cn(
                "bg-white/10 border border-white/30 rounded-lg px-2 py-1 text-white outline-none focus:ring-2 focus:ring-white/40 w-full resize-none",
                inputClassName
            ),
        };
        return as === "textarea"
            ? <textarea {...shared} rows={2} />
            : <input {...shared} />;
    }

    return (
        <span
            className={cn("group/edit relative cursor-pointer inline-flex items-center gap-1.5", className)}
            onClick={() => setEditing(true)}
        >
            {value || <span className="opacity-40 italic">Clique para editar</span>}
            <Pencil className="size-3 opacity-0 group-hover/edit:opacity-60 transition-opacity shrink-0" />
        </span>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function UserTaskCenter() {
    const { tasks, projects, currentUser, updateCurrentUser, startTask, joinedCommunityIds } = useAppStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") ?? "feed";

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [projectFilter, setProjectFilter] = useState("ALL");
    const [coverTheme, setCoverTheme] = useState("mesh-2");
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
    const [rsvpdIds, setRsvpdIds] = useState<Set<string>>(new Set(
        FLAT_AGENDA.filter(e => e.rsvpdByDefault).map(e => e.id)
    ));
    const [showNewEventForm, setShowNewEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", communityId: "", type: "online" as "online" | "presencial", date: "", time: "", duration: "", description: "" });

    // ── Agenda ────────────────────────────────────────────────────────
    const myAgenda = useMemo(() =>
        FLAT_AGENDA
            .filter(e => joinedCommunityIds.includes(e.communityId))
            .sort((a, b) => a.date.getTime() - b.date.getTime()),
        [joinedCommunityIds]
    );
    const upcomingEvents = myAgenda.filter(e => isFuture(e.date));
    const pastEvents = myAgenda.filter(e => isPast(e.date));

    // ── Team detail drill-down ────────────────────────────────────
    const [selectedTeam, setSelectedTeam] = useState<TeamEntry | null>(null);

    // ── Mock feed (community posts + task activities) ──────────────────
    const mockFeed = useMemo(() => [
        {
            id: "f1", kind: "post" as const,
            communityName: "Dev & Open Source", communityEmoji: "⚡",
            content: "Descobri o Zustand hoje e ele virou meu gerenciador de estado favorito de vez 🚀 A API é inacreditavelmente simples — zero boilerplate, sem Context, sem providers. Quem ainda não testou, recomendo muito.",
            mediaUrls: ["https://picsum.photos/seed/zustand/800/400"],
            mediaType: "image" as const,
            likesCount: 14, commentsCount: 5,
            createdAt: new Date(Date.now() - 25 * 60000),
        },
        {
            id: "f2", kind: "task_done" as const,
            taskTitle: "Ajustar padding do Mobile Header",
            projectName: "Projeto Alpha",
            priority: "LOW",
            createdAt: new Date(Date.now() - 2 * 3600000),
        },
        {
            id: "f3", kind: "post" as const,
            communityName: "Psicologia & UX", communityEmoji: "🧠",
            content: "Pequeno experimento que fizemos essa semana: ao remover o contador de notificações do ícone de sino, o engajamento com a área caiu 38%. O número cria urgência — mesmo que o usuário saiba que é artificial. Nir Eyal explica bem isso no Hooked.",
            likesCount: 22, commentsCount: 8,
            createdAt: new Date(Date.now() - 3.5 * 3600000),
        },
        {
            id: "f4", kind: "task_review" as const,
            taskTitle: "Refatorar Context API para Zustand",
            projectName: "Mobile App Refactor",
            priority: "HIGH",
            createdAt: new Date(Date.now() - 5 * 3600000),
        },
        {
            id: "f5", kind: "post" as const,
            communityName: "Música & Playlists", communityEmoji: "🎵",
            content: "Playlist de foco que tenho usado essa semana enquanto codifico — Lo-fi + Jazz Fusion. Sobe a concentração de um jeito que nenhuma outra consegue. Link nos comentários 🎧",
            mediaUrls: [
                "https://picsum.photos/seed/music1/800/500",
                "https://picsum.photos/seed/music2/800/500",
            ],
            mediaType: "image" as const,
            likesCount: 31, commentsCount: 12,
            createdAt: new Date(Date.now() - 7 * 3600000),
        },
        {
            id: "f6", kind: "task_started" as const,
            taskTitle: "Validar tokens JWT no Middleware",
            projectName: "Integração SSO",
            priority: "HIGH",
            createdAt: new Date(Date.now() - 9 * 3600000),
        },
        {
            id: "f7", kind: "post" as const,
            communityName: "Psicologia & UX", communityEmoji: "🧠",
            content: "Capturas do novo onboarding que lançamos essa semana. Redução de 60% no drop-off no primeiro dia — a mudança de uma tela de 7 campos para um fluxo de 3 perguntas simples fez toda a diferença 🚀",
            mediaUrls: [
                "https://picsum.photos/seed/onboard1/800/500",
                "https://picsum.photos/seed/onboard2/800/500",
                "https://picsum.photos/seed/onboard3/800/500",
            ],
            mediaType: "image" as const,
            likesCount: 41, commentsCount: 9,
            createdAt: new Date(Date.now() - 11 * 3600000),
        },
        {
            id: "f8", kind: "task_assigned" as const,
            taskTitle: "Corrigir vazamento de memória no SSR",
            projectName: "Projeto Alpha",
            priority: "URGENT",
            assignedBy: "Sarah Chen",
            createdAt: new Date(Date.now() - 14 * 3600000),
        },
        {
            id: "f9", kind: "post" as const,
            communityName: "RPG & Jogos de Mesa", communityEmoji: "🎲",
            content: "Confirmo presença na sessão de D&D de sexta! Já escolhi meu personagem — Druida do Círculo da Lua, nível 5. Vou de wild shape em qualquer coisa que aparecer na frente 🐻",
            likesCount: 7, commentsCount: 3,
            createdAt: new Date(Date.now() - 18 * 3600000),
        },
    ], []);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
            const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
            const matchesProject = projectFilter === "ALL" || task.projectId === projectFilter;
            return matchesSearch && matchesStatus && matchesPriority && matchesProject;
        });
    }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE": return <CheckCircle2 className="size-3.5 text-green-500" />;
            case "IN_PROGRESS": return <Clock className="size-3.5 text-primary" />;
            case "REVIEW": return <AlertCircle className="size-3.5 text-blue-500" />;
            default: return <Clock className="size-3.5 text-muted-foreground" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT": return "bg-destructive/10 text-destructive border-destructive/20";
            case "HIGH": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "MEDIUM": return "bg-primary/10 text-primary border-primary/20";
            default: return "bg-muted text-muted-foreground border-muted-foreground/20";
        }
    };

    const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || "Geral";

    const taskStats = useMemo(() => ({
        total: tasks.length,
        pending: tasks.filter(t => t.status !== "DONE").length,
        done: tasks.filter(t => t.status === "DONE").length,
    }), [tasks]);


    const integrations = [
        { name: "GitHub", icon: Github, color: "bg-zinc-900 dark:bg-zinc-800", desc: "Conecte repositórios e commits" },
        { name: "Slack", icon: Slack, color: "bg-[#4A154B]", desc: "Notificações e alertas em tempo real" },
        { name: "Figma", icon: Figma, color: "bg-[#1E1E1E]", desc: "Sincronize designs e protótipos" },
        { name: "Jira", icon: Puzzle, color: "bg-[#0052CC]", desc: "Importe issues e sprints do Jira" },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-background overflow-y-auto">

            {/* ── Cover + Profile Header ─────────────────────────────────── */}
            <div className="relative group/cover shrink-0 h-[380px] flex flex-col justify-end">
                {/* Cover backdrop */}
                <div
                    className={cn(
                        "absolute inset-0 transition-all duration-700",
                        coverTheme === "mesh-1" && "bg-[radial-gradient(circle_at_20%_30%,#0ea5e9_0,transparent_50%),radial-gradient(circle_at_80%_70%,#6366f1_0,transparent_50%),linear-gradient(135deg,#020617_0,#0f172a_100%)]",
                        coverTheme === "mesh-2" && "bg-[radial-gradient(circle_at_80%_20%,#ec4899_0,transparent_50%),radial-gradient(circle_at_20%_80%,#8b5cf6_0,transparent_50%),linear-gradient(135deg,#020617_0,#0f172a_100%)]",
                        coverTheme === "dark" && "bg-slate-950",
                        coverTheme === "custom" && "bg-cover bg-center bg-no-repeat"
                    )}
                    style={coverTheme === "custom" ? { backgroundImage: 'url("/images/task-cover.png")' } : {}}
                >
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                {/* Edit cover button */}
                <div className="absolute top-4 right-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div
                                role="button"
                                className="bg-background/50 backdrop-blur-md border border-border/50 opacity-0 group-hover/cover:opacity-100 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 h-9 px-4 rounded-xl shadow-xl cursor-pointer hover:bg-background/80 active:scale-95"
                            >
                                <Camera className="size-3.5" />
                                Editar Capa
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 bg-background/80 backdrop-blur-xl">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground">Imagem Personalizada</DropdownMenuLabel>
                                <DropdownMenuItem
                                    className="rounded-xl px-3 py-2 gap-3 cursor-pointer"
                                    onSelect={(e) => { e.preventDefault(); document.getElementById("cover-upload-input")?.click(); }}
                                >
                                    <Upload className="size-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-tight">Carregar Imagem</span>
                                </DropdownMenuItem>
                                <input
                                    id="cover-upload-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const url = URL.createObjectURL(file);
                                        setCoverTheme("custom");
                                        (window as any).__customCoverUrl = url;
                                        e.target.value = "";
                                    }}
                                />
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground">Temas Disponíveis</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setCoverTheme("mesh-1")} className="rounded-xl px-3 py-2 gap-3 cursor-pointer">
                                    <div className="size-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-border/50" />
                                    <span className="text-xs font-bold uppercase tracking-tight">Mesh Blue</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setCoverTheme("mesh-2")} className="rounded-xl px-3 py-2 gap-3 cursor-pointer">
                                    <div className="size-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border border-border/50" />
                                    <span className="text-xs font-bold uppercase tracking-tight">Mesh Pink</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setCoverTheme("dark")} className="rounded-xl px-3 py-2 gap-3 cursor-pointer">
                                    <div className="size-4 rounded-full bg-slate-950 border border-border/50" />
                                    <span className="text-xs font-bold uppercase tracking-tight">Dark Solid</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Profile identity */}
                <div className="max-w-[1440px] mx-auto w-full px-8 relative">
                    <div className="flex items-center justify-between gap-6 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="relative group/avatar shrink-0">
                                <Avatar className="size-28 rounded-full border-4 border-background shadow-2xl ring-1 ring-border/50">
                                    <AvatarImage src={`https://i.pravatar.cc/200?u=${currentUser.id}`} />
                                    <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                                        {currentUser.name?.[0] ?? "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <button className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center text-white rounded-full">
                                    <Camera className="size-6" />
                                </button>
                            </div>

                            {/* Name / jobTitle / jobObjective */}
                            <div className="min-w-0">
                                <EditableField
                                    value={currentUser.name}
                                    onSave={(v) => updateCurrentUser({ name: v })}
                                    className="text-4xl font-black font-mono tracking-tighter uppercase text-white drop-shadow-lg block mb-1"
                                    inputClassName="text-3xl font-black font-mono tracking-tighter uppercase"
                                />
                                <EditableField
                                    value={currentUser.jobTitle ?? ""}
                                    onSave={(v) => updateCurrentUser({ jobTitle: v })}
                                    className="text-sm font-bold text-white/80 uppercase tracking-[0.2em] drop-shadow block mb-1"
                                    inputClassName="text-sm font-bold uppercase tracking-[0.15em]"
                                />
                                <EditableField
                                    value={currentUser.jobObjective ?? ""}
                                    onSave={(v) => updateCurrentUser({ jobObjective: v })}
                                    as="textarea"
                                    className="text-xs text-white/60 max-w-lg block leading-relaxed"
                                    inputClassName="text-xs leading-relaxed"
                                />
                                <p className="text-[11px] text-white/40 font-bold mt-2 uppercase tracking-widest">
                                    {currentUser.email}
                                </p>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="flex gap-8 px-8 py-3 mb-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/20 shrink-0">
                            {[
                                { label: "Tarefas", val: taskStats.total, color: "text-primary" },
                                { label: "Pendentes", val: taskStats.pending, color: "text-orange-500" },
                                { label: "Concluídas", val: taskStats.done, color: "text-green-600" },
                            ].map(st => (
                                <div key={st.label} className="text-center">
                                    <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">{st.label}</p>
                                    <p className={cn("text-2xl font-black font-mono tracking-tighter", st.color)}>{st.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tab navigation ────────────────────────────────────────── */}
            <Tabs defaultValue={initialTab} className="flex-1 flex flex-col min-h-0">
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40">
                    <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
                        <TabsList className="h-12 bg-transparent gap-0 p-0 rounded-none">
                            {[
                                { value: "feed", label: "Meu Feed" },
                                { value: "tasks", label: "Tarefas" },
                                { value: "agenda", label: "Agenda" },
                                { value: "team", label: "Equipe" },
                                { value: "integrations", label: "Integrações" },
                            ].map(tab => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="h-12 px-5 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 bg-transparent text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-all"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>

                {/* ── Meu Feed ────────────────────────────────────────────── */}
                <TabsContent value="feed" className="flex-1 mt-0 data-[state=inactive]:hidden">
                    <div className="max-w-[860px] mx-auto w-full">
                        <Publisher />
                    </div>
                    <div className="max-w-[860px] mx-auto px-6 pb-6 w-full space-y-6">
                        {mockFeed.map(item => {
                            if (item.kind === "post") {
                                const liked = likedIds.has(item.id);
                                return (
                                    <div key={item.id} className="relative pl-8 group">
                                        {/* Timeline line */}
                                        <div className="absolute left-3 top-8 bottom-[-18px] w-px bg-border group-last:bg-transparent" />
                                        {/* Timeline icon */}
                                        <div className="absolute left-0 top-1.5 size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center z-10 shadow-sm text-xs">
                                            {item.communityEmoji}
                                        </div>

                                        <Card className="border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all duration-300 group-hover:shadow-md">
                                            <CardContent className="p-4 space-y-3">
                                                {/* Author row */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-8 ring-2 ring-primary/10">
                                                            <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                                            <AvatarFallback className="text-xs font-black">{currentUser.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="space-y-0.5">
                                                            <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{currentUser.name}</p>
                                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                {formatDistanceToNow(item.createdAt, { addSuffix: true, locale: ptBR })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg shrink-0">
                                                        {item.communityEmoji} {item.communityName}
                                                    </Badge>
                                                </div>

                                                {/* Content */}
                                                <div className="text-xs font-medium leading-relaxed text-foreground/80 pl-11 border-l-2 border-primary/20 ml-4">
                                                    {item.content}
                                                </div>

                                                {/* Media */}
                                                {item.mediaUrls && item.mediaUrls.length > 0 && (
                                                    <div className={cn(
                                                        "grid gap-1.5 rounded-2xl overflow-hidden mt-1",
                                                        item.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
                                                    )}>
                                                        {item.mediaUrls.map((url, i) => (
                                                            <div key={i} className={cn(
                                                                "relative rounded-xl overflow-hidden bg-muted/40 cursor-pointer",
                                                                item.mediaUrls!.length === 1 ? "aspect-video" : "aspect-square",
                                                                item.mediaUrls!.length === 3 && i === 0 ? "col-span-2 aspect-video" : ""
                                                            )}>
                                                                <img src={url} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 pt-1 border-t border-primary/10 mt-2">
                                                    <button
                                                        onClick={() => setLikedIds(prev => { const n = new Set(prev); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}
                                                        className={cn(
                                                            "flex items-center gap-1.5 h-7 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                                            liked ? "text-red-500 bg-red-500/5" : "text-muted-foreground hover:text-primary"
                                                        )}
                                                    >
                                                        <Heart className={cn("size-3", liked && "fill-current")} />
                                                        {(item.likesCount ?? 0) + (liked ? 1 : 0)}
                                                    </button>
                                                    <button className="flex items-center gap-1.5 h-7 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all">
                                                        <MessageSquare className="size-3" />
                                                        {item.commentsCount ?? 0}
                                                    </button>
                                                    <button className="flex items-center gap-1.5 h-7 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all ml-auto">
                                                        <Share2 className="size-3" />
                                                        Compartilhar
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            }

                            // ── Task activity items ──────────────────────────
                            const taskConfig = {
                                task_done:     { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-card border-border", iconBg: "bg-emerald-500/10", label: "Tarefa concluída" },
                                task_started:  { icon: Play,         color: "text-primary",     bg: "bg-card border-border", iconBg: "bg-primary/10",     label: "Tarefa iniciada" },
                                task_review:   { icon: AlertCircle,  color: "text-blue-500",    bg: "bg-card border-border", iconBg: "bg-blue-500/10",    label: "Enviada para revisão" },
                                task_assigned: { icon: Plus,         color: "text-amber-500",   bg: "bg-card border-border", iconBg: "bg-amber-500/10",   label: "Nova tarefa atribuída" },
                            }[item.kind] ?? { icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-card border-border", iconBg: "bg-muted/20", label: item.kind };

                            const TaskIcon = taskConfig.icon;

                            return (
                                <div key={item.id} className="relative pl-8 group">
                                    {/* Timeline line */}
                                    <div className="absolute left-3 top-8 bottom-[-18px] w-px bg-border group-last:bg-transparent" />
                                    {/* Timeline icon */}
                                    <div className={cn("absolute left-0 top-1.5 size-6 rounded-full flex items-center justify-center z-10 shadow-sm border border-border bg-card", taskConfig.iconBg)}>
                                        <TaskIcon className={cn("size-3.5", taskConfig.color)} />
                                    </div>

                                    <Card className="border-border bg-card/50 hover:bg-card transition-all duration-300 group-hover:shadow-md">
                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8 ring-2 ring-primary/10">
                                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                                                        <AvatarFallback className="text-xs font-black">{currentUser.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{currentUser.name}</p>
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {formatDistanceToNow(item.createdAt, { addSuffix: true, locale: ptBR })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge className={cn("text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg shrink-0 border", taskConfig.color, taskConfig.iconBg)}>
                                                    {taskConfig.label}
                                                </Badge>
                                            </div>

                                            <div className="mt-2 text-xs font-medium leading-relaxed text-foreground/80 pl-11 border-l-2 border-border/50 ml-4">
                                                <span className="font-black text-foreground/90">{item.taskTitle}</span>
                                                {"projectName" in item && item.projectName && (
                                                    <span className="text-muted-foreground/60"> · {item.projectName}</span>
                                                )}
                                                {"assignedBy" in item && item.assignedBy && (
                                                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                                                        atribuída por {item.assignedBy}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* ── Tarefas ─────────────────────────────────────────────── */}
                <TabsContent value="tasks" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
                    {/* Toolbar */}
                    <div className="border-b border-border/40 py-4">
                        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative flex-1 max-w-md group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Filtrar por nome de tarefa..."
                                        className="pl-10 bg-muted/30 border-border/50 h-11 rounded-xl text-sm font-medium focus-visible:ring-primary/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div role="button" className="rounded-xl border border-border/50 font-bold text-[10px] uppercase tracking-widest gap-2 h-11 px-4 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
                                                <FolderKanban className="size-3.5 text-primary" />
                                                Projeto: <span className="text-primary font-black ml-1">{projectFilter === "ALL" ? "Todos" : getProjectName(projectFilter)}</span>
                                                <ChevronDown className="size-3.5 opacity-50 ml-2" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 rounded-2xl p-2 border-border/50 scrollbar-hide">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={() => setProjectFilter("ALL")} className="rounded-xl">Todos os Projetos</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {projects.map(p => (
                                                    <DropdownMenuItem key={p.id} onClick={() => setProjectFilter(p.id)} className="rounded-xl px-3 py-2 flex items-center gap-2">
                                                        <div className={cn("size-2 rounded-full", p.color)} />
                                                        <span className="text-xs font-bold uppercase">{p.name}</span>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div role="button" className="rounded-xl border border-border/50 font-bold text-[10px] uppercase tracking-widest gap-2 h-11 px-4 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
                                                <Filter className="size-3.5 text-muted-foreground" />
                                                Status: <span className="text-foreground font-black ml-1">{STATUS_OPTIONS.find(s => s.value === statusFilter)?.label}</span>
                                                <ChevronDown className="size-3.5 opacity-50 ml-2" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 rounded-2xl p-2 border-border/50">
                                            <DropdownMenuGroup>
                                                {STATUS_OPTIONS.map(s => (
                                                    <DropdownMenuItem key={s.value} onClick={() => setStatusFilter(s.value)} className="rounded-xl">{s.label}</DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <Button className="h-11 rounded-xl px-6 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95">
                                <Plus className="size-4 mr-2" />
                                Nova Tarefa
                            </Button>
                        </div>
                    </div>

                    {/* Task list */}
                    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-6 w-full">
                        {filteredTasks.length > 0 ? (
                            <div>
                                {/* ── Column header ── */}
                                <div className="flex items-center gap-4 px-4 pb-2 border-b border-border/30 mb-2">
                                    <div className="size-10 shrink-0" />
                                    <div className="flex-1 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Tarefa</div>
                                    <div className="w-[110px] shrink-0 text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Prioridade</div>
                                    <div className="w-[160px] shrink-0 text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Status</div>
                                    <div className="w-[88px] shrink-0" />
                                </div>

                                {/* ── Rows ── */}
                                <div className="space-y-1.5">
                                    {filteredTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="group flex items-center gap-4 px-4 py-3 rounded-2xl bg-card/30 border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all duration-200"
                                        >
                                            {/* ID */}
                                            <div className="size-10 shrink-0 rounded-xl bg-background flex items-center justify-center border border-border group-hover:border-primary/20 transition-all font-mono text-[10px] font-black text-muted-foreground">
                                                {task.id}
                                            </div>

                                            {/* Title + meta */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-1">
                                                    <h3 className="text-sm font-black tracking-tight uppercase group-hover:text-primary transition-colors truncate">
                                                        {task.title}
                                                    </h3>
                                                    <Badge variant="outline" className="shrink-0 h-4 px-1.5 text-[9px] font-mono border-primary/20 text-primary/70 uppercase tracking-tighter">
                                                        {getProjectName(task.projectId)}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="size-3" />
                                                        {task.dueDate || "Sem data"}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MessageSquare className="size-3" />
                                                        2 comentários
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Priority — fixed width, center-aligned */}
                                            <div className="w-[110px] shrink-0 flex justify-center">
                                                <Badge variant="outline" className={cn("text-[10px] font-black border px-2.5 h-5", getPriorityColor(task.priority))}>
                                                    {task.priority}
                                                </Badge>
                                            </div>

                                            {/* Status — fixed width, center-aligned */}
                                            <div className="w-[160px] shrink-0 flex items-center justify-center gap-2">
                                                {getStatusIcon(task.status)}
                                                <span className="text-[10px] font-black uppercase tracking-tight whitespace-nowrap">
                                                    {task.status.replace(/_/g, " ")}
                                                </span>
                                            </div>

                                            {/* Actions — fixed width */}
                                            <div className="w-[88px] shrink-0 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                {task.status === 'TODO' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2.5 rounded-xl gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10"
                                                        onClick={() => { startTask(task.id); router.push('/'); }}
                                                    >
                                                        <Play className="size-3 fill-current" />
                                                        Iniciar
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="size-7 rounded-xl hover:bg-primary/5">
                                                    <MoreHorizontal className="size-4 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-card/10 border border-dashed border-border/50 rounded-[2rem]">
                                <div className="size-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
                                    <List className="size-8 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-lg font-black font-mono uppercase tracking-tight mb-1">Nenhuma tarefa encontrada</h3>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Tente ajustar seus filtros ou busca</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ── Agenda ──────────────────────────────────────────────── */}
                <TabsContent value="agenda" className="flex-1 mt-0 data-[state=inactive]:hidden">
                    <div className="max-w-[860px] mx-auto px-6 py-6 w-full">
                        {/* Header + create button */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Agenda dos Grupos</h2>
                                <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-wider mt-0.5">
                                    {upcomingEvents.length} próximos eventos
                                </p>
                            </div>
                            <Button
                                size="sm"
                                className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                                onClick={() => setShowNewEventForm(v => !v)}
                            >
                                <Plus className="size-3.5" />
                                Criar Evento
                            </Button>
                        </div>

                        {/* New event inline form */}
                        {showNewEventForm && (
                            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
                                <p className="text-xs font-black uppercase tracking-widest text-primary">Novo Evento</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <Input
                                            placeholder="Título do evento"
                                            value={newEvent.title}
                                            onChange={e => setNewEvent(v => ({ ...v, title: e.target.value }))}
                                            className="h-10 rounded-xl text-sm font-bold bg-background border-border/50 focus-visible:ring-primary/20"
                                        />
                                    </div>
                                    <select
                                        value={newEvent.communityId}
                                        onChange={e => setNewEvent(v => ({ ...v, communityId: e.target.value }))}
                                        className="h-10 rounded-xl text-xs font-bold bg-background border border-border/50 px-3 col-span-1 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                                    >
                                        <option value="">Grupo</option>
                                        {joinedCommunityIds.map(id => {
                                            const ev = FLAT_AGENDA.find(e => e.communityId === id);
                                            return <option key={id} value={id}>{ev ? `${ev.communityEmoji} ${ev.communityName}` : id}</option>;
                                        })}
                                    </select>
                                    <select
                                        value={newEvent.type}
                                        onChange={e => setNewEvent(v => ({ ...v, type: e.target.value as "online" | "presencial" }))}
                                        className="h-10 rounded-xl text-xs font-bold bg-background border border-border/50 px-3 col-span-1 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                                    >
                                        <option value="online">Online</option>
                                        <option value="presencial">Presencial</option>
                                    </select>
                                    <Input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent(v => ({ ...v, date: e.target.value }))}
                                        className="h-10 rounded-xl text-xs font-bold bg-background border-border/50 focus-visible:ring-primary/20"
                                    />
                                    <Input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={e => setNewEvent(v => ({ ...v, time: e.target.value }))}
                                        className="h-10 rounded-xl text-xs font-bold bg-background border-border/50 focus-visible:ring-primary/20"
                                    />
                                    <div className="col-span-2">
                                        <Input
                                            placeholder="Descrição (opcional)"
                                            value={newEvent.description}
                                            onChange={e => setNewEvent(v => ({ ...v, description: e.target.value }))}
                                            className="h-10 rounded-xl text-sm font-medium bg-background border-border/50 focus-visible:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-1">
                                    <Button
                                        size="sm"
                                        className="h-9 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest"
                                        onClick={() => {
                                            setShowNewEventForm(false);
                                            setNewEvent({ title: "", communityId: "", type: "online", date: "", time: "", duration: "", description: "" });
                                        }}
                                    >
                                        Criar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-muted-foreground"
                                        onClick={() => setShowNewEventForm(false)}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Upcoming */}
                        {upcomingEvents.length > 0 && (
                            <div className="space-y-3 mb-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-1">Próximos</p>
                                {upcomingEvents.map(ev => {
                                    const isRsvpd = rsvpdIds.has(ev.id);
                                    return (
                                        <div key={ev.id} className={cn(
                                            "rounded-2xl border p-4 transition-all",
                                            isRsvpd ? "border-primary/20 bg-primary/5" : "border-border/50 bg-card/40 hover:bg-card/60"
                                        )}>
                                            {/* Top row */}
                                            <div className="flex items-start gap-4">
                                                {/* Date block */}
                                                <div className={cn(
                                                    "shrink-0 w-12 flex flex-col items-center rounded-xl py-1.5 px-1 border",
                                                    isRsvpd ? "bg-primary/10 border-primary/20" : "bg-muted/40 border-border/50"
                                                )}>
                                                    <span className={cn("text-[9px] font-black uppercase tracking-widest leading-none", isRsvpd ? "text-primary/70" : "text-muted-foreground/60")}>
                                                        {format(ev.date, "MMM", { locale: ptBR })}
                                                    </span>
                                                    <span className={cn("text-2xl font-black font-mono leading-tight", isRsvpd ? "text-primary" : "text-foreground")}>
                                                        {format(ev.date, "d")}
                                                    </span>
                                                    <span className={cn("text-[9px] font-bold uppercase tracking-widest leading-none", isRsvpd ? "text-primary/50" : "text-muted-foreground/40")}>
                                                        {format(ev.date, "EEE", { locale: ptBR })}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3 mb-1">
                                                        <p className="text-sm font-black uppercase tracking-tight leading-snug">{ev.title}</p>
                                                        <Badge className={cn(
                                                            "shrink-0 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                                                            ev.type === "online"
                                                                ? "bg-primary/10 text-primary border-primary/20"
                                                                : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                        )}>
                                                            {ev.type === "online" ? <Monitor className="size-2.5 mr-1 inline" /> : <MapPin className="size-2.5 mr-1 inline" />}
                                                            {ev.type}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                                                        {ev.communityEmoji} {ev.communityName}
                                                    </span>
                                                    <p className="text-xs text-muted-foreground/70 leading-relaxed mt-1.5 line-clamp-2">{ev.description}</p>

                                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                            <Clock className="size-3" />
                                                            {ev.time} · {ev.duration}
                                                        </span>
                                                        {ev.type === "presencial" && ev.location && (
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate">
                                                                <MapPin className="size-3 shrink-0" />
                                                                {ev.location}
                                                            </span>
                                                        )}
                                                        {ev.type === "online" && ev.link && (
                                                            <a href={ev.link} className="flex items-center gap-1 text-[10px] font-bold text-primary/60 uppercase tracking-widest hover:text-primary transition-colors" onClick={e => e.stopPropagation()}>
                                                                <ExternalLink className="size-3 shrink-0" />
                                                                Acessar link
                                                            </a>
                                                        )}
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                            <UserCheck className="size-3" />
                                                            {ev.rsvpCount + (isRsvpd && !ev.rsvpdByDefault ? 1 : 0)} confirmados
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RSVP button */}
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                                    Organizado por {ev.host}
                                                </span>
                                                <button
                                                    onClick={() => setRsvpdIds(prev => {
                                                        const n = new Set(prev);
                                                        n.has(ev.id) ? n.delete(ev.id) : n.add(ev.id);
                                                        return n;
                                                    })}
                                                    className={cn(
                                                        "h-7 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                                                        isRsvpd
                                                            ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                                            : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/30 hover:text-primary"
                                                    )}
                                                >
                                                    {isRsvpd ? "✓ Confirmado" : "Confirmar presença"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Past events */}
                        {pastEvents.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 px-1">Passados</p>
                                {pastEvents.map(ev => (
                                    <div key={ev.id} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border/30 bg-muted/10 opacity-60">
                                        <div className="shrink-0 w-10 flex flex-col items-center rounded-lg bg-muted/40 py-1 px-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 leading-none">
                                                {format(ev.date, "MMM", { locale: ptBR })}
                                            </span>
                                            <span className="text-lg font-black font-mono text-muted-foreground/70 leading-tight">
                                                {format(ev.date, "d")}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-black uppercase tracking-tight truncate">{ev.title}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">
                                                {ev.communityEmoji} {ev.communityName} · {ev.time}
                                            </p>
                                        </div>
                                        <Badge className="shrink-0 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-muted text-muted-foreground border-border/30">
                                            Encerrado
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}

                        {myAgenda.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 bg-card/10 border border-dashed border-border/50 rounded-[2rem]">
                                <Calendar className="size-10 text-muted-foreground/20 mb-3" />
                                <h3 className="text-sm font-black font-mono uppercase tracking-tight mb-1">Nenhum evento agendado</h3>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest text-center mb-4">
                                    Participe de grupos para ver os eventos
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ── Equipe ──────────────────────────────────────────────── */}
                <TabsContent value="team" className="flex-1 mt-0 data-[state=inactive]:hidden">
                    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-6 w-full">

                        {!selectedTeam ? (
                            /* ── My teams grid ── */
                            <>
                                <div className="mb-6">
                                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-0.5">Meus Times & Squads</h2>
                                    <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Clique em um card para ver os membros</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {TEAMS_DATA.map(team => {
                                        const previewMembers = team.members.slice(0, 4);
                                        return (
                                            <button
                                                key={team.id}
                                                onClick={() => setSelectedTeam(team)}
                                                className={cn(
                                                    "group text-left rounded-2xl border p-5 flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
                                                    team.borderColor, team.bgColor,
                                                    "hover:border-opacity-60"
                                                )}
                                            >
                                                {/* Header */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="size-12 rounded-2xl flex items-center justify-center text-2xl bg-background/60 border border-border/30 shadow-sm">
                                                        {team.emoji}
                                                    </div>
                                                    <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border shrink-0 mt-0.5", team.badgeColor)}>
                                                        {team.type === "time" ? "Time" : "Squad"}
                                                    </Badge>
                                                </div>

                                                {/* Name + description */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn("text-sm font-black uppercase tracking-tight leading-snug mb-1", team.color)}>{team.name}</p>
                                                    <p className="text-[11px] text-muted-foreground/60 leading-relaxed line-clamp-2">{team.description}</p>
                                                </div>

                                                {/* Members preview */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex -space-x-2">
                                                        {previewMembers.map(m => (
                                                            <Avatar key={m.id} className="size-7 border-2 border-background ring-0">
                                                                <AvatarImage src={`https://i.pravatar.cc/100?u=${m.id}`} />
                                                                <AvatarFallback className="text-[9px] font-black bg-muted">{m.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                        {team.members.length > 4 && (
                                                            <div className="size-7 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                                                                <span className="text-[9px] font-black text-muted-foreground">+{team.members.length - 4}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest group-hover:text-primary transition-colors">
                                                        {team.members.length} membros →
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* ── Team detail view ── */
                            <>
                                {/* Back + header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <button
                                        onClick={() => setSelectedTeam(null)}
                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronRight className="size-3.5 rotate-180" />
                                        Voltar
                                    </button>
                                    <div className="h-4 w-px bg-border/50" />
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-xl">{selectedTeam.emoji}</span>
                                        <div className="min-w-0">
                                            <p className={cn("text-sm font-black uppercase tracking-tight truncate", selectedTeam.color)}>{selectedTeam.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{selectedTeam.description}</p>
                                        </div>
                                    </div>
                                    <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border shrink-0", selectedTeam.badgeColor)}>
                                        {selectedTeam.type === "time" ? "Time" : "Squad"}
                                    </Badge>
                                </div>

                                {/* Member cards grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {selectedTeam.members.map(member => {
                                        const isMe = member.id === currentUser.id;
                                        const lvl = LEVEL_CONFIG[member.level];
                                        return (
                                            <div
                                                key={member.id}
                                                className={cn(
                                                    "rounded-2xl border p-4 flex flex-col items-center gap-3 text-center transition-all hover:shadow-md",
                                                    isMe
                                                        ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20"
                                                        : "border-border/50 bg-card/40 hover:bg-card/70"
                                                )}
                                            >
                                                <div className="relative">
                                                    <Avatar className={cn("size-14 border-2", isMe ? "border-primary/40" : "border-border/50")}>
                                                        <AvatarImage src={`https://i.pravatar.cc/100?u=${member.id}`} />
                                                        <AvatarFallback className="text-base font-black">{member.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    {isMe && (
                                                        <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                                                            <span className="text-[7px] font-black text-primary-foreground">✓</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 w-full">
                                                    <p className={cn("text-[11px] font-black uppercase tracking-tight truncate", isMe && "text-primary")}>
                                                        {isMe ? currentUser.name : member.name}
                                                        {isMe && <span className="text-primary/50 ml-1 font-bold">· Você</span>}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate mt-0.5">
                                                        {isMe ? (currentUser.jobTitle ?? member.role) : member.role}
                                                    </p>
                                                </div>
                                                <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border", lvl.color)}>
                                                    {lvl.label}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </TabsContent>

                {/* ── Integrações ─────────────────────────────────────────── */}
                <TabsContent value="integrations" className="flex-1 mt-0 data-[state=inactive]:hidden">
                    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-8 w-full">
                        <div className="mb-6">
                            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Integrações Disponíveis</h2>
                            <p className="text-[11px] text-muted-foreground/60 font-bold uppercase tracking-wider">Conecte suas ferramentas favoritas</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {integrations.map(({ name, icon: Icon, color, desc }) => (
                                <div key={name} className="relative flex flex-col gap-4 p-6 rounded-2xl bg-card/30 border border-border/50 overflow-hidden opacity-70">
                                    <div className={cn("size-12 rounded-xl flex items-center justify-center text-white shadow-lg", color)}>
                                        <Icon className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-tight mb-1">{name}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                                    </div>
                                    <Badge className="absolute top-4 right-4 bg-muted text-muted-foreground border border-border/50 text-[10px] font-black uppercase tracking-widest">
                                        Em breve
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
