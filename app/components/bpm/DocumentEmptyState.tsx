import { FileSearch } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DocumentEmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function DocumentEmptyState({
  title = 'Belum ada dokumen',
  description = 'Dokumen untuk kategori ini belum tersedia. Silakan hubungi BPM untuk informasi lebih lanjut.',
  action,
  className,
}: DocumentEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center',
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileSearch className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
