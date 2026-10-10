'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/auth'

export default function Register() {
  const { admin, loading, register } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && admin) {
    router.replace('/dashboard')
    return null
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }
    setSubmitting(true)
    try {
      await register(email, username, password)
      router.replace('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendaftar')
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
          <CardTitle className="text-xl">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Buat akun untuk mengakses portal akreditasi Sains Data.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="username"
                required
                minLength={3}
                maxLength={30}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@domain.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {error ? (
              <p className="text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Memproses…' : 'Daftar'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}