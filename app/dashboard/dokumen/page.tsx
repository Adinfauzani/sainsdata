'use client'

import { useRouter } from 'next/navigation'
import DataDokumenAdmin from '@/components/dashboard/DataDokumenAdmin'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Button } from '@/components/ui/button'

export default function DashboardDokumen() {
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
          title="Data Dokumen"
          description="Kelola dokumen pendukung untuk seluruh standar akreditasi."
        >
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Keluar
          </Button>
        </PageHeader>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <DataDokumenAdmin />
        </div>
      </main>
    </div>
  )
}