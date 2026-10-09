import { handleApi } from '@/lib/api-handler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const res = await handleApi(req, '/api/audit-log')
  return res ?? new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan' }), { status: 404 })
}