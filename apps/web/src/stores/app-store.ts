'use client'

import { create } from 'zustand'

interface AppState {
    sidebarOpen: boolean
    sidebarCollapsed: boolean
    activeView: string
    theme: 'dark' | 'light'
    toggleSidebar: () => void
    toggleCollapsed: () => void
    setActiveView: (view: string) => void
    toggleTheme: () => void
}

export const useAppStore = create<AppState>((set) => ({
    sidebarOpen: true,
    sidebarCollapsed: false,
    activeView: 'dashboard',
    theme: 'dark',
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    toggleCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setActiveView: (activeView) => set({ activeView }),
    toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}))
