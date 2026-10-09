import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FileText, FolderOpen, Link2, Layers, ListTree, Table2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InstrumenTable } from '@/components/InstrumenTable'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { api } from '@/lib/api'

interface Stats {
  sections: number
  rows: number
  children: number
  docs: number
  files: number
  uploads: number
  links: number
}

interface StatsResponse {
  stats: Stats
}

const statCards: { key: keyof Stats; label: string; icon: typeof Layers }[] = [
  { key: 'sections', label: 'Kriteria', icon: Layers },
  { key: 'rows', label: 'Standar', icon: Table2 },
  { key: 'children', label: 'Sub Standar', icon: ListTree },
  { key: 'docs', label: 'Dokumen', icon: FileText },
  { key: 'links', label: 'Link Drive', icon: Link2 },
  { key: 'files', label: 'File Terunggah', icon: FolderOpen },
]

export function Admin() {
  const { admin, loading, logout } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

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

  if (loading) return null
  if (!admin) return <Navigate to="/login" replace />

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Dashboard Admin"
        description="Ringkasan seluruh data instrumen akreditasi program studi."
      >
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Masuk sebagai{' '}
            <span className="font-medium text-foreground">{admin.username}</span>
          </p>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            <LogOut className="size-3.5" />
            Keluar
          </Button>
        </div>
      </PageHeader>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {error ? (
          <p className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map(({ key, label, icon: Icon }) => (
            <Card key={key} size="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className="size-4 text-primary" />
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

        <InstrumenTable mode="admin" />
      </div>
    </>
  )
}