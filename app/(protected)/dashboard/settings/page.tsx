'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default function DashboardSettings() {
  const { admin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      router.replace('/login')
    }
    if (!loading && admin && admin.role === 'user') {
      router.replace('/profile')
    }
  }, [admin, loading, router])

  if (loading || !admin || admin.role === 'user') return null

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <PageHeader
          title="Pengaturan Sistem"
          description="Konfigurasi global portal akreditasi"
        />

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
    </div>
  )
}