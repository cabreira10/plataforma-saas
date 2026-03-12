import { useWorkspaceStore } from '@/shared/stores/workspace.store'
import { DEFAULT_PERMISSIONS } from '@/shared/types/permissions.types'
import type { Module, Action } from '@/shared/types/permissions.types'

export function usePermission(module: Module, action: Action): boolean {
  const { activeWorkspace } = useWorkspaceStore()

  if (!activeWorkspace) return false

  const role = activeWorkspace.role
  const rolePerms = DEFAULT_PERMISSIONS.find((rp) => rp.role === role)
  if (!rolePerms) return false

  const modulePerm = rolePerms.permissions.find((p) => p.module === module)
  if (!modulePerm) return false

  return modulePerm.actions.includes(action)
}

export function usePermissions(module: Module): Record<Action, boolean> {
  const actions: Action[] = ['view', 'edit', 'create', 'delete']
  const { activeWorkspace } = useWorkspaceStore()

  if (!activeWorkspace) {
    return { view: false, edit: false, create: false, delete: false }
  }

  const role = activeWorkspace.role
  const rolePerms = DEFAULT_PERMISSIONS.find((rp) => rp.role === role)
  const modulePerm = rolePerms?.permissions.find((p) => p.module === module)

  return actions.reduce(
    (acc, action) => ({
      ...acc,
      [action]: modulePerm?.actions.includes(action) ?? false,
    }),
    {} as Record<Action, boolean>,
  )
}
