import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkspaceWithMember } from '@/shared/types/workspace.types'

interface WorkspaceStore {
  activeWorkspace: WorkspaceWithMember | null
  workspaces: WorkspaceWithMember[]
  setActiveWorkspace: (workspace: WorkspaceWithMember | null) => void
  setWorkspaces: (workspaces: WorkspaceWithMember[]) => void
  addWorkspace: (workspace: WorkspaceWithMember) => void
  removeWorkspace: (id: string) => void
  updateWorkspace: (id: string, updates: Partial<WorkspaceWithMember>) => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      workspaces: [],

      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

      setWorkspaces: (workspaces) => set({ workspaces }),

      addWorkspace: (workspace) =>
        set((state) => ({ workspaces: [...state.workspaces, workspace] })),

      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
          activeWorkspace:
            state.activeWorkspace?.id === id ? null : state.activeWorkspace,
        })),

      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, ...updates } : w,
          ),
          activeWorkspace:
            state.activeWorkspace?.id === id
              ? { ...state.activeWorkspace, ...updates }
              : state.activeWorkspace,
        })),
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({
        activeWorkspace: state.activeWorkspace,
        workspaces: state.workspaces,
      }),
    },
  ),
)
