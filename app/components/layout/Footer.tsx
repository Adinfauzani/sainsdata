import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { institution } from '@/data/profile'

const navigation = [
  { href: '/', label: 'Beranda' },
  { href: '/profile', label: 'Profil Prodi' },
  { href: '/spmi', label: 'SPMI' },
  { href: '/akreditasi', label: 'Instrumen Akreditasi' },
  { href: '/data-dokumen', label: 'Data Dokumen' },
  { href: '/contact', label: 'Kontak' },
]

const footerLinks = [
  { href: '/akreditasi', label: 'Standar Akreditasi' },
  { href: '/spmi', label: 'Dokumen SPMI' },
  { href: '/data-dokumen', label: 'Arsip Dokumen' },
]

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 xl:py-14">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-base font-semibold tracking-tight">{institution.nama}</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Pusat data dan informasi akreditasi Program Studi Sains Data, Fakultas Ilmu Komputer.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-3.5" aria-hidden />
                Fakultas Ilmu Komputer
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-3.5" aria-hidden />
                Program Studi Sains Data (S1)
              </span>
            </div>
          </div>

          <nav aria-label="Navigasi portal">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Portal
            </p>
            <ul className="mt-3 space-y-2">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Akses Cepat
            </p>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {institution.nama} - Fakultas Ilmu Komputer
          </p>
          <p>
            Akreditasi Institusi {institution.statusAkreditasi} · {institution.statusAkreditasiSk}
          </p>
        </div>
      </div>
    </footer>
  )
}