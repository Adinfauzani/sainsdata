import type { Metadata } from 'next'
import { BpmPage } from '@/components/bpm/BpmPage'
import { createBpmMetadata } from '@/data/bpm'

export const metadata: Metadata = createBpmMetadata('/bpm/spmi/ami-program-studi')

export default function Page() {
  return <BpmPage pathname="/bpm/spmi/ami-program-studi" />
}
