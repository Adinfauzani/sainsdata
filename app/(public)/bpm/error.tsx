'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DocumentEmptyState } from '@/components/bpm/DocumentEmptyState'

export default function BpmError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <DocumentEmptyState
        title="Terjadi kesalahan"
        description="Halaman BPM tidak dapat dimuat saat ini. Silakan coba lagi atau kembali ke halaman sebelumnya."
        action={
          <Button size="sm" onClick={reset}>
            Coba lagi
          </Button>
        }
      />
    </div>
  )
}
