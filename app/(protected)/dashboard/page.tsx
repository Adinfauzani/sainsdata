'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, FolderOpen, Link2, Layers, ListTree, Table2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { api } from '@/lib/api'

export const dynamic = 'force-dynamic'

interface Stats {
  sections: number
  rows: number
  children: number
  docs: number
  files: number
  uploads: number
  links: number
  users: number
}

interface StatsResponse {
  stats: Stats
}

const statCards: { key: keyof Stats; label: string; icon: typeof Layers; color: string }[] = [
  { key: 'sections', label: 'Kriteria', icon: Layers, color: 'text-blue-500' },
  { key: 'rows', label: 'Standar', icon: Table2, color: 'text-green-500' },
  { key: 'children', label: 'Sub Standar', icon: ListTree, color: 'text-purple-500' },
  { key: 'docs', label: 'Dokumen', icon: FileText, color: 'text-orange-500' },
  { key: 'links', label: 'Link Drive', icon: Link2, color: 'text-cyan-500' },
  { key: 'files', label: 'File Terunggah', icon: FolderOpen, color: 'text-pink-500' },
]

export default function DashboardOverview() {
  const { admin, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !admin) {
      router.replace('/login')
      return
    }
    if (!loading && admin && admin.role === 'user') {
      router.replace('/profile')
      return
    }
  }, [admin, loading, router])

  useEffect(() => {
    if (!admin) return
    let cancelled = false

    async function load() {
      try {
        const statsRes = await api<StatsResponse>('/api/stats')
        if (cancelled) return
        setStats(statsRes.stats)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat data')
      } finally {
        if (!cancelled) setLoadingStats(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [admin])

  if (loading || !admin) return null

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <PageHeader
          title="Overview"
          description="Ringkasan seluruh data instrumen akreditasi program studi Sains Data."
        />

        {error ? (
          <p className="text-sm font-medium text-destructive" role="alert">{error}</p>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map(({ key, label, icon: Icon, color }) => (
            <Card key={key} size="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className={`size-4 ${color}`} />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">
                  {loadingStats ? '–' : (stats?.[key] ?? 0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}