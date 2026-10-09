import { handleApi } from '@/lib/api-handler'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const res = await handleApi(req, '/api/instrumen/children')
  return res ?? new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan' }), { status: 404 })
}

export async function PUT(req: NextRequest) {
  const res = await handleApi(req, '/api/instrumen/children')
  return res ?? new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan' }), { status: 404 })
}

export async function DELETE(req: NextRequest) {
  const res = await handleApi(req, '/api/instrumen/children')
  return res ?? new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan' }), { status: 404 })
}