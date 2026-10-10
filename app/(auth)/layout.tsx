'use client'

import { Providers } from '@/providers'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-dvh flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </Providers>
  )
}