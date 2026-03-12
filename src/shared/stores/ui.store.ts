import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/shared/types/global.types'

interface UIStore {
  sidebarCollapsed: boolean
  language: Language
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setLanguage: (language: Language) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      language: 'pt-BR',

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'ui-storage',
    },
  ),
)
