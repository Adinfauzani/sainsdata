'use client'

import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, FileText } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import {
  collectInstrumenDocuments,
  documentFileSrc,
  documentSearchText,
  type InstrumenDocumentItem,
} from '@/lib/instrumen-documents'
import type { InstrumenSection } from '@/types'

type JenisFilter = 'all' | InstrumenDocumentItem['jenis']

export default function DataDokumenAdmin() {
  const [sections, setSections] = useState<InstrumenSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jenis, setJenis] = useState<JenisFilter>('all')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await api<{ sections: InstrumenSection[] }>('/api/instrumen')
        if (cancelled) return
        setSections(res.sections)
        setError(null)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Gagal memuat data')
        setSections([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const documents = useMemo(() => collectInstrumenDocuments(sections), [sections])

  const rows = useMemo(
    () => (jenis === 'all' ? documents : documents.filter((doc) => doc.jenis === jenis)),
    [documents, jenis]
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
      accessorKey: 'jenis',
      header: 'Jenis',
      cell: ({ row }) => (
        <Badge variant={row.original.jenis === 'Dokumen Instrumen' ? 'secondary' : 'outline'}>
          {row.original.jenis}
        </Badge>
      ),
    },
    {
      id: 'aksi',
      header: 'Aksi',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const doc = row.original
        const url = documentFileSrc(doc) ?? doc.link
        if (!url) return <span className="text-muted-foreground">-</span>
        return (
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              {doc.fileUrl ? 'Buka File' : 'Buka Link'}
            </a>
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Data dan Dokumen"
        title="Repositori Dokumen (Admin)"
        description="Dokumen pendukung instrumen akreditasi dari database."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {error ? (
          <div className="py-12 text-center text-destructive">
            <FileText className="mx-auto mb-2 size-12 opacity-50" />
            <p>{error}</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            searchFilter={searchFilter}
            searchPlaceholder="Cari dokumen, kriteria, nomor…"
            emptyMessage={
              loading
                ? 'Memuat data…'
                : documents.length === 0
                  ? 'Belum ada dokumen di database.'
                  : 'Tidak ada dokumen yang cocok dengan pencarian.'
            }
            toolbar={
              <Select value={jenis} onValueChange={(value) => setJenis(value as JenisFilter)}>
                <SelectTrigger className="w-[12rem]" aria-label="Filter jenis dokumen">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">Semua jenis</SelectItem>
                  <SelectItem value="Dokumen Instrumen">Dokumen instrumen</SelectItem>
                  <SelectItem value="File Terunggah">File terunggah</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        )}
      </div>
    </>
  )
}
