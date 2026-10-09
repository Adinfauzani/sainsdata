import { put } from '@vercel/blob'
import {
  adminFromToken,
  bearerToken,
  json,
  pool,
  UPLOAD_ALLOWED,
  UPLOAD_MAX_BYTES,
} from '../../lib/api-handler'

export default async function handler(req: Request): Promise<Response> {
  const admin = await adminFromToken(bearerToken(req))
  if (!admin) return json({ error: 'Belum login' }, 401)

  const form = await req.formData()
  const file = form.get('file')
  const sectionNo = Number(form.get('sectionNo'))
  const rowId = typeof form.get('rowId') === 'string' ? String(form.get('rowId')) : ''
  const childNo = Number(form.get('childNo'))
  if (!Number.isInteger(sectionNo) || !rowId || !Number.isInteger(childNo)) {
    return json({ error: 'Data tidak lengkap' }, 400)
  }
  if (!(file instanceof File)) return json({ error: 'File wajib diisi' }, 400)
  if (file.size > UPLOAD_MAX_BYTES) return json({ error: 'Ukuran file maksimal 25MB' }, 400)

  const originalName = file.name
  const ext = originalName.includes('.')
    ? originalName.slice(originalName.lastIndexOf('.')).toLowerCase()
    : ''
  if (!UPLOAD_ALLOWED.includes(ext)) return json({ error: 'Format file tidak didukung' }, 400)

  const childRes = await pool.query(
    'SELECT 1 FROM instrumen_children WHERE section_no = $1 AND row_id = $2 AND child_no = $3',
    [sectionNo, rowId, childNo]
  )
  if (!childRes.rows[0]) return json({ error: 'Baris tidak ditemukan' }, 404)

  let fileUrl: string
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const storedName = `${crypto.randomUUID()}${ext}`
    const blob = await put(storedName, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type || undefined,
    })
    fileUrl = blob.url
  } else {
    const storedName = `${crypto.randomUUID()}${ext}`
    const uploadsDir = `${process.cwd()}/server/uploads`
    const { writeFile } = await import('node:fs/promises')
    const arrayBuffer = await file.arrayBuffer()
    await writeFile(`${uploadsDir}/${storedName}`, new Uint8Array(arrayBuffer))
    fileUrl = `/uploads/${storedName}`
  }

  await pool.query(
    `UPDATE instrumen_children SET file_name = $4, file_url = $5
     WHERE section_no = $1 AND row_id = $2 AND child_no = $3`,
    [sectionNo, rowId, childNo, originalName, fileUrl]
  )

  return json({ ok: true, fileName: originalName, fileUrl })
}