'use client'

import Link from 'next/link'
import { Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-9xl font-bold tracking-tight text-muted-foreground/20">404</h1>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Halaman tidak ditemukan</h2>
        <p className="text-muted-foreground max-w-md">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 size-4" />
            Kembali ke Beranda
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <RotateCcw className="mr-2 size-4" />
            Coba Lagi
          </Link>
        </Button>
      </div>
    </div>
  )
}