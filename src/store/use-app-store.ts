import { create } from 'zustand';

interface AppState {
    isCopilotOpen: boolean;
    workspaceId: string | null;
    activeTheme: 'system' | 'light' | 'dark';
    toggleCopilot: () => void;
    setCopilotOpen: (isOpen: boolean) => void;
    setActiveWorkspace: (workspaceId: string) => void;
    setActiveTheme: (theme: 'system' | 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isCopilotOpen: false,
    workspaceId: 'wksp_01',
    activeTheme: 'dark',

    toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
    setCopilotOpen: (isOpen) => set({ isCopilotOpen: isOpen }),
    setActiveWorkspace: (workspaceId) => set({ workspaceId }),
    setActiveTheme: (theme) => set({ activeTheme: theme }),
}));
