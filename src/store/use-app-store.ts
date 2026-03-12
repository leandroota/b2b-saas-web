import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'MEMBER';

interface AppState {
    isCopilotOpen: boolean;
    isSidebarCollapsed: boolean;
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

    toggleCopilot: () => void;
    toggleSidebar: () => void;
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
    isSidebarCollapsed: false,
    unreadCount: 3,
    drawerLevel: 'inbox',
    activeConversation: null,

    toggleCopilot: () => set((state) => ({
        isCopilotOpen: !state.isCopilotOpen,
        isMessagingOpen: false
    })),
    toggleSidebar: () => set((state) => ({
        isSidebarCollapsed: !state.isSidebarCollapsed
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
        { id: "p1", name: "Projeto Alpha", status: "No Prazo", color: "text-primary", involvedMembers: ["john@acme.com", "admin@acme.com"], health: 'on-time', completionRate: 65, methodology: 'AGILE' },
        { id: "p2", name: "Integração SSO", status: "Crítico", color: "text-destructive", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 42, methodology: 'KANBAN' },
        { id: "p3", name: "Marketing Q3", status: "Adiantado", color: "text-blue-500", involvedMembers: ["john@acme.com", "admin@acme.com"], health: 'ahead', completionRate: 88, methodology: 'LIST' },
        { id: "p4", name: "Mobile App Refactor", status: "No Prazo", color: "text-purple-500", involvedMembers: ["admin@acme.com"], health: 'on-time', completionRate: 25, methodology: 'AGILE' },
        { id: "p5", name: "Backend Scalability", status: "Risco", color: "text-orange-500", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 15, methodology: 'AGILE' },
        { id: "p6", name: "Customer Portal", status: "No Prazo", color: "text-cyan-500", involvedMembers: ["admin@acme.com"], health: 'on-time', completionRate: 50, methodology: 'KANBAN' },
        { id: "p7", name: "Security Audit", status: "Adiantado", color: "text-emerald-500", involvedMembers: ["admin@acme.com"], health: 'ahead', completionRate: 95, methodology: 'LIST' },
        { id: "p8", name: "API Documentation", status: "No Prazo", color: "text-rose-500", involvedMembers: ["admin@acme.com"], health: 'on-time', completionRate: 40, methodology: 'PLANNING' },
        { id: "p9", name: "User Onboarding Flow", status: "Crítico", color: "text-amber-500", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 10, methodology: 'AGILE' },
        { id: "p10", name: "Payment Gateway v2", status: "No Prazo", color: "text-indigo-500", involvedMembers: ["admin@acme.com", "john@acme.com"], health: 'on-time', completionRate: 33, methodology: 'AGILE' },
        { id: "p11", name: "Legacy Migration", status: "Risco", color: "text-slate-500", involvedMembers: ["admin@acme.com"], health: 'delayed', completionRate: 5, methodology: 'PLANNING' },
        { id: "p12", name: "Partner API", status: "Adiantado", color: "text-pink-500", involvedMembers: ["admin@acme.com"], health: 'ahead', completionRate: 75, methodology: 'KANBAN' },
    ],

    tasks: [
        { id: "T1", title: "Corrigir vazamento de memória no SSR", priority: 'URGENT', status: 'TODO', projectId: 'p1', assigneeId: 'u1', story: 'UX Performance' },
        { id: "T2", title: "Validar tokens JWT no Middleware", priority: 'HIGH', status: 'IN_PROGRESS', projectId: 'p2', assigneeId: 'u1', story: 'Auth Core' },
        { id: "T3", title: "Criar assets para campanha Q3", priority: 'MEDIUM', status: 'TODO', projectId: 'p3', assigneeId: 'u1', story: 'Campaign Launch' },
        { id: "T4", title: "Refatorar Context API para Zustand", priority: 'HIGH', status: 'REVIEW', projectId: 'p4', assigneeId: 'u1', story: 'State Migration' },
        { id: "T5", title: "Ajustar padding do Mobile Header", priority: 'LOW', status: 'DONE', projectId: 'p1', assigneeId: 'u1', story: 'UI Polish' },
        { id: "T6", title: "Implementar Rate Limit no Gateway", priority: 'URGENT', status: 'TODO', projectId: 'p5', assigneeId: 'u1', story: 'Scalability' },
        { id: "T7", title: "Revisar permissões de Workspace", priority: 'HIGH', status: 'TODO', projectId: 'p10', assigneeId: 'u1', story: 'Security Hub' },
        { id: "T8", title: "Mapear endpoints legados", priority: 'MEDIUM', status: 'IN_PROGRESS', projectId: 'p11', assigneeId: 'u1', story: 'Safe Migration' },
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
