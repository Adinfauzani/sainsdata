'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, FileText, Loader2 } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { PageHeader } from '@/components/PageHeader'
import { PdfViewer } from '@/components/bpm/PdfViewer'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import {
  collectInstrumenDocuments,
  documentSearchText,
  type InstrumenDocumentItem,
} from '@/lib/instrumen-documents'
import type { InstrumenSection } from '@/types'

/**
 * Public listing of the documents uploaded from the dashboard
 * (`/dashboard/instrumen`). It reads the same public `/api/instrumen` endpoint
 * and only surfaces indicators that actually carry a file or a link.
 */
export default function DokumenAkreditasiPage() {
  const [sections, setSections] = useState<InstrumenSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewer, setViewer] = useState<InstrumenDocumentItem | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const res = await api<{ sections: InstrumenSection[] }>('/api/instrumen')
        if (cancelled) return
        setSections(res.sections)
        setError(null)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Gagal memuat dokumen')
        setSections([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const documents = useMemo(
    () => collectInstrumenDocuments(sections).filter((doc) => doc.fileUrl),
    [sections]
  )

  const searchFilter = (doc: InstrumenDocumentItem, query: string) =>
    documentSearchText(doc).includes(query)

  const columns: DataTableColumn<InstrumenDocumentItem>[] = [
    {
      accessorKey: 'nomor',
      header: 'No',
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums">{row.original.nomor}</span>
      ),
    },
    { accessorKey: 'kriteria', header: 'Kriteria' },
    { accessorKey: 'subKriteria', header: 'Sub Kriteria' },
    {
      accessorKey: 'indikator',
      header: 'Indikator',
      cell: ({ row }) => <div className="min-w-[16rem]">{row.original.indikator}</div>,
    },
    {
      accessorKey: 'judul',
      header: 'Nama File',
      cell: ({ row }) => <div className="min-w-[10rem] font-medium">{row.original.judul}</div>,
    },
    {
      accessorKey: 'deskripsi',
      header: 'Deskripsi',
      cell: ({ row }) => (
        <div className="min-w-[12rem] text-muted-foreground">
          {row.original.deskripsi || '-'}
        </div>
      ),
    },
    {
      id: 'aksi',
      header: 'Aksi',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const doc = row.original

        // Only files uploaded from the dashboard are exposed to the public.
        if (!doc.fileUrl) return <span className="text-muted-foreground">-</span>

        const label =
          doc.format === 'PDF' || doc.fileName?.toLowerCase().endsWith('.pdf')
            ? 'Lihat PDF'
            : 'Lihat Dokumen'

        return (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={label}
            title={label}
            onClick={() => setViewer(doc)}
          >
            <Eye />
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Akreditasi"
        title="Dokumen Akreditasi"
        description="Dokumen pendukung akreditasi yang telah diunggah melalui dasbor dan tersedia untuk publik."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {error ? (
          <div className="py-12 text-center text-destructive">
            <FileText className="mx-auto mb-2 size-12 opacity-50" />
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
            <span className="sr-only">Memuat dokumen…</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={documents}
            searchFilter={searchFilter}
            searchPlaceholder="Cari dokumen, kriteria, nomor…"
            emptyMessage={
              documents.length === 0
                ? 'Belum ada dokumen yang diunggah dari dasbor.'
                : 'Tidak ada dokumen yang cocok dengan pencarian.'
            }
          />
        )}
      </div>

      {viewer ? (
        <PdfViewer
          key={viewer.id}
          url={viewer.fileUrl ?? ''}
          title={viewer.judul}
          mimeType={
            viewer.format === 'PDF' ? 'application/pdf' : 'application/octet-stream'
          }
          open
          onOpenChange={(open) => {
            if (!open) setViewer(null)
          }}
        />
      ) : null}
    </>
  )
}
