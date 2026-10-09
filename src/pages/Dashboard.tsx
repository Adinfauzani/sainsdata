import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FileText, FolderOpen, Link2, Layers, ListTree, Table2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { InstrumenTable } from '@/components/InstrumenTable'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersTab } from '@/components/dashboard/UsersTab'
import { AuditLogTab } from '@/components/dashboard/AuditLogTab'

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

export function Dashboard() {
  const { admin, loading, logout } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('overview')

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

  const isSudo = admin.role === 'sudo'

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Dashboard Admin"
        description="Ringkasan seluruh data instrumen akreditasi program studi Sains Data."
      >
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Masuk sebagai{' '}
            <span className="font-medium text-foreground">{admin.email}</span>
            {' '}
            <Badge variant={admin.role === 'sudo' ? 'default' : admin.role === 'admin' ? 'secondary' : 'outline'}>
              {admin.role === 'sudo' ? 'Sudo' : admin.role === 'admin' ? 'Admin' : 'User'}
            </Badge>
          </p>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            <LogOut className="size-3.5" />
            Keluar
          </Button>
        </div>
      </PageHeader>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {error ? (
          <p className="text-sm font-medium text-destructive" role="alert">{error}</p>
        ) : null}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="instrumen">Instrumen</TabsTrigger>
            {isSudo && <TabsTrigger value="users">Manajemen User</TabsTrigger>}
            {isSudo && <TabsTrigger value="auditlog">Audit Log</TabsTrigger>}
            {isSudo && <TabsTrigger value="settings">Pengaturan</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview">
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
          </TabsContent>

          <TabsContent value="instrumen">
            <InstrumenTable mode="admin" />
          </TabsContent>

          {isSudo && (
            <TabsContent value="users">
              <UsersTab />
            </TabsContent>
          )}

          {isSudo && (
            <TabsContent value="auditlog">
              <AuditLogTab />
            </TabsContent>
          )}

          {isSudo && (
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Sistem</CardTitle>
                  <CardDescription>Konfigurasi global portal akreditasi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Fitur pengaturan sistem akan segera tersedia.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  )
}