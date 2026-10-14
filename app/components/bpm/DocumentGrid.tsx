import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { DocumentCard } from '@/components/bpm/DocumentCard'
import { DocumentEmptyState } from '@/components/bpm/DocumentEmptyState'
import type { BpmDocument } from '@/data/bpm'
import { cn } from '@/lib/utils'

interface DocumentGridProps {
  documents: BpmDocument[]
  /** Optional resolver for a category badge per document. */
  getCategoryLabel?: (document: BpmDocument) => string | undefined
  loading?: boolean
  /** Rendered when there are no documents and loading is false. */
  emptyState?: ReactNode
  className?: string
}

export function DocumentGrid({
  documents,
  getCategoryLabel,
  loading = false,
  emptyState,
  className,
}: DocumentGridProps) {
  const gridClass = cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)

  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-live="polite">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border p-6">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="mt-4 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-2/3" />
            <Skeleton className="mt-6 h-8 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (documents.length === 0) {
    return <>{emptyState ?? <DocumentEmptyState />}</>
  }

  return (
    <ul className={gridClass}>
      {documents.map((document) => (
        <li key={document.id} className="h-full">
          <DocumentCard
            document={document}
            categoryLabel={getCategoryLabel?.(document)}
          />
        </li>
      ))}
    </ul>
  )
}
