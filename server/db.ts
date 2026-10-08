import { Client, Pool } from 'pg'
import { instrumenSections } from '../src/data/instrumen'

const dbUrl = process.env.DATABASE_URL
const dbUrlNonPool = process.env.DATABASE_URL_NON_POOLING

if (!dbUrl || !dbUrlNonPool) {
  throw new Error('DATABASE_URL dan DATABASE_URL_NON_POOLING harus diisi di .env')
}

export const pool = new Pool({ connectionString: dbUrl, max: 5 })

export async function migrate(): Promise<void> {
  const sql = await Bun.file(`${import.meta.dir}/schema.sql`).text()
  const client = new Client({ connectionString: dbUrlNonPool })
  await client.connect()
  try {
    await client.query(sql)
  } finally {
    await client.end()
  }
}

export async function seed(): Promise<void> {
  const adminCount = await pool.query('SELECT count(*)::int AS n FROM admins')
  if (adminCount.rows[0].n === 0) {
    const username = 'admin'
    const password = process.env.ADMIN_PASSWORD ?? 'admin123'
    const hash = await Bun.password.hash(password)
    await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [
      username,
      hash,
    ])
    console.log(`[seed] admin dibuat — username: ${username}, password: ${password}`)
  }

  for (const section of instrumenSections) {
    await pool.query(
      `INSERT INTO instrumen_sections (no, nama) VALUES ($1, $2)
       ON CONFLICT (no) DO UPDATE SET nama = EXCLUDED.nama`,
      [section.no, section.nama]
    )
    for (const row of section.rows) {
      await pool.query(
        `INSERT INTO instrumen_rows (section_no, row_no, row_id, sub_kriteria, indikator, penjelasan_prodi)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (section_no, row_id) DO UPDATE SET
           row_no = EXCLUDED.row_no,
           sub_kriteria = EXCLUDED.sub_kriteria,
           indikator = EXCLUDED.indikator,
           penjelasan_prodi = EXCLUDED.penjelasan_prodi`,
        [section.no, row.no, row.id, row.subKriteria, row.indikator, row.penjelasanProdi ?? null]
      )
    }
  }

  const { rows: deleted } = await pool.query(
    `DELETE FROM instrumen_children
     WHERE doc IS NULL AND file_name IS NULL AND file_url IS NULL
     RETURNING child_no`
  )
  if (deleted.length > 0) {
    console.log(`[seed] ${deleted.length} anak placeholder dihapus`)
  }
  console.log('[seed] data instrumen disinkronkan dari src/data/instrumen.ts')
}
