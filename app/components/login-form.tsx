'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { GitHubLoginButton } from '@/components/GitHubLoginButton'
import { useAuth } from '@/context/auth'

interface LoginFormProps extends React.ComponentProps<'div'> {
  /** Pre-filled message when the OAuth callback redirects with `?error=`. */
  oauthError?: string | null
}

export function LoginForm({ className, oauthError, ...props }: LoginFormProps) {
  const { admin, loading, login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && admin) {
    router.replace(admin.role === 'user' ? `/${encodeURIComponent(admin.username)}` : '/dashboard')
    return null
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await login(email, password)
      router.replace(user.role === 'user' ? `/${encodeURIComponent(user.username)}` : '/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="flex flex-col items-center gap-2 font-medium">
              <img src="/favicon.png" alt="Sains Data" className="size-8 rounded-md" />
            </Link>
            <h1 className="text-xl font-bold">Masuk ke Dashboard</h1>
            <FieldDescription>
              Belum punya akun?{' '}
              <Link href="/daftar" className="underline underline-offset-4 hover:text-primary">
                Daftar
              </Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="admin@saintekmu.ac.id"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          <FieldError>{error ?? oauthError}</FieldError>
          <Field>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Memproses…' : 'Masuk'}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">atau</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GitHubLoginButton className="w-full" />
    </div>
  )
}
