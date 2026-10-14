'use client'

import { useState } from 'react'
import { Download, ExternalLink, File, FileText, FolderOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PdfViewer } from '@/components/bpm/PdfViewer'
import type { BpmDocument } from '@/data/bpm'
import { cn } from '@/lib/utils'

interface DocumentCardProps {
  document: BpmDocument
  /** Human readable category label shown as a badge. */
  categoryLabel?: string
  className?: string
}

function formatSize(bytes?: number): string | null {
  if (!bytes || bytes <= 0) return null
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`
}

function typeLabel(document: BpmDocument): string {
  if (document.kind === 'folder') return 'Folder Google Drive'
  if (document.mimeType === 'application/pdf') return 'PDF'
  const ext = document.fileUrl.split('.').pop()
  return ext && ext.length <= 5 ? ext.toUpperCase() : 'Dokumen'
}

export function DocumentCard({ document, categoryLabel, className }: DocumentCardProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const isFolder = document.kind === 'folder'
  const isPdf = document.mimeType === 'application/pdf'
  const Icon = isFolder ? FolderOpen : isPdf ? FileText : File
  const size = formatSize(document.fileSize)

  return (
    <Card className={cn('flex h-full flex-col transition-colors hover:border-primary/40', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              {categoryLabel ? (
                <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  {categoryLabel}
                </span>
              ) : null}
              <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold">{document.title}</h3>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            {typeLabel(document)}
          </Badge>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {document.description}
        </p>
      </CardHeader>

      <CardContent className="mt-auto space-y-4">
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          {size ? (
            <div className="flex gap-1.5">
              <dt>Ukuran</dt>
              <dd className="font-mono tabular-nums text-foreground/80">{size}</dd>
            </div>
          ) : null}
          {document.updatedAt ? (
            <div className="flex gap-1.5">
              <dt>Diperbarui</dt>
              <dd className="font-mono tabular-nums text-foreground/80">{document.updatedAt}</dd>
            </div>
          ) : null}
        </dl>

        <div className="flex flex-wrap gap-2">
          {isFolder ? (
            <Button asChild size="sm" variant="outline" className="flex-1">
              <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Buka Folder
              </a>
            </Button>
          ) : (
            <>
              {isPdf ? (
                <Button size="sm" className="flex-1" onClick={() => setViewerOpen(true)}>
                  <FileText className="size-4" />
                  Lihat Dokumen
                </Button>
              ) : (
                <Button asChild size="sm" className="flex-1">
                  <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    Buka Dokumen
                  </a>
                </Button>
              )}
              <Button asChild size="sm" variant="outline">
                <a href={document.fileUrl} download>
                  <Download className="size-4" />
                  Unduh
                </a>
              </Button>
            </>
          )}
        </div>
      </CardContent>

      {isPdf ? (
        <PdfViewer
          url={document.fileUrl}
          title={document.title}
          mimeType={document.mimeType}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
        />
      ) : null}
    </Card>
  )
}
