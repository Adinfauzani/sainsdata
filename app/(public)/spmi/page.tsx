'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FolderTree, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tree } from '@/components/navigation/Tree'
import { PageHeader } from '@/components/PageHeader'
import { spmiCategories, spmiDocuments } from '@/data/spmi'
import type { SpmiDocument } from '@/types'
import Link from 'next/link'

const treeNodes = spmiCategories.map((category) => ({
  id: `spmi-${category.id}`,
  label: category.nama,
  meta: String(spmiDocuments.filter((doc) => doc.categoryId === category.id).length),
  href: `/spmi?kategori=${category.id}`,
}))

function statusBadge(status: SpmiDocument['status']) {
  if (status === 'Berlaku') return <Badge variant="secondary">{status}</Badge>
  return <Badge variant="outline">{status}</Badge>
}

function SpmiContent() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const kategori = searchParams.get('kategori') ?? spmiCategories[0].id
  const activeCategory =
    spmiCategories.find((category) => category.id === kategori) ?? spmiCategories[0]
  const docs = spmiDocuments.filter((doc) => doc.categoryId === activeCategory.id)

  const selectCategory = (id: string) => {
    window.location.href = id === spmiCategories[0].id ? '/spmi' : `/spmi?kategori=${id}`
  }

  const tree = (
    <Tree
      nodes={treeNodes}
      activeId={`spmi-${activeCategory.id}`}
      onNodeSelect={(node) => {
        const id = node.id.replace(/^spmi-/, '')
        selectCategory(id)
        setOpen(false)
      }}
      aria-label="Kategori SPMI"
    />
  )

  return (
    <>
      <PageHeader
        eyebrow="SPMI"
        title="Dokumen Sistem Penjaminan Mutu Internal"
        description="Kebijakan, manual, standar, formulir, dan dokumen pendukung yang mengatur siklus mutu Plan-Do-Check-Act."
      />

      <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-[17rem_1fr]">
        <aside className="hidden border-e border-border lg:block">
          <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto px-3 py-5">
            <p className="px-1.5 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Kategori
            </p>
            {tree}
          </div>
        </aside>

        <div className="min-w-0 px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                {docs.length} dokumen
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                {activeCategory.nama}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {activeCategory.deskripsi}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <FolderTree className="size-4" />
              Pilih kategori
            </Button>
          </div>

          <Separator className="my-6" />

          <ul className="space-y-4">
            {docs.map((doc) => (
              <li key={doc.id} className="rounded-xl border border-border p-5 transition-colors hover:border-primary/40">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{doc.judul}</h3>
                      {statusBadge(doc.status)}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {doc.deskripsi}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                    {doc.fileType}
                  </span>
                </div>

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-3 text-xs">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Nomor</dt>
                    <dd className="font-mono tabular-nums">{doc.nomor}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Tahun</dt>
                    <dd className="font-mono tabular-nums">{doc.tahun}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Jenis</dt>
                    <dd>{doc.jenis}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-muted-foreground">
            Dokumen dapat diminta salinannya melalui{' '}
            <Link href="/contact" className="text-primary hover:underline">
              halaman kontak
            </Link>
            .
          </p>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-80 max-w-[85vw] flex-col gap-0 p-0">
          <SheetHeader className="flex-row items-center justify-between border-b border-border px-4 py-3.5">
            <SheetTitle className="text-sm">Kategori SPMI</SheetTitle>
            <Button variant="ghost" size="icon-sm" aria-label="Tutup" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-3">{tree}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default function Spmi() {
  return (
    <Suspense fallback={<div>Memuat…</div>}>
      <SpmiContent />
    </Suspense>
  )
}