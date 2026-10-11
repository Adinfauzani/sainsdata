import Link from 'next/link'
import { ArrowRight, BookOpen, FileCheck2, Layers, Landmark, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { institution } from '@/data/profile'
import { spmiCategories, spmiDocuments } from '@/data/spmi'

const overview = [
  {
    href: '/profile',
    icon: Landmark,
    title: 'Profil',
    description:
      'Latar belakang universitas, visi misi, daftar program studi, dan struktur organisasi penanggung jawab mutu.',
  },
  {
    href: '/spmi',
    icon: Layers,
    title: 'SPMI',
    description:
      `${spmiDocuments.length} dokumen pada ${spmiCategories.length} kategori: kebijakan, manual, standar, formulir, dan dokumen pendukung siklus P-D-C-A.`,
  },
  {
    href: '/akreditasi',
    icon: BookOpen,
    title: 'Akreditasi',
    description:
      'Standar mutu pendidikan, penelitian, pengabdian, dan tata kelola lengkap dengan indikator capaian serta dokumen terkait.',
  },
]

function HeroIllustration() {
  return (
    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] max-w-[480px] opacity-40 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 480 480" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect x="30" y="30" width="180" height="180" rx="12" fill="url(#grad1)" transform="rotate(-10 120 120)" />
        <circle cx="360" cy="100" r="85" fill="var(--primary)" opacity="0.06" />
        <polygon points="440,340 480,420 400,420" fill="var(--primary)" opacity="0.08" />
        <rect x="150" y="300" width="240" height="240" rx="16" stroke="var(--primary)" strokeWidth="1.5" fill="none" opacity="0.1" transform="rotate(6 270 420)" />
        <circle cx="100" cy="400" r="50" fill="var(--primary)" opacity="0.05" />
        <rect x="330" y="200" width="110" height="110" rx="6" fill="var(--primary)" opacity="0.08" transform="rotate(20 385 255)" />
        <circle cx="200" cy="200" r="3" fill="var(--primary)" opacity="0.15" />
        <circle cx="400" cy="300" r="2" fill="var(--primary)" opacity="0.1" />
        <rect x="50" y="380" width="60" height="4" rx="2" fill="var(--primary)" opacity="0.08" />
        <rect x="380" y="80" width="4" height="60" rx="2" fill="var(--primary)" opacity="0.06" />
      </svg>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <section className="relative border-b border-border px-4 pt-16 pb-14 sm:px-6 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl">
          <HeroIllustration />
          <div className="relative z-10 max-w-2xl sm:max-w-3xl lg:max-w-4xl">
            <Badge variant="outline" className="font-mono text-[11px] tracking-wider uppercase">
              {institution.singkatan} . Fakultas Ilmu Komputer
            </Badge>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl sm:leading-[1.1] lg:text-5xl xl:text-6xl">
              Pusat Data dan Informasi Program Studi Sains Data
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl max-w-3xl">
              Portal resmi SPMI Universitas Saintek Muhammadiyah yang menyediakan standar mutu, kebijakan, dan dokumen akreditasi secara terintegrasi, sistematis, dan mudah diakses, mencakup pendidikan, penelitian, pengabdian kepada masyarakat, serta tata kelola Program Studi Sains Data.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/akreditasi"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Lihat Standar
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/spmi"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Dokumen SPMI
              </Link>
            </div>

            <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Program Studi Sains Data Fakultas Ilmu Komputer
                  </p>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    Program studi yang berfokus pada pengembangan ilmu pengetahuan dan teknologi di bidang sains data, menghasilkan lulusan kompeten dalam mengelola, menganalisis, dan memanfaatkan data skala besar untuk pengambilan keputusan berbasis bukti.
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shrink-0"
                >
                  <GraduationCap className="size-4" aria-hidden />
                  Lihat Profil Lengkap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6" aria-labelledby="overview-heading">
        <div className="mx-auto w-full max-w-7xl">
          <h2 id="overview-heading" className="text-xs font-semibold tracking-widest text-primary uppercase">
            Jelajahi Portal
          </h2>

          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {overview.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-3 bg-background p-6 transition-colors hover:bg-muted/60"
              >
                <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-primary">
                  <item.icon className="size-4" aria-hidden />
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {item.title}
                  <ArrowRight
                    className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm">
            <FileCheck2 className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-muted-foreground">
              Akreditasi Institusi:{' '}
              <span className="font-medium text-foreground">{institution.statusAkreditasi}</span>{' '}
              - {institution.statusAkreditasiSk}, berlaku hingga{' '}
              {institution.statusAkreditasiBerlaku}.
            </span>
            <Link
              href="/profile"
              className="ms-auto inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Detail profil
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}