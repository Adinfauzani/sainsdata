import bcrypt from 'bcryptjs'
import { unlink } from 'node:fs/promises'
import { Pool } from 'pg'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) throw new Error('DATABASE_URL belum diisi di .env')

export const pool = new Pool({ connectionString: dbUrl, max: 5 })

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json()
    return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function bearerToken(req: Request): string | null {
  const header = req.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7)
}

export async function adminFromToken(token: string | null) {
  if (!token) return null
  const { rows } = await pool.query(
    `SELECT a.id, a.email, a.username, a.role, a.is_active FROM sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token]
  )
  return rows[0] ?? null
}

export async function requireRole(admin: { role: string } | null, allowedRoles: string[]): Promise<boolean> {
  if (!admin) return false
  return allowedRoles.includes(admin.role)
}

export async function logAudit(
  adminId: number | null,
  action: string,
  targetType: string | null,
  targetId: string | null,
  oldValue: unknown,
  newValue: unknown,
  req: Request
): Promise<void> {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    await pool.query(
      `INSERT INTO audit_log (admin_id, action, target_type, target_id, old_value, new_value, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [adminId, action, targetType, targetId, 
       oldValue ? JSON.stringify(oldValue) : null,
       newValue ? JSON.stringify(newValue) : null,
       ip, userAgent]
    )
  } catch {
    // audit log failure shouldn't break the main operation
  }
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

export async function deleteStoredFile(fileUrl: unknown): Promise<void> {
  if (typeof fileUrl !== 'string' || !fileUrl) return
  try {
    if (fileUrl.startsWith('/uploads/')) {
      const uploadsDir = `${process.cwd()}/server/uploads`
      await unlink(`${uploadsDir}/${fileUrl.slice('/uploads/'.length)}`)
    } else if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { del } = await import('@vercel/blob')
      await del(fileUrl)
    }
  } catch {
    // file telah tidak ada - abaikan
  }
}

const UPLOAD_ALLOWED = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.csv', '.xls', '.xlsx', '.ppt', '.pptx']
const UPLOAD_MAX_BYTES = 25 * 1024 * 1024

export { UPLOAD_ALLOWED, UPLOAD_MAX_BYTES }

export async function handleApi(req: Request, path: string): Promise<Response | null> {
  if (path === '/api/auth/login' && req.method === 'POST') {
    const body = await readJson(req)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!email || !password) return json({ error: 'Email dan password wajib diisi' }, 400)

    const { rows } = await pool.query(
      'SELECT id, email, username, password_hash, role FROM admins WHERE email = $1',
      [email]
    )
    const admin = rows[0]
    const valid = admin ? await bcrypt.compare(password, admin.password_hash) : false
    if (!valid) return json({ error: 'Email atau password salah' }, 401)

    const token = crypto.randomUUID()
    await pool.query(
      'INSERT INTO sessions (token, admin_id, expires_at) VALUES ($1, $2, now() + $3 * interval \'1 millisecond\')',
      [token, admin.id, 7 * 24 * 60 * 60 * 1000]
    )
    return json({ token, admin: { id: admin.id, email: admin.email, username: admin.username, role: admin.role } })
  }

  if (path === '/api/auth/logout' && req.method === 'POST') {
    const token = bearerToken(req)
    if (token) await pool.query('DELETE FROM sessions WHERE token = $1', [token])
    return json({ ok: true })
  }

  if (path === '/api/auth/me' && req.method === 'GET') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    return json({ admin: { id: admin.id, email: admin.email, username: admin.username, role: admin.role } })
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
            WHERE doc IS NOT NULL AND coalesce(doc->>'link', '') <> '')::int AS links,
         (SELECT count(*) FROM admins)::int AS users`
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

    await deleteStoredFile(delRes.rows[0].file_url)

    return json({ ok: true })
  }

  // User management APIs
  if (path === '/api/users' && req.method === 'GET') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    if (!(await requireRole(admin, ['sudo', 'admin']))) return json({ error: 'Akses ditolak' }, 403)

    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20))
    const search = url.searchParams.get('search') || ''
    const role = url.searchParams.get('role') || ''
    const isActive = url.searchParams.get('isActive')
    const offset = (page - 1) * limit

    let whereClause = 'WHERE 1=1'
    const params: unknown[] = []
    let paramIndex = 1

    if (search) {
      whereClause += ` AND (email ILIKE $${paramIndex} OR username ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }
    if (role) {
      whereClause += ` AND role = $${paramIndex}`
      params.push(role)
      paramIndex++
    }
    if (isActive !== null && isActive !== '') {
      whereClause += ` AND is_active = $${paramIndex}`
      params.push(isActive === 'true')
      paramIndex++
    }

    const countQuery = `SELECT count(*)::int AS total FROM admins ${whereClause}`
    const countRes = await pool.query(countQuery, params)
    const total = countRes.rows[0].total

    const dataQuery = `
      SELECT id, email, username, role, is_active, created_at, updated_at
      FROM admins
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)
    const dataRes = await pool.query(dataQuery, params)

    return json({
      users: dataRes.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  }

  if (path === '/api/users' && req.method === 'POST') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    if (!(await requireRole(admin, ['sudo']))) return json({ error: 'Hanya SUDO yang dapat membuat pengguna' }, 403)

    const body = await readJson(req)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const role = typeof body.role === 'string' ? body.role : 'user'

    if (!email || !username || !password) return json({ error: 'Email, username, dan password wajib diisi' }, 400)
    if (!['sudo', 'admin', 'user'].includes(role)) return json({ error: 'Role tidak valid' }, 400)
    if (role === 'sudo') return json({ error: 'Tidak dapat membuat akun SUDO melalui API' }, 400)
    if (password.length < 8) return json({ error: 'Password minimal 8 karakter' }, 400)

    const existing = await pool.query('SELECT id FROM admins WHERE email = $1 OR username = $2', [email, username])
    if (existing.rows.length > 0) return json({ error: 'Email atau username sudah digunakan' }, 409)

    const hash = await bcrypt.hash(password, 12)
    const res = await pool.query(
      'INSERT INTO admins (email, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role, is_active, created_at',
      [email, username, hash, role]
    )
    const newUser = res.rows[0]

    await logAudit(admin.id, 'USER_CREATE', 'user', String(newUser.id), null, newUser, req)

    return json({ ok: true, user: newUser }, 201)
  }

  if (path.startsWith('/api/users/') && req.method === 'GET') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    if (!(await requireRole(admin, ['sudo', 'admin']))) return json({ error: 'Akses ditolak' }, 403)

    const userId = Number(path.split('/api/users/')[1])
    if (!Number.isInteger(userId)) return json({ error: 'ID tidak valid' }, 400)

    const res = await pool.query('SELECT id, email, username, role, is_active, created_at, updated_at FROM admins WHERE id = $1', [userId])
    if (res.rows.length === 0) return json({ error: 'Pengguna tidak ditemukan' }, 404)

    return json({ user: res.rows[0] })
  }

  if (path.startsWith('/api/users/') && req.method === 'PUT') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    if (!(await requireRole(admin, ['sudo']))) return json({ error: 'Hanya SUDO yang dapat mengubah pengguna' }, 403)

    const userId = Number(path.split('/api/users/')[1])
    if (!Number.isInteger(userId)) return json({ error: 'ID tidak valid' }, 400)

    const targetRes = await pool.query('SELECT id, email, username, role, is_active FROM admins WHERE id = $1', [userId])
    if (targetRes.rows.length === 0) return json({ error: 'Pengguna tidak ditemukan' }, 404)
    const target = targetRes.rows[0]

    // Prevent modifying sudo accounts unless you are sudo (and even then, cannot change sudo role)
    if (target.role === 'sudo' && admin.id !== userId) {
      return json({ error: 'Tidak dapat mengubah akun SUDO lain' }, 403)
    }

    const body = await readJson(req)
    const updates: string[] = []
    const params: unknown[] = []
    let paramIndex = 1
    const oldValue = { ...target }

    if (body.email !== undefined) {
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
      if (!email) return json({ error: 'Email tidak boleh kosong' }, 400)
      const existing = await pool.query('SELECT id FROM admins WHERE email = $1 AND id != $2', [email, userId])
      if (existing.rows.length > 0) return json({ error: 'Email sudah digunakan' }, 409)
      updates.push(`email = $${paramIndex}`)
      params.push(email)
      paramIndex++
    }
    if (body.username !== undefined) {
      const username = typeof body.username === 'string' ? body.username.trim() : ''
      if (!username) return json({ error: 'Username tidak boleh kosong' }, 400)
      const existing = await pool.query('SELECT id FROM admins WHERE username = $1 AND id != $2', [username, userId])
      if (existing.rows.length > 0) return json({ error: 'Username sudah digunakan' }, 409)
      updates.push(`username = $${paramIndex}`)
      params.push(username)
      paramIndex++
    }
    if (body.role !== undefined) {
      const role = typeof body.role === 'string' ? body.role : ''
      if (!['sudo', 'admin', 'user'].includes(role)) return json({ error: 'Role tidak valid' }, 400)
      if (target.role === 'sudo' && role !== 'sudo') return json({ error: 'Tidak dapat menurunkan role SUDO' }, 403)
      if (role === 'sudo' && admin.role !== 'sudo') return json({ error: 'Hanya SUDO yang dapat membuat SUDO' }, 403)
      updates.push(`role = $${paramIndex}`)
      params.push(role)
      paramIndex++
    }
    if (body.isActive !== undefined) {
      const isActive = Boolean(body.isActive)
      if (target.role === 'sudo' && !isActive) return json({ error: 'Tidak dapat menonaktifkan akun SUDO' }, 403)
      updates.push(`is_active = $${paramIndex}`)
      params.push(isActive)
      paramIndex++
    }
    if (body.password !== undefined) {
      const password = typeof body.password === 'string' ? body.password : ''
      if (password.length < 8) return json({ error: 'Password minimal 8 karakter' }, 400)
      const hash = await bcrypt.hash(password, 12)
      updates.push(`password_hash = $${paramIndex}`)
      params.push(hash)
      paramIndex++
    }

    if (updates.length === 0) return json({ error: 'Tidak ada data yang diubah' }, 400)

    updates.push(`updated_at = now()`)
    params.push(userId)
    await pool.query(`UPDATE admins SET ${updates.join(', ')} WHERE id = $${paramIndex}`, params)

    const newRes = await pool.query('SELECT id, email, username, role, is_active, created_at, updated_at FROM admins WHERE id = $1', [userId])
    const updated = newRes.rows[0]

    await logAudit(admin.id, 'USER_UPDATE', 'user', String(userId), oldValue, updated, req)

    return json({ ok: true, user: updated })
  }

  if (path.startsWith('/api/users/') && req.method === 'DELETE') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    if (!(await requireRole(admin, ['sudo']))) return json({ error: 'Hanya SUDO yang dapat menghapus pengguna' }, 403)

    const userId = Number(path.split('/api/users/')[1])
    if (!Number.isInteger(userId)) return json({ error: 'ID tidak valid' }, 400)

    if (admin.id === userId) return json({ error: 'Tidak dapat menghapus akun sendiri' }, 403)

    const targetRes = await pool.query('SELECT id, email, username, role FROM admins WHERE id = $1', [userId])
    if (targetRes.rows.length === 0) return json({ error: 'Pengguna tidak ditemukan' }, 404)
    const target = targetRes.rows[0]

    if (target.role === 'sudo') return json({ error: 'Tidak dapat menghapus akun SUDO' }, 403)

    await pool.query('DELETE FROM admins WHERE id = $1', [userId])

    await logAudit(admin.id, 'USER_DELETE', 'user', String(userId), target, null, req)

    return json({ ok: true })
  }

  // Audit log API (SUDO only)
  if (path === '/api/audit-log' && req.method === 'GET') {
    const admin = await adminFromToken(bearerToken(req))
    if (!admin) return json({ error: 'Belum login' }, 401)
    if (!(await requireRole(admin, ['sudo']))) return json({ error: 'Hanya SUDO yang dapat melihat audit log' }, 403)

    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 50))
    const action = url.searchParams.get('action') || ''
    const targetType = url.searchParams.get('targetType') || ''
    const offset = (page - 1) * limit

    let whereClause = 'WHERE 1=1'
    const params: unknown[] = []
    let paramIndex = 1

    if (action) {
      whereClause += ` AND action = $${paramIndex}`
      params.push(action)
      paramIndex++
    }
    if (targetType) {
      whereClause += ` AND target_type = $${paramIndex}`
      params.push(targetType)
      paramIndex++
    }

    const countQuery = `SELECT count(*)::int AS total FROM audit_log ${whereClause}`
    const countRes = await pool.query(countQuery, params)
    const total = countRes.rows[0].total

    const dataQuery = `
      SELECT al.*, a.email as admin_email, a.username as admin_username
      FROM audit_log al
      LEFT JOIN admins a ON a.id = al.admin_id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)
    const dataRes = await pool.query(dataQuery, params)

    return json({
      logs: dataRes.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  }

  return null
}