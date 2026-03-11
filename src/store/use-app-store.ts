import { create } from 'zustand';

interface AppState {
    isCopilotOpen: boolean;
    activeWorkspaceId: string | null;
    activeTheme: 'system' | 'light' | 'dark'; // Though Next Themes handles it, we can keep track if needed for custom UI logic
    toggleCopilot: () => void;
    setCopilotOpen: (isOpen: boolean) => void;
    setActiveWorkspace: (workspaceId: string) => void;
    setActiveTheme: (theme: 'system' | 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isCopilotOpen: false,
    activeWorkspaceId: 'wksp_01', // Mock default workspace
    activeTheme: 'dark', // Native premium B2B dark mode default

    toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
    setCopilotOpen: (isOpen) => set({ isCopilotOpen: isOpen }),
    setActiveWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
    setActiveTheme: (theme) => set({ activeTheme: theme }),
}));
