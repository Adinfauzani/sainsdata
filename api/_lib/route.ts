import { handleApi, json } from '../../server/handler'

export async function route(req: Request): Promise<Response> {
  const path = new URL(req.url).pathname
  const res = await handleApi(req, path)
  return res ?? json({ error: 'Endpoint tidak ditemukan' }, 404)
}