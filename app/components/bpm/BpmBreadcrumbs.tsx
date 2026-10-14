import { Fragment } from 'react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getBpmBreadcrumbs } from '@/data/bpm'
import { cn } from '@/lib/utils'

interface BpmBreadcrumbsProps {
  pathname: string
  className?: string
}

export function BpmBreadcrumbs({ pathname, className }: BpmBreadcrumbsProps) {
  const crumbs = getBpmBreadcrumbs(pathname)

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={`${crumb.label}-${index}`}>
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

interface BpmBreadcrumbsBarProps {
  pathname: string
  className?: string
}

/** Breadcrumbs wrapped in the shared page container. */
export function BpmBreadcrumbsBar({ pathname, className }: BpmBreadcrumbsBarProps) {
  return (
    <div className={cn('border-b border-border', className)}>
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <BpmBreadcrumbs pathname={pathname} />
      </div>
    </div>
  )
}
