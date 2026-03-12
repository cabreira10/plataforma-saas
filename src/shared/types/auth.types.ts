import type { ID } from './global.types'

export interface User {
  id: ID
  email: string
  name?: string
  avatarUrl?: string
  language: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export type OAuthProvider = 'google' | 'github'
