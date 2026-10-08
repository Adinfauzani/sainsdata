import { pool, migrate, seed } from './db'

const port = Number(process.env.PORT ?? 8787)
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json()
    return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

function bearerToken(req: Request): string | null {
  const header = req.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7)
}

async function adminFromToken(token: string | null) {
  if (!token) return null
  const { rows } = await pool.query(
    `SELECT a.id, a.username FROM sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token]
  )
  return rows[0] ?? null
}

function mapChild(child: {
  child_no?: number
  no?: number
  sub_kriteria: string
  indikator: string
  doc?: unknown
  file_name?: string | null
  file_url?: string | null
}) {
  return {
    no: child.child_no ?? child.no,
    subKriteria: child.sub_kriteria,
    indikator: child.indikator,
    doc: child.doc ?? undefined,
    fileName: child.file_name ?? undefined,
    fileUrl: child.file_url ?? undefined,
  }
}

const UPLOAD_ALLOWED = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.csv', '.xls', '.xlsx', '.ppt', '.pptx']
const UPLOAD_MAX_BYTES = 25 * 1024 * 1024

async function handleApi(req: Request, path: string): Promise<Response | null> {
  if (path === '/api/auth/login' && req.method === 'POST') {
    const body = await readJson(req)
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!username || !password) return json({ error: 'Username dan password wajib diisi' }, 400)

    const { rows } = await pool.query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1',
      [username]
    )
    const admin = rows[0]
    const valid = admin ? await Bun.password.verify(password, admin.password_hash) : false
    if (!valid) return json({ error: 'Username atau password salah' }, 401)

    const token = crypto.randomUUID()
    await pool.query(
      'INSERT INTO sessions (token, admin_id, expires_at) VALUES ($1, $2, now() + $3 * interval \'1 millisecond\')',
      [token, admin.id, SESSION_TTL_MS]
    )
    return json({ token, admin: { username: admin.username } })
  }

  if (path === '/api/auth/logout' && req.method === 'POST') {
    const token = bearerToken(req)
    if (token) await pool.query('DELETE FROM sessions WHERE token = $1', [token])
    return json({ ok: true })
  }

  if (path === '/api/auth/me' && req.method === 'GET') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    return json({ admin: { username: admin.username } })
  }

  if (path === '/api/stats' && req.method === 'GET') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)

    const { rows } = await pool.query(
      `SELECT
         (SELECT count(*) FROM instrumen_sections)::int AS sections,
         (SELECT count(*) FROM instrumen_rows)::int AS rows,
         (SELECT count(*) FROM instrumen_children)::int AS children,
         (SELECT count(*) FROM instrumen_children WHERE doc IS NOT NULL)::int AS docs,
         (SELECT count(*) FROM instrumen_children WHERE file_name IS NOT NULL)::int AS files,
         (SELECT count(*) FROM instrumen_children WHERE file_url IS NOT NULL)::int AS uploads,
         (SELECT count(*) FROM instrumen_children
            WHERE doc IS NOT NULL AND coalesce(doc->>'link', '') <> '')::int AS links`
    )
    return json({ stats: rows[0] })
  }

  if (path === '/api/instrumen' && req.method === 'GET') {
    const [sections, rows, children] = await Promise.all([
      pool.query('SELECT no, nama FROM instrumen_sections ORDER BY no'),
      pool.query(
        'SELECT section_no, row_no, row_id, sub_kriteria, indikator, penjelasan_prodi FROM instrumen_rows ORDER BY section_no, row_id'
      ),
      pool.query(
        `SELECT section_no, row_id, child_no, sub_kriteria, indikator, doc, file_name, file_url
         FROM instrumen_children ORDER BY section_no, row_id, child_no`
      ),
    ])

    const data = sections.rows.map((section) => ({
      no: section.no,
      nama: section.nama,
      rows: rows.rows
        .filter((row) => row.section_no === section.no)
        .map((row) => ({
          no: row.row_no,
          id: row.row_id,
          subKriteria: row.sub_kriteria,
          indikator: row.indikator,
          penjelasanProdi: row.penjelasan_prodi ?? undefined,
          children: children.rows
            .filter((child) => child.section_no === section.no && child.row_id === row.row_id)
            .map(mapChild),
        })),
    }))

    return json({ sections: data })
  }

  if (path === '/api/instrumen/children' && req.method === 'POST') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)

    const body = await readJson(req)
    const sectionNo = Number(body.sectionNo)
    const rowId = typeof body.rowId === 'string' ? body.rowId : ''
    const doc = body.doc
    if (!Number.isInteger(sectionNo) || !rowId) return json({ error: 'Data tidak lengkap' }, 400)
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
      return json({ error: 'Dokumen wajib diisi' }, 400)
    }

    const rowRes = await pool.query(
      'SELECT sub_kriteria, indikator FROM instrumen_rows WHERE section_no = $1 AND row_id = $2',
      [sectionNo, rowId]
    )
    if (!rowRes.rows[0]) return json({ error: 'Baris tidak ditemukan' }, 404)

    const docJson = doc as Record<string, unknown>
    const subKriteria =
      typeof docJson.subKriteria === 'string' && docJson.subKriteria.trim()
        ? docJson.subKriteria
        : rowRes.rows[0].sub_kriteria
    const indikator =
      typeof docJson.indikator === 'string' && docJson.indikator.trim()
        ? docJson.indikator
        : rowRes.rows[0].indikator

    const nextNo = await pool.query(
      `SELECT coalesce(max(child_no), 0) + 1 AS next
       FROM instrumen_children WHERE section_no = $1 AND row_id = $2`,
      [sectionNo, rowId]
    )
    const childNo = nextNo.rows[0].next

    await pool.query(
      `INSERT INTO instrumen_children (section_no, row_id, child_no, sub_kriteria, indikator, doc)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [sectionNo, rowId, childNo, subKriteria, indikator, JSON.stringify(docJson)]
    )

    return json({
      ok: true,
      child: { no: childNo, subKriteria, indikator, doc: docJson },
    })
  }

  if (path === '/api/instrumen/children' && req.method === 'PUT') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)

    const body = await readJson(req)
    const sectionNo = Number(body.sectionNo)
    const rowId = typeof body.rowId === 'string' ? body.rowId : ''
    const childNo = Number(body.childNo)
    const doc = body.doc
    if (!Number.isInteger(sectionNo) || !rowId || !Number.isInteger(childNo)) {
      return json({ error: 'Data tidak lengkap' }, 400)
    }
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
      return json({ error: 'Dokumen wajib diisi' }, 400)
    }

    const childRes = await pool.query(
      'SELECT sub_kriteria, indikator FROM instrumen_children WHERE section_no = $1 AND row_id = $2 AND child_no = $3',
      [sectionNo, rowId, childNo]
    )
    if (!childRes.rows[0]) return json({ error: 'Baris tidak ditemukan' }, 404)

    const docJson = doc as Record<string, unknown>
    const subKriteria =
      typeof docJson.subKriteria === 'string' && docJson.subKriteria.trim()
        ? docJson.subKriteria
        : childRes.rows[0].sub_kriteria
    const indikator =
      typeof docJson.indikator === 'string' && docJson.indikator.trim()
        ? docJson.indikator
        : childRes.rows[0].indikator

    await pool.query(
      `UPDATE instrumen_children
       SET doc = $4, sub_kriteria = $5, indikator = $6
       WHERE section_no = $1 AND row_id = $2 AND child_no = $3`,
      [sectionNo, rowId, childNo, JSON.stringify(docJson), subKriteria, indikator]
    )

    return json({
      ok: true,
      child: { no: childNo, subKriteria, indikator, doc: docJson },
    })
  }

  if (path === '/api/instrumen/children' && req.method === 'DELETE') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)

    const body = await readJson(req)
    const sectionNo = Number(body.sectionNo)
    const rowId = typeof body.rowId === 'string' ? body.rowId : ''
    const childNo = Number(body.childNo)
    if (!Number.isInteger(sectionNo) || !rowId || !Number.isInteger(childNo)) {
      return json({ error: 'Data tidak lengkap' }, 400)
    }

    const delRes = await pool.query(
      `DELETE FROM instrumen_children
       WHERE section_no = $1 AND row_id = $2 AND child_no = $3
       RETURNING file_url`,
      [sectionNo, rowId, childNo]
    )
    if (delRes.rowCount === 0) return json({ error: 'Baris tidak ditemukan' }, 404)

    const fileUrl = delRes.rows[0].file_url
    if (typeof fileUrl === 'string' && fileUrl.startsWith('/uploads/')) {
      try {
        await Bun.file(`${uploadsDir}/${fileUrl.slice('/uploads/'.length)}`).delete()
      } catch {
        // file telah tidak ada — abaikan
      }
    }

    return json({ ok: true })
  }

  if (path === '/api/instrumen/upload' && req.method === 'POST') {
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

  return null
}

const uploadsDir = `${import.meta.dir}/uploads`

async function serveUpload(pathname: string): Promise<Response> {
  const relative = decodeURIComponent(pathname.slice('/uploads/'.length))
  if (!relative || relative.includes('..')) return new Response('Not found', { status: 404 })
  const file = Bun.file(`${uploadsDir}/${relative}`)
  if (!(await file.exists())) return new Response('Not found', { status: 404 })
  return new Response(file)
}

await migrate()
await seed()

Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url)

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
