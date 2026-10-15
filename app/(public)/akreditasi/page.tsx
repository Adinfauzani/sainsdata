import Link from 'next/link'
import { FileText } from 'lucide-react'
import { InstrumenTable } from '@/components/InstrumenTable'
import { PageHeader } from '@/components/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Akreditasi() {
  return (
    <>
      <PageHeader
        eyebrow="Akreditasi"
        title="Instrumen Akreditasi Program Studi Sarjana"
        description="Portal resmi Sistem Penjaminan Mutu Internal Universitas Saintek Muhammadiyah - seluruh standar mutu, kebijakan, dan dokumen akreditasi tersusun rapi dalam satu tempat."
      >
        <div className="mt-6">
          <Link
            href="/akreditasi/dokumen"
            className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
          >
            <FileText className="size-4" />
            Lihat Dokumen Terunggah
          </Link>
        </div>
      </PageHeader>
      <InstrumenTable mode="public" />
    </>
  )
}
