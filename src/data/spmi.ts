import type { SpmiCategory, SpmiDocument } from '../types'

export const spmiCategories: SpmiCategory[] = [
  { id: 'kebijakan', nama: 'Kebijakan SPMI', deskripsi: 'Dokumen kebijakan penjaminan mutu internal universitas.' },
  { id: 'manual', nama: 'Manual SPMI', deskripsi: 'Manual prosedur operasional pelaksanaan SPMI.' },
  { id: 'standar', nama: 'Standar SPMI', deskripsi: 'Standar mutu internal yang berlaku di seluruh unit kerja.' },
  { id: 'formulir', nama: 'Formulir SPMI', deskripsi: 'Formulir baku untuk kegiatan monitoring dan evaluasi mutu.' },
  { id: 'pendukung', nama: 'Dokumen Pendukung', deskripsi: 'Dokumen pendukung pelaksanaan siklus mutu P-D-C-A.' },
]

export const spmiDocuments: SpmiDocument[] = [
  {
    id: 'spmi-1',
    categoryId: 'kebijakan',
    judul: 'Kebijakan Sistem Penjaminan Mutu Internal',
    deskripsi:
      'Menetapkan arah dan komitmen universitas dalam penjaminan mutu pendidikan, penelitian, dan pengabdian kepada masyarakat melalui siklus Plan–Do–Check–Act.',
    tahun: 2023,
    nomor: 'SK/USM/014/2023',
    status: 'Berlaku',
    jenis: 'Kebijakan',
    fileType: 'PDF',
  },
  {
    id: 'spmi-2',
    categoryId: 'kebijakan',
    judul: 'Kebijakan Penjaminan Mutu Program Studi',
    deskripsi:
      'Mengatur kewajiban setiap program studi dalam penyusunan evaluasi diri, monitoring, dan tindak lanjut rekomendasi audit mutu.',
    tahun: 2022,
    nomor: 'SK/USM/009/2022',
    status: 'Berlaku',
    jenis: 'Kebijakan',
    fileType: 'PDF',
  },
  {
    id: 'spmi-3',
    categoryId: 'manual',
    judul: 'Manual SPMI Universitas Saintek Muhammadiyah',
    deskripsi:
      'Panduan pelaksanaan SPMI yang memuat struktur, peran, siklus P-D-C-A, serta mekanisme audit internal di seluruh unit kerja universitas.',
    tahun: 2023,
    nomor: 'MD/USM/003/2023',
    status: 'Berlaku',
    jenis: 'Manual',
    fileType: 'PDF',
  },
  {
    id: 'spmi-4',
    categoryId: 'manual',
    judul: 'Manual Audit Mutu Internal',
    deskripsi:
      'Menguraikan tahapan audit mutu internal mulai dari penyusunan rencana audit, pelaksanaan, pelaporan, hingga monitoring tindak lanjut.',
    tahun: 2024,
    nomor: 'MD/USM/006/2024',
    status: 'Berlaku',
    jenis: 'Manual',
    fileType: 'PDF',
  },
  {
    id: 'spmi-5',
    categoryId: 'standar',
    judul: 'Standar Mutu Internal Universitas',
    deskripsi:
      'Kumpulan standar mutu internal yang menjadi rujukan penilaian kinerja seluruh unit kerja, termasuk standar pendidikan, penelitian, dan tata kelola.',
    tahun: 2024,
    nomor: 'ST/USM/011/2024',
    status: 'Berlaku',
    jenis: 'Standar',
    fileType: 'PDF',
  },
  {
    id: 'spmi-6',
    categoryId: 'standar',
    judul: 'Standar Proses Bisnis Unit Kerja',
    deskripsi:
      'Memetakan proses bisnis utama universitas beserta indikator kinerja dan pemilik proses pada masing-masing unit.',
    tahun: 2023,
    nomor: 'ST/USM/008/2023',
    status: 'Revisi',
    jenis: 'Standar',
    fileType: 'PDF',
  },
  {
    id: 'spmi-7',
    categoryId: 'formulir',
    judul: 'Formulir Rencana Audit Mutu Internal',
    deskripsi:
      'Formulir baku untuk penyusunan rencana audit tahunan, memuat lingkup audit, auditor, dan jadwal pelaksanaan.',
    tahun: 2024,
    nomor: 'FR/USM/021/2024',
    status: 'Berlaku',
    jenis: 'Formulir',
    fileType: 'PDF',
  },
  {
    id: 'spmi-8',
    categoryId: 'formulir',
    judul: 'Formulir Laporan Hasil Audit Mutu',
    deskripsi:
      'Formulir pelaporan temuan audit berupa conforms, observations, dan rekomendasi perbaikan beserta tenggat tindak lanjut.',
    tahun: 2024,
    nomor: 'FR/USM/022/2024',
    status: 'Berlaku',
    jenis: 'Formulir',
    fileType: 'PDF',
  },
  {
    id: 'spmi-9',
    categoryId: 'formulir',
    judul: 'Formulir Monitoring dan Evaluasi Tindak Lanjut',
    deskripsi:
      'Formulir pemantauan pelaksanaan rekomendasi audit oleh unit kerja hingga seluruh temuan dinyatakan selesai.',
    tahun: 2024,
    nomor: 'FR/USM/023/2024',
    status: 'Berlaku',
    jenis: 'Formulir',
    fileType: 'XLSX',
  },
  {
    id: 'spmi-10',
    categoryId: 'pendukung',
    judul: 'Laporan Evaluasi Diri Universitas 2024',
    deskripsi:
      'Laporan evaluasi diri siklus Plan–Do–Check–Act tahun berjalan yang memuat capaian indikator dan rencana perbaikan berkelanjutan.',
    tahun: 2024,
    nomor: 'LP/USM/017/2024',
    status: 'Berlaku',
    jenis: 'Laporan',
    fileType: 'PDF',
  },
  {
    id: 'spmi-11',
    categoryId: 'pendukung',
    judul: 'Notulen Rapat Koordinasi Penjaminan Mutu',
    deskripsi:
      'Dokumentasi keputusan rapat koordinasi LPM dengan seluruh unit kerja terkait program penjaminan mutu semester berjalan.',
    tahun: 2024,
    nomor: 'NT/USM/031/2024',
    status: 'Draft',
    jenis: 'Notulen',
    fileType: 'PDF',
  },
]

export function getDocumentsByCategory(categoryId: string): SpmiDocument[] {
  return spmiDocuments.filter((doc) => doc.categoryId === categoryId)
}

export function getSpmiDocument(id: string): SpmiDocument | undefined {
  return spmiDocuments.find((doc) => doc.id === id)
}
