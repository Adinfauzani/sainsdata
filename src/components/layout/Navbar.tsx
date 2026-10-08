import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, LogOut, Menu } from 'lucide-react'
import { Tree } from '@/components/navigation/Tree'
import { MobileNav } from '@/components/layout/MobileNav'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth'
import { cn } from '@/lib/utils'
import { spmiTreeNodes } from '@/data/treeNodes'
import type { TreeNode } from '@/types'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'Profile' },
  { to: '/contact', label: 'Contact' },
]

function DropdownMenu({
  label,
  active,
  nodes,
}: {
  label: string
  active: boolean
  nodes: TreeNode[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring/60',
          active ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
        )}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <ChevronDown
          className={cn('size-3.5 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <div
        className={cn(
          'absolute start-0 top-full z-50 mt-1 w-72 rounded-lg border border-border bg-popover p-2 shadow-lg',
          'origin-top transition duration-150',
          open ? 'visible scale-100 opacity-100' : 'invisible scale-[0.98] opacity-0'
        )}
      >
        <Tree nodes={nodes} onNodeSelect={() => setOpen(false)} aria-label={label} />
      </div>
    </div>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { admin, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            SD
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm">Sains Data</span>
            <span className="hidden text-[11px] font-normal text-muted-foreground sm:block">
              Fakultas Ilmu Komputer
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Menu utama">
          {navLinks.slice(0, 2).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                  isActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          <DropdownMenu label="SPMI" active={pathname.startsWith('/spmi')} nodes={spmiTreeNodes} />

          <NavLink
            to="/akreditasi"
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                isActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              )
            }
          >
            Akreditasi
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                isActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              )
            }
          >
            Contact
          </NavLink>

          {admin ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                    isActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                  )
                }
              >
                Dashboard
              </NavLink>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void logout()}
                title="Keluar"
              >
                <LogOut className="size-3.5" />
                Keluar
              </Button>
            </>
          ) : null}
        </nav>

        <div className="md:hidden">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  )
}
