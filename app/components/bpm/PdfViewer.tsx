'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PdfViewerProps {
  /** URL of the document to render. */
  url: string
  title: string
  /** Optional MIME type; non-PDF types fall back to a new-tab link. */
  mimeType?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Minimal, dependency-free PDF viewer. Uses the browser-native PDF renderer in
 * an iframe, so no PDF.js bundle is shipped. Supports an always-available
 * download action and an "open in a new tab" fallback for unsupported files.
 */
export function PdfViewer({ url, title, mimeType, open, onOpenChange }: PdfViewerProps) {
  const [failed, setFailed] = useState(false)
  const isPdf = !mimeType || mimeType === 'application/pdf'

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setFailed(false)
        onOpenChange(next)
      }}
    >
      <DialogContent className="flex h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] max-w-5xl flex-col gap-3 overflow-hidden p-4 sm:p-5">
        <DialogHeader className="pe-10">
          <DialogTitle className="line-clamp-1">{title}</DialogTitle>
          <DialogDescription>
            Pratinjau dokumen. Gunakan tombol unduh atau buka di tab baru bila pratinjau tidak tampil.
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-muted/30">
          {isPdf && !failed ? (
            <iframe
              src={url}
              title={title}
              className="size-full"
              onError={() => setFailed(true)}
            />
          ) : null}

          {(!isPdf || failed) && (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {failed
                  ? 'Dokumen tidak dapat ditampilkan di dalam halaman.'
                  : 'Format file ini tidak mendukung pratinjau di dalam halaman.'}
              </p>
              <Button asChild variant="outline" size="sm">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" />
                  Buka di tab baru
                </a>
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button asChild variant="ghost" size="sm">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              Buka di tab baru
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={url} download>
              Unduh dokumen
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
