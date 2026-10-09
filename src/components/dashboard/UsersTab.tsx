import { useEffect, useState } from 'react'
import { Search, Plus, Edit, Trash2, User, Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from '@/components/ui/table'
import { api } from '@/lib/api'

interface User {
  id: number
  email: string
  username: string
  role: 'sudo' | 'admin' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface UserFormData {
  email: string
  username: string
  password: string
  role: 'sudo' | 'admin' | 'user'
}

const roleLabels: Record<string, string> = {
  sudo: 'Sudo',
  admin: 'Admin',
  user: 'User'
}

const roleBadgeVariants: Record<string, 'default' | 'secondary' | 'outline'> = {
  sudo: 'default',
  admin: 'secondary',
  user: 'outline'
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'sudo' | 'admin' | 'user'>('all')
  const [filterActive, setFilterActive] = useState<'all' | 'true' | 'false'>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    username: '',
    password: '',
    role: 'user'
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit)
      })
      if (search) params.set('search', search)
      if (filterRole !== 'all') params.set('role', filterRole)
      if (filterActive !== 'all') params.set('isActive', filterActive)

      const res = await api<UsersResponse>(`/api/users?${params.toString()}`)
      setUsers(res.users)
      setPagination(res.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [pagination.page, search, filterRole, filterActive])

  function openCreateDialog() {
    setIsEditing(false)
    setEditingUser(null)
    setFormData({ email: '', username: '', password: '', role: 'user' })
    setFormError(null)
    setIsDialogOpen(true)
  }

  function openEditDialog(user: User) {
    setIsEditing(true)
    setEditingUser(user)
    setFormData({ email: user.email, username: user.username, password: '', role: user.role })
    setFormError(null)
    setIsDialogOpen(true)
  }

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingUser(null)
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      if (isEditing && editingUser) {
        const updates: Record<string, unknown> = {}
        if (formData.email !== editingUser.email) updates.email = formData.email
        if (formData.username !== editingUser.username) updates.username = formData.username
        if (formData.role !== editingUser.role) updates.role = formData.role
        if (formData.password) updates.password = formData.password

        await api(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        })
      } else {
        await api('/api/users', {
          method: 'POST',
          body: JSON.stringify(formData)
        })
      }
      closeDialog()
      loadUsers()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return

    setDeletingId(id)
    try {
      await api(`/api/users/${id}`, { method: 'DELETE' })
      loadUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus')
    } finally {
      setDeletingId(null)
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  function getRoleBadge(role: string) {
    return (
      <Badge variant={roleBadgeVariants[role] || 'outline'}>
        {roleLabels[role] || role}
      </Badge>
    )
  }

  function getActiveBadge(active: boolean) {
    return (
      <Badge variant={active ? 'secondary' : 'outline'}>
        {active ? 'Aktif' : 'Nonaktif'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Manajemen Pengguna</h2>
          <p className="text-sm text-muted-foreground">Kelola akun pengguna dan hak akses dashboard</p>
        </div>
        <Button onClick={openCreateDialog} disabled={!['sudo'].includes('')}>
          <Plus className="size-4 mr-2" />
          Tambah Pengguna
        </Button>
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
                placeholder="Cari email atau username..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={v => { setFilterRole(v as typeof filterRole); setPagination(p => ({ ...p, page: 1 })) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Semua Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="sudo">Sudo</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterActive} onValueChange={v => { setFilterActive(v as typeof filterActive); setPagination(p => ({ ...p, page: 1 })) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
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
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto size-12 mb-2 opacity-50" />
              <p>Tidak ada pengguna yang ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getActiveBadge(user.is_active)}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)} disabled={submitting}>
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} disabled={deletingId === user.id || user.role === 'sudo' || submitting}>
                            {deletingId === user.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-destructive" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} pengguna
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

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Mengubah data untuk ${editingUser?.email}`
                : 'Buat akun pengguna baru untuk akses dashboard'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@saintekmu.ac.id"
                  required
                  disabled={isEditing}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="username"
                  required
                  disabled={isEditing}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{isEditing ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={isEditing ? '••••••••' : 'minimal 8 karakter'}
                  required={!isEditing}
                  minLength={8}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData(prev => ({ ...prev, role: v as 'sudo' | 'admin' | 'user' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sudo">Sudo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formError && (
                <p className="text-sm text-destructive" role="alert">{formError}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={submitting}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
                {isEditing ? 'Simpan Perubahan' : 'Buat Pengguna'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function UsersTab() {
  return <UserManagement />
}