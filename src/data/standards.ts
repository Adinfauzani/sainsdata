import type { Standard, StandardGroup } from '../types'

export const standardGroups: StandardGroup[] = [
  {
    id: 'pendidikan',
    nama: 'Standar Pendidikan',
    deskripsi: 'Standar yang mengatur mutu penyelenggaraan pendidikan pada seluruh program studi.',
  },
  {
    id: 'penelitian',
    nama: 'Standar Penelitian',
    deskripsi: 'Standar yang mengatur mutu penyelenggaraan penelitian dan pemanfaatan hasil riset.',
  },
  {
    id: 'pengabdian',
    nama: 'Standar Pengabdian kepada Masyarakat',
    deskripsi: 'Standar yang mengatur mutu pelaksanaan pengabdian kepada masyarakat.',
  },
  {
    id: 'tata-kelola',
    nama: 'Standar Tata Kelola',
    deskripsi: 'Standar yang mengatur tata pamong, kepemimpinan, dan sistem pengelolaan universitas.',
  },
]

export const standards: Standard[] = [
  {
    id: 'std-skl',
    groupId: 'pendidikan',
    kode: 'PDK-01',
    nama: 'Standar Kompetensi Lulusan',
    deskripsi:
      'Menetapkan kompetensi lulusan yang mencakup sikap, pengetahuan, dan keterampilan sesuai jenjang pendidikan.',
    tujuan: 'Menjamin setiap lulusan mencapai kompetensi yang ditetapkan program studi.',
    ruangLingkup: [
      'Penyusunan capaian pembelajaran lulusan',
      'Pemetaan kompetensi per jenjang dan profesi',
      'Evaluasi pencapaian kompetensi lulusan',
    ],
    indikator: [
      { id: 'ind-1', pernyataan: 'Capaian pembelajaran lulusan ditetapkan dan ditinjau tiap 4 tahun', capaian: 'Tercapai (96%)' },
      { id: 'ind-2', pernyataan: '90% lulusan menyelesaikan studi sesuai target waktu', capaian: 'Tercapai (91%)' },
      { id: 'ind-3', pernyataan: 'Alumni menilai kompetensi sesuai kebutuhan dunia kerja', capaian: 'Tercapai (89%)' },
    ],
    documentIds: ['doc-02', 'doc-05', 'doc-01'],
    tahun: 2023,
    status: 'Tercapai',
  },
  {
    id: 'std-isi',
    groupId: 'pendidikan',
    kode: 'PDK-02',
    nama: 'Standar Isi Pembelajaran',
    deskripsi:
      'Menetapkan kerangka dasar dan struktur kurikulum yang memuat bahan kajian, muatan lokal, dan pengayaan.',
    tujuan: 'Menjamin kurikulum relevan, terstruktur, dan selaras dengan capaian pembelajaran.',
    ruangLingkup: [
      'Kurikulum pendidikan tinggi berbasis kompetensi',
      'Struktur kurikulum dan bobot sks',
      'Peninjauan kurikulum setiap tahun akademik',
    ],
    indikator: [
      { id: 'ind-4', pernyataan: 'Kurikulum ditinjau berdasarkan umpan balik pemangku kepentingan', capaian: 'Tercapai (94%)' },
      { id: 'ind-5', pernyataan: 'Mata kuliah sesuai peta kompetensi dan kebutuhan industri', capaian: 'Tercapai (90%)' },
    ],
    documentIds: ['doc-01', 'doc-17'],
    tahun: 2023,
    status: 'Tercapai',
  },
  {
    id: 'std-proses',
    groupId: 'pendidikan',
    kode: 'PDK-03',
    nama: 'Standar Proses Pembelajaran',
    deskripsi:
      'Menetapkan pelaksanaan pembelajaran yang interaktif, inspiratif, antusias, menyenangkan, kreatif, dan efektif.',
    tujuan: 'Menjamin proses pembelajaran berjalan sesuai rencana dan berorientasi pada mahasiswa.',
    ruangLingkup: [
      'Perencanaan dan pelaksanaan perkuliahan',
      'Rencana pelaksanaan pembelajaran semester',
      'Monitoring dan evaluasi proses pembelajaran',
    ],
    indikator: [
      { id: 'ind-6', pernyataan: 'RPP tersedia dan diupdate setiap semester', capaian: 'Tercapai (97%)' },
      { id: 'ind-7', pernyataan: 'Kehadiran dosen minimal 80% per pertemuan', capaian: 'Tercapai (93%)' },
      { id: 'ind-8', pernyataan: 'Evaluasi pembelajaran dilakukan tiap akhir semester', capaian: 'Dalam Evaluasi (78%)' },
    ],
    documentIds: ['doc-01', 'doc-21', 'doc-13'],
    tahun: 2024,
    status: 'Tercapai',
  },
  {
    id: 'std-penilaian',
    groupId: 'pendidikan',
    kode: 'PDK-04',
    nama: 'Standar Penilaian Pembelajaran',
    deskripsi:
      'Menetapkan sistem penilaian yang objektif, transparan, dan akuntabel untuk hasil belajar mahasiswa.',
    tujuan: 'Menjamin penilaian hasil belajar konsisten dan dapat dipertanggungjawabkan.',
    ruangLingkup: [
      'Teknik, instrumen, dan prosedur penilaian',
      'Analisis hasil belajar',
      'Pengelolaan nilai dan dokumentasi',
    ],
    indikator: [
      { id: 'ind-9', pernyataan: 'Kriteria penilaian diumumkan pada awal semester', capaian: 'Tercapai (98%)' },
      { id: 'ind-10', pernyataan: 'Rekap nilai diinput sebelum batas waktu yang ditentukan', capaian: 'Tercapai (87%)' },
    ],
    documentIds: ['doc-14', 'doc-21'],
    tahun: 2024,
    status: 'Sesuai',
  },
  {
    id: 'std-hasil-penelitian',
    groupId: 'penelitian',
    kode: 'PEN-05',
    nama: 'Standar Hasil Penelitian',
    deskripsi:
      'Menetapkan mutu hasil penelitian yang dihasilkan dosen dan mahasiswa universitas.',
    tujuan: 'Menjamin hasil penelitian bermutu, terpublikasi, dan berdampak pada pengembangan ilmu.',
    ruangLingkup: [
      'Publikasi pada jurnal nasional dan internasional',
      'Penyimpanan dan diseminasi hasil riset',
      'Pemanfaatan hasil penelitian oleh masyarakat',
    ],
    indikator: [
      { id: 'ind-11', pernyataan: 'Minimal 60% dosen aktif meneliti setiap tahun', capaian: 'Tercapai (64%)' },
      { id: 'ind-12', pernyataan: 'Publikasi jurnal terindeks meningkat tahunan', capaian: 'Tercapai (88%)' },
    ],
    documentIds: ['doc-06', 'doc-08'],
    tahun: 2024,
    status: 'Tercapai',
  },
  {
    id: 'std-isi-penelitian',
    groupId: 'penelitian',
    kode: 'PEN-06',
    nama: 'Standar Isi Penelitian',
    deskripsi:
      'Menetapkan topik dan ruang lingkup penelitian sesuai prioritas pengembangan ilmu dan kebutuhan masyarakat.',
    tujuan: 'Menjamin penelitian selaras dengan visi universitas dan peta riset nasional.',
    ruangLingkup: [
      'Peta riset dan prioritas bidang',
      'Penelitian dosen, mahasiswa, dan kolaborasi',
      'Etika dan tata kelola penelitian',
    ],
    indikator: [
      { id: 'ind-13', pernyataan: 'Topik penelitian sesuai peta riset universitas', capaian: 'Tercapai (92%)' },
      { id: 'ind-14', pernyataan: 'Penelitian melibatkan mahasiswa sebagai responden/narasumber', capaian: 'Tercapai (85%)' },
    ],
    documentIds: ['doc-07', 'doc-18'],
    tahun: 2023,
    status: 'Sesuai',
  },
  {
    id: 'std-proses-penelitian',
    groupId: 'penelitian',
    kode: 'PEN-07',
    nama: 'Standar Proses Penelitian',
    deskripsi:
      'Menetapkan tahapan pelaksanaan penelitian mulai dari proposal, penelitian, hingga publikasi.',
    tujuan: 'Menjamin setiap penelitian berjalan terencana, tepat waktu, dan sesuai jadwal.',
    ruangLingkup: [
      'Perencanaan dan pengusulan penelitian',
      'Pelaksanaan dan pelaporan penelitian',
      'Audit mutu pelaksanaan penelitian',
    ],
    indikator: [
      { id: 'ind-15', pernyataan: 'Proposal penelitian dievaluasi sebelum pendanaan', capaian: 'Tercapai (95%)' },
      { id: 'ind-16', pernyataan: 'Laporan akhir disampaikan sesuai tenggat', capaian: 'Tercapai (83%)' },
    ],
    documentIds: ['doc-06', 'doc-13'],
    tahun: 2024,
    status: 'Tercapai',
  },
  {
    id: 'std-hasil-pkm',
    groupId: 'pengabdian',
    kode: 'PKM-08',
    nama: 'Standar Hasil Pengabdian',
    deskripsi:
      'Menetapkan mutu hasil pengabdian kepada masyarakat yang memberi manfaat nyata bagi mitra.',
    tujuan: 'Menjamin hasil pengabdian terukur, berkelanjutan, dan dirasakan masyarakat.',
    ruangLingkup: [
      'Dampak dan kemanfaatan kegiatan',
      'Tindak lanjut dan keberlanjutan program',
      'Publikasi dan dokumentasi hasil pengabdian',
    ],
    indikator: [
      { id: 'ind-17', pernyataan: 'Mitra menilai kegiatan sesuai kebutuhan', capaian: 'Tercapai (93%)' },
      { id: 'ind-18', pernyataan: 'Program berlanjut pada tahun berikutnya', capaian: 'Dalam Evaluasi (74%)' },
    ],
    documentIds: ['doc-12', 'doc-11'],
    tahun: 2024,
    status: 'Sesuai',
  },
  {
    id: 'std-isi-pkm',
    groupId: 'pengabdian',
    kode: 'PKM-09',
    nama: 'Standar Isi Pengabdian',
    deskripsi:
      'Menetapkan topik pengabdian kepada masyarakat berdasarkan potensi daerah dan kebutuhan mitra.',
    tujuan: 'Menjamin kegiatan pengabdian tepat sasaran dan sesuai kompetensi pengabdi.',
    ruangLingkup: [
      'Pemetaan kebutuhan masyarakat',
      'Perencanaan program pengabdian',
      'Pemilihan metode dan pendekatan',
    ],
    indikator: [
      { id: 'ind-19', pernyataan: 'Topik kegiatan diusulkan dari hasil pemetaan mitra', capaian: 'Tercapai (90%)' },
      { id: 'ind-20', pernyataan: 'Program melibatkan mahasiswa dalam pelaksanaan', capaian: 'Tercapai (86%)' },
    ],
    documentIds: ['doc-11', 'doc-19'],
    tahun: 2023,
    status: 'Tercapai',
  },
  {
    id: 'std-proses-pkm',
    groupId: 'pengabdian',
    kode: 'PKM-10',
    nama: 'Standar Proses Pengabdian',
    deskripsi:
      'Menetapkan tahapan pelaksanaan pengabdian kepada masyarakat secara terencana dan terdokumentasi.',
    tujuan: 'Menjamin setiap kegiatan berjalan sesuai rencana dan tepat waktu.',
    ruangLingkup: [
      'Penyusunan rencana kegiatan',
      'Pelaksanaan dan monitoring di lapangan',
      'Pelaporan dan evaluasi kegiatan',
    ],
    indikator: [
      { id: 'ind-21', pernyataan: 'Kegiatan dilaksanakan sesuai jadwal yang disepakati', capaian: 'Tercapai (91%)' },
      { id: 'ind-22', pernyataan: 'Monitoring dilakukan minimal sekali per kegiatan', capaian: 'Tercapai (84%)' },
    ],
    documentIds: ['doc-12', 'doc-14'],
    tahun: 2024,
    status: 'Tercapai',
  },
  {
    id: 'std-tata-pamong',
    groupId: 'tata-kelola',
    kode: 'TKL-11',
    nama: 'Tata Pamong',
    deskripsi:
      'Menetapkan pelaksanaan otonomi institusi yang bertanggung jawab publik dan menjunjung tinggi nilai-nilai keadilan.',
    tujuan: 'Menjamin tata pamong universitas berjalan sesuai peraturan perundang-undangan.',
    ruangLingkup: [
      'Visi, misi, dan tujuan institusi',
      'Statuta dan regulasi internal',
      'Pemilihan pimpinan universitas',
    ],
    indikator: [
      { id: 'ind-23', pernyataan: 'Visi misi ditinjau bersama seluruh pemangku kepentingan', capaian: 'Tercapai (94%)' },
      { id: 'ind-24', pernyataan: 'Regulasi internal diundangkan dan diakses publik', capaian: 'Tercapai (97%)' },
    ],
    documentIds: ['doc-23', 'doc-16', 'doc-22'],
    tahun: 2023,
    status: 'Tercapai',
  },
  {
    id: 'std-kepemimpinan',
    groupId: 'tata-kelola',
    kode: 'TKL-12',
    nama: 'Kepemimpinan',
    deskripsi:
      'Menetapkan kepemimpinan fungsional yang mampu menjamin terwujudnya tata kelola dan budaya mutu.',
    tujuan: 'Menjamin pimpinan menjalankan amanah sesuai statuta dan budaya mutu.',
    ruangLingkup: [
      'Penyusunan rencana strategis',
      'Pembangunan budaya mutu di unit kerja',
      'Evaluasi kinerja pimpinan',
    ],
    indikator: [
      { id: 'ind-25', pernyataan: 'Rencana strategis dievaluasi setiap tahun', capaian: 'Tercapai (92%)' },
      { id: 'ind-26', pernyataan: 'Pimpinan rutin melakukan kunjungan ke unit kerja', capaian: 'Tercapai (88%)' },
      { id: 'ind-27', pernyataan: 'Kinerja pimpinan dievaluasi oleh senat universitas', capaian: 'Tercapai (90%)' },
    ],
    documentIds: ['doc-16', 'doc-22', 'doc-03'],
    tahun: 2024,
    status: 'Tercapai',
  },
  {
    id: 'std-sistem-pengelolaan',
    groupId: 'tata-kelola',
    kode: 'TKL-13',
    nama: 'Sistem Pengelolaan',
    deskripsi:
      'Menetapkan pengelolaan sumber daya, sistem informasi, dan jaminan mutu sebagai satu kesatuan SPMI.',
    tujuan: 'Menjamin seluruh sumber daya dikelola efektif untuk mendukung pencapaian visi misi.',
    ruangLingkup: [
      'Pengelolaan sumber daya manusia dan keuangan',
      'Sistem informasi manajemen',
      'Pelaksanaan siklus P-D-C-A SPMI',
    ],
    indikator: [
      { id: 'ind-28', pernyataan: 'Audit internal dilakukan minimal sekali per tahun', capaian: 'Tercapai (96%)' },
      { id: 'ind-29', pernyataan: 'Laporan evaluasi diri disusun lengkap dan tepat waktu', capaian: 'Tercapai (89%)' },
      { id: 'ind-30', pernyataan: 'Tindak lanjut rekomendasi audit ditindaklanjuti', capaian: 'Dalam Evaluasi (76%)' },
    ],
    documentIds: ['doc-09', 'doc-10', 'doc-03', 'doc-04', 'doc-15', 'doc-20', 'doc-24'],
    tahun: 2024,
    status: 'Sesuai',
  },
]
