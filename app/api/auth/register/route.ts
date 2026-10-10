import { handleApi } from '@/lib/api-handler'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const res = await handleApi(req, '/api/auth/register')
  return res ?? new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan' }), { status: 404 })
}