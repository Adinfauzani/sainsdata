import type { Metadata } from 'next'

/**
 * Centralized BPM information architecture + document registry.
 *
 * Source of truth: the official BPM Google Site
 * https://sites.google.com/view/bpmsaintekmu
 *
 * Navigation, breadcrumbs, page metadata and document listings are all derived
 * from this file so route strings live in exactly one place. Content is kept in
 * Indonesian to match the rest of the portal.
 */

export type BpmCategoryId = 'profil' | 'spmi' | 'ppepp' | 'dokumen-spmi' | 'dokumen-bpm' | 'spme'

export interface BpmBreadcrumb {
  label: string
  href?: string
}

export interface BpmRouteNode {
  /** Stable identifier used by navigation and tests. */
  id: string
  /** Application path, e.g. `/bpm/spmi/pedoman-ami`. */
  pathname: string
  /** Short label for menus. */
  navLabel: string
  /** Full page/heading title. */
  title: string
  /** Short, descriptive summary shown under the page title. */
  description: string
  category: BpmCategoryId
  /** Traceability link to the corresponding page on the reference site. */
  referenceUrl: string
  isPublished: boolean
  children?: BpmRouteNode[]
}

export type BpmDocumentKind = 'file' | 'folder'
export type BpmDocumentProvider = 'local' | 'google-drive'

export interface BpmDocument {
  id: string
  slug: string
  title: string
  description: string
  /** Pathname of the owning BPM route. */
  category: string
  fileUrl: string
  mimeType: string
  provider: BpmDocumentProvider
  /** `file` opens in the in-app viewer; `folder` links out to the source. */
  kind: BpmDocumentKind
  fileSize?: number
  publishedAt?: string
  updatedAt?: string
  isPublished: boolean
  tags?: string[]
}

export const REFERENCE_BASE = 'https://sites.google.com/view/bpmsaintekmu'

const driveFolder = (id: string) => `https://drive.google.com/drive/folders/${id}`
const driveMime = 'application/vnd.google-apps.folder'

/* -------------------------------------------------------------------------- */
/* Route registry                                                             */
/* -------------------------------------------------------------------------- */

export const bpmNavigation: BpmRouteNode[] = [
  {
    id: 'profil',
    pathname: '/bpm/profile',
    navLabel: 'Profil',
    title: 'Profil Badan Penjaminan Mutu',
    description:
      'Tentang BPM, visi, misi, tujuan, dan struktur organisasi Badan Penjaminan Mutu Universitas Saintek Muhammadiyah.',
    category: 'profil',
    referenceUrl: `${REFERENCE_BASE}/profil`,
    isPublished: true,
  },
  {
    id: 'spmi',
    pathname: '/bpm/spmi',
    navLabel: 'SPMI',
    title: 'SPMI',
    description:
      'Sistem Penjaminan Mutu Internal: pedoman dan dokumen pelaksanaan Audit Mutu Internal, monitoring, evaluasi, serta tindak lanjut di Universitas Saintek Muhammadiyah.',
    category: 'spmi',
    referenceUrl: `${REFERENCE_BASE}/spmi`,
    isPublished: true,
    children: [
      {
        id: 'spmi-pedoman-ami',
        pathname: '/bpm/spmi/pedoman-ami',
        navLabel: 'Pedoman AMI',
        title: 'Pedoman Audit Mutu Internal (AMI)',
        description: 'Pedoman dan acuan pelaksanaan Audit Mutu Internal di lingkungan Universitas Saintek Muhammadiyah.',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/pedoman-ami`,
        isPublished: true,
      },
      {
        id: 'spmi-ami-program-studi',
        pathname: '/bpm/spmi/ami-program-studi',
        navLabel: '(AMI) Program Studi',
        title: 'AMI Program Studi',
        description: 'Dokumen pelaksanaan Audit Mutu Internal pada program studi di lingkungan universitas.',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/ami-program-studi`,
        isPublished: true,
      },
      {
        id: 'spmi-ami-unit-kerja',
        pathname: '/bpm/spmi/ami-unit-kerja',
        navLabel: '(AMI) Unit Kerja',
        title: 'AMI Unit Kerja',
        description: 'Dokumen pelaksanaan Audit Mutu Internal pada unit kerja di lingkungan universitas.',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/ami-unit-kerja`,
        isPublished: true,
      },
      {
        id: 'spmi-survei-kepuasan-mahasiswa',
        pathname: '/bpm/spmi/survei-kepuasan-mahasiswa',
        navLabel: 'Survei Kepuasan Mahasiswa',
        title: 'Survei Kepuasan Mahasiswa',
        description: 'Instrumen dan hasil survei kepuasan mahasiswa terhadap layanan pendidikan di universitas.',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/survei-kepuasan-mahasiswa`,
        isPublished: true,
      },
      {
        id: 'spmi-evaluasi-pmb',
        pathname: '/bpm/spmi/evaluasi-pmb',
        navLabel: 'Evaluasi PMB',
        title: 'Evaluasi PMB (Penerimaan Mahasiswa Baru)',
        description: 'Dokumen evaluasi penyelenggaraan Penerimaan Mahasiswa Baru.',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/evaluasi-pmb-penerimaan-mahasiswa-baru`,
        isPublished: true,
      },
      {
        id: 'spmi-monev-pembelajaran',
        pathname: '/bpm/spmi/monev-pembelajaran',
        navLabel: 'Monev Pembelajaran',
        title: 'Monitoring dan Evaluasi Pembelajaran',
        description: 'Dokumen monitoring dan evaluasi pelaksanaan pembelajaran pada program studi.',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/monev-pembelajaran`,
        isPublished: true,
      },
      {
        id: 'spmi-evaluasi-ketercapaian-standar',
        pathname: '/bpm/spmi/evaluasi-ketercapaian-standar',
        navLabel: 'Evaluasi Ketercapaian Standar',
        title: 'Evaluasi Ketercapaian Standar',
        description: 'Dokumen evaluasi ketercapaian standar mutu pendidikan tinggi di universitas.',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/evaluasi-ketercapaian-standar`,
        isPublished: true,
      },
      {
        id: 'spmi-rtm-dan-rtl',
        pathname: '/bpm/spmi/rtm-dan-rtl',
        navLabel: 'RTM dan RTL',
        title: 'RTM dan RTL',
        description: 'Dokumen Rapat Tinjauan Manajemen (RTM) dan Rencana Tindak Lanjut (RTL).',
        category: 'spmi',
        referenceUrl: `${REFERENCE_BASE}/spmi/rtm-dan-rtl`,
        isPublished: true,
      },
    ],
  },
  {
    id: 'ppepp',
    pathname: '/bpm/ppepp',
    navLabel: 'PPEPP',
    title: 'Siklus PPEPP',
    description:
      'Siklus Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan sebagai kerangka penjaminan mutu internal.',
    category: 'ppepp',
    referenceUrl: `${REFERENCE_BASE}/ppepp`,
    isPublished: true,
    children: [
      {
        id: 'ppepp-penetapan',
        pathname: '/bpm/ppepp/penetapan',
        navLabel: 'Penetapan',
        title: 'Penetapan',
        description: 'Tahap penetapan standar dan target mutu dalam siklus PPEPP.',
        category: 'ppepp',
        referenceUrl: `${REFERENCE_BASE}/ppepp/penetapan`,
        isPublished: true,
      },
      {
        id: 'ppepp-pelaksanaan',
        pathname: '/bpm/ppepp/pelaksanaan',
        navLabel: 'Pelaksanaan',
        title: 'Pelaksanaan',
        description: 'Tahap pelaksanaan standar mutu dalam siklus PPEPP.',
        category: 'ppepp',
        referenceUrl: `${REFERENCE_BASE}/ppepp/pelaksanaan`,
        isPublished: true,
      },
      {
        id: 'ppepp-evaluasi',
        pathname: '/bpm/ppepp/evaluasi',
        navLabel: 'Evaluasi',
        title: 'Evaluasi',
        description: 'Tahap evaluasi ketercapaian standar mutu dalam siklus PPEPP.',
        category: 'ppepp',
        referenceUrl: `${REFERENCE_BASE}/ppepp/evaluasi`,
        isPublished: true,
      },
      {
        id: 'ppepp-pengendalian',
        pathname: '/bpm/ppepp/pengendalian',
        navLabel: 'Pengendalian',
        title: 'Pengendalian',
        description: 'Tahap pengendalian dan tindak lanjut hasil evaluasi mutu dalam siklus PPEPP.',
        category: 'ppepp',
        referenceUrl: `${REFERENCE_BASE}/ppepp/pengendalian`,
        isPublished: true,
      },
      {
        id: 'ppepp-peningkatan',
        pathname: '/bpm/ppepp/peningkatan',
        navLabel: 'Peningkatan',
        title: 'Peningkatan',
        description: 'Tahap peningkatan standar mutu secara berkelanjutan dalam siklus PPEPP.',
        category: 'ppepp',
        referenceUrl: `${REFERENCE_BASE}/ppepp/peningkatan`,
        isPublished: true,
      },
    ],
  },
  {
    id: 'dokumen-spmi',
    pathname: '/bpm/dokumen-spmi',
    navLabel: 'Dokumen SPMI',
    title: 'Dokumen SPMI',
    description: 'Kebijakan, manual, standar, dan formulir Sistem Penjaminan Mutu Internal.',
    category: 'dokumen-spmi',
    referenceUrl: `${REFERENCE_BASE}/dokumen-spmi`,
    isPublished: true,
    children: [
      {
        id: 'dokumen-spmi-kebijakan',
        pathname: '/bpm/dokumen-spmi/kebijakan-spmi',
        navLabel: 'Kebijakan SPMI',
        title: 'Kebijakan SPMI',
        description: 'Dokumen kebijakan Sistem Penjaminan Mutu Internal universitas.',
        category: 'dokumen-spmi',
        referenceUrl: `${REFERENCE_BASE}/dokumen-spmi/kebijakan-spmi`,
        isPublished: true,
      },
      {
        id: 'dokumen-spmi-manual',
        pathname: '/bpm/dokumen-spmi/manual-spmi',
        navLabel: 'Manual SPMI',
        title: 'Manual SPMI',
        description: 'Manual pelaksanaan Sistem Penjaminan Mutu Internal universitas.',
        category: 'dokumen-spmi',
        referenceUrl: `${REFERENCE_BASE}/dokumen-spmi/manual-spmi`,
        isPublished: true,
      },
      {
        id: 'dokumen-spmi-standar',
        pathname: '/bpm/dokumen-spmi/standar-spmi',
        navLabel: 'Standar SPMI',
        title: 'Standar SPMI',
        description: 'Standar mutu internal yang berlaku di lingkungan universitas.',
        category: 'dokumen-spmi',
        referenceUrl: `${REFERENCE_BASE}/dokumen-spmi/standar-spmi`,
        isPublished: true,
      },
      {
        id: 'dokumen-spmi-formulir',
        pathname: '/bpm/dokumen-spmi/formulir-spmi',
        navLabel: 'Formulir SPMI',
        title: 'Formulir SPMI',
        description: 'Formulir baku pelaksanaan kegiatan penjaminan mutu internal.',
        category: 'dokumen-spmi',
        referenceUrl: `${REFERENCE_BASE}/dokumen-spmi/formulir-spmi`,
        isPublished: true,
      },
    ],
  },
  {
    id: 'dokumen-bpm',
    pathname: '/bpm/dokumen-bpm',
    navLabel: 'Dokumen BPM',
    title: 'Dokumen BPM',
    description: 'Dokumen kegiatan, Renstra dan Renop, peraturan dan pedoman, serta kalender mutu BPM.',
    category: 'dokumen-bpm',
    referenceUrl: `${REFERENCE_BASE}/dokumen-bpm`,
    isPublished: true,
    children: [
      {
        id: 'dokumen-bpm-kegiatan',
        pathname: '/bpm/dokumen-bpm/dokumen-kegiatan',
        navLabel: 'Dokumen Kegiatan',
        title: 'Dokumen Kegiatan SPMI dan Benchmarking',
        description: 'Dokumen kegiatan SPMI dan benchmarking yang diselenggarakan BPM.',
        category: 'dokumen-bpm',
        referenceUrl: `${REFERENCE_BASE}/dokumen-bpm/dokumen-kegiatan`,
        isPublished: true,
      },
      {
        id: 'dokumen-bpm-renstra-renop',
        pathname: '/bpm/dokumen-bpm/renstra-dan-renop',
        navLabel: 'Renstra dan Renop',
        title: 'Renstra dan Renop',
        description: 'Rencana Strategis dan Rencana Operasional Badan Penjaminan Mutu.',
        category: 'dokumen-bpm',
        referenceUrl: `${REFERENCE_BASE}/dokumen-bpm/renstra-dan-renop`,
        isPublished: true,
      },
      {
        id: 'dokumen-bpm-peraturan-pedoman',
        pathname: '/bpm/dokumen-bpm/peraturan-dan-pedoman',
        navLabel: 'Peraturan dan Pedoman',
        title: 'Peraturan dan Pedoman',
        description: 'Peraturan dan pedoman terkait penjaminan mutu di lingkungan universitas.',
        category: 'dokumen-bpm',
        referenceUrl: `${REFERENCE_BASE}/dokumen-bpm/peraturan-dan-pedoman`,
        isPublished: true,
      },
      {
        id: 'dokumen-bpm-kalender-mutu',
        pathname: '/bpm/dokumen-bpm/kalender-mutu',
        navLabel: 'Kalender Mutu',
        title: 'Kalender Mutu',
        description: 'Kalender kegiatan penjaminan mutu BPM sepanjang tahun akademik.',
        category: 'dokumen-bpm',
        referenceUrl: `${REFERENCE_BASE}/dokumen-bpm/kalender-mutu`,
        isPublished: true,
      },
    ],
  },
  {
    id: 'spme',
    pathname: '/bpm/spme',
    navLabel: 'SPME',
    title: 'SPME',
    description:
      'Sistem Penjaminan Mutu Eksternal: peraturan akreditasi serta data akreditasi institusi dan program studi.',
    category: 'spme',
    referenceUrl: `${REFERENCE_BASE}/spme`,
    isPublished: true,
    children: [
      {
        id: 'spme-peraturan-akreditasi',
        pathname: '/bpm/spme/peraturan-akreditasi',
        navLabel: 'Peraturan Akreditasi',
        title: 'Peraturan Akreditasi',
        description: 'Peraturan yang menjadi dasar pelaksanaan akreditasi institusi dan program studi.',
        category: 'spme',
        referenceUrl: `${REFERENCE_BASE}/spme/peraturan-akreditasi`,
        isPublished: true,
      },
      {
        id: 'spme-data-akreditasi-institusi',
        pathname: '/bpm/spme/data-akreditasi-institusi',
        navLabel: 'Data Akreditasi Institusi',
        title: 'Data Akreditasi Institusi',
        description: 'Data dan dokumen akreditasi institusi Universitas Saintek Muhammadiyah.',
        category: 'spme',
        referenceUrl: `${REFERENCE_BASE}/spme/data-akreditai-institusi`,
        isPublished: true,
      },
      {
        id: 'spme-data-akreditasi-prodi',
        pathname: '/bpm/spme/data-akreditasi-program-studi',
        navLabel: 'Data Akreditasi Program Studi',
        title: 'Data Akreditasi Program Studi',
        description: 'Data dan dokumen akreditasi program studi di lingkungan universitas.',
        category: 'spme',
        referenceUrl: `${REFERENCE_BASE}/spme/data-akreditasi-program-studi`,
        isPublished: true,
      },
    ],
  },
]

function flatten(nodes: BpmRouteNode[], out: BpmRouteNode[] = []): BpmRouteNode[] {
  for (const node of nodes) {
    out.push(node)
    if (node.children?.length) flatten(node.children, out)
  }
  return out
}

export const bpmRoutes: BpmRouteNode[] = flatten(bpmNavigation)

const routeIndex = new Map(bpmRoutes.map((route) => [route.pathname, route]))

export function getBpmRoute(pathname: string): BpmRouteNode | undefined {
  return routeIndex.get(pathname)
}

export function getBpmChildren(pathname: string): BpmRouteNode[] {
  return getBpmRoute(pathname)?.children?.filter((child) => child.isPublished) ?? []
}

export function getBpmBreadcrumbs(pathname: string): BpmBreadcrumb[] {
  const crumbs: BpmBreadcrumb[] = [{ label: 'Beranda', href: '/' }]

  const walk = (nodes: BpmRouteNode[], trail: BpmRouteNode[]): BpmRouteNode[] | null => {
    for (const node of nodes) {
      const next = [...trail, node]
      if (node.pathname === pathname) return next
      if (node.children?.length) {
        const found = walk(node.children, next)
        if (found) return found
      }
    }
    return null
  }

  const trail = walk(bpmNavigation, []) ?? []
  if (trail.length > 0) {
    crumbs.push({ label: 'BPM' })
    trail.forEach((node, index) => {
      crumbs.push({
        label: node.navLabel,
        href: index < trail.length - 1 ? node.pathname : undefined,
      })
    })
  }
  return crumbs
}

export function createBpmMetadata(pathname: string): Metadata {
  const route = getBpmRoute(pathname)
  if (!route) return {}

  return {
    title: `${route.title} | BPM Universitas Saintek Muhammadiyah`,
    description: route.description,
    alternates: { canonical: route.pathname },
    openGraph: {
      title: route.title,
      description: route.description,
      type: 'website',
      locale: 'id_ID',
    },
  }
}

/* -------------------------------------------------------------------------- */
/* Document registry                                                          */
/* -------------------------------------------------------------------------- */

interface DriveDocumentInput {
  id: string
  title: string
  description: string
  category: string
  folderId: string
  tags?: string[]
}

function driveDocument({ id, title, description, category, folderId, tags }: DriveDocumentInput): BpmDocument {
  return {
    id,
    slug: id,
    title,
    description,
    category,
    fileUrl: driveFolder(folderId),
    mimeType: driveMime,
    provider: 'google-drive',
    kind: 'folder',
    isPublished: true,
    tags,
  }
}

/**
 * Verified resources from the reference site. Each entry maps a BPM page to the
 * Google Drive folder that the reference site links to. No local files are
 * configured yet; see `public/documents/bpm/README.md`.
 */
export const bpmDocuments: BpmDocument[] = [
  // SPMI
  driveDocument({
    id: 'spmi-pedoman-ami',
    title: 'Pedoman Audit Mutu Internal (AMI)',
    description: 'Folder dokumen pedoman pelaksanaan Audit Mutu Internal.',
    category: '/bpm/spmi/pedoman-ami',
    folderId: '1b1pb2vN5XT9AQaoK8hnjeOZkM4dLNk1e',
    tags: ['AMI', 'pedoman'],
  }),
  driveDocument({
    id: 'spmi-ami-program-studi',
    title: 'Dokumen AMI Program Studi',
    description: 'Folder dokumen pelaksanaan Audit Mutu Internal program studi.',
    category: '/bpm/spmi/ami-program-studi',
    folderId: '1dwwq5NScstWbTQJNkwuiTfErqAGlhop9',
    tags: ['AMI', 'program studi'],
  }),
  driveDocument({
    id: 'spmi-ami-unit-kerja',
    title: 'Dokumen AMI Unit Kerja',
    description: 'Folder dokumen pelaksanaan Audit Mutu Internal unit kerja.',
    category: '/bpm/spmi/ami-unit-kerja',
    folderId: '1A-WRFoj1-V5p6geQ84X7L-p8RKF10AkI',
    tags: ['AMI', 'unit kerja'],
  }),
  driveDocument({
    id: 'spmi-survei-kepuasan-mahasiswa',
    title: 'Survei Kepuasan Mahasiswa',
    description: 'Folder instrumen dan hasil survei kepuasan mahasiswa.',
    category: '/bpm/spmi/survei-kepuasan-mahasiswa',
    folderId: '1txf-_aRPe3roeOwk9-FNrpS4zf_qvXOF',
    tags: ['survei'],
  }),
  driveDocument({
    id: 'spmi-evaluasi-pmb',
    title: 'Evaluasi PMB (Penerimaan Mahasiswa Baru)',
    description: 'Folder dokumen evaluasi penerimaan mahasiswa baru.',
    category: '/bpm/spmi/evaluasi-pmb',
    folderId: '1ShuHisr1OmEMoAtf0f3C6LbNpM6NHWlK',
    tags: ['PMB'],
  }),
  driveDocument({
    id: 'spmi-monev-pembelajaran',
    title: 'Monitoring dan Evaluasi Pembelajaran',
    description: 'Folder dokumen monitoring dan evaluasi pembelajaran.',
    category: '/bpm/spmi/monev-pembelajaran',
    folderId: '1RPoTl6xPMshET_NnT1T-MrJ7YbXq9UJJ',
    tags: ['monev'],
  }),
  driveDocument({
    id: 'spmi-evaluasi-ketercapaian-standar',
    title: 'Evaluasi Ketercapaian Standar',
    description: 'Folder dokumen evaluasi ketercapaian standar mutu.',
    category: '/bpm/spmi/evaluasi-ketercapaian-standar',
    folderId: '1sSd027SEuW5feUOEOveNOdeLlbLauxFB',
    tags: ['standar'],
  }),
  driveDocument({
    id: 'spmi-rtm-dan-rtl',
    title: 'RTM dan RTL',
    description: 'Folder dokumen Rapat Tinjauan Manajemen dan Rencana Tindak Lanjut.',
    category: '/bpm/spmi/rtm-dan-rtl',
    folderId: '1RMpNrgtJmbcIVgz7rFwocOSMCozDeWki',
    tags: ['RTM', 'RTL'],
  }),

  // PPEPP
  driveDocument({
    id: 'ppepp-penetapan',
    title: 'Penetapan',
    description: 'Folder dokumen tahap penetapan standar mutu.',
    category: '/bpm/ppepp/penetapan',
    folderId: '1t6pNX9ipPPoQ9_5GoOxk0smVjLJc4nrP',
    tags: ['PPEPP'],
  }),
  driveDocument({
    id: 'ppepp-pelaksanaan',
    title: 'Pelaksanaan',
    description: 'Folder dokumen tahap pelaksanaan standar mutu.',
    category: '/bpm/ppepp/pelaksanaan',
    folderId: '1lxk5Yb-zcWp5ZTRCD7HvgySoVmO5KeM3',
    tags: ['PPEPP'],
  }),
  driveDocument({
    id: 'ppepp-evaluasi',
    title: 'Evaluasi',
    description: 'Folder dokumen tahap evaluasi ketercapaian standar mutu.',
    category: '/bpm/ppepp/evaluasi',
    folderId: '1EOethii_Mo23CHsmsLznmO2mVlERgsJu',
    tags: ['PPEPP'],
  }),
  driveDocument({
    id: 'ppepp-pengendalian',
    title: 'Pengendalian',
    description: 'Folder dokumen tahap pengendalian mutu.',
    category: '/bpm/ppepp/pengendalian',
    folderId: '1j_S48zGdaFdfJSs1idzKPPd_vpBSA2z6',
    tags: ['PPEPP'],
  }),
  driveDocument({
    id: 'ppepp-peningkatan',
    title: 'Peningkatan',
    description: 'Folder dokumen tahap peningkatan standar mutu.',
    category: '/bpm/ppepp/peningkatan',
    folderId: '12RDeh-sNinYDLZPWY2NdMPyUDvr06C1X',
    tags: ['PPEPP'],
  }),

  // Dokumen SPMI
  driveDocument({
    id: 'dokumen-spmi-kebijakan',
    title: 'Kebijakan SPMI',
    description: 'Folder dokumen kebijakan Sistem Penjaminan Mutu Internal.',
    category: '/bpm/dokumen-spmi/kebijakan-spmi',
    folderId: '1dP0SdSNDNaUZr7VqAWcKQZgevsHbHbW0',
    tags: ['SPMI'],
  }),
  driveDocument({
    id: 'dokumen-spmi-manual',
    title: 'Manual SPMI',
    description: 'Folder manual pelaksanaan Sistem Penjaminan Mutu Internal.',
    category: '/bpm/dokumen-spmi/manual-spmi',
    folderId: '1DyFJVHaGjKy2CZGmRgVgJfIVbZ2x3xsk',
    tags: ['SPMI'],
  }),
  driveDocument({
    id: 'dokumen-spmi-standar',
    title: 'Standar SPMI',
    description: 'Folder dokumen standar mutu internal.',
    category: '/bpm/dokumen-spmi/standar-spmi',
    folderId: '167oHtf8uoZMaryAi2Hh4Pml03zQx3vJt',
    tags: ['SPMI'],
  }),
  driveDocument({
    id: 'dokumen-spmi-formulir',
    title: 'Formulir SPMI',
    description: 'Folder formulir baku kegiatan penjaminan mutu.',
    category: '/bpm/dokumen-spmi/formulir-spmi',
    folderId: '13rdSV8JTjExG7YYE9ARSkhm5eMETTvB3',
    tags: ['SPMI'],
  }),

  // Dokumen BPM
  driveDocument({
    id: 'dokumen-bpm-kegiatan',
    title: 'Dokumen Kegiatan SPMI dan Benchmarking',
    description: 'Folder dokumen kegiatan SPMI dan benchmarking.',
    category: '/bpm/dokumen-bpm/dokumen-kegiatan',
    folderId: '1pI6HXZ8GEs3uD_2TEsJrhRqBydqTMqnd',
    tags: ['kegiatan'],
  }),
  driveDocument({
    id: 'dokumen-bpm-renstra-renop',
    title: 'Renstra dan Renop',
    description: 'Folder Rencana Strategis dan Rencana Operasional BPM.',
    category: '/bpm/dokumen-bpm/renstra-dan-renop',
    folderId: '1jw65_FcYXMfA2qiiHXdgdOdNJiuPLL2B',
    tags: ['renstra'],
  }),
  driveDocument({
    id: 'dokumen-bpm-peraturan-pedoman',
    title: 'Peraturan dan Pedoman',
    description: 'Folder peraturan dan pedoman penjaminan mutu.',
    category: '/bpm/dokumen-bpm/peraturan-dan-pedoman',
    folderId: '12JWPx_FBQFqnMGHnHtVYYEx_l1bGOXuf',
    tags: ['peraturan'],
  }),
  driveDocument({
    id: 'dokumen-bpm-kalender-mutu',
    title: 'Kalender Mutu',
    description: 'Folder kalender kegiatan mutu BPM.',
    category: '/bpm/dokumen-bpm/kalender-mutu',
    folderId: '1zmRgz7Rr0gAuypmC31e5gsDBVpPvWXrB',
    tags: ['kalender'],
  }),
]

export function getBpmDocuments(categoryPathname: string): BpmDocument[] {
  return bpmDocuments.filter((doc) => doc.isPublished && doc.category === categoryPathname)
}

/** Documents that belong to a category but are not tied to a single leaf page. */
export function getBpmDocumentsByCategory(category: BpmCategoryId): BpmDocument[] {
  return bpmDocuments.filter(
    (doc) => doc.isPublished && getBpmRoute(doc.category)?.category === category
  )
}
