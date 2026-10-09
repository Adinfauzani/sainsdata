import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FileCheck2, Layers, Landmark } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { institution, programStudi } from '@/data/profile'
import { spmiCategories, spmiDocuments } from '@/data/spmi'
import { standards } from '@/data/standards'
import { supportingDocuments } from '@/data/documents'

const stats = [
  { label: 'Akreditasi', value: standards.length },
  { label: 'Kategori SPMI', value: spmiCategories.length },
  { label: 'Program Studi', value: programStudi.length },
  { label: 'Dokumen Pendukung', value: supportingDocuments.length },
]

const overview = [
  {
    to: '/profile',
    icon: Landmark,
    title: 'Profil',
    description:
      'Latar belakang universitas, visi misi, daftar program studi, dan struktur organisasi penanggung jawab mutu.',
  },
  {
    to: '/spmi',
    icon: Layers,
    title: 'SPMI',
    description:
      `${spmiDocuments.length} dokumen pada ${spmiCategories.length} kategori: kebijakan, manual, standar, formulir, dan dokumen pendukung siklus P-D-C-A.`,
  },
  {
    to: '/akreditasi',
    icon: BookOpen,
    title: 'Akreditasi',
    description:
      'Standar mutu pendidikan, penelitian, pengabdian, dan tata kelola lengkap dengan indikator capaian serta dokumen terkait.',
  },
]

export function Home() {
  return (
    <>
      <section className="border-b border-border px-4 pt-16 pb-14 sm:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <Badge variant="outline" className="font-mono text-[11px] tracking-wider uppercase">
            {institution.singkatan} · Fakultas Ilmu Komputer
          </Badge>

          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
            Pusat Data dan Informasi Program Studi Sains Data
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Portal resmi Sistem Penjaminan Mutu Internal Universitas Saintek Muhammadiyah -
            seluruh standar mutu, kebijakan, dan dokumen akreditasi tersusun rapi dalam satu
            tempat. Portal ini menyajikan informasi terintegrasi terkait pendidikan, penelitian,
            pengabdian kepada masyarakat, SPMI, serta tata kelola Program Studi Sains Data
            secara sistematis, terbuka, dan mudah diakses.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/akreditasi"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Lihat Standar
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/spmi"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Dokumen SPMI
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-background px-5 py-6">
                <dd className="text-3xl font-semibold tracking-tight tabular-nums">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
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
                key={item.to}
                to={item.to}
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
              to="/profile"
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
