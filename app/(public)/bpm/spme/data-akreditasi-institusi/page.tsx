import type { Metadata } from 'next'
import { BpmPage } from '@/components/bpm/BpmPage'
import { createBpmMetadata } from '@/data/bpm'

export const metadata: Metadata = createBpmMetadata('/bpm/spme/data-akreditasi-institusi')

export default function Page() {
  return <BpmPage pathname="/bpm/spme/data-akreditasi-institusi" />
}
