import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { institution, programStudi, strukturOrganisasi } from '@/data/profile'
import type { OrgNode } from '@/types'

function SectionTitle({ children, id }: { children: string; id: string }) {
  return (
    <h2 id={id} className="text-xs font-semibold tracking-widest text-primary uppercase">
      {children}
    </h2>
  )
}

function OrgList({ nodes, depth = 0 }: { nodes: OrgNode[]; depth?: number }) {
  return (
    <ul className={depth === 0 ? 'space-y-3' : 'ms-6 space-y-3 border-s border-border ps-6'}>
      {nodes.map((node) => (
        <li key={node.id}>
          <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-sm font-semibold">{node.jabatan}</p>
            <p className="text-sm text-muted-foreground">{node.nama}</p>
          </div>
          {node.children ? <div className="mt-3"><OrgList nodes={node.children} depth={depth + 1} /></div> : null}
        </li>
      ))}
    </ul>
  )
}

export default function Profile() {
  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Profil Sains Data"
        description="Informasi umum, program studi, dan struktur organisasi penjaminan mutu di lingkungan Universitas Saintek Muhammadiyah."
      />

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6">
        <section aria-labelledby="tentang-heading" className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div>
            <SectionTitle id="tentang-heading">Tentang</SectionTitle>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-base">
              {institution.tentang}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Berdiri {institution.tahunBerdiri}</Badge>
              <Badge variant="secondary">{programStudi.length} Program Studi</Badge>
              <Badge variant="secondary">Akreditasi {institution.statusAkreditasi}</Badge>
            </div>
          </div>

          <dl className="divide-y divide-border self-start rounded-xl border border-border">
            {[
              ['Nama Institusi', institution.nama],
              ['Status Akreditasi', institution.statusAkreditasi],
              ['Nomor SK', institution.statusAkreditasiSk],
              ['Berlaku Hingga', institution.statusAkreditasiBerlaku],
              ['Tahun Berdiri', String(institution.tahunBerdiri)],
            ].map(([label, value]) => (
              <div key={label} className="px-4 py-3">
                <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="visi-heading">
          <SectionTitle id="visi-heading">Visi, Misi, dan Tujuan</SectionTitle>

          <blockquote className="mt-4 rounded-xl border-s-4 border-primary bg-muted/50 px-5 py-4 text-base leading-relaxed font-medium">
            {institution.visi}
          </blockquote>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Misi</h3>
              <ol className="mt-3 space-y-2.5">
                {institution.misi.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <span className="mt-0.5 font-mono text-xs text-primary tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Tujuan</h3>
              <ul className="mt-3 space-y-2.5">
                {institution.tujuan.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="prodi-heading">
          <SectionTitle id="prodi-heading">Program Studi</SectionTitle>

          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-start">
                  <th scope="col" className="px-4 py-3 text-start text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    No.
                  </th>
                  <th scope="col" className="px-4 py-3 text-start text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Program Studi
                  </th>
                  <th scope="col" className="px-4 py-3 text-start text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Jenjang
                  </th>
                  <th scope="col" className="px-4 py-3 text-start text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Fakultas
                  </th>
                  <th scope="col" className="px-4 py-3 text-start text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Akreditasi
                  </th>
                  <th scope="col" className="px-4 py-3 text-start text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Tahun
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {programStudi.map((prodi, index) => (
                  <tr key={prodi.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3 font-medium">{prodi.nama}</td>
                    <td className="px-4 py-3 text-muted-foreground">{prodi.jenjang}</td>
                    <td className="px-4 py-3 text-muted-foreground">{prodi.fakultas}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{prodi.akreditasi}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums">
                      {prodi.tahunAkreditasi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="struktur-heading">
          <SectionTitle id="struktur-heading">Struktur Organisasi</SectionTitle>
          <div className="mt-4">
            <OrgList nodes={strukturOrganisasi} />
          </div>
        </section>
      </div>
    </>
  )
}