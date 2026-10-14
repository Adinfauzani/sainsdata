import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircleIcon, TargetIcon, FlagIcon } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { BpmBreadcrumbsBar } from '@/components/bpm/BpmBreadcrumbs'
import { createBpmMetadata } from '@/data/bpm'

export const metadata: Metadata = createBpmMetadata('/bpm/profile')

export default function BpmProfilPage() {
  return (
    <article className="space-y-10 sm:space-y-12 md:space-y-16">
      <BpmBreadcrumbsBar pathname="/bpm/profile" />
      <PageHeader title="Badan Penjaminan Mutu" className="pt-4 sm:pt-6" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* TENTANG BPM */}
        <section aria-labelledby="tentang-heading" className="relative rounded-2xl bg-gradient-to-br from-primary/5 via-background to-background p-5 sm:p-7 md:p-10 lg:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary)/0.08,transparent_60%)]" aria-hidden="true" />
          <div className="relative space-y-6">
            <header>
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-primary uppercase">Profil</p>
              <h1 id="tentang-heading" className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                TENTANG BADAN PENJAMINAN MUTU
              </h1>
            </header>
            <div className="max-w-4xl space-y-4 text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
              <p>
                Badan Penjaminan Mutu (BPM) sebagaimana dimaksud pada Struktur Organisasi, Tugas dan Fungsi (SOTF) Universitas Saintek Muhammadiyah, merupakan unsur penunjang pelengkap di tingkat universitas yang mempunyai fungsi mengoordinasi, memantau, dan mengembangkan proses penjaminan mutu di Universitas Saintek Muhammadiyah.
              </p>
              <p>
                Badan Penjaminan Mutu dibentuk pada tahun 2023 dengan SK Nomor 027/KEP/II.3.AU/A/2023. BPM dipimpin oleh seorang Kepala, berada di bawah dan bertanggung jawab kepada Rektor, serta berkoordinasi dengan Wakil Rektor Bidang I.
              </p>
            </div>
          </div>
        </section>

        {/* VISI, MISI, TUJUAN */}
        <section aria-labelledby="visi-misi-heading" className="space-y-8">
          <header className="text-center">
            <h2 id="visi-misi-heading" className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              VISI, MISI & TUJUAN BADAN PENJAMINAN MUTU
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              Universitas Saintek Muhammadiyah
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Visi */}
            <article className="relative rounded-2xl border border-border/50 bg-background p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FlagIcon className="size-5 sm:size-6 text-primary" aria-hidden="true" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">A. VISI</h3>
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                    Menjadi badan penjaminan mutu yang unggul, profesional, independen, dan berkelanjutan dalam mewujudkan budaya mutu untuk mendukung penyelenggaraan pendidikan tinggi yang berkualitas, berdaya saing, serta berlandaskan nilai-nilai Islam dan Kemuhammadiyahan.
                  </p>
                </div>
              </div>
            </article>

            {/* Misi */}
            <article className="lg:col-span-2 relative rounded-2xl border border-border/50 bg-background p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TargetIcon className="size-5 sm:size-6 text-primary" aria-hidden="true" />
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">B. MISI</h3>
                  <ol className="space-y-3 text-sm sm:text-base text-foreground/80 leading-relaxed pl-4">
                    <li>Mengembangkan dan mengimplementasikan Sistem Penjaminan Mutu Internal secara sistematis, terukur, dan berkelanjutan melalui siklus Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan (PPEPP).</li>
                    <li>Melaksanakan Audit Mutu Internal, monitoring, dan evaluasi terhadap penyelenggaraan pendidikan tinggi secara objektif, independen, transparan, dan akuntabel.</li>
                    <li>Mendorong peningkatan mutu pendidikan, penelitian, pengabdian kepada masyarakat, dan tata kelola perguruan tinggi berdasarkan standar nasional pendidikan tinggi serta standar pendidikan tinggi yang ditetapkan universitas.</li>
                    <li>Mengembangkan budaya mutu pada seluruh fakultas, program studi, dan unit kerja melalui sosialisasi, pendampingan, pelatihan, serta penguatan kapasitas sumber daya manusia.</li>
                    <li>Mengoordinasikan tindak lanjut hasil audit, evaluasi ketercapaian standar, dan pengelolaan risiko sebagai dasar perbaikan mutu secara berkelanjutan.</li>
                    <li>Mendukung peningkatan mutu akreditasi institusi dan program studi melalui pengelolaan dokumen mutu, penyediaan data yang valid, dan pemantauan ketercapaian indikator kinerja.</li>
                    <li>Mengintegrasikan nilai-nilai Islam dan Kemuhammadiyahan dalam pelaksanaan penjaminan mutu untuk mewujudkan tata kelola universitas yang amanah, berintegritas, dan bertanggung jawab.</li>
                  </ol>
                </div>
              </div>
            </article>
          </div>

          {/* Tujuan */}
          <article className="relative rounded-2xl border border-border/50 bg-background p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircleIcon className="size-5 sm:size-6 text-primary" aria-hidden="true" />
              </div>
              <div className="space-y-4 flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">C. TUJUAN</h3>
                <ol className="grid gap-3 md:grid-cols-2 md:gap-4 text-sm sm:text-base text-foreground/80 leading-relaxed pl-4">
                  <li>Terwujudnya pelaksanaan Sistem Penjaminan Mutu Internal yang efektif, konsisten, dan berkelanjutan.</li>
                  <li>Meningkatnya ketercapaian standar mutu serta efektivitas tata kelola universitas.</li>
                  <li>Terlaksananya Audit Mutu Internal dan tindak lanjut hasil evaluasi secara terencana dan terukur.</li>
                  <li>Terbangunnya budaya mutu yang partisipatif pada seluruh unit kerja.</li>
                  <li>Meningkatnya mutu penyelenggaraan tridarma perguruan tinggi dan layanan pendukung akademik.</li>
                  <li>Meningkatnya kesiapan dan kualitas akreditasi institusi maupun program studi.</li>
                  <li className="md:col-span-2">Terlaksananya peningkatan mutu berdasarkan data, hasil evaluasi, analisis risiko, dan capaian indikator kinerja.</li>
                </ol>
              </div>
            </div>
          </article>
        </section>

        {/* STRUKTUR ORGANISASI */}
        <section aria-labelledby="struktur-heading" className="mt-10 space-y-8 sm:mt-12">
          <header className="text-center">
            <h2 id="struktur-heading" className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              STRUKTUR ORGANISASI BADAN PENJAMINAN MUTU
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              Universitas Saintek Muhammadiyah
            </p>
          </header>
          <figure className="overflow-hidden rounded-2xl border border-border/50 bg-background p-2 shadow-sm sm:p-4">
            <Image
              src="/struktur.png"
              alt="Bagan struktur organisasi Badan Penjaminan Mutu Universitas Saintek Muhammadiyah"
              width={1280}
              height={862}
              className="h-auto w-full rounded-xl"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          </figure>
        </section>
      </div>
    </article>
  )
}
