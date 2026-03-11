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
}));
