import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sains Data - Fakultas Ilmu Komputer | Universitas Saintek Muhammadiyah',
  description: 'Pusat data dan informasi akreditasi Program Studi Sains Data, Fakultas Ilmu Komputer, Universitas Saintek Muhammadiyah.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-dvh flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}