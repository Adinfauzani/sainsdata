import bcrypt from 'bcryptjs'
import { Client } from 'pg'

const dbUrlNonPool = process.env.DATABASE_URL_NON_POOLING

if (!dbUrlNonPool) {
  throw new Error('DATABASE_URL_NON_POOLING harus diisi di .env')
}

async function bootstrap(): Promise<void> {
  const client = new Client({ connectionString: dbUrlNonPool })
  await client.connect()
  try {
    const adminCount = await client.query('SELECT count(*)::int AS n FROM admins')
    if (adminCount.rows[0].n === 0) {
      const email = 'sudo@saintekmu.ac.id'
      const username = 'sudo'
      const password = process.env.ADMIN_PASSWORD ?? 'admin123'
      const hash = bcrypt.hashSync(password, 10)
      await client.query(
        'INSERT INTO admins (email, username, password_hash, role) VALUES ($1, $2, $3, $4)',
        [email, username, hash, 'sudo']
      )
      console.log(`[bootstrap] sudo admin dibuat — email: ${email}, password: ${password}`)
    } else {
      const defaultAdmin = await client.query(
        'SELECT id, password_hash FROM admins WHERE email = $1 ORDER BY id LIMIT 1',
        ['sudo@saintekmu.ac.id']
      )
      const existing = defaultAdmin.rows[0]
      if (existing && !existing.password_hash.startsWith('$2')) {
        const password = process.env.ADMIN_PASSWORD ?? 'admin123'
        const hash = bcrypt.hashSync(password, 10)
        await client.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [
          hash,
          existing.id,
        ])
        console.log('[bootstrap] password default admin dimigrasikan ke bcrypt')
      } else {
        console.log('[bootstrap] sudo admin sudah ada')
      }
    }
  } finally {
    await client.end()
  }
}

await bootstrap()