'use client'

import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Search, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { InstrumenSection, InstrumenChild } from '@/types'

interface DocumentItem {
  id: string
  judul: string
  deskripsi: string
  tahun: number
  nomor: string
  status: string
  jenis: string
  fileType: string
  kriteria: string
  subKriteria: string
  indikator: string
  fileName?: string
  fileUrl?: string
  link?: string
}

export default function DataDokumenAdmin() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'dokumen' | 'standar'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true)
        const res = await api<{ sections: InstrumenSection[] }>('/api/instrumen')
        const docs: DocumentItem[] = []

        res.sections.forEach(section => {
          section.rows.forEach(row => {
            row.children?.forEach((child: InstrumenChild) => {
              if (child.doc) {
                const doc = child.doc
                docs.push({
                  id: `${section.no}-${row.id}-${child.no}`,
                  judul: doc.namaFile || `Dokumen ${child.no}`,
                  deskripsi: doc.deskripsi || doc.indikator || '',
                  tahun: new Date().getFullYear(),
                  nomor: `${section.no}.${row.no}.${child.no}`,
                  status: 'Berlaku',
                  jenis: 'Instrumen Akreditasi',
                  fileType: doc.namaFile?.split('.').pop()?.toUpperCase() || 'LINK',
                  kriteria: section.nama,
                  subKriteria: child.subKriteria,
                  indikator: child.indikator,
                  fileName: child.fileName,
                  fileUrl: child.fileUrl,
                  link: doc.link,
                })
              } else if (child.fileName || child.fileUrl) {
                docs.push({
                  id: `${section.no}-${row.id}-${child.no}`,
                  judul: child.fileName || `File ${child.no}`,
                  deskripsi: child.indikator || '',
                  tahun: new Date().getFullYear(),
                  nomor: `${section.no}.${row.no}.${child.no}`,
                  status: 'Berlaku',
                  jenis: 'File Terunggah',
                  fileType: child.fileName?.split('.').pop()?.toUpperCase() || 'FILE',
                  kriteria: section.nama,
                  subKriteria: child.subKriteria,
                  indikator: child.indikator,
                  fileName: child.fileName,
                  fileUrl: child.fileUrl,
                })
              }
            })
          })
        })

        setDocuments(docs)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data')
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [])

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.nomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.kriteria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subKriteria.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || filterType === 'dokumen'
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const statuses = ['all', 'Berlaku', 'Revisi', 'Draft']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="sr-only">Memuat data...</span>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Data dan Dokumen"
        title="Repositori Dokumen (Admin)"
        description="Dokumen pendukung instrumen akreditasi dari database."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari dokumen, kriteria, sub kriteria, nomor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as typeof filterType)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua</option>
              <option value="dokumen">Dokumen Instrumen</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua Status</option>
              {statuses.filter(s => s !== 'all').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12 text-destructive">
            <FileText className="mx-auto size-12 mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : (
          <section aria-labelledby="dokumen-heading">
            <h2 id="dokumen-heading" className="text-xs font-semibold tracking-widest text-primary uppercase mb-4">
              Dokumen ({filteredDocs.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map(doc => (
                <Card key={doc.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                          {doc.kriteria}
                        </span>
                        <h3 className="mt-1 font-semibold text-sm line-clamp-2">{doc.judul}</h3>
                      </div>
                      <Badge variant={doc.status === 'Berlaku' ? 'secondary' : doc.status === 'Revisi' ? 'destructive' : 'outline'}>
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{doc.deskripsi}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <dl className="space-y-1.5 text-xs">
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">Nomor</dt>
                        <dd className="font-mono tabular-nums truncate">{doc.nomor}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">Tahun</dt>
                        <dd className="font-mono tabular-nums">{doc.tahun}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">Kriteria</dt>
                        <dd className="truncate">{doc.kriteria}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">Sub Kriteria</dt>
                        <dd className="truncate">{doc.subKriteria}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">Format</dt>
                        <dd className="font-mono">{doc.fileType}</dd>
                      </div>
                    </dl>
                    {(doc.fileUrl || doc.link) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => window.open(doc.fileUrl || doc.link!, '_blank')}
                      >
                        <Download className="size-3.5 mr-1.5" />
                        {doc.fileUrl ? 'Unduh File' : 'Buka Link'}
                      </Button>
                    )}
                    {!doc.fileUrl && !doc.link && (
                      <Button variant="outline" size="sm" className="mt-4 w-full" disabled>
                        <Download className="size-3.5 mr-1.5" />
                        Tidak Ada File/Link
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {filteredDocs.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto size-12 mb-2 opacity-50" />
                  <p>Tidak ada dokumen di database.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  )
}