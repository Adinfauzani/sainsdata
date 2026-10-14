import type { Metadata } from 'next'
import { BpmPage } from '@/components/bpm/BpmPage'
import { createBpmMetadata } from '@/data/bpm'

export const metadata: Metadata = createBpmMetadata('/bpm/spmi/monev-pembelajaran')

export default function Page() {
  return <BpmPage pathname="/bpm/spmi/monev-pembelajaran" />
}
