import type { Institution, OrgNode, ProgramStudi } from '../types'

export const institution: Institution = {
  nama: 'Universitas Saintek Muhammadiyah',
  singkatan: 'USM',
  statusAkreditasi: 'Baik Sekali (BAN-PT)',
  statusAkreditasiSk: 'SK BAN-PT No. 2647/SK/BAN-PT/Ak/PT/VIII/2025',
  statusAkreditasiBerlaku: 'Agustus 2030',
  tahunBerdiri: 1992,
  alamat:
    'Jl. Raya Klp. Dua Wetan No.17 7, RT.7/RW.4, Klp. Dua Wetan, Kec. Ciracas, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13730',
  mapsUrl: 'https://maps.app.goo.gl/d9y2TAYn8XG6wQvH7',
  website: 'https://saintekmu.ac.id',
  email: 'info@saintekmu.ac.id',
  telepon: '(021) 8771 7489',
  jamLayanan: 'Senin - Jumat, 08.00 - 16.00 WIB',
  tentang:
    'Universitas Saintek Muhammadiyah (USM) merupakan pengembangan dari STMIK Muhammadiyah Jakarta yang berdiri sejak 10 November 1992. USM adalah perguruan tinggi yang fokus pada pengembangan sains dan teknologi berlandaskan nilai-nilai Islam dan Kemuhammadiyahan. Seluruh proses pendidikan, penelitian, dan pengabdian kepada masyarakat dikelola melalui Sistem Penjaminan Mutu Internal (SPMI) yang menerapkan siklus Plan–Do–Check–Act pada setiap unit kerja.',
  visi:
    'Menjadi Perguruan Tinggi yang Unggul, Inovatif, Terpercaya dan Mandiri Berwawasan Global dan Islami di bidang Bisnis dan Rekayasa Digital Tahun 2050.',
  misi: [
    'Menyelenggarakan catur dharma perguruan tinggi secara profesional, inovatif dan mandiri.',
    'Menjadi pusat dakwah dan pengembangan bisnis, teknologi informasi dan rekayasa digital di lingkungan persyarikatan.',
    'Menghasilkan lulusan yang unggul, berakhlak mulia, berwawasan dan berkemampuan tinggi dalam bisnis, teknologi informasi dan rekayasa digital.',
    'Mampu meningkatkan produktivitas dan kualitas lulusan yang berkemajuan, berkeadaban dan berintegritas dalam pembangunan nasional.',
    'Meningkatkan harkat manusia dalam upaya meneguhkan nilai-nilai kemanusiaan dan peradaban.',
  ],
  tujuan: [
    'Mewujudkan budaya mutu di seluruh unit kerja universitas melalui siklus P-D-C-A.',
    'Menjaga akreditasi institusi Baik Sekali dan seluruh program studi minimal peringkat Baik.',
    'Meningkatkan jumlah publikasi ilmiah dan paten dosen setiap tahun.',
    'Menghasilkan lulusan yang terserap di dunia kerja minimal 85% dalam enam bulan setelah wisuda.',
  ],
}

export const programStudi: ProgramStudi[] = [
  {
    id: 'prodi-1',
    nama: 'Teknik Informatika',
    jenjang: 'S1',
    fakultas: 'Fakultas Ilmu Komputer',
    akreditasi: 'Baik Sekali',
    tahunAkreditasi: 2025,
    skAkreditasi: '179/SK/LAM-INFOKOM/Ak/S/VIII/2025',
  },
  {
    id: 'prodi-2',
    nama: 'Sistem Informasi',
    jenjang: 'S1',
    fakultas: 'Fakultas Ilmu Komputer',
    akreditasi: 'Baik Sekali',
    tahunAkreditasi: 2025,
    skAkreditasi: '236/SK/LAM-INFOKOM/Ak/S/VIII/2025',
  },
  {
    id: 'prodi-3',
    nama: 'Sains Data',
    jenjang: 'S1',
    fakultas: 'Fakultas Ilmu Komputer',
    akreditasi: 'Baik',
    tahunAkreditasi: 2025,
    skAkreditasi: '178/SK/LAM-INFOKOM/Ak.S/S/IX/2025',
  },
  {
    id: 'prodi-4',
    nama: 'Ilmu Komunikasi',
    jenjang: 'S1',
    fakultas: 'Fakultas Komunikasi dan Bisnis',
    akreditasi: 'Baik',
    tahunAkreditasi: 2025,
    skAkreditasi: '196/AK.03.01/2025',
  },
  {
    id: 'prodi-5',
    nama: 'Film dan Televisi',
    jenjang: 'S1',
    fakultas: 'Fakultas Komunikasi dan Bisnis',
    akreditasi: 'Baik',
    tahunAkreditasi: 2025,
    skAkreditasi: '198/AK.03.01/2025',
  },
  {
    id: 'prodi-6',
    nama: 'Kewirausahaan',
    jenjang: 'S1',
    fakultas: 'Fakultas Komunikasi dan Bisnis',
    akreditasi: 'Baik',
    tahunAkreditasi: 2026,
    skAkreditasi: '914/DE/A.5/LAMEMBA-S/III/2026',
  },
]

export const strukturOrganisasi: OrgNode[] = [
  {
    id: 'org-1',
    jabatan: 'Rektor',
    nama: 'Dr. Faiz Rafdhi, S.Kom., M.Kom.',
    children: [
      { id: 'org-2', jabatan: 'Wakil Rektor I — Akademik, Riset dan Inovasi', nama: 'Imam Suprapta, S.E., M.M.' },
      { id: 'org-3', jabatan: 'Wakil Rektor II — Keuangan, SDM dan Aset', nama: 'Mochammad Arief Sutisna, S.Kom., M.Kom.' },
      { id: 'org-4', jabatan: 'Wakil Rektor III — AIK, Kemahasiswaan dan Kerjasama', nama: 'Himawan Dwiatmodjo, S.H., LL.M.' },
      { id: 'org-5', jabatan: 'Badan Penjaminan Mutu', nama: 'Ketua BPM — penanggung jawab SPMI' },
      { id: 'org-6', jabatan: 'Lembaga Penjaminan Mutu Internal', nama: 'Pelaksana audit mutu internal' },
      { id: 'org-7', jabatan: 'Senat Universitas', nama: 'Majelis tertinggi badan legislasi universitas' },
    ],
  },
]
