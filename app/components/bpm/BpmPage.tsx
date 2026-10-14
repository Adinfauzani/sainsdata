import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { BpmBreadcrumbsBar } from '@/components/bpm/BpmBreadcrumbs'
import { BpmCategoryGrid } from '@/components/bpm/BpmCategoryGrid'
import { BpmDocumentExplorer } from '@/components/bpm/BpmDocumentExplorer'
import { DocumentEmptyState } from '@/components/bpm/DocumentEmptyState'
import type { DocumentCategoryOption } from '@/components/bpm/DocumentSearch'
import {
  getBpmChildren,
  getBpmDocuments,
  getBpmRoute,
  type BpmCategoryId,
  type BpmDocument,
} from '@/data/bpm'

const categoryLabels: Record<BpmCategoryId, string> = {
  profil: 'Profil',
  spmi: 'SPMI',
  ppepp: 'PPEPP',
  'dokumen-spmi': 'Dokumen SPMI',
  'dokumen-bpm': 'Dokumen BPM',
  spme: 'SPME',
}

interface BpmPageProps {
  pathname: string
}

/**
 * Shared renderer for every entry in the BPM route registry. Route files stay
 * thin: they only declare metadata and hand their pathname to this component.
 */
export function BpmPage({ pathname }: BpmPageProps) {
  const route = getBpmRoute(pathname)
  if (!route) return null

  const children = getBpmChildren(pathname)
  const directDocuments = getBpmDocuments(pathname)

  const childDocuments: BpmDocument[] = children.flatMap((child) => getBpmDocuments(child.pathname))
  const documents = [...directDocuments, ...childDocuments]

  const categoryOptions: DocumentCategoryOption[] = children.map((child) => ({
    id: child.pathname,
    label: child.title,
  }))

  return (
    <article>
      <BpmBreadcrumbsBar pathname={pathname} />

      <PageHeader
        eyebrow={categoryLabels[route.category]}
        title={route.title}
        description={route.description}
        className="pt-4 sm:pt-6"
      />

      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {children.length > 0 ? (
          <section aria-labelledby="subbagian-heading" className="space-y-5">
            <h2 id="subbagian-heading" className="text-lg font-semibold tracking-tight">
              Subbagian
            </h2>
            <BpmCategoryGrid nodes={children} />
          </section>
        ) : null}

        <section aria-labelledby="dokumen-heading" className="space-y-5">
          <div className="space-y-1.5">
            <h2 id="dokumen-heading" className="text-lg font-semibold tracking-tight">
              Dokumen
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Dokumen disajikan sesuai sumber resmi BPM. Sebagian berkas tersimpan pada penyimpanan
              eksternal dan dibuka melalui tautan penyedianya.
            </p>
          </div>

          {documents.length > 0 ? (
            <BpmDocumentExplorer documents={documents} categories={categoryOptions} />
          ) : (
            <DocumentEmptyState
              title="Belum ada dokumen"
              description="Dokumen untuk bagian ini belum tersedia atau belum dipublikasikan. Silakan periksa kembali nanti."
              action={
                <Link
                  href={route.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  Lihat sumber resmi
                </Link>
              }
            />
          )}
        </section>

        <footer className="border-t border-border pt-5">
          <Link
            href={route.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Sumber: situs resmi BPM Universitas Saintek Muhammadiyah
          </Link>
        </footer>
      </div>
    </article>
  )
}
