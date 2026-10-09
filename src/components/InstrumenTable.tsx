import { Fragment, useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  Download,
  Eye,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth'
import type { DokumenUpload, InstrumenSection } from '@/types'

const columnLabels = [
  'No',
  'Kriteria',
  'Sub Kriteria',
  'Indikator',
  'Penjelasan Prodi',
  'Nama File',
  'Deskripsi',
  'Aksi',
]
const fileAccept = '.pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx,.ppt,.pptx'

type FormTarget =
  | { mode: 'add'; sectionNo: number; rowId: string }
  | { mode: 'update'; sectionNo: number; rowId: string; childNo: number }

interface ChildRef {
  sectionNo: number
  rowId: string
  childNo: number
}

interface RowCellsProps {
  kriteria: string
  subKriteria: string
  indikator: string
  penjelasanProdi?: string
  namaFile?: string
  deskripsi?: string
}

function RowCells({
  kriteria,
  subKriteria,
  indikator,
  penjelasanProdi = '',
  namaFile = '',
  deskripsi = '',
}: RowCellsProps) {
  return (
    <>
      <td className="border border-border px-3 py-2.5 align-top">{kriteria}</td>
      <td className="border border-border px-3 py-2.5 align-top whitespace-nowrap">
        {subKriteria}
      </td>
      <td className="border border-border px-3 py-2.5 align-top leading-relaxed">{indikator}</td>
      <td className="border border-border px-3 py-2.5 align-top leading-relaxed break-words">
        {penjelasanProdi || <span className="text-muted-foreground">-</span>}
      </td>
      <td className="border border-border px-3 py-2.5 align-top whitespace-nowrap">{namaFile}</td>
      <td className="border border-border px-3 py-2.5 align-top">{deskripsi}</td>
    </>
  )
}

function DocFormDialog({
  mode,
  kriteria,
  subKriteria,
  indikator,
  initial,
  onClose,
  onSave,
}: {
  mode: FormTarget['mode']
  kriteria: string
  subKriteria: string
  indikator: string
  initial?: DokumenUpload
  onClose: () => void
  onSave: (doc: DokumenUpload) => void
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      kriteria: String(form.get('kriteria') ?? ''),
      subKriteria: String(form.get('subKriteria') ?? ''),
      indikator: String(form.get('indikator') ?? ''),
      namaFile: String(form.get('namaFile') ?? ''),
      deskripsi: String(form.get('deskripsi') ?? ''),
      link: String(form.get('link') ?? ''),
    })
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Tambah Dokumen' : 'Update Dokumen'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Isi data dokumen untuk baris baru.'
              : 'Perbarui data dokumen pada baris ini.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="kriteria">Kriteria</Label>
            <Input id="kriteria" name="kriteria" defaultValue={kriteria} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="subKriteria">Sub Kriteria</Label>
            <Input id="subKriteria" name="subKriteria" defaultValue={subKriteria} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="indikator">Indikator</Label>
            <Textarea
              id="indikator"
              name="indikator"
              defaultValue={indikator}
              placeholder="Isi indikator"
              rows={2}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="namaFile">Nama File</Label>
            <Input
              id="namaFile"
              name="namaFile"
              defaultValue={initial?.namaFile}
              placeholder="Contoh: SK Tim Pengendali Mutu"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              defaultValue={initial?.deskripsi}
              placeholder="Deskripsi dokumen"
              rows={3}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="link">Link (Google Drive)</Label>
            <Input
              id="link"
              name="link"
              type="url"
              defaultValue={initial?.link}
              placeholder="https://drive.google.com/..."
              required
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DocPreviewDialog({
  fileName,
  fileUrl,
  onClose,
}: {
  fileName: string
  fileUrl: string
  onClose: () => void
}) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const isDocx = ext === 'docx'
  const isInline = ext === 'pdf' || ext === 'txt' || ext === 'csv'
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    isDocx ? 'loading' : 'ready'
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDocx) return
    let cancelled = false
    ;(async () => {
      try {
        const blob = await (await fetch(fileUrl)).blob()
        const { renderAsync } = await import('docx-preview')
        if (cancelled || !containerRef.current) return
        containerRef.current.innerHTML = ''
        await renderAsync(blob, containerRef.current, containerRef.current)
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [fileUrl, isDocx])

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">{fileName}</DialogTitle>
          <DialogDescription>Preview dokumen</DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-auto rounded-md border border-border bg-muted/30">
          {status === 'loading' ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Memuat preview…</p>
          ) : null}
          {status === 'error' ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Preview tidak tersedia untuk format .{ext}. Silakan download file-nya.
            </p>
          ) : null}
          {isDocx ? (
            <div ref={containerRef} className={cn('p-3', status !== 'ready' && 'hidden')} />
          ) : isInline ? (
            <iframe
              src={fileUrl}
              title={`Preview ${fileName}`}
              className="h-[60vh] w-full border-0 bg-background"
            />
          ) : (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Preview tidak tersedia untuk format .{ext}. Silakan download file-nya.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button asChild>
            <a href={fileUrl} download={fileName}>
              <Download className="size-3.5" />
              Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function InstrumenTable({ mode }: { mode: 'public' | 'admin' }) {
  const { admin } = useAuth()
  const canEdit = mode === 'admin' && !!admin
  const [sections, setSections] = useState<InstrumenSection[]>([])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null)
  const [viewTarget, setViewTarget] = useState<ChildRef | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState(false)

  const loadSections = useCallback(async () => {
    const res = await api<{ sections: InstrumenSection[] }>('/api/instrumen')
    setSections(res.sections)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api<{ sections: InstrumenSection[] }>('/api/instrumen')
        if (cancelled) return
        setSections(res.sections)
        setLoadState('ready')
      } catch (err) {
        if (cancelled) return
        setLoadError(err instanceof Error ? err.message : 'Gagal memuat data')
        setLoadState('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const toggleRow = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const runMutation = async (action: () => Promise<unknown>) => {
    setBusy(true)
    setLoadError('')
    try {
      await action()
      await loadSections()
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Operasi gagal')
    } finally {
      setBusy(false)
    }
  }

  const addChild = (sectionNo: number, rowId: string, doc: DokumenUpload) =>
    api('/api/instrumen/children', {
      method: 'POST',
      body: JSON.stringify({ sectionNo, rowId, doc }),
    })

  const updateChildDoc = (
    sectionNo: number,
    rowId: string,
    childNo: number,
    doc: DokumenUpload
  ) =>
    api('/api/instrumen/children', {
      method: 'PUT',
      body: JSON.stringify({ sectionNo, rowId, childNo, doc }),
    })

  const delChild = (sectionNo: number, rowId: string, childNo: number) =>
    api('/api/instrumen/children', {
      method: 'DELETE',
      body: JSON.stringify({ sectionNo, rowId, childNo }),
    })

  const uploadFile = (sectionNo: number, rowId: string, childNo: number, file: File) => {
    const form = new FormData()
    form.set('file', file)
    form.set('sectionNo', String(sectionNo))
    form.set('rowId', rowId)
    form.set('childNo', String(childNo))
    return api('/api/instrumen/upload', { method: 'POST', body: form })
  }

  const saveDoc = (doc: DokumenUpload) => {
    if (!formTarget) return
    const add = formTarget.mode === 'add'
    const sectionNo = formTarget.sectionNo
    const rowId = formTarget.rowId
    const childNo = formTarget.mode === 'update' ? formTarget.childNo : 0
    const key = `${sectionNo}.${rowId}`

    void runMutation(async () => {
      if (add) await addChild(sectionNo, rowId, doc)
      else await updateChildDoc(sectionNo, rowId, childNo, doc)
      if (add) setExpanded((prev) => new Set(prev).add(key))
    }).finally(() => setFormTarget(null))
  }

  const activeForm = (() => {
    if (!formTarget) return null
    const section = sections.find((s) => s.no === formTarget.sectionNo)
    const row = section?.rows.find(
      (r) => r.no === formTarget.sectionNo && r.id === formTarget.rowId
    )
    if (!section || !row) return null
    if (formTarget.mode === 'add') {
      return {
        mode: 'add' as const,
        sectionNo: section.no,
        rowId: row.id,
        childNo: null,
        kriteria: section.nama,
        subKriteria: '',
        indikator: '',
        initial: undefined,
      }
    }
    const child = row.children?.find((c) => c.no === formTarget.childNo)
    if (!child) return null
    return {
      mode: 'update' as const,
      sectionNo: section.no,
      rowId: row.id,
      childNo: child.no,
      kriteria: child.doc?.kriteria ?? section.nama,
      subKriteria: child.doc?.subKriteria ?? child.subKriteria,
      indikator: child.doc?.indikator ?? child.indikator,
      initial: child.doc,
    }
  })()

  const activeView = (() => {
    if (!viewTarget) return null
    const section = sections.find((s) => s.no === viewTarget.sectionNo)
    const row = section?.rows.find(
      (r) => r.no === viewTarget.sectionNo && r.id === viewTarget.rowId
    )
    const child = row?.children?.find((c) => c.no === viewTarget.childNo)
    if (!child?.fileUrl) return null
    return { fileName: child.fileName ?? 'Dokumen', fileUrl: child.fileUrl }
  })()

  return (
    <div className="mx-auto w-full max-w-7xl overflow-x-auto px-4 py-8 sm:px-6">
      {loadState === 'ready' && loadError ? (
        <p className="mb-4 text-sm font-medium text-destructive" role="alert">
          {loadError}
        </p>
      ) : null}
      <table className="w-full min-w-[96rem] border-collapse text-sm">
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
          {loadState === 'loading' ? (
            <tr>
              <td
                colSpan={columnLabels.length}
                className="border border-border px-3 py-8 text-center text-muted-foreground"
              >
                Memuat data…
              </td>
            </tr>
          ) : loadState === 'error' ? (
            <tr>
              <td
                colSpan={columnLabels.length}
                className="border border-border px-3 py-8 text-center text-destructive"
              >
                {loadError}
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
                  const isExpanded = expanded.has(key)

                  return (
                    <Fragment key={key}>
                      <tr className="transition-colors hover:bg-muted/40">
                        <td className="border border-border px-3 py-2.5 align-top">
                          <span className="flex items-center gap-1 font-mono text-xs font-medium">
                            {row.children?.length ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-expanded={isExpanded}
                                aria-label={`Turunan ${key}`}
                                onClick={() => toggleRow(key)}
                              >
                                <ChevronDown
                                  className={cn(
                                    'size-3.5 transition-transform duration-150',
                                    !isExpanded && '-rotate-90'
                                  )}
                                />
                              </Button>
                            ) : null}
                            {key}
                          </span>
                        </td>
                        <RowCells
                          kriteria={section.nama}
                          subKriteria={row.subKriteria}
                          indikator={row.indikator}
                          penjelasanProdi={row.penjelasanProdi}
                        />
                        <td className="border border-border px-3 py-2.5 align-top">
                          {canEdit ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={busy}
                              onClick={() => setFormTarget({ mode: 'add', sectionNo: row.no, rowId: row.id })}
                            >
                              <Plus className="size-3.5" />
                              Tambah
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>

                      {isExpanded
                        ? row.children?.map((child) => (
                            <tr
                              key={`${key}.${child.no}`}
                              className="bg-muted/30 transition-colors hover:bg-muted/50"
                            >
                              <td className="border border-border ps-10 pe-3 py-2.5 align-top font-mono text-xs text-muted-foreground">
                                {key}.{child.no}
                              </td>
                              <RowCells
                                kriteria={child.doc?.kriteria ?? section.nama}
                                subKriteria={child.subKriteria}
                                indikator={child.indikator}
                                penjelasanProdi={''}
                                namaFile={child.doc?.namaFile ?? ''}
                                deskripsi={child.doc?.deskripsi ?? ''}
                              />
                              <td className="border border-border px-3 py-2.5 align-top">
                                {canEdit ? (
                                  <div className="flex items-center gap-3">
                                    {child.doc?.link ? (
                                      <Button
                                        asChild
                                        variant="outline"
                                        size="icon-sm"
                                        title="Buka Dokumen"
                                        aria-label="Buka Dokumen"
                                      >
                                        <a
                                          href={child.doc.link}
                                          target="_blank"
                                          rel="noreferrer noopener"
                                        >
                                          <LinkIcon className="size-3.5" />
                                        </a>
                                      </Button>
                                    ) : (
                                      <Button
                                        asChild
                                        variant="outline"
                                        size="icon-sm"
                                        title="Buka Dokumen"
                                        aria-label="Buka Dokumen"
                                      >
                                        <Link to="/spmi">
                                          <LinkIcon className="size-3.5" />
                                        </Link>
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="icon-sm"
                                      title="View File"
                                      aria-label="View File"
                                      disabled={!child.fileUrl}
                                      onClick={() =>
                                        setViewTarget({
                                          sectionNo: row.no,
                                          rowId: row.id,
                                          childNo: child.no,
                                        })
                                      }
                                    >
                                      <Eye className="size-3.5" />
                                    </Button>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="destructive"
                                        size="icon-sm"
                                        title="Del"
                                        aria-label="Del"
                                        disabled={busy}
                                        onClick={() =>
                                          void runMutation(() =>
                                            delChild(row.no, row.id, child.no)
                                          )
                                        }
                                      >
                                        <Trash2 className="size-3.5" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon-sm"
                                        title="Update"
                                        aria-label="Update"
                                        disabled={busy}
                                        onClick={() =>
                                          setFormTarget({
                                            mode: 'update',
                                            sectionNo: row.no,
                                            rowId: row.id,
                                            childNo: child.no,
                                          })
                                        }
                                      >
                                        <Pencil className="size-3.5" />
                                      </Button>
                                      <label
                                        className={cn(
                                          buttonVariants({ variant: 'default', size: 'icon-sm' }),
                                          'cursor-pointer'
                                        )}
                                        title="Upload"
                                        aria-label="Upload"
                                      >
                                        <Upload className="size-3.5" />
                                        <input
                                          type="file"
                                          className="hidden"
                                          accept={fileAccept}
                                          disabled={busy}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                              void runMutation(() =>
                                                uploadFile(row.no, row.id, child.no, file)
                                              )
                                            }
                                            e.target.value = ''
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="icon-sm"
                                    title="View File"
                                    aria-label="View File"
                                    disabled={!child.fileUrl}
                                    onClick={() =>
                                      setViewTarget({
                                        sectionNo: row.no,
                                        rowId: row.id,
                                        childNo: child.no,
                                      })
                                    }
                                  >
                                    <Eye className="size-3.5" />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        : null}
                    </Fragment>
                  )
                })}
              </Fragment>
            ))
          )}
        </tbody>
      </table>

      {activeForm ? (
        <DocFormDialog
          key={`${activeForm.sectionNo}.${activeForm.rowId}.${activeForm.childNo ?? 'new'}.${activeForm.mode}`}
          mode={activeForm.mode}
          kriteria={activeForm.kriteria}
          subKriteria={activeForm.subKriteria}
          indikator={activeForm.indikator}
          initial={activeForm.initial}
          onClose={() => setFormTarget(null)}
          onSave={saveDoc}
        />
      ) : null}

      {activeView ? (
        <DocPreviewDialog
          key={activeView.fileUrl}
          fileName={activeView.fileName}
          fileUrl={activeView.fileUrl}
          onClose={() => setViewTarget(null)}
        />
      ) : null}
    </div>
  )
}