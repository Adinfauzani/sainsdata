'use client'

import { Providers } from '@/providers'
import { useAuth } from '@/context/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LayoutDashboard, Table2, FileText, Users, ShieldCheck, Settings2 } from 'lucide-react'
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

const navMain = [
  { title: 'Overview', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'sudo'] },
  { title: 'Instrumen', url: '/dashboard/instrumen', icon: Table2, roles: ['admin', 'sudo'] },
  { title: 'Data Dokumen', url: '/dashboard/dokumen', icon: FileText, roles: ['admin', 'sudo'] },
  { title: 'Manajemen User', url: '/dashboard/users', icon: Users, roles: ['sudo'] },
  { title: 'Audit Log', url: '/dashboard/audit-log', icon: ShieldCheck, roles: ['sudo'] },
  { title: 'Pengaturan', url: '/dashboard/settings', icon: Settings2, roles: ['sudo'] },
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

  const filteredItems = navMain.filter((item) => item.roles.includes(admin.role))

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
  const { admin, logout } = useAuth()
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-medium">
                {admin?.username?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{admin?.username ?? 'User'}</span>
                <span className="truncate text-xs text-muted-foreground">{admin?.email ?? ''}</span>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-medium">
                  {admin?.username?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{admin?.username ?? 'User'}</span>
                  <span className="truncate text-xs text-muted-foreground">{admin?.email ?? ''}</span>
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
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard">
                <span className="text-base font-semibold">Sains Data</span>
              </a>
            </SidebarMenuButton>
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