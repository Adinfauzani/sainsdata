import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { BpmRouteNode } from '@/data/bpm'

interface BpmCategoryGridProps {
  nodes: BpmRouteNode[]
}

export function BpmCategoryGrid({ nodes }: BpmCategoryGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {nodes.map((node) => (
        <li key={node.id} className="h-full">
          <Link
            href={node.pathname}
            className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <Card className="flex h-full flex-col transition-colors group-hover:border-primary/40">
              <CardHeader>
                <h3 className="text-sm font-semibold">{node.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {node.description}
                </p>
              </CardHeader>
              <CardContent className="mt-auto">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Buka halaman
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}
