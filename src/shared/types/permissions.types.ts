import type { WorkspaceRole } from './workspace.types'

export type Module =
  | 'crm'
  | 'contracts'
  | 'invoices'
  | 'checkout'
  | 'leads'
  | 'schedule'
  | 'payments'
  | 'follow-up'
  | 'users'
  | 'billing'

export type Action = 'view' | 'edit' | 'create' | 'delete'

export interface Permission {
  module: Module
  actions: Action[]
}

export interface RolePermissions {
  role: WorkspaceRole
  permissions: Permission[]
}

// Default permissions per role
export const DEFAULT_PERMISSIONS: RolePermissions[] = [
  {
    role: 'owner',
    permissions: [
      { module: 'crm', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'contracts', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'invoices', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'checkout', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'leads', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'schedule', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'payments', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'follow-up', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'users', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'billing', actions: ['view', 'edit', 'create', 'delete'] },
    ],
  },
  {
    role: 'admin',
    permissions: [
      { module: 'crm', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'contracts', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'invoices', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'checkout', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'leads', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'schedule', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'payments', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'follow-up', actions: ['view', 'edit', 'create', 'delete'] },
      { module: 'users', actions: ['view', 'edit', 'create'] },
    ],
  },
  {
    role: 'member',
    permissions: [
      { module: 'crm', actions: ['view'] },
      { module: 'contracts', actions: ['view'] },
      { module: 'invoices', actions: ['view'] },
      { module: 'checkout', actions: ['view'] },
      { module: 'leads', actions: ['view'] },
      { module: 'schedule', actions: ['view', 'create'] },
      { module: 'payments', actions: ['view'] },
      { module: 'follow-up', actions: ['view'] },
    ],
  },
]
