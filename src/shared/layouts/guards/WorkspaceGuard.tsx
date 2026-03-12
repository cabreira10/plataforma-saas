import { Navigate, Outlet } from 'react-router-dom'
import { useWorkspaceStore } from '@/shared/stores/workspace.store'

export function WorkspaceGuard() {
  const { activeWorkspace } = useWorkspaceStore()

  if (!activeWorkspace) {
    return <Navigate to="/workspaces" replace />
  }

  return <Outlet />
}
