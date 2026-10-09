import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Clock, Globe } from 'lucide-react'
import { institution } from '@/data/profile'

const columns = [
  {
    title: 'Navigasi',
    links: [
      { to: '/', label: 'Home' },
      { to: '/profile', label: 'Profile' },
      { to: '/spmi', label: 'SPMI' },
      { to: '/akreditasi', label: 'Akreditasi' },
      { to: '/data-dokumen', label: 'Data dan Dokumen' },
      { to: '/contact', label: 'Contact' },
    ],
  },
]

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1.4fr]">
          <div>
            <p className="text-sm font-semibold tracking-tight">{institution.nama}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Pusat data dan informasi akreditasi Program Studi Sains Data, Fakultas Ilmu Komputer.
            </p>
          </div>

          <nav aria-label="Tautan footer">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {columns[0].title}
            </p>
            <ul className="mt-3 space-y-2">
              {columns[0].links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
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
              Kontak
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-foreground/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="leading-relaxed">{institution.alamat}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <a href={`tel:${institution.telepon.replace(/[^0-9+]/g, '')}`} className="hover:text-primary">
                  {institution.telepon}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <a href={`mailto:${institution.email}`} className="hover:text-primary">
                  {institution.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  {institution.website.replace('https://', '')}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span>{institution.jamLayanan}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {institution.nama} — Fakultas Ilmu Komputer
          </p>
          <p>
            Akreditasi Institusi {institution.statusAkreditasi} · {institution.statusAkreditasiSk}
          </p>
        </div>
      </div>
    </footer>
  )
}
