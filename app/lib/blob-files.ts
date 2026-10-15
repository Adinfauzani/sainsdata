import { put, type PutBlobResult } from '@vercel/blob'

/**
 * Store Blob dari dashboard Vercel sekarang default-nya *private*, sedangkan
 * store lama *public*. Mode akses tidak bisa diubah setelah store dibuat, jadi
 * kita coba `private` lebih dulu lalu jatuh ke `public` — kode tetap jalan di
 * kedua jenis store tanpa konfigurasi tambahan.
 */
function isAccessMismatch(err: unknown) {
  const raw = err instanceof Error ? err.message : ''
  return /access on a (private|public) store/i.test(raw)
}

export async function putBlobFile(
  pathname: string,
  file: File,
  contentType?: string
): Promise<PutBlobResult> {
  const options = {
    addRandomSuffix: false,
    contentType: contentType || undefined,
  }

  try {
    return await put(pathname, file, { ...options, access: 'private' })
  } catch (err) {
    if (!isAccessMismatch(err)) throw err
    return put(pathname, file, { ...options, access: 'public' })
  }
}

/**
 * Mode akses tersimpan di dalam URL yang dikembalikan `put()`:
 * `xxxx.public.blob.vercel-storage.com` atau `xxxx.private.blob.vercel-storage.com`.
 */
export function blobAccessFromUrl(url: string): 'public' | 'private' {
  return url.includes('.private.blob.') ? 'private' : 'public'
}

/** `pathname` (kunci objek di dalam store) dari URL Vercel Blob. */
export function blobPathnameFromUrl(url: string) {
  try {
    return new URL(url).pathname.replace(/^\//, '')
  } catch {
    return url.replace(/^\//, '')
  }
}
