'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  CircleUser,
  EllipsisVerticalIcon,
  FileText,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  LogOutIcon,
  Settings2,
  ShieldCheck,
  Table2,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { useAuth } from '@/context/auth'
import { Providers } from '@/providers'
import type { UserRole } from '@/types'

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

const navSecondary: NavItem[] = [
  { title: 'Situs Publik', url: '/', icon: Globe, roles: ['user', 'admin', 'sudo'] },
  { title: 'Kontak', url: '/contact', icon: LifeBuoy, roles: ['user', 'admin', 'sudo'] },
]

/** Longest matching nav URL for the current path, so `/dashboard` does not
 * stay highlighted while on `/dashboard/instrumen`. */
function findActiveUrl(links: NavItem[], pathname: string) {
  return links
    .filter((link) => link.url !== '/' && (pathname === link.url || pathname.startsWith(`${link.url}/`)))
    .sort((a, b) => b.url.length - a.url.length)[0]?.url
}

function useNavLinks() {
  const { admin } = useAuth()
  const profileHref = admin ? `/${encodeURIComponent(admin.username)}` : '/dashboard'

  return (items: NavItem[]) =>
    items
      .filter((item) => !admin || item.roles.includes(admin.role))
      .map((item) => ({ ...item, url: item.dynamic ? profileHref : item.url }))
}

function NavMain() {
  const { admin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const resolveLinks = useNavLinks()

  useEffect(() => {
    if (!loading && !admin) {
      router.replace('/login')
    }
  }, [admin, loading, router])

  if (loading || !admin) return null

  const items = resolveLinks(navMain)
  const activeUrl = findActiveUrl(items, pathname)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.url === activeUrl}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                  {admin.role === 'sudo' && item.roles.length === 1 && (
                    <Badge variant="secondary" className="ml-auto text-xs">
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

function NavSecondary() {
  const { admin, loading } = useAuth()
  const pathname = usePathname()
  const resolveLinks = useNavLinks()

  if (loading || !admin) return null

  const items = resolveLinks(navSecondary)
  const activeUrl = findActiveUrl(items, pathname)

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Lainnya</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.url === activeUrl && item.url !== '/'}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
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
      className="size-8 rounded-lg object-cover"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground">
      {admin?.username?.charAt(0).toUpperCase() ?? 'U'}
    </div>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {avatar}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{displayDetail}</span>
              </div>
              <EllipsisVerticalIcon className="ml-auto" />
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
              <LogOutIcon />
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
  const href =
    admin && admin.role === 'user' ? `/${encodeURIComponent(admin.username)}` : '/dashboard'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" className="data-[slot=sidebar-menu-button]:p-1.5!">
          <a href={href}>
            <img src="/favicon.png" alt="" className="size-6 rounded-sm" />
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-base font-semibold">Sains Data</span>
              <span className="truncate text-xs text-muted-foreground">SPMI · BPM</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function InsetHeader() {
  const pathname = usePathname()
  const resolveLinks = useNavLinks()
  const items = resolveLinks(navMain)
  const activeUrl = findActiveUrl(items, pathname)
  const title = items.find((item) => item.url === activeUrl)?.title ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
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
            <SidebarBrand />
          </SidebarHeader>
          <SidebarContent>
            <NavMain />
            <NavSecondary />
          </SidebarContent>
          <SidebarFooter>
            <NavUser />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <InsetHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  )
}
