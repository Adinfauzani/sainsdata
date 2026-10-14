import { createContext, useContext } from 'react'
import type { AuthProfile, AuthUser } from '@/types'

export interface AuthContextValue {
  admin: AuthUser | null
  profile: AuthProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}

export type { AuthUser }
