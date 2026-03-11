import { create } from 'zustand';

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

    toggleCopilot: () => void;
    setCopilotOpen: (isOpen: boolean) => void;
    setActiveWorkspace: (workspaceId: string) => void;
    setActiveTheme: (theme: 'system' | 'light' | 'dark') => void;
    setProjectContext: (context: any) => void;
    setWikiContext: (context: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isCopilotOpen: false,
    workspaceId: 'wksp_01',
    activeTheme: 'dark',
    currentProjectContext: null,
    currentWikiContext: null,

    toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
    setCopilotOpen: (isOpen) => set({ isCopilotOpen: isOpen }),
    setActiveWorkspace: (workspaceId) => set({ workspaceId }),
    setActiveTheme: (theme) => set({ activeTheme: theme }),
    setProjectContext: (context) => set({ currentProjectContext: context }),
    setWikiContext: (context) => set({ currentWikiContext: context }),
}));
