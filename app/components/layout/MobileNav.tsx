'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tree } from '@/components/navigation/Tree'
import { useAuth } from '@/context/auth'
import { cn } from '@/lib/utils'
import { spmiTreeNodes } from '@/data/treeNodes'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/profile', label: 'Profile' },
  { href: '/spmi', label: 'SPMI' },
  { href: '/akreditasi', label: 'Akreditasi' },
  { href: '/contact', label: 'Contact' },
]

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()
  const close = () => onOpenChange(false)
  const { admin, logout } = useAuth()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-80 max-w-[85vw] flex-col gap-0 p-0">
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-4 py-3.5">
          <SheetTitle className="text-sm">Menu Navigasi</SheetTitle>
          <Button variant="ghost" size="icon-sm" aria-label="Tutup menu" onClick={close}>
            <X className="size-4" />
          </Button>
        </SheetHeader>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Menu mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === link.href ? 'bg-primary/8 text-primary' : 'text-foreground/85 hover:bg-accent'
              )}
            >
              {link.label}
            </Link>
          ))}

          {admin && (admin.role === 'admin' || admin.role === 'sudo') ? (
            <Link
              href="/dashboard"
              onClick={close}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/dashboard' ? 'bg-primary/8 text-primary' : 'text-foreground/85 hover:bg-accent'
              )}
            >
              Dashboard
            </Link>
          ) : null}

          <div className="pt-3">
            <p className="px-3 pb-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              SPMI
            </p>
            <Tree nodes={spmiTreeNodes} onNodeSelect={close} aria-label="Submenu SPMI" />
          </div>

          {admin ? (
            <div className="border-t border-border pt-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  close()
                  void logout()
                }}
              >
                <LogOut className="size-4" />
                Keluar
              </Button>
            </div>
          ) : null}
        </nav>
      </SheetContent>
    </Sheet>
  )
}