'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AtSign, BadgeCheck, LayoutDashboard, LogOut, Mail, User } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/auth'
import type { UserRole } from '@/types'

export const dynamic = 'force-dynamic'

const roleLabels: Record<UserRole, string> = {
  sudo: 'Super Admin',
  admin: 'Admin',
  user: 'Pengguna',
}

/**
 * Account/profile page addressed by the signed-in username (e.g. `/budi`).
 * A visitor may only open their own profile: when the URL username does not
 * match the logged-in user they are redirected to their own profile.
 */
export default function ProfilePage() {
  const params = useParams<{ username: string }>()
  const { admin, profile, loading, logout } = useAuth()
  const router = useRouter()

  const username = typeof params?.username === 'string' ? params.username : ''
  const isOwnProfile = !!admin && username === admin.username

  useEffect(() => {
    if (loading) return
    if (!admin) {
      router.replace('/login')
      return
    }
    if (username && username !== admin.username) {
      router.replace(`/${encodeURIComponent(admin.username)}`)
    }
  }, [admin, loading, router, username])

  if (loading || !isOwnProfile) return null

  const displayName = profile?.name || admin.username
  const initial = displayName.charAt(0).toUpperCase()

  const fields: { label: string; value: string; icon: typeof User }[] = [
    { label: 'Nama', value: displayName, icon: User },
    { label: 'Username', value: admin.username, icon: AtSign },
    { label: 'Email', value: admin.email, icon: Mail },
    { label: 'Peran', value: roleLabels[admin.role] ?? admin.role, icon: BadgeCheck },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <PageHeader
          title="Profil Saya"
          description="Informasi akun yang Anda gunakan untuk masuk ke portal akreditasi."
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="size-14 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <CardTitle className="truncate text-lg">{displayName}</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{roleLabels[admin.role] ?? admin.role}</Badge>
                  {profile?.provider === 'github' ? (
                    <span className="text-xs text-muted-foreground">Masuk via GitHub</span>
                  ) : null}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.label} className="space-y-1">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <field.icon className="size-3.5" aria-hidden />
                    {field.label}
                  </dt>
                  <dd className="text-sm font-medium break-words">{field.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <Button asChild size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4" />
                  Ke Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => void logout()}>
                <LogOut className="size-4" />
                Keluar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
