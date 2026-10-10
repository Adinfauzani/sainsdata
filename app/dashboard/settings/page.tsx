'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function DashboardSettings() {
  const { admin, loading, logout } = useAuth()
  const router = useRouter()

  if (loading) return null
  if (!admin) {
    router.replace('/login')
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar admin={admin} onLogout={() => void logout()} />
      <main className="flex-1 overflow-auto">
        <PageHeader
          eyebrow="Dashboard"
          title="Pengaturan Sistem"
          description="Konfigurasi global portal akreditasi"
        >
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Keluar
          </Button>
        </PageHeader>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Sistem</CardTitle>
              <CardDescription>Fitur pengaturan sistem akan segera tersedia.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Halaman ini dalam pengembangan.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}