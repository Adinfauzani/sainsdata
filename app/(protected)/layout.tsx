'use client'

import { Providers } from '@/providers'
import { useAuth } from '@/context/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LayoutDashboard, Table2, FileText, Users, ShieldCheck, Settings2, CircleUser, type LucideIcon } from 'lucide-react'
import type { UserRole } from '@/types'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { EllipsisVerticalIcon, LogOutIcon } from 'lucide-react'

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  roles: UserRole[]
  /** When true the URL is resolved from the signed-in user (`/{username}`). */
  dynamic?: boolean
}

const navMain: NavItem[] = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'sudo'] },
  { title: 'Instrumen', url: '/dashboard/instrumen', icon: Table2, roles: ['admin', 'sudo'] },
  { title: 'Data Dokumen', url: '/dashboard/dokumen', icon: FileText, roles: ['admin', 'sudo'] },
  { title: 'Manajemen User', url: '/dashboard/users', icon: Users, roles: ['sudo'] },
  { title: 'Audit Log', url: '/dashboard/audit-log', icon: ShieldCheck, roles: ['sudo'] },
  { title: 'Pengaturan', url: '/dashboard/settings', icon: Settings2, roles: ['sudo'] },
  { title: 'Profil Saya', url: '/', icon: CircleUser, roles: ['user', 'admin', 'sudo'], dynamic: true },
]

function NavMain() {
  const { admin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      router.replace('/login')
    }
  }, [admin, loading, router])

  if (loading || !admin) return null

  const profileHref = `/${encodeURIComponent(admin.username)}`
  const filteredItems = navMain
    .filter((item) => item.roles.includes(admin.role))
    .map((item) => ({ ...item, url: item.dynamic ? profileHref : item.url }))

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                  {admin.role === 'sudo' && item.roles.includes('sudo') && item.roles.length === 1 && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      SUDO
                    </Badge>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavUser() {
  const { admin, profile, logout } = useAuth()
  const { isMobile } = useSidebar()

  const displayName = profile?.name || admin?.username || 'User'
  const displayDetail = admin?.email ?? profile?.login ?? ''

  const avatar = profile?.avatarUrl ? (
    <img
      src={profile.avatarUrl}
      alt=""
      className="h-8 w-8 rounded-lg object-cover"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-medium">
      {admin?.username?.charAt(0).toUpperCase() ?? 'U'}
    </div>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              {avatar}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{displayDetail}</span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {avatar}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{displayDetail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void logout()}>
              <LogOutIcon className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function SidebarBrand() {
  const { admin } = useAuth()
  const href = admin && admin.role === 'user' ? `/${encodeURIComponent(admin.username)}` : '/dashboard'

  return (
    <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
      <a href={href} className="flex items-center gap-2">
        <img src="/favicon.png" alt="" className="size-6 rounded-sm" />
        <span className="text-base font-semibold">Sains Data</span>
      </a>
    </SidebarMenuButton>
  )
}

export const dynamic = 'force-dynamic'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <Providers>
      <SidebarProvider>
        <Sidebar collapsible="offcanvas" variant="inset">
          <SidebarHeader>
            <SidebarTrigger className="-ml-1" />
            <SidebarBrand />
          </SidebarHeader>
          <SidebarContent>
            <NavMain />
          </SidebarContent>
          <SidebarFooter>
            <NavUser />
          </SidebarFooter>
        </Sidebar>
        <SidebarRail />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </Providers>
  )
}