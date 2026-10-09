import { InstrumenTable } from '@/components/InstrumenTable'
import { PageHeader } from '@/components/PageHeader'

export function Standar() {
  return (
    <>
      <PageHeader
        eyebrow="Akreditasi"
        title="Instrumen Akreditasi Program Studi Sarjana"
        description="Portal resmi Sistem Penjaminan Mutu Internal Universitas Saintek Muhammadiyah — seluruh standar mutu, kebijakan, dan dokumen akreditasi tersusun rapi dalam satu tempat."
      />
      <InstrumenTable mode="public" />
    </>
  )
}