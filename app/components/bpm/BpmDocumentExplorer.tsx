'use client'

import { useMemo, useState } from 'react'
import { DocumentEmptyState } from '@/components/bpm/DocumentEmptyState'
import { DocumentGrid } from '@/components/bpm/DocumentGrid'
import { DocumentSearch, type DocumentCategoryOption } from '@/components/bpm/DocumentSearch'
import type { BpmDocument } from '@/data/bpm'

interface BpmDocumentExplorerProps {
  documents: BpmDocument[]
  categories?: DocumentCategoryOption[]
  emptyTitle?: string
  emptyDescription?: string
}

function matches(document: BpmDocument, query: string): boolean {
  const haystack = [document.title, document.description, document.mimeType, ...(document.tags ?? [])]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

export function BpmDocumentExplorer({
  documents,
  categories = [],
  emptyTitle,
  emptyDescription,
}: BpmDocumentExplorerProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return documents.filter((document) => {
      const categoryMatch = category === 'all' || document.category === category
      const queryMatch = needle.length === 0 || matches(document, needle)
      return categoryMatch && queryMatch
    })
  }, [documents, query, category])

  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((option) => [option.id, option.label]))
    return (document: BpmDocument) =>
      map.get(document.category) ??
      (document.kind === 'folder' ? 'Google Drive' : undefined)
  }, [categories])

  const hasFilter = query.trim().length > 0 || category !== 'all'

  return (
    <div className="space-y-6">
      <DocumentSearch
        query={query}
        onQueryChange={setQuery}
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
      />

      <p className="text-xs font-semibold tracking-widest text-primary uppercase" aria-live="polite">
        {filtered.length} dokumen
      </p>

      <DocumentGrid
        documents={filtered}
        getCategoryLabel={categoryLabel}
        emptyState={
          hasFilter ? (
            <DocumentEmptyState
              title="Tidak ada dokumen yang cocok"
              description="Coba ubah kata kunci pencarian atau pilih kategori lain."
            />
          ) : (
            <DocumentEmptyState title={emptyTitle} description={emptyDescription} />
          )
        }
      />
    </div>
  )
}
