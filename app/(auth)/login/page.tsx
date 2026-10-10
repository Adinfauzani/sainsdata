'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/auth'

export default function Login() {
  const { admin, loading, login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && admin) {
    router.replace('/dashboard')
    return null
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      router.replace('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <span className="mb-2 flex size-9 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            SD
          </span>
          <CardTitle className="text-xl">Masuk ke Dashboard</CardTitle>
          <CardDescription>
            Gunakan email dan password admin Anda untuk mengelola data akreditasi.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@saintekmu.ac.id"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Memproses…' : 'Masuk'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/daftar" className="font-medium text-primary hover:underline">
              Daftar di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}