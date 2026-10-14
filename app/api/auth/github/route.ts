import { handleApi } from '@/lib/api-handler'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const res = await handleApi(req, '/api/auth/github')
  return res ?? new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan' }), { status: 404 })
}
