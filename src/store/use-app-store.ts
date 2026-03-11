import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'MEMBER';

interface AppState {
    isCopilotOpen: boolean;
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
    };

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
        involvedMembers: string[]; // List of user emails or IDs
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

    toggleCopilot: () => void;
    setCopilotOpen: (isOpen: boolean) => void;
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
}

export const useAppStore = create<AppState>((set) => ({
    isCopilotOpen: false,
    workspaceId: 'wksp_01',
    activeTheme: 'dark',
    currentProjectContext: null,
    currentWikiContext: null,
    currentUser: {
        id: "u1",
        name: "John Smith",
        email: "john@acme.com",
        role: "MEMBER",
    },

    isMessagingOpen: false,
    unreadCount: 3,
    drawerLevel: 'inbox',
    activeConversation: null,

    toggleCopilot: () => set((state) => ({
        isCopilotOpen: !state.isCopilotOpen,
        isMessagingOpen: false
    })),
    setCopilotOpen: (isOpen) => set((state) => ({
        isCopilotOpen: isOpen,
        isMessagingOpen: isOpen ? false : state.isMessagingOpen
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
        isCopilotOpen: false,
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
        isCopilotOpen: false
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

    // Initial Mock Data
    projects: [
        { id: "p1", name: "Projeto Alpha", status: "No Prazo", color: "bg-primary", involvedMembers: ["john@acme.com"] },
        { id: "p2", name: "Integração SSO", status: "Risco", color: "bg-destructive", involvedMembers: ["admin@acme.com"] },
        { id: "p3", name: "Marketing Q3", status: "No Prazo", color: "bg-primary", involvedMembers: ["admin@acme.com"] },
    ],

    activities: [
        {
            id: "act_1",
            type: "TASK_COMPLETED",
            projectId: "p1",
            content: "concluiu a tarefa: 'Definir paleta de cores primária'",
            createdAt: new Date(Date.now() - 600000).toISOString(),
            user: { id: "user_1", name: "Felipe Designer", role: "UI Designer" }
        },
        {
            id: "act_2",
            type: "DEPLOY",
            projectId: "p1",
            content: "Acabei de subir o deploy para produção com as novas melhorias do Design System. O tempo de carregamento das páginas foi reduzido em 35%!",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            user: { id: "user_2", name: "Alex Rivera", role: "Engenheiro Frontend" }
        },
        {
            id: "act_3",
            type: "BUG_FIX",
            projectId: "p1",
            content: "Resolvido o problema crítico de timeout no Gateway de APIs. Todos os testes de integração passaram em 100%. Ótimo trabalho, equipe!",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            user: { id: "user_3", name: "Sarah Chen", role: "Líder de QA" }
        }
    ],
}));
