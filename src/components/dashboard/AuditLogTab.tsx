import { useEffect, useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from '@/components/ui/table'
import { api } from '@/lib/api'
import { format } from 'date-fns'

interface AuditLog {
  id: number
  admin_id: number | null
  action: string
  target_type: string | null
  target_id: string | null
  old_value: unknown
  new_value: unknown
  ip_address: string
  user_agent: string
  created_at: string
  admin_email: string | null
  admin_username: string | null
}

interface AuditLogResponse {
  logs: AuditLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const actionLabels: Record<string, string> = {
  USER_CREATE: 'Buat Pengguna',
  USER_UPDATE: 'Ubah Pengguna',
  USER_DELETE: 'Hapus Pengguna',
  ROLE_CHANGE: 'Ubah Role',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
}

const targetTypeLabels: Record<string, string> = {
  user: 'Pengguna',
  document: 'Dokumen',
  standard: 'Standar',
  setting: 'Pengaturan',
}

function getActionBadge(action: string) {
  const label = actionLabels[action] || action
  let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline'
  if (action.includes('CREATE')) variant = 'default'
  else if (action.includes('UPDATE') || action.includes('CHANGE')) variant = 'secondary'
  else if (action.includes('DELETE')) variant = 'destructive'
  return <Badge variant={variant}>{label}</Badge>
}

function getTargetTypeBadge(type: string | null) {
  if (!type) return <Badge variant="outline">-</Badge>
  return <Badge variant="outline">{targetTypeLabels[type] || type}</Badge>
}

function truncate(value: unknown, maxLength = 50): string {
  const str = typeof value === 'string' ? value : JSON.stringify(value)
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str
}

export function AuditLogTab() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterAction, setFilterAction] = useState('')
  const [filterTargetType, setFilterTargetType] = useState('')

  async function loadLogs() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit)
      })
      if (filterAction) params.set('action', filterAction)
      if (filterTargetType) params.set('targetType', filterTargetType)

      const res = await api<AuditLogResponse>(`/api/audit-log?${params.toString()}`)
      setLogs(res.logs)
      setPagination(res.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat audit log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [pagination.page, filterAction, filterTargetType])

  function goToPage(page: number) {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Audit Log</h2>
          <p className="text-sm text-muted-foreground">Riwayat aktivitas administratif dan perubahan sensitif</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter tersembunyi (gunakan select di bawah)"
                className="pl-10 opacity-0 pointer-events-none h-0"
                aria-hidden="true"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterAction} onValueChange={v => { setFilterAction(v); setPagination(p => ({ ...p, page: 1 })) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Aksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Aksi</SelectItem>
                  <SelectItem value="USER_CREATE">Buat Pengguna</SelectItem>
                  <SelectItem value="USER_UPDATE">Ubah Pengguna</SelectItem>
                  <SelectItem value="USER_DELETE">Hapus Pengguna</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="LOGOUT">Logout</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTargetType} onValueChange={v => { setFilterTargetType(v); setPagination(p => ({ ...p, page: 1 })) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Target</SelectItem>
                  <SelectItem value="user">Pengguna</SelectItem>
                  <SelectItem value="document">Dokumen</SelectItem>
                  <SelectItem value="standard">Standar</SelectItem>
                  <SelectItem value="setting">Pengaturan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mx-auto size-12 mb-2 opacity-50">📋</div>
              <p>Tidak ada log aktivitas yang ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>ID Target</TableHead>
                    <TableHead>Pelaku</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {format(new Date(log.created_at), 'dd MMM yyyy HH:mm:ss', { locale: undefined })}
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>{getTargetTypeBadge(log.target_type)}</TableCell>
                      <TableCell className="font-mono text-xs">{log.target_id || '-'}</TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{log.admin_email || 'Sistem'}</span>
                          {log.admin_username && <span className="text-xs text-muted-foreground ml-1">(@{log.admin_username})</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.ip_address}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex gap-1">
                          {log.old_value != null && (
                            <Badge variant="outline" className="text-[10px] cursor-help" title={`Old: ${JSON.stringify(log.old_value)}`}>
                              Lama: {String(truncate(log.old_value, 30))}
                            </Badge>
                          )}
                          {log.new_value != null && (
                            <Badge variant="secondary" className="text-[10px] cursor-help" title={`New: ${JSON.stringify(log.new_value)}`}>
                              Baru: {String(truncate(log.new_value, 30))}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} log
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page <= 1 || loading}>
                            <ChevronLeft className="size-4 mr-1" /> Sebelumnya
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages || loading}>
                            Selanjutnya <ChevronRight className="size-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}