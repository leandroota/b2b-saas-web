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
        userId: string;
        userName: string;
        type: string;
        projectName: string;
        projectId: string;
        content: string;
        createdAt: string;
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
            userId: "user_1",
            userName: "Felipe Designer",
            type: "TASK_COMPLETED",
            projectName: "Flyprod Dashboard",
            projectId: "p1", // Assigned to Alpha for filtering
            content: "concluiu a tarefa: 'Definir paleta de cores primária'",
            createdAt: new Date(Date.now() - 600000).toISOString(),
        },
        {
            id: "act_2",
            userId: "user_2",
            userName: "Carla Product",
            type: "PROJECT_MEMBER_ADDED",
            projectName: "Flyprod Dashboard",
            projectId: "p1",
            content: "adicionou Robo Dev ao projeto",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: "act_3",
            userId: "user_3",
            userName: "Robo Dev",
            type: "TASK_CREATED",
            projectName: "Infra Alpha",
            projectId: "p2", // Assigned to SSO
            content: "criou uma nova tarefa: 'Configurar CI/CD pipeline'",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
            id: "act_4",
            userId: "user_1",
            userName: "Felipe Designer",
            type: "PROJECT_MILESTONE",
            projectName: "Flyprod Dashboard",
            projectId: "p1",
            content: "alcançou o marco: 'MVP UI Definido'",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
    ],
}));
