'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
      <Toaster position="top-right" closeButton richColors />
    </AuthProvider>
  )
}