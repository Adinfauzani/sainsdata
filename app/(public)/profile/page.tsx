import { PageHeader } from '@/components/PageHeader'
import { ChevronDownIcon, AlertCircleIcon } from 'lucide-react'
import {
  sainsDataProfile,
  universitasVMTS,
  sainsDataPrinsipPengembangan,
} from '@/data/sains-data'

function SectionTitle({ children, id }: { children: string; id: string }) {
  return (
    <h2 id={id} className="text-xs sm:text-sm font-semibold tracking-widest text-primary uppercase mb-4 sm:mb-6">
      {children}
    </h2>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <article className="p-4 sm:p-6 text-center bg-muted/30 rounded-xl border border-border/50">
      <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3 sm:mb-4">
        <AlertCircleIcon className="size-5 sm:size-6 text-muted-foreground/40" />
      </div>
      <h3 className="font-medium text-sm sm:text-base text-foreground">{title}</h3>
      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">{description}</p>
    </article>
  )
}

function VMTSReferenceItem({ label, content }: { 
  label: string; 
  content: string | string[]; 
}) {
  const items = Array.isArray(content) ? content : [content]
  return (
    <article className="py-4 sm:py-5 border-t border-border/50 first:border-0">
      <header className="mb-3 sm:mb-4">
        <h3 className="font-semibold text-sm sm:text-base text-foreground">{label}</h3>
      </header>
      <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-foreground/80 pl-4 border-l border-border/30">
        {items.map((item, i) => (
          <li key={i} className="relative pb-2 last:pb-0 before:absolute before:left-[-12px] before:top-[6px] before:size-1.5 before:rounded-full before:bg-primary/40">
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

function HierarchyItem({ label, content, isLast = false, showConnector = true }: { 
  label: string; 
  content: string | string[];
  isLast?: boolean;
  showConnector?: boolean;
}) {
  const items = Array.isArray(content) ? content : [content]
  const connector = showConnector && !isLast ? (
    <div className="absolute left-[18px] top-10 bottom-0 w-[1px] bg-border/30 hidden sm:block" aria-hidden="true" />
  ) : null

  return (
    <div className="relative">
      {connector}
      <div className="flex items-start gap-3 sm:gap-4 pl-10 sm:pl-12">
        <div className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full border border-primary/30 bg-background flex items-center justify-center hidden sm:block">
          <ChevronDownIcon className="size-3 text-primary/50" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm sm:text-base text-foreground mb-2">{label}</h4>
          <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-foreground/70 pl-3 sm:pl-4 border-l border-border/30">
            {items.map((item, i) => (
              <li key={i} className="relative pb-2 last:pb-0 before:absolute before:left-[-9px] before:top-[6px] before:size-1 before:rounded-full before:bg-primary/30">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function PrinsipItem({ nomor, judul, deskripsi, referensi }: { nomor: number; judul: string; deskripsi: string; referensi: string }) {
  return (
    <article className="py-4 sm:py-5 border-t border-border/50 first:border-0">
      <div className="flex gap-4 sm:gap-6">
        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center text-primary font-bold text-sm sm:text-base" aria-hidden="true">
          {nomor}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg text-foreground">{judul}</h3>
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-foreground/75 leading-relaxed">{deskripsi}</p>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground/60 italic">{referensi}</p>
        </div>
      </div>
    </article>
  )
}

export default function Profile() {
  return (
    <article className="space-y-10 sm:space-y-12 md:space-y-16">
      <PageHeader title="Profil Program Studi Sains Data" className="pt-4 sm:pt-6" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-10">

        {/* A. Hero - Profil Program Studi */}
        <section aria-labelledby="hero-heading" className="relative rounded-2xl bg-gradient-to-br from-primary/5 via-background to-background p-5 sm:p-7 md:p-10 lg:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary)/0.08,transparent_60%)]" aria-hidden="true" />
          <header className="relative mb-6 sm:mb-8 md:mb-10">
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-primary uppercase">Universitas Saintek Muhammadiyah</p>
            <h1 id="hero-heading" className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Program Studi Sains Data
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg font-medium text-muted-foreground">
              Fakultas Ilmu Komputer · Strata 1 (S1)
            </p>
          </header>
          <div className="relative grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-3 text-sm sm:text-base mb-6 pt-5 border-t border-border/30">
            <dl className="flex flex-col gap-1">
              <dt className="text-[11px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">Akreditasi</dt>
              <dd className="font-semibold text-base sm:text-lg text-foreground">{sainsDataProfile.akreditasi}</dd>
            </dl>
            <dl className="flex flex-col gap-1">
              <dt className="text-[11px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">Nomor SK</dt>
              <dd className="font-mono text-xs sm:text-sm text-foreground/70 break-all">{sainsDataProfile.skAkreditasi}</dd>
            </dl>
            <dl className="flex flex-col gap-1">
              <dt className="text-[11px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">Berlaku Hingga</dt>
              <dd className="font-semibold text-base sm:text-lg text-foreground">{sainsDataProfile.berlakuHingga}</dd>
            </dl>
</div>
        </section>

        {/* C. Visi, Misi, Tujuan, Sasaran Universitas */}
        <section aria-labelledby="universitas-vmts-heading" className="space-y-5 sm:space-y-6 md:space-y-8">
          <header className="space-y-3 sm:space-y-4">
            <SectionTitle id="universitas-vmts-heading">Visi, Misi, Tujuan & Sasaran Universitas</SectionTitle>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
              Data berikut bersumber dari <strong>BAB II Pedoman Penyusunan Visi Misi Universitas</strong> Universitas Saintek Muhammadiyah, 
              sebagai acuan penyusunan VMTS Fakultas dan Program Studi.
            </p>
          </header>
          <div className="space-y-0 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            <VMTSReferenceItem label="Visi Universitas" content={universitasVMTS.visi} />
            <VMTSReferenceItem label="Misi Universitas" content={universitasVMTS.misi} />
            <VMTSReferenceItem label="Tujuan Universitas" content={universitasVMTS.tujuan} />
            <VMTSReferenceItem label="Sasaran Universitas" content={universitasVMTS.sasaran} />
          </div>
        </section>

        {/* D. VMTS Program Studi Sains Data */}
        <section aria-labelledby="prodi-vmts-heading" className="space-y-5 sm:space-y-6 md:space-y-8">
          <header className="space-y-3 sm:space-y-4">
            <SectionTitle id="prodi-vmts-heading">Visi, Misi, Tujuan & Sasaran Program Studi</SectionTitle>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
              VMTS Program Studi Sains Data mengacu pada VMTS Universitas dan Fakultas Ilmu Komputer. 
              Data resmi akan ditampilkan setelah dokumen SK Rektor / Renstra Program Studi tersedia.
            </p>
          </header>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EmptyState
              title="Visi Keilmuan"
              description="Visi keilmuan Program Studi Sains Data belum tersedia dalam dokumen resmi publik."
            />
            <EmptyState
              title="Misi"
              description="Rumusan misi Program Studi Sains Data belum tersedia dalam dokumen resmi publik."
            />
            <EmptyState
              title="Tujuan"
              description="Rumusan tujuan Program Studi Sains Data belum tersedia dalam dokumen resmi publik."
            />
            <EmptyState
              title="Sasaran Strategis"
              description="Sasaran strategis Program Studi Sains Data belum tersedia dalam dokumen resmi publik."
            />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground italic pt-2 border-t border-border/30">
            Hubungi Ketua Program Studi Sains Data atau akses dokumen internal (SK Rektor, Renstra Prodi) untuk data VMTS resmi.
          </p>
        </section>

        {/* E. Keterkaitan VMTS (Hierarki) */}
        <section aria-labelledby="keterkaitan-heading" className="space-y-5 sm:space-y-6 md:space-y-8">
          <header>
            <SectionTitle id="keterkaitan-heading">Keterkaitan VMTS (Hierarki)</SectionTitle>
          </header>
          <div className="space-y-0 md:grid md:grid-cols-3 md:gap-6 md:space-y-0 md:items-start">
            <HierarchyItem
              label="Visi Universitas Saintek Muhammadiyah"
              content={universitasVMTS.visi}
            />
            <HierarchyItem
              label="Visi Fakultas Ilmu Komputer"
              content="Data visi Fakultas Ilmu Komputer belum tersedia dalam dokumen referensi."
            />
            <HierarchyItem
              label="Visi Keilmuan Program Studi Sains Data"
              content="Data VMTS Program Studi (Visi, Misi, Tujuan, Sasaran, CPL) memerlukan dokumen resmi Prodi."
              isLast={true}
              showConnector={false}
            />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground pt-3 border-t border-border/30">
            <strong className="text-foreground/60">Alur:</strong> Visi Universitas → Visi Fakultas → Visi Keilmuan Prodi → Misi → Tujuan → Sasaran → CPL.
          </p>
        </section>

        {/* F. Prinsip Pengembangan dan Penjaminan Mutu */}
        <section aria-labelledby="prinsip-heading" className="space-y-5 sm:space-y-6 md:space-y-8">
          <header className="space-y-3 sm:space-y-4">
            <SectionTitle id="prinsip-heading">Prinsip Pengembangan & Penjaminan Mutu</SectionTitle>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
              Berdasarkan <strong>BAB II Kriteria Visi, Misi, Tujuan, dan Sasaran</strong> Pedoman Penyusunan Visi Misi Universitas.
            </p>
          </header>
          <div className="space-y-0 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {sainsDataPrinsipPengembangan.map((prinsip) => (
              <PrinsipItem key={prinsip.nomor} {...prinsip} />
            ))}
          </div>
        </section>

        {/* G. Informasi Kontak */}
        <section aria-labelledby="kontak-heading" className="rounded-xl bg-muted/30 border border-border/50 p-5 sm:p-6 md:p-8">
          <header className="mb-4 sm:mb-6">
            <h3 id="kontak-heading" className="font-semibold text-base sm:text-lg text-foreground">Informasi Kontak</h3>
          </header>
          <dl className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm sm:text-base text-foreground/75">
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">Website</dt>
              <dd><a href={sainsDataProfile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{sainsDataProfile.website}</a></dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">Email</dt>
              <dd><a href={`mailto:${sainsDataProfile.email}`} className="text-primary hover:underline">{sainsDataProfile.email}</a></dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">Universitas</dt>
              <dd className="text-foreground/90">{sainsDataProfile.universitas} ({sainsDataProfile.singkatan})</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">Fakultas</dt>
              <dd className="text-foreground/90">{sainsDataProfile.fakultas}</dd>
            </div>
          </dl>
        </section>

      </div>
    </article>
  )
}