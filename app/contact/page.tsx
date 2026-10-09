import { Mail, MapPin, Phone, Clock, Globe, Navigation } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { institution } from '@/data/profile'

const channels = [
  {
    icon: MapPin,
    label: 'Alamat',
    value: institution.alamat,
    href: institution.mapsUrl,
    external: true,
  },
  {
    icon: Phone,
    label: 'Telepon',
    value: institution.telepon,
    href: `tel:${institution.telepon.replace(/[^0-9+]/g, '')}`,
    external: false,
  },
  {
    icon: Mail,
    label: 'Email',
    value: institution.email,
    href: `mailto:${institution.email}`,
    external: false,
  },
  {
    icon: Globe,
    label: 'Website',
    value: institution.website.replace('https://saintekmu.ac.id', ''),
    href: institution.website,
    external: true,
  },
  {
    icon: Clock,
    label: 'Jam Layanan',
    value: institution.jamLayanan,
    href: null,
    external: false,
  },
]

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Hubungi Kami"
        description="Pertanyaan seputar dokumen akreditasi, SPMI, dan permintaan salinan dokumen dapat disampaikan melalui kanal berikut."
      />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="kanal-heading">
          <h2 id="kanal-heading" className="text-xs font-semibold tracking-widest text-primary uppercase">
            Kanal Kontak
          </h2>

          <ul className="mt-4 space-y-3">
            {channels.map((channel) => {
              const body = (
                <span className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-primary">
                    <channel.icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                      {channel.label}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed font-medium">
                      {channel.value}
                    </span>
                  </span>
                </span>
              )

              return (
                <li key={channel.label}>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      target={channel.external ? '_blank' : undefined}
                      rel={channel.external ? 'noreferrer' : undefined}
                      className="block rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="rounded-xl border border-border p-4">{body}</div>
                  )}
                </li>
              )
            })}
          </ul>

          <a
            href={institution.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Navigation className="size-4" aria-hidden />
            Buka Petunjuk Arah
          </a>
        </section>

        <section aria-labelledby="peta-heading">
          <h2 id="peta-heading" className="text-xs font-semibold tracking-widest text-primary uppercase">
            Peta Lokasi
          </h2>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <iframe
              title="Peta lokasi Universitas Saintek Muhammadiyah"
              src="https://www.google.com/maps?q=Jl.+Raya+Klp.+Dua+Wetan+No.17,+Klp.+Dua+Wetan,+Ciracas,+Jakarta+Timur,+DKI+Jakarta+13730&output=embed"
              className="h-80 w-full border-0 lg:h-[26rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Kampus {institution.nama} - {institution.alamat}.
          </p>
        </section>
      </div>
    </>
  )
}