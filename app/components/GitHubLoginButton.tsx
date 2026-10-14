import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/icons/github'

interface GitHubLoginButtonProps {
  disabled?: boolean
  className?: string
}

/**
 * Starts the server-side GitHub OAuth flow. Rendering a plain anchor means the
 * browser performs a full navigation to the provider, as OAuth requires.
 */
export function GitHubLoginButton({ disabled = false, className }: GitHubLoginButtonProps) {
  if (disabled) {
    return (
      <Button type="button" variant="outline" className={className} disabled>
        <GitHubIcon className="size-4" />
        Masuk dengan GitHub
      </Button>
    )
  }

  return (
    <Button asChild variant="outline" className={className}>
      <a href="/api/auth/github">
        <GitHubIcon className="size-4" />
        Masuk dengan GitHub
      </a>
    </Button>
  )
}
