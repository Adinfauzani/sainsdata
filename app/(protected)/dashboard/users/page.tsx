'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UsersTab } from '@/components/dashboard/UsersTab'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'

export const dynamic = 'force-dynamic'

export default function DashboardUsers() {
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
          title="Manajemen User"
          description="Kelola akun admin, pengguna, dan peran akses."
        />

        <UsersTab />
      </div>
    </div>
  )
}