import {
  adminFromToken,
  bearerToken,
  handleApi,
  json,
  pool,
  UPLOAD_ALLOWED,
  UPLOAD_MAX_BYTES,
} from '../src/lib/api-handler'
import { migrate, seed } from './db'

const port = Number(process.env.PORT ?? 8787)

const uploadsDir = `${import.meta.dir}/uploads`

async function serveUpload(pathname: string): Promise<Response> {
  const relative = decodeURIComponent(pathname.slice('/uploads/'.length))
  if (!relative || relative.includes('..')) return new Response('Not found', { status: 404 })
  const file = Bun.file(`${uploadsDir}/${relative}`)
  if (!(await file.exists())) return new Response('Not found', { status: 404 })
  return new Response(file)
}

async function handleUpload(req: Request): Promise<Response> {
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

  const storedName = `${crypto.randomUUID()}${ext}`
  await Bun.write(`${uploadsDir}/${storedName}`, new Uint8Array(await file.arrayBuffer()))

  const fileUrl = `/uploads/${storedName}`
  await pool.query(
    `UPDATE instrumen_children SET file_name = $4, file_url = $5
     WHERE section_no = $1 AND row_id = $2 AND child_no = $3`,
    [sectionNo, rowId, childNo, originalName, fileUrl]
  )

  return json({ ok: true, fileName: originalName, fileUrl })
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) {
        console.warn('[boot] Neon tidak responsif, coba ulang…', i + 1)
        await Bun.sleep(1500 * (i + 1))
      }
    }
  }
  throw lastErr
}

await withRetry(migrate)
await withRetry(seed)

Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url)

    if (pathname === '/api/instrumen/upload' && req.method === 'POST') {
      return handleUpload(req)
    }

    if (pathname.startsWith('/api/')) {
      try {
        const res = await handleApi(req, pathname)
        return res ?? json({ error: 'Endpoint tidak ditemukan' }, 404)
      } catch (err) {
        console.error('[api]', err)
        return json({ error: 'Terjadi kesalahan pada server' }, 500)
      }
    }

    if (pathname.startsWith('/uploads/')) return serveUpload(pathname)

    return new Response('Not found', { status: 404 })
  },
})

console.log(`API server berjalan di http://localhost:${port}`)