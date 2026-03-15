import { create } from 'zustand';
import { Community, CommunityPost } from '@/features/communities/lib/community-schema';

export type UserRole = 'ADMIN' | 'MEMBER';

interface AppState {
    isSidebarCollapsed: boolean;
    focusMode: boolean;
    workspaceId: string | null;
    activeTheme: 'system' | 'light' | 'dark';

    // AI Context
    currentProjectContext: {
        id: string;
        name: string;
        taskCount: number;
        inProgressCount: number;
        blockedCount: number;
    } | null;

    currentWikiContext: {
        pageCount: number;
        lastPageTitle: string;
    } | null;

    // RBAC
    currentUser: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        jobTitle?: string;
        jobObjective?: string;
        activeTaskId?: string;
    };

    teamStatus: Array<{
        userId: string;
        userName: string;
        userRole: string;
        taskId: string;
        taskTitle: string;
        projectName: string;
        startedAt: string;
    }>;

    // Unified Messaging (Epic 14 Pivô)
    isMessagingOpen: boolean;
    unreadCount: number;
    drawerLevel: 'inbox' | 'chat';
    activeConversation: {
        id: string;
        type: 'person' | 'project';
        name: string;
        context: string;
        status?: 'online' | 'away' | 'offline';
        avatar?: string;
        participants?: number;
    } | null;

    projects: Array<{
        id: string;
        name: string;
        status: string;
        color: string;
        involvedMembers: string[];
        health: 'on-time' | 'ahead' | 'delayed';
        completionRate: number;
        methodology?: string;
    }>;

    tasks: Array<{
        id: string;
        title: string;
        priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
        status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
        projectId: string;
        assigneeId: string;
        story?: string;
        dueDate?: string;
    }>;

    activities: Array<{
        id: string;
        type: string;
        content: string;
        createdAt: string;
        projectId: string;
        user: {
            id: string;
            name: string;
            role: string;
        };
    }>;

    // Communities
    communities: Community[];
    communityPosts: CommunityPost[];
    joinedCommunityIds: string[];

    toggleSidebar: () => void;
    toggleFocusMode: () => void;
    setActiveWorkspace: (workspaceId: string) => void;
    setActiveTheme: (theme: 'system' | 'light' | 'dark') => void;
    setProjectContext: (context: any) => void;
    setWikiContext: (context: any) => void;
    setUserRole: (role: UserRole) => void;

    // Messaging Actions
    openMessaging: () => void;
    closeMessaging: () => void;
    openConversation: (conv: any) => void;
    backToInbox: () => void;

    // RBAC Actions
    toggleRole: () => void;
    updateCurrentUser: (data: Partial<Pick<AppState['currentUser'], 'name' | 'jobTitle' | 'jobObjective'>>) => void;

    // Community Actions
    joinCommunity: (communityId: string) => void;
    leaveCommunity: (communityId: string) => void;
    createCommunity: (community: Omit<Community, 'id' | 'createdAt' | 'memberCount' | 'postCount'>) => void;
    addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>) => void;

    // Task Actions
    startTask: (taskId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    workspaceId: 'wksp_01',
    activeTheme: 'dark',
    currentProjectContext: null,
    currentWikiContext: null,
    currentUser: {
        id: "u1",
        name: "Luiz Augusto",
        email: "luiz.augusto@flyproj.com.br",
        role: "MEMBER",
        jobTitle: "Product Designer",
        jobObjective: "Criar experiências centradas no usuário que equilibrem estética, usabilidade e impacto de negócio.",
    },

    isMessagingOpen: false,
    isSidebarCollapsed: false,
    focusMode: false,
    unreadCount: 3,
    drawerLevel: 'inbox',
    activeConversation: null,

    toggleSidebar: () => set((state) => ({
        isSidebarCollapsed: !state.isSidebarCollapsed
    })),
    toggleFocusMode: () => set((state) => ({
        focusMode: !state.focusMode
    })),
    setActiveWorkspace: (workspaceId) => set({ workspaceId }),
    setActiveTheme: (theme) => set({ activeTheme: theme }),
    setProjectContext: (context) => set({ currentProjectContext: context }),
    setWikiContext: (context) => set({ currentWikiContext: context }),
    setUserRole: (role) => set((state) => ({
        currentUser: { ...state.currentUser, role }
    })),

    openMessaging: () => set({
        isMessagingOpen: true,
        drawerLevel: 'inbox'
    }),
    closeMessaging: () => set({
        isMessagingOpen: false,
        activeConversation: null
    }),
    openConversation: (conv) => set({
        activeConversation: conv,
        drawerLevel: 'chat',
        isMessagingOpen: true,
    }),
    backToInbox: () => set({
        drawerLevel: 'inbox',
        activeConversation: null
    }),

    // RBAC
    toggleRole: () => set((state) => ({
        currentUser: {
            ...state.currentUser,
            role: state.currentUser.role === 'ADMIN' ? 'MEMBER' : 'ADMIN'
        }
    })),
    updateCurrentUser: (data) => set((state) => ({
        currentUser: { ...state.currentUser, ...data }
    })),

    // Community Actions
    joinCommunity: (communityId) => set((state) => ({
        joinedCommunityIds: [...state.joinedCommunityIds, communityId],
        communities: state.communities.map(c =>
            c.id === communityId ? { ...c, memberCount: c.memberCount + 1 } : c
        ),
    })),
    leaveCommunity: (communityId) => set((state) => ({
        joinedCommunityIds: state.joinedCommunityIds.filter(id => id !== communityId),
        communities: state.communities.map(c =>
            c.id === communityId ? { ...c, memberCount: Math.max(0, c.memberCount - 1) } : c
        ),
    })),
    createCommunity: (community) => set((state) => {
        const newCommunity: Community = {
            ...community,
            id: `comm_${Date.now()}`,
            memberCount: 1,
            postCount: 0,
            createdAt: new Date().toISOString(),
        };
        return {
            communities: [newCommunity, ...state.communities],
            joinedCommunityIds: [...state.joinedCommunityIds, newCommunity.id],
        };
    }),
    addCommunityPost: (post) => set((state) => {
        const newPost: CommunityPost = {
            ...post,
            id: `cpost_${Date.now()}`,
            createdAt: new Date().toISOString(),
            likesCount: 0,
            commentsCount: 0,
        };
        return {
            communityPosts: [newPost, ...state.communityPosts],
            communities: state.communities.map(c =>
                c.id === post.communityId ? { ...c, postCount: c.postCount + 1 } : c
            ),
        };
    }),

    startTask: (taskId) => set((state) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;
        const project = state.projects.find(p => p.id === task.projectId);
        return {
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'IN_PROGRESS' as const } : t),
            currentUser: { ...state.currentUser, activeTaskId: taskId },
            teamStatus: [
                ...state.teamStatus.filter(s => s.userId !== state.currentUser.id),
                {
                    userId: state.currentUser.id,
                    userName: state.currentUser.name,
                    userRole: state.currentUser.jobTitle ?? 'Membro',
                    taskId,
                    taskTitle: task.title,
                    projectName: project?.name ?? 'Projeto',
                    startedAt: new Date().toISOString(),
                },
            ],
        };
    }),

    // Initial Mock Data
    projects: [
        { id: "proj_01", name: "Projeto Alpha", status: "No Prazo", color: "text-primary", involvedMembers: ["luiz.augusto@flyproj.com.br", "admin@acme.com"], health: 'on-time', completionRate: 65, methodology: 'AGILE' },
        { id: "proj_02", name: "Integração SSO", status: "Crítico", color: "text-destructive", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 42, methodology: 'KANBAN' },
        { id: "proj_03", name: "Marketing Q3", status: "Adiantado", color: "text-blue-500", involvedMembers: ["luiz.augusto@flyproj.com.br", "admin@acme.com"], health: 'ahead', completionRate: 88, methodology: 'LIST' },
        { id: "p4", name: "Mobile App Refactor", status: "No Prazo", color: "text-purple-500", involvedMembers: ["admin@acme.com"], health: 'on-time', completionRate: 25, methodology: 'AGILE' },
        { id: "p5", name: "Backend Scalability", status: "Risco", color: "text-orange-500", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 15, methodology: 'AGILE' },
        { id: "p6", name: "Customer Portal", status: "No Prazo", color: "text-cyan-500", involvedMembers: ["admin@acme.com"], health: 'on-time', completionRate: 50, methodology: 'KANBAN' },
        { id: "p7", name: "Security Audit", status: "Adiantado", color: "text-emerald-500", involvedMembers: ["admin@acme.com"], health: 'ahead', completionRate: 95, methodology: 'LIST' },
        { id: "p8", name: "API Documentation", status: "No Prazo", color: "text-rose-500", involvedMembers: ["admin@acme.com"], health: 'on-time', completionRate: 40, methodology: 'PLANNING' },
        { id: "p9", name: "User Onboarding Flow", status: "Crítico", color: "text-amber-500", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 10, methodology: 'AGILE' },
        { id: "p10", name: "Payment Gateway v2", status: "No Prazo", color: "text-indigo-500", involvedMembers: ["admin@acme.com", "luiz.augusto@flyproj.com.br"], health: 'on-time', completionRate: 33, methodology: 'AGILE' },
        { id: "p11", name: "Legacy Migration", status: "Risco", color: "text-slate-500", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 5, methodology: 'PLANNING' },
        { id: "p12", name: "Partner API", status: "Adiantado", color: "text-pink-500", involvedMembers: ["admin@acme.com"], health: 'ahead', completionRate: 75, methodology: 'KANBAN' },
    ],

    tasks: [
        { id: "T1", title: "Corrigir vazamento de memória no SSR", priority: 'URGENT', status: 'TODO', projectId: 'proj_01', assigneeId: 'u1', story: 'UX Performance' },
        { id: "T2", title: "Validar tokens JWT no Middleware", priority: 'HIGH', status: 'IN_PROGRESS', projectId: 'proj_02', assigneeId: 'u1', story: 'Auth Core' },
        { id: "T3", title: "Criar assets para campanha Q3", priority: 'MEDIUM', status: 'TODO', projectId: 'proj_03', assigneeId: 'u1', story: 'Campaign Launch' },
        { id: "T4", title: "Refatorar Context API para Zustand", priority: 'HIGH', status: 'REVIEW', projectId: 'p4', assigneeId: 'u1', story: 'State Migration' },
        { id: "T5", title: "Ajustar padding do Mobile Header", priority: 'LOW', status: 'DONE', projectId: 'proj_01', assigneeId: 'u1', story: 'UI Polish' },
        { id: "T6", title: "Implementar Rate Limit no Gateway", priority: 'URGENT', status: 'TODO', projectId: 'p5', assigneeId: 'u1', story: 'Scalability' },
        { id: "T7", title: "Revisar permissões de Workspace", priority: 'HIGH', status: 'TODO', projectId: 'p10', assigneeId: 'u1', story: 'Security Hub' },
        { id: "T8", title: "Mapear endpoints legados", priority: 'MEDIUM', status: 'IN_PROGRESS', projectId: 'p11', assigneeId: 'u1', story: 'Safe Migration' },
    ],

    teamStatus: [
        { userId: "user_1", userName: "Felipe Designer", userRole: "UI Designer", taskId: "xt1", taskTitle: "Redesign da tela de Onboarding", projectName: "User Onboarding Flow", startedAt: new Date(Date.now() - 25 * 60000).toISOString() },
        { userId: "user_2", userName: "Alex Rivera", userRole: "Eng. Frontend", taskId: "xt2", taskTitle: "Otimizar bundle size do deploy", projectName: "Flyproj Dashboard", startedAt: new Date(Date.now() - 48 * 60000).toISOString() },
        { userId: "user_3", userName: "Sarah Chen", userRole: "Líder de QA", taskId: "xt3", taskTitle: "Validar testes de regressão", projectName: "Backend Scalability", startedAt: new Date(Date.now() - 12 * 60000).toISOString() },
    ],

    activities: [
        {
            id: "act_1",
            type: "TASK_COMPLETED",
            projectId: "proj_01",
            content: "concluiu a tarefa: 'Definir paleta de cores primária'",
            createdAt: new Date(Date.now() - 600000).toISOString(),
            user: { id: "user_1", name: "Felipe Designer", role: "UI Designer" }
        },
        {
            id: "act_2",
            type: "DEPLOY",
            projectId: "proj_01",
            content: "Acabei de subir o deploy para produção com as novas melhorias do Design System. O tempo de carregamento das páginas foi reduzido em 35%!",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            user: { id: "user_2", name: "Alex Rivera", role: "Engenheiro Frontend" }
        },
        {
            id: "act_3",
            type: "BUG_FIX",
            projectId: "proj_01",
            content: "Resolvido o problema crítico de timeout no Gateway de APIs. Todos os testes de integração passaram em 100%. Ótimo trabalho, equipe!",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            user: { id: "user_3", name: "Sarah Chen", role: "Líder de QA" }
        }
    ],

    joinedCommunityIds: ["comm_01", "comm_02"],

    communities: [
        {
            id: "comm_01",
            name: "Psicologia & UX",
            description: "Explorando como princípios da psicologia cognitiva e comportamental se aplicam à criação de experiências de usuário mais humanas e eficazes.",
            emoji: "🧠",
            category: "Design",
            tags: ["ux", "psicologia", "comportamento", "pesquisa"],
            memberCount: 24,
            postCount: 47,
            createdBy: "u1",
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
            isPrivate: false,
        },
        {
            id: "comm_02",
            name: "RPG & Jogos de Mesa",
            description: "Para os aventureiros do escritório! D&D, Pathfinder, boardgames e tudo que envolve dados, narrativas e muita imaginação.",
            emoji: "🎲",
            category: "Hobbies",
            tags: ["rpg", "dnd", "boardgames", "jogos"],
            memberCount: 18,
            postCount: 63,
            createdBy: "user_2",
            createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
            isPrivate: false,
        },
        {
            id: "comm_03",
            name: "Clube do Livro",
            description: "Leituras mensais, recomendações, resenhas e discussões sobre livros de ficção, não-ficção, técnicos e tudo mais.",
            emoji: "📚",
            category: "Cultura",
            tags: ["livros", "leitura", "literatura", "clube"],
            memberCount: 31,
            postCount: 89,
            createdBy: "user_1",
            createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
            isPrivate: false,
        },
        {
            id: "comm_04",
            name: "Fitness & Saúde",
            description: "Corrida, musculação, nutrição, meditação e tudo que ajuda a manter o corpo e a mente em forma durante a jornada de trabalho.",
            emoji: "💪",
            category: "Saúde & Bem-estar",
            tags: ["fitness", "corrida", "saude", "meditacao"],
            memberCount: 42,
            postCount: 112,
            createdBy: "user_3",
            createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
            isPrivate: false,
        },
        {
            id: "comm_05",
            name: "Música & Playlists",
            description: "Compartilhe o que está ouvindo, descubra novos artistas, troque playlists de foco, coding, relaxamento e muito mais.",
            emoji: "🎵",
            category: "Cultura",
            tags: ["musica", "playlist", "spotify", "rock", "jazz"],
            memberCount: 56,
            postCount: 204,
            createdBy: "user_2",
            createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
            isPrivate: false,
        },
        {
            id: "comm_06",
            name: "Dev & Open Source",
            description: "Projetos open source, ferramentas úteis, tutoriais, novidades do mundo dev e espaço para tirar dúvidas técnicas entre colegas.",
            emoji: "⚡",
            category: "Tecnologia",
            tags: ["dev", "opensource", "codigo", "tools"],
            memberCount: 38,
            postCount: 156,
            createdBy: "u1",
            createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
            isPrivate: false,
        },
    ],

    communityPosts: [
        {
            id: "cpost_01",
            communityId: "comm_01",
            communityName: "Psicologia & UX",
            communityEmoji: "🧠",
            userId: "user_1",
            userName: "Felipe Designer",
            userRole: "UI Designer",
            content: "Acabei de terminar o livro 'Hooked' do Nir Eyal e a conexão com os padrões de design que usamos diariamente é incrível. Alguém mais leu? Vale muito debater como usar esses gatilhos de forma ética no nosso produto.",
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            likesCount: 8,
            commentsCount: 3,
            mediaUrls: ["https://picsum.photos/seed/book1/800/450", "https://picsum.photos/seed/book2/800/450"],
            mediaType: "image" as const,
        },
        {
            id: "cpost_02",
            communityId: "comm_02",
            communityName: "RPG & Jogos de Mesa",
            communityEmoji: "🎲",
            userId: "user_2",
            userName: "Alex Rivera",
            userRole: "Engenheiro Frontend",
            content: "Pessoal, quem topa uma sessão de D&D 5e virtual na sexta-feira? Tenho uma aventura de one-shot preparada, umas 3h de duração. Preciso de 3-4 aventureiros corajosos 🗡️",
            createdAt: new Date(Date.now() - 5400000).toISOString(),
            likesCount: 12,
            commentsCount: 7,
            mediaUrls: ["https://picsum.photos/seed/rpg1/800/500"],
            mediaType: "image" as const,
        },
        {
            id: "cpost_03",
            communityId: "comm_01",
            communityName: "Psicologia & UX",
            communityEmoji: "🧠",
            userId: "user_3",
            userName: "Sarah Chen",
            userRole: "Líder de QA",
            content: "Artigo incrível sobre o efeito de 'cognitive load' em formulários complexos. Reduzimos o abandono em 40% só reorganizando os campos em grupos lógicos. A ciência funciona! 📊",
            createdAt: new Date(Date.now() - 10800000).toISOString(),
            likesCount: 15,
            commentsCount: 5,
        },
        {
            id: "cpost_04",
            communityId: "comm_02",
            communityName: "RPG & Jogos de Mesa",
            communityEmoji: "🎲",
            userId: "user_4",
            userName: "Luiz Augusto",
            userRole: "Product Designer",
            content: "Gravei um vídeo rápido do novo sistema de batalha que estamos prototipando para o board digital. Feedback bem-vindo! 🎮",
            createdAt: new Date(Date.now() - 14400000).toISOString(),
            likesCount: 20,
            commentsCount: 4,
            mediaUrls: ["https://www.w3schools.com/html/mov_bbb.mp4"],
            mediaType: "video" as const,
        },
        {
            id: "cpost_05",
            communityId: "comm_01",
            communityName: "Psicologia & UX",
            communityEmoji: "🧠",
            userId: "user_5",
            userName: "Carla Mendes",
            userRole: "Product Manager",
            content: "Capturas do novo onboarding que lançamos essa semana. Redução de 60% no drop-off no primeiro dia 🚀",
            createdAt: new Date(Date.now() - 21600000).toISOString(),
            likesCount: 31,
            commentsCount: 9,
            mediaUrls: [
                "https://picsum.photos/seed/ui1/800/500",
                "https://picsum.photos/seed/ui2/800/500",
                "https://picsum.photos/seed/ui3/800/500",
            ],
            mediaType: "image" as const,
        },
    ],
}));
