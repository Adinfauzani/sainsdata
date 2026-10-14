'use client'

import Link from 'next/link'
import { useAuth } from '@/context/auth'
import { cn } from '@/lib/utils'

interface UserAvatarLinkProps {
  /** Show the display name next to the avatar (used in the mobile drawer). */
  showLabel?: boolean
  /** Called right after the link is activated (e.g. to close the mobile drawer). */
  onNavigate?: () => void
  className?: string
}

/**
 * Logged-in indicator for the public navbar: a single avatar that links to the
 * account page (`/{username}`). Every role — `user`, `admin`, `sudo` — lands on
 * the profile; the profile itself exposes the dashboard entry for admins.
 */
export function UserAvatarLink({ showLabel = false, onNavigate, className }: UserAvatarLinkProps) {
  const { admin, profile } = useAuth()
  if (!admin) return null

  const displayName = profile?.name || admin.username
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <Link
      href={`/${encodeURIComponent(admin.username)}`}
      onClick={onNavigate}
      aria-label={`Buka profil ${displayName}`}
      title={displayName}
      className={cn(
        'flex items-center rounded-full outline-none transition-colors',
        'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/60',
        showLabel ? 'w-full gap-2 rounded-lg px-2 py-1.5' : 'p-0.5',
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-1 ring-border">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="size-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initial
        )}
      </span>
      {showLabel ? <span className="truncate text-sm font-medium">{displayName}</span> : null}
    </Link>
  )
}
