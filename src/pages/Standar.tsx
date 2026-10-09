import { InstrumenTable } from '@/components/InstrumenTable'
import { PageHeader } from '@/components/PageHeader'

export function Standar() {
  return (
    <>
      <PageHeader eyebrow="Standar" title="Instrumen Akreditasi Program Studi Sarjana" />
      <InstrumenTable mode="public" />
    </>
  )
}