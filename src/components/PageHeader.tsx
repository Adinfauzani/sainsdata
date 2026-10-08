import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ eyebrow, title, description, children, className }: PageHeaderProps) {
  return (
    <header className={cn('border-b border-border px-4 py-10 sm:px-6', className)}>
      <div className="mx-auto w-full max-w-7xl">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  )
}
