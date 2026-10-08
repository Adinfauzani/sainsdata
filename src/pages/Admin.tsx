import { Fragment, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FileText, FolderOpen, Link2, Layers, ListTree, Table2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/auth'
import { api } from '@/lib/api'
import type { InstrumenSection } from '@/types'

interface Stats {
  sections: number
  rows: number
  children: number
  docs: number
  files: number
  uploads: number
  links: number
}

interface StatsResponse {
  stats: Stats
}

interface InstrumenResponse {
  sections: InstrumenSection[]
}

const statCards: { key: keyof Stats; label: string; icon: typeof Layers }[] = [
  { key: 'sections', label: 'Kriteria', icon: Layers },
  { key: 'rows', label: 'Standar', icon: Table2 },
  { key: 'children', label: 'Sub Standar', icon: ListTree },
  { key: 'docs', label: 'Dokumen', icon: FileText },
  { key: 'links', label: 'Link Drive', icon: Link2 },
  { key: 'files', label: 'File Terunggah', icon: FolderOpen },
]

const columnLabels = [
  'No',
  'Kriteria',
  'Sub Kriteria',
  'Indikator',
  'Penjelasan Prodi',
  'Nama File',
  'Link Drive',
]

export function Admin() {
  const { admin, loading, logout } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [sections, setSections] = useState<InstrumenSection[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!admin) return
    let cancelled = false

    async function load() {
      try {
        const [statsRes, instrumenRes] = await Promise.all([
          api<StatsResponse>('/api/stats'),
          api<InstrumenResponse>('/api/instrumen'),
        ])
        if (cancelled) return
        setStats(statsRes.stats)
        setSections(instrumenRes.sections)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat data')
      } finally {
        if (!cancelled) setLoadingData(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [admin])

  if (loading) return null
  if (!admin) return <Navigate to="/login" replace />

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Dashboard Admin"
        description="Ringkasan seluruh data instrumen akreditasi program studi."
      >
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Masuk sebagai{' '}
            <span className="font-medium text-foreground">{admin.username}</span>
          </p>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            <LogOut className="size-3.5" />
            Keluar
          </Button>
        </div>
      </PageHeader>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {error ? (
          <p className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map(({ key, label, icon: Icon }) => (
            <Card key={key} size="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className="size-4 text-primary" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">
                  {loadingData ? '–' : (stats?.[key] ?? 0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[88rem] border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                {columnLabels.map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="border border-border px-3 py-2.5 text-start text-xs font-semibold tracking-wider uppercase"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={columnLabels.length} className="border border-border px-3 py-8 text-center text-muted-foreground">
                    Memuat data…
                  </td>
                </tr>
              ) : sections.length === 0 ? (
                <tr>
                  <td colSpan={columnLabels.length} className="border border-border px-3 py-8 text-center text-muted-foreground">
                    Belum ada data instrumen.
                  </td>
                </tr>
              ) : (
                sections.map((section) => (
                  <Fragment key={section.no}>
                    <tr>
                      <td
                        colSpan={columnLabels.length}
                        className="border border-border bg-primary/10 px-3 py-2 text-start text-sm font-semibold text-primary"
                      >
                        {section.no}. {section.nama}
                      </td>
                    </tr>

                    {section.rows.map((row) => {
                      const key = `${row.no}.${row.id}`

                      return (
                        <Fragment key={key}>
                          <tr className="transition-colors hover:bg-muted/40">
                            <td className="border border-border px-3 py-2.5 align-top font-mono text-xs font-medium">
                              {key}
                            </td>
                            <td className="border border-border px-3 py-2.5 align-top">
                              {section.nama}
                            </td>
                            <td className="border border-border px-3 py-2.5 align-top whitespace-nowrap">
                              {row.subKriteria}
                            </td>
                            <td className="border border-border px-3 py-2.5 align-top leading-relaxed">
                              {row.indikator}
                            </td>
                            <td className="border border-border px-3 py-2.5 align-top leading-relaxed break-words">
                              {row.penjelasanProdi || (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="border border-border px-3 py-2.5 align-top text-muted-foreground">
                              —
                            </td>
                            <td className="border border-border px-3 py-2.5 align-top text-muted-foreground">
                              —
                            </td>
                          </tr>

                          {row.children?.map((child) => (
                            <tr
                              key={`${key}.${child.no}`}
                              className="bg-muted/30 transition-colors hover:bg-muted/50"
                            >
                              <td className="border border-border ps-10 pe-3 py-2.5 align-top font-mono text-xs text-muted-foreground">
                                {key}.{child.no}
                              </td>
                              <td className="border border-border px-3 py-2.5 align-top">
                                {child.doc?.kriteria ?? section.nama}
                              </td>
                              <td className="border border-border px-3 py-2.5 align-top whitespace-nowrap">
                                {child.subKriteria}
                              </td>
                              <td className="border border-border px-3 py-2.5 align-top leading-relaxed">
                                {child.indikator}
                              </td>
                              <td className="border border-border px-3 py-2.5 align-top leading-relaxed break-words text-muted-foreground">
                                —
                              </td>
                              <td className="border border-border px-3 py-2.5 align-top whitespace-nowrap">
                                {child.doc?.namaFile ?? (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="border border-border px-3 py-2.5 align-top">
                                {child.doc?.link ? (
                                  <a
                                    className="text-primary underline-offset-4 hover:underline"
                                    href={child.doc.link}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    Buka
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      )
                    })}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
