'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Layers, LogOut, Settings, Table2, Users, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Layers, roles: ['admin', 'sudo'] },
  { href: '/dashboard/instrumen', label: 'Instrumen', icon: Table2, roles: ['admin', 'sudo'] },
  { href: '/dashboard/dokumen', label: 'Data Dokumen', icon: FileText, roles: ['admin', 'sudo'] },
  { href: '/dashboard/users', label: 'Manajemen User', icon: Users, roles: ['sudo'] },
  { href: '/dashboard/audit-log', label: 'Audit Log', icon: ShieldCheck, roles: ['sudo'] },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings, roles: ['sudo'] },
]

interface DashboardSidebarProps {
  admin: { email: string; role: string }
  onLogout: () => void
}

export function DashboardSidebar({ admin, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname()
  const isSudo = admin.role === 'sudo'

  const filteredItems = navItems.filter((item) => item.roles.includes(admin.role))

  return (
    <aside className="flex h-full flex-col border-r border-border bg-background w-64 shrink-0 hidden lg:flex">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <span className="font-semibold text-sm tracking-tight">Dashboard</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onLogout}
          title="Keluar"
        >
          <LogOut className="size-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Dashboard navigation">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/80 hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className={cn('size-4 shrink-0', isActive && 'text-primary-foreground')} aria-hidden />
              {item.label}
              {isSudo && item.roles.includes('sudo') && item.roles.length === 1 && (
                <Badge variant="secondary" className="text-xs ml-auto">SUDO</Badge>
              )}
            </Link>
          )
        })}

        <Separator className="my-3" />

        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Akun</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground/80 truncate">{admin.email}</span>
            <Badge variant={admin.role === 'sudo' ? 'default' : admin.role === 'admin' ? 'secondary' : 'outline'}>
              {admin.role === 'sudo' ? 'Sudo' : admin.role === 'admin' ? 'Admin' : 'User'}
            </Badge>
          </div>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="size-4 mr-2" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}