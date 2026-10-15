import { get, type GetBlobResult } from '@vercel/blob'
import { pool } from '@/lib/api-handler'
import { blobAccessFromUrl, blobPathnameFromUrl } from '@/lib/blob-files'

export const dynamic = 'force-dynamic'

/**
 * Menyajikan berkas instrumen yang tersimpan di Vercel Blob.
 *
 * Berkas pada store *private* tidak bisa dibuka langsung oleh browser (403),
 * jadi diambil di server lalu dialirkan ke klien — lihat `get()` pada
 * dokumentasi Vercel Blob. Berkas pada store *public* cukup dialihkan ke CDN.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sectionNo: string; rowId: string; childNo: string }> }
) {
  const { sectionNo, rowId, childNo } = await params
  const section = Number(sectionNo)
  const child = Number(childNo)
  if (!Number.isInteger(section) || !rowId || !Number.isInteger(child)) {
    return new Response('Permintaan tidak valid', { status: 400 })
  }

  const { rows } = await pool.query<{ file_name: string | null; file_url: string | null }>(
    `SELECT file_name, file_url FROM instrumen_children
     WHERE section_no = $1 AND row_id = $2 AND child_no = $3`,
    [section, rowId, child]
  )

  const row = rows[0]
  if (!row?.file_url) return new Response('Berkas tidak ditemukan', { status: 404 })

  if (blobAccessFromUrl(row.file_url) === 'public') {
    return Response.redirect(row.file_url, 302)
  }

  let result: GetBlobResult | null
  try {
    result = await get(blobPathnameFromUrl(row.file_url), { access: 'private' })
  } catch (err) {
    console.error('[berkas] gagal mengambil berkas dari Vercel Blob:', err)
    return new Response('Berkas sedang tidak dapat diakses', { status: 502 })
  }

  if (!result || result.statusCode !== 200) {
    return new Response('Berkas tidak ditemukan', { status: 404 })
  }

  return new Response(result.stream, {
    headers: {
      'Cache-Control': 'private, no-cache',
      'Content-Type': result.blob.contentType || 'application/octet-stream',
      'Content-Disposition': inlineFileName(row.file_name),
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

/** Nama berkas aman untuk header `Content-Disposition` (tanpa karakter non-ASCII). */
function inlineFileName(name: string | null) {
  const safe = (name || 'dokumen').replace(/[^\w.()\- ]+/g, '_')
  return `inline; filename="${safe}"`
}
