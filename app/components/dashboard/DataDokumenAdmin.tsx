'use client'

import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Search } from 'lucide-react'
import { useState } from 'react'
import { spmiDocuments } from '@/data/spmi'
import { supportingDocuments } from '@/data/documents'
import { standards, standardGroups } from '@/data/standards'

const allDocuments = [
  ...spmiDocuments.map(d => ({ ...d, source: 'SPMI' as const })),
  ...supportingDocuments.map(d => ({ ...d, source: 'Dokumen Pendukung' as const })),
]

const allStandards = standards

export default function DataDokumenAdmin() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'spmi' | 'pendukung' | 'standar'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredDocs = allDocuments.filter(doc => {
    const matchesSearch = doc.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.nomor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || 
      (filterType === 'spmi' && doc.source === 'SPMI') ||
      (filterType === 'pendukung' && doc.source === 'Dokumen Pendukung')
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const filteredStandards = allStandards.filter(std => {
    const matchesSearch = std.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || filterType === 'standar'
    return matchesSearch && matchesType
  })

  const statuses = ['all', 'Berlaku', 'Revisi', 'Draft', 'Tercapai', 'Sesuai', 'Dalam Evaluasi']

  return (
    <>
      <PageHeader
        eyebrow="Data dan Dokumen"
        title="Repositori Dokumen dan Standar (Admin)"
        description="Manajemen dokumen SPMI, dokumen pendukung akreditasi, dan standar mutu program studi Sains Data."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari dokumen, standar, nomor..."
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
              <option value="all">Semua Jenis</option>
              <option value="spmi">Dokumen SPMI</option>
              <option value="pendukung">Dokumen Pendukung</option>
              <option value="standar">Standar Mutu</option>
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

        {filterType !== 'standar' && (
          <section className="mb-10" aria-labelledby="dokumen-heading">
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
                          {doc.source}
                        </span>
                        <h3 className="mt-1 font-semibold text-sm line-clamp-2">{doc.judul}</h3>
                      </div>
                      <Badge variant={doc.status === 'Berlaku' ? 'secondary' : doc.status === 'Revisi' ? 'destructive' : doc.status === 'Draft' ? 'outline' : 'outline'}>
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
                        <dt className="text-muted-foreground shrink-0">Jenis</dt>
                        <dd>{doc.jenis}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">Format</dt>
                        <dd className="font-mono">{doc.fileType}</dd>
                      </div>
                    </dl>
                    <Button variant="outline" size="sm" className="mt-4 w-full" disabled>
                      <Download className="size-3.5 mr-1.5" />
                      Unduh
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filteredDocs.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto size-12 mb-2 opacity-50" />
                  <p>Tidak ada dokumen yang cocok dengan filter.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {(filterType === 'all' || filterType === 'standar') && (
          <section aria-labelledby="standar-heading">
            <h2 id="standar-heading" className="text-xs font-semibold tracking-widest text-primary uppercase mb-4">
              Standar Mutu ({filteredStandards.length})
            </h2>
            <div className="space-y-3">
              {standardGroups.map(group => {
                const groupStandards = filteredStandards.filter(s => s.groupId === group.id)
                if (groupStandards.length === 0) return null
                return (
                  <Card key={group.id}>
                    <CardHeader>
                      <h3 className="font-semibold">{group.nama}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{group.deskripsi}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {groupStandards.map(std => (
                          <div key={std.id} className="rounded-lg border border-border p-4 hover:bg-muted/40 transition-colors">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs text-primary">{std.kode}</span>
                                  <h4 className="font-semibold text-sm">{std.nama}</h4>
                                  <Badge variant={std.status === 'Tercapai' ? 'secondary' : std.status === 'Sesuai' ? 'outline' : 'destructive'}>
                                    {std.status}
                                  </Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{std.deskripsi}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {std.indikator.slice(0, 3).map(ind => (
                                <Badge key={ind.id} variant="outline" className="text-[11px]">
                                  {ind.pernyataan.slice(0, 50)}…
                                </Badge>
                              ))}
                              {std.indikator.length > 3 && (
                                <Badge variant="outline" className="text-[11px]">
                                  +{std.indikator.length - 3} indikator lainnya
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filteredStandards.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto size-12 mb-2 opacity-50" />
                  <p>Tidak ada standar yang cocok dengan filter.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  )
}