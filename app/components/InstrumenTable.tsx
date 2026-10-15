'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  ExternalLink,
  Eye,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/DataTable'
import { documentFileSrc } from '@/lib/instrumen-documents'
import { Button } from '@/components/ui/button'
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
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth'
import { toast } from 'sonner'
import type { DokumenUpload, InstrumenSection } from '@/types'
import { cn } from '@/lib/utils'

/** Mirrors `UPLOAD_ALLOWED` in `app/lib/api-handler.ts`. */
const UPLOAD_ACCEPT = '.pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx,.ppt,.pptx'

interface FormTarget {
  mode: 'add' | 'update'
  sectionNo: number
  rowId: string
  childNo: number | null
}

interface ChildRef {
  sectionNo: number
  rowId: string
  childNo: number
}

/**
 * A single rendered line of the instrument table. Indicators without documents
 * still get a row (`childNo: null`) so the number sequence stays complete and
 * the "Tambah" action keeps a home.
 */
interface InstrumenItem {
  id: string
  sectionNo: number
  rowId: string
  childNo: number | null
  no: string
  kriteria: string
  subKriteria: string
  indikator: string
  namaFile: string
  deskripsi: string
  fileName?: string
  fileUrl?: string
  canAdd: boolean
}

function isPdfFile(fileName?: string) {
  return fileName?.toLowerCase().endsWith('.pdf') ?? false
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
        const response = await fetch(fileUrl)
        const blob = await response.blob()
        const { renderAsync } = await import('docx-preview')
        if (cancelled || !containerRef.current) return
        await renderAsync(blob, containerRef.current, containerRef.current)
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isDocx, fileUrl])

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="truncate">{fileName}</DialogTitle>
          <DialogDescription>Pratinjau dokumen</DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] min-h-64 overflow-auto rounded-md border bg-muted/30">
          {status === 'error' ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Pratinjau tidak tersedia untuk file ini.{' '}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Buka di tab baru
              </a>
              .
            </p>
          ) : isDocx ? (
            <div ref={containerRef} className={cn('p-4', status === 'loading' && 'hidden')} />
          ) : isInline ? (
            <iframe
              src={fileUrl}
              title={`Pratinjau ${fileName}`}
              className="h-[70vh] w-full border-0 bg-background"
            />
          ) : (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Format .{ext} tidak dapat dipratinjau.{' '}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Buka di tab baru
              </a>
              .
            </p>
          )}
          {status === 'loading' ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Memuat pratinjau…</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Buka
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
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null)
  const [viewTarget, setViewTarget] = useState<ChildRef | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<ChildRef | null>(null)
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

  const runMutation = useCallback(
    async (action: () => Promise<unknown>) => {
      setBusy(true)
      setLoadError('')
      try {
        await action()
        await loadSections()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Operasi gagal'
        setLoadError(message)
        toast.error(message)
      } finally {
        setBusy(false)
      }
    },
    [loadSections]
  )

  const uploadChildFile = useCallback(
    (target: ChildRef, file: File) => {
      void runMutation(async () => {
        const form = new FormData()
        form.append('file', file)
        form.append('sectionNo', String(target.sectionNo))
        form.append('rowId', target.rowId)
        form.append('childNo', String(target.childNo))

        const toastId = toast.loading(`Mengunggah ${file.name}…`)
        try {
          await api('/api/instrumen/upload', { method: 'POST', body: form })
        } catch (err) {
          // Error ditampilkan oleh `runMutation`.
          toast.dismiss(toastId)
          throw err
        }

        toast.success('File berhasil diunggah', {
          id: toastId,
          description: file.name,
        })
      })
    },
    [runMutation]
  )

  const items = useMemo<InstrumenItem[]>(() => {
    const list: InstrumenItem[] = []

    for (const section of sections) {
      for (const row of section.rows) {
        const nomor = `${row.no}.${row.id}`

        // The indicator line always stays visible; uploaded documents are
        // nested below it as `1.a.1`, `1.a.2`, …
        list.push({
          id: `${section.no}.${row.id}`,
          sectionNo: section.no,
          rowId: row.id,
          childNo: null,
          no: nomor,
          kriteria: section.nama,
          subKriteria: row.subKriteria,
          indikator: row.indikator,
          namaFile: '',
          deskripsi: '',
          canAdd: true,
        })

        for (const child of row.children ?? []) {
          list.push({
            id: `${section.no}.${row.id}.${child.no}`,
            sectionNo: section.no,
            rowId: row.id,
            childNo: child.no,
            no: `${nomor}.${child.no}`,
            kriteria: child.doc?.kriteria ?? section.nama,
            subKriteria: child.subKriteria,
            indikator: child.indikator,
            namaFile: child.doc?.namaFile ?? '',
            deskripsi: child.doc?.deskripsi ?? '',
            fileName: child.fileName,
            fileUrl: child.fileUrl,
            canAdd: false,
          })
        }
      }
    }

    return list
  }, [sections])

  const searchFilter = useCallback((item: InstrumenItem, query: string) => {
    return [item.no, item.kriteria, item.subKriteria, item.indikator, item.namaFile, item.deskripsi]
      .join(' ')
      .toLowerCase()
      .includes(query)
  }, [])

  const saveDoc = (doc: DokumenUpload) => {
    if (!formTarget) return
    const target = formTarget
    const isAdd = target.mode === 'add'

    void runMutation(async () => {
      if (isAdd) {
        await api('/api/instrumen/children', {
          method: 'POST',
          body: JSON.stringify({ sectionNo: target.sectionNo, rowId: target.rowId, doc }),
        })
        toast.success('Dokumen berhasil ditambahkan')
      } else {
        await api('/api/instrumen/children', {
          method: 'PUT',
          body: JSON.stringify({
            sectionNo: target.sectionNo,
            rowId: target.rowId,
            childNo: target.childNo,
            doc,
          }),
        })
        toast.success('Dokumen berhasil diperbarui')
      }
    }).finally(() => setFormTarget(null))
  }

  const activeForm = (() => {
    if (!formTarget) return null
    const section = sections.find((s) => s.no === formTarget.sectionNo)
    const row = section?.rows.find((r) => r.id === formTarget.rowId)
    if (!section || !row) return null

    if (formTarget.mode === 'add') {
      return {
        mode: 'add' as const,
        sectionNo: section.no,
        rowId: row.id,
        childNo: null,
        kriteria: section.nama,
        subKriteria: row.subKriteria,
        indikator: row.indikator,
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
    const row = section?.rows.find((r) => r.id === viewTarget.rowId)
    const child = row?.children?.find((c) => c.no === viewTarget.childNo)
    if (!child?.fileUrl) return null
    return {
      fileName: child.fileName ?? child.doc?.namaFile ?? 'Dokumen',
      fileUrl: child.fileUrl,
      sectionNo: section!.no,
      rowId: row!.id,
      childNo: child.no,
    }
  })()

  const actionColumn: DataTableColumn<InstrumenItem> = {
    id: 'aksi',
    header: 'Aksi',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original
      const child: ChildRef | null =
        item.childNo === null
          ? null
          : { sectionNo: item.sectionNo, rowId: item.rowId, childNo: item.childNo }

      const tambah = item.canAdd ? (
        <Button
          key="tambah"
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() =>
            setFormTarget({
              mode: 'add',
              sectionNo: item.sectionNo,
              rowId: item.rowId,
              childNo: null,
            })
          }
        >
          <Plus />
          Tambah
        </Button>
      ) : null

      if (mode === 'admin') {
        if (!canEdit) return <span className="text-muted-foreground">-</span>

        return (
          <div className="flex flex-wrap items-center gap-1">
            {tambah}
            {child ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(busy && 'pointer-events-none opacity-50')}
                >
                  <label title="Unggah file">
                    <Upload />
                    <span className="sr-only">Unggah file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept={UPLOAD_ACCEPT}
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file && !busy) uploadChildFile(child, file)
                        event.target.value = ''
                      }}
                    />
                  </label>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Ubah dokumen"
                  title="Ubah dokumen"
                  disabled={busy}
                  onClick={() => setFormTarget({ mode: 'update', ...child })}
                >
                  <Pencil />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Hapus dokumen"
                  title="Hapus dokumen"
                  disabled={busy}
                  onClick={() => setConfirmTarget(child)}
                >
                  <Trash2 />
                </Button>
              </>
            ) : null}
          </div>
        )
      }

      // Public visitors only see files that were uploaded from the dashboard.
      // Plain `doc.link` values (e.g. legacy/placeholder URLs) are not surfaced.
      if (item.fileUrl) {
        const label = isPdfFile(item.fileName ?? item.namaFile) ? 'Lihat PDF' : 'Lihat Dokumen'

        return (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={label}
            title={label}
            onClick={() =>
              setViewTarget({ sectionNo: item.sectionNo, rowId: item.rowId, childNo: item.childNo! })
            }
          >
            <Eye />
          </Button>
        )
      }

      return <span className="text-muted-foreground">-</span>
    },
  }

  const columns: DataTableColumn<InstrumenItem>[] = [
    {
      accessorKey: 'no',
      header: 'No',
      cell: ({ row }) =>
        row.original.childNo === null ? (
          <span className="font-mono text-xs font-semibold tabular-nums">{row.original.no}</span>
        ) : (
          <span className="ps-4 font-mono text-xs tabular-nums text-muted-foreground">
            {row.original.no}
          </span>
        ),
    },
    { accessorKey: 'kriteria', header: 'Kriteria' },
    { accessorKey: 'subKriteria', header: 'Sub Kriteria' },
    {
      accessorKey: 'indikator',
      header: 'Indikator',
      cell: ({ row }) => <div className="min-w-[14rem]">{row.original.indikator}</div>,
    },
    {
      accessorKey: 'namaFile',
      header: 'Nama File',
      cell: ({ row }) => (
        <div className="min-w-[8rem]">
          {row.original.namaFile || <span className="text-muted-foreground">-</span>}
        </div>
      ),
    },
    {
      accessorKey: 'deskripsi',
      header: 'Deskripsi',
      cell: ({ row }) => (
        <div className="min-w-[10rem]">
          {row.original.deskripsi || <span className="text-muted-foreground">-</span>}
        </div>
      ),
    },
    actionColumn,
  ]

  const emptyMessage =
    loadState === 'loading'
      ? 'Memuat data…'
      : loadState === 'error'
        ? loadError || 'Gagal memuat data.'
        : 'Belum ada data instrumen.'

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {loadState === 'ready' && loadError ? (
        <p className="mb-4 text-sm font-medium text-destructive" role="alert">
          {loadError}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={items}
        searchFilter={searchFilter}
        searchPlaceholder="Cari nomor, kriteria, indikator…"
        rowClassName={(item) => (item.childNo === null ? 'bg-muted/40' : undefined)}
        initialPageSize={25}
        emptyMessage={emptyMessage}
      />

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
          fileUrl={documentFileSrc(activeView) ?? ''}
          onClose={() => setViewTarget(null)}
        />
      ) : null}

      {confirmTarget ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setConfirmTarget(null)
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Hapus dokumen</DialogTitle>
              <DialogDescription>
                Dokumen ini akan dihapus permanen. Lanjutkan?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmTarget(null)} disabled={busy}>
                Batal
              </Button>
              <Button
                variant="destructive"
                disabled={busy}
                onClick={() => {
                  const target = confirmTarget
                  void runMutation(async () => {
                    await api('/api/instrumen/children', {
                      method: 'DELETE',
                      body: JSON.stringify(target),
                    })
                    toast.success('Dokumen berhasil dihapus')
                  }).finally(() => setConfirmTarget(null))
                }}
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  )
}
