'use client'

import { useRouter } from 'next/navigation'
import { InstrumenTable } from '@/components/InstrumenTable'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Button } from '@/components/ui/button'

export default function DashboardInstrumen() {
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
          title="Instrumen Akreditasi"
          description="Kelola data instrumen LAM INFOKOM untuk akreditasi program studi."
        >
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Keluar
          </Button>
        </PageHeader>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <InstrumenTable mode="admin" />
        </div>
      </main>
    </div>
  )
}