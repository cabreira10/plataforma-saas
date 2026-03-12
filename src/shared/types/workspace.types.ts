import type { ID } from './global.types'

export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface Workspace {
  id: ID
  name: string
  slug: string
  logoUrl?: string
  ownerId: ID
  planId?: ID
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMember {
  id: ID
  workspaceId: ID
  userId: ID
  role: WorkspaceRole
  invitedBy?: ID
  inviteAcceptedAt?: string
  createdAt: string
}

export interface WorkspaceInvite {
  id: ID
  workspaceId: ID
  email: string
  role: WorkspaceRole
  token: string
  invitedBy: ID
  expiresAt: string
  acceptedAt?: string
  createdAt: string
}

export interface WorkspaceWithMember extends Workspace {
  role: WorkspaceRole
  memberCount: number
}
