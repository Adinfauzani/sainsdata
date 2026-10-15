import type { InstrumenSection } from '@/types'

export interface InstrumenDocumentItem {
  id: string
  /** Human readable number, e.g. `2.a.1`. */
  nomor: string
  kriteria: string
  subKriteria: string
  indikator: string
  /** File name shown to the user. */
  judul: string
  deskripsi: string
  jenis: 'Dokumen Instrumen' | 'File Terunggah'
  /** Uppercase extension (PDF, DOCX…) or `LINK` when only a link exists. */
  format: string
  /** Primary key of the row in `instrumen_children`. */
  sectionNo: number
  rowId: string
  childNo: number
  fileName?: string
  fileUrl?: string
  link?: string
}

/**
 * URL yang dipakai untuk membuka berkas. Berkas pada store Vercel Blob yang
 * *private* tidak bisa dibuka langsung dari browser, jadi dialihkan ke route
 * penyaji milik aplikasi (`/api/instrumen/file/...`). Berkas di store *public*
 * (atau fallback lokal `/uploads/...`) dipakai apa adanya.
 */
export function documentFileSrc(doc: {
  fileUrl?: string
  sectionNo: number
  rowId: string
  childNo: number
}): string | undefined {
  if (!doc.fileUrl) return undefined
  if (!doc.fileUrl.includes('.private.blob.')) return doc.fileUrl
  return `/api/instrumen/file/${doc.sectionNo}/${doc.rowId}/${doc.childNo}`
}

/**
 * Flattens the instrument tree into the list of documents used by both the
 * public (`/akreditasi/dokumen`) and the dashboard (`/dashboard/dokumen`)
 * repositories. Only indicators that carry a document, an uploaded file or a
 * link are surfaced.
 */
export function collectInstrumenDocuments(
  sections: InstrumenSection[]
): InstrumenDocumentItem[] {
  const documents: InstrumenDocumentItem[] = []

  for (const section of sections) {
    for (const row of section.rows) {
      for (const child of row.children ?? []) {
        const doc = child.doc
        const fileName = doc?.namaFile || child.fileName
        if (!doc && !child.fileUrl && !child.fileName) continue

        const extension = fileName?.split('.').pop()?.toUpperCase()
        documents.push({
          id: `${section.no}.${row.id}.${child.no}`,
          nomor: `${row.no}.${row.id}.${child.no}`,
          sectionNo: section.no,
          rowId: row.id,
          childNo: child.no,
          kriteria: section.nama,
          subKriteria: child.subKriteria || row.subKriteria,
          indikator: child.indikator || row.indikator,
          judul: fileName || `Dokumen ${row.no}.${row.id}.${child.no}`,
          deskripsi: doc?.deskripsi || doc?.indikator || child.indikator || '',
          jenis: doc ? 'Dokumen Instrumen' : 'File Terunggah',
          format: extension || (child.fileUrl ? 'FILE' : 'LINK'),
          fileName: child.fileName,
          fileUrl: child.fileUrl,
          link: doc?.link,
        })
      }
    }
  }

  return documents
}

/** Searchable text used by the client-side filters of the document tables. */
export function documentSearchText(doc: InstrumenDocumentItem) {
  return [
    doc.nomor,
    doc.kriteria,
    doc.subKriteria,
    doc.indikator,
    doc.judul,
    doc.deskripsi,
    doc.format,
    doc.jenis,
  ]
    .join(' ')
    .toLowerCase()
}
