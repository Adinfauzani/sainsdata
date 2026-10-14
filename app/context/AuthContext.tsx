import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthUser } from '@/context/auth'
import { api, setToken } from '@/lib/api'
import type { AuthProfile } from '@/types'
import { toast } from 'sonner'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function restore() {
      // Sessions may be backed by an HttpOnly cookie (GitHub OAuth) or a
      // localStorage bearer token (email/password). Always ask the server so
      // both paths are restored; a 401 simply means "not logged in".
      try {
        const res = await api<{ admin: AuthUser; profile: AuthProfile | null }>('/api/auth/me')
        if (!cancelled) {
          setAdmin(res.admin)
          setProfile(res.profile)
        }
      } catch {
        if (!cancelled) {
          setToken(null)
          setAdmin(null)
          setProfile(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ token: string; admin: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(res.token)
    setAdmin(res.admin)
    setProfile(null)
    return res.admin
  }, [])

  const register = useCallback(async (email: string, username: string, password: string) => {
    const res = await api<{ token: string; admin: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    })
    setToken(res.token)
    setAdmin(res.admin)
    setProfile(null)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } catch {
      // token mungkin sudah kedaluwarsa - tetap bersihkan di sisi klien
    }
    setToken(null)
    setAdmin(null)
    setProfile(null)
    toast.success('Berhasil keluar')
  }, [])

  const value = useMemo(
    () => ({ admin, profile, loading, login, register, logout }),
    [admin, profile, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
