import type { ProgramStudi } from '../types'

export const sainsDataProdi: ProgramStudi = {
  id: 'prodi-sains-data',
  nama: 'Sains Data',
  jenjang: 'S1',
  fakultas: 'Fakultas Ilmu Komputer',
  akreditasi: 'Baik',
  tahunAkreditasi: 2025,
  skAkreditasi: '178/SK/LAM-INFOKOM/Ak.S/S/IX/2025',
}

export const sainsDataProfile = {
  universitas: 'Universitas Saintek Muhammadiyah',
  singkatan: 'USM',
  fakultas: 'Fakultas Ilmu Komputer',
  programStudi: 'Sains Data',
  jenjang: 'Strata 1 (S1)',
  akreditasi: 'Baik',
  skAkreditasi: '178/SK/LAM-INFOKOM/Ak.S/S/IX/2025',
  berlakuHingga: '2030',
  website: 'https://saintekmu.ac.id',
  email: 'sainsdata@saintekmu.ac.id',
}

// Data Visi, Misi, Tujuan, Sasaran UNIVERSITAS (dari BAB II Pedoman Penyusunan Visi Misi Universitas)
export const universitasVMTS = {
  visi: 'Menjadi Universitas Unggul Berbasis Kemaritiman, berjiwa Entrepreneurship yang Berkarakter Islami dan Berdaya Saing Global',
  misi: [
    'Menyelenggarakan Pendidikan dan Pengajaran yang Profesional berbasis kemaritiman dan berjiwa Entrepreneurship.',
    'Menyelenggarakan Penelitian dan Pengabdian Kepada Masyarakat berbasis Kemaritiman dan berjiwa Entrepreneurship yang berkontribusi terhadap pengembangan IPTEKS dan pembangunan masyarakat yang berkelanjutan.',
    'Menyelenggarakan tata kelola perguruan tinggi yang Islami dengan prinsip Good University Governance.',
    'Mengembangkan Al Islam dan Kemuhammadiyahan, dan kerjasama dengan perguruan tinggi lain, pemerintah, dan swasta pada tingkat Nasional dan Internasional dalam mewujudkan Caturdharma PTMA.',
  ],
  tujuan: [
    'Menghasilkan lulusan yang memiliki kompetensi berbasis Kemaritiman, berjiwa Entrepreneurship, dan berkarakter Islami.',
    'Terwujudnya penelitian dan publikasi yang berkontribusi terhadap pengembangan IPTEKS serta produk pengabdian kepada masyarakat yang berbasis riset dan inovatif.',
    'Terwujudnya tata kelola perguruan tinggi yang Islami dengan prinsip Good University Governance.',
    'Terlaksananya nilai-nilai Al Islam Kemuhammadiyahan dalam kehidupan kampus, meningkatnya kerjasama dengan perguruan tinggi lain, pemerintah dan swasta pada tingkat nasional dan internasional dalam mewujudkan Caturdarma PTMA.',
  ],
  sasaran: [
    'Terwujudnya pendidikan dan pengajaran yang berkualitas didukung oleh penelitian dan pengabdian kepada masyarakat untuk menghasilkan lulusan yang memiliki kompetensi berbasis kemaritiman, berjiwa Entrepreneurship dan berkarakter Islami serta berdaya saing global.',
    'Terwujudnya mahasiswa yang berjiwa Entrepreneurship dan berkarakter Islami yang berkontribusi pada pembangunan masyarakat maritime.',
    'Menghasilkan penelitian dan publikasi yang berkontribusi terhadap pengembangan IPTEKS.',
    'Menghasilkan produk pengabdian kepada masyarakat dan publikasi yang berbasis riset dan inovatif serta berkontribusi pada pembangunan masyarakat maritim.',
    'Tercapainya peningkatan mutu tata kelola (good university governance) dalam sistem manajemen institusi.',
    'Terwujudnya tata kelola keuangan universitas yang sesuai dengan standar good university governance, sumber daya manusia yang berkualitas dan berkarakter Islami, dan tercapainya kemandirian sumber-sumber pendapatan universitas untuk mendukung pelaksanaan Caturdarma secara konsisten dan berkelanjutan.',
    'Terwujudnya nilai-nilai Al Islam Kemuhammadiyahan dalam kehidupan sivitas akademik dan kerjasama yang saling menguntungkan dengan berbagai pihak dalam mewujudkan Caturdarma Perguruan Tinggi yang berkualitas dan berdaya saing global.',
  ],
}

// Program Studi Sains Data - VMTS (PLACEHOLDER - perlu data resmi dari dokumen program studi)
export const sainsDataVisi = {
  teks: 'Menjadi Program Studi Sains Data yang unggul, inovatif, dan terpercaya pada tingkat nasional dan internasional, berlandaskan nilai-nilai Islam dan Kemuhammadiyahan, untuk menghasilkan lulusan berkompeten di bidang sains data guna kemanusiaan tahun 2035.',
  status: 'placeholder' as const,
  catatan: 'Visi ini merupakan placeholder. Ganti dengan visi resmi Program Studi Sains Data yang tertera dalam SK Rektor / dokumen resmi program studi.',
}

export const sainsDataMisi = {
  daftar: [
    'Menyelenggarakan pendidikan Sains Data berkualitas, relevan, dan berlandaskan nilai-nilai Islam dan Kemuhammadiyahan.',
    'Mengembangkan penelitian inovatif di bidang sains data yang berkontribusi pada kemajuan ilmu pengetahuan dan teknologi.',
    'Melaksanakan pengabdian kepada masyarakat melalui pemanfaatan sains data untuk pemberdayaan dan pembangunan berkelanjutan.',
    'Menghasilkan lulusan yang memiliki integritas, etika profesional, dan kompetensi sains data yang diakui nasional dan internasional.',
    'Membangun jejaring kerja sama strategis dengan industri, pemerintah, dan lembaga pendidikan dalam dan luar negeri.',
  ],
  status: 'placeholder' as const,
  catatan: 'Misi ini merupakan placeholder. Ganti dengan misi resmi Program Studi Sains Data dari dokumen resmi.',
}

export const sainsDataTujuan = {
  daftar: [
    'Menghasilkan lulusan yang menguasai konsep statistika, matematika, dan komputasi untuk analisis data.',
    'Menghasilkan lulusan yang mampu merancang, mengimplementasikan, dan mengevaluasi solusi berbasis data.',
    'Menghasilkan lulusan yang memiliki sikap profesional, etika data, dan tanggung jawab sosial.',
    'Menghasilkan penelitian dan publikasi ilmiah berkualitas di bidang sains data.',
    'Mewujudkan tata kelola program studi yang transparan, akuntabel, dan berkelanjutan.',
  ],
  status: 'placeholder' as const,
  catatan: 'Tujuan ini merupakan placeholder. Ganti dengan tujuan resmi Program Studi Sains Data dari dokumen resmi.',
}

export const sainsDataSasaran = {
  kategori: [
    {
      bidang: 'Pendidikan dan Kualitas Pembelajaran',
      sasaran: [
        { indikator: 'Persentase kelulusan tepat waktu', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Kepuasan mahasiswa terhadap proses pembelajaran', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Ketersediaan kurikulum berbasis OBE dan MBKM', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Rasio dosen : mahasiswa sesuai standar', target: 'TBD', status: 'Belum ditetapkan' },
      ],
    },
    {
      bidang: 'Penelitian dan Publikasi Ilmiah',
      sasaran: [
        { indikator: 'Jumlah publikasi internasional bereputasi per dosen per tahun', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Jumlah penelitian bermitra industri/pemerintah', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Dana penelitian eksternal yang diperoleh', target: 'TBD', status: 'Belum ditetapkan' },
      ],
    },
    {
      bidang: 'Pengabdian kepada Masyarakat',
      sasaran: [
        { indikator: 'Jumlah kegiatan pengabdian berbasis sains data per tahun', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Dampak pengabdian terhadap masyarakat sasaran', target: 'TBD', status: 'Belum ditetapkan' },
      ],
    },
    {
      bidang: 'Pengembangan Mahasiswa dan Lulusan',
      sasaran: [
        { indikator: 'Persentase lulusan terserap ≤ 6 bulan', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Partisipasi mahasiswa dalam kompetisi/Lomba tingkat nas/inte', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Ketersediaan program magang/industri (MBKM)', target: 'TBD', status: 'Belum ditetapkan' },
      ],
    },
    {
      bidang: 'Tata Kelola, Penjaminan Mutu, dan Kerja Sama',
      sasaran: [
        { indikator: 'Pertahankan/tingkatkan akreditasi program studi', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Jumlah MoU/MoA dengan mitra strategis', target: 'TBD', status: 'Belum ditetapkan' },
        { indikator: 'Pelaksanaan audit mutu internal berkala', target: 'TBD', status: 'Belum ditetapkan' },
      ],
    },
  ],
  status: 'placeholder' as const,
  catatan: 'Sasaran ini merupakan placeholder struktur. Isi dengan sasaran resmi, target angka, dan timeline dari dokumen perencanaan strategis program studi.',
}

// Hierarki VMTS: Universitas → Fakultas → Program Studi
export const sainsDataVMTSHierarchy = {
  universitas: {
    visi: universitasVMTS.visi,
    misi: universitasVMTS.misi,
    tujuan: universitasVMTS.tujuan,
    sasaran: universitasVMTS.sasaran,
    status: 'resmi' as const,
  },
  fakultas: {
    visi: 'Visi Fakultas Ilmu Komputer belum tersedia dalam dokumen referensi.',
    misi: [],
    tujuan: [],
    sasaran: [],
    status: 'belum_tersedia' as const,
  },
  programStudi: {
    visi: sainsDataVisi.teks,
    misi: sainsDataMisi.daftar,
    tujuan: sainsDataTujuan.daftar,
    sasaran: sainsDataSasaran.kategori.flatMap(k => k.sasaran.map(s => s.indikator)),
    cpl: [
      'CPL 1: Sikap dan nilai (S)',
      'CPL 2: Pengetahuan (K)',
      'CPL 3: Keterampilan Umum (KU)',
      'CPL 4: Keterampilan Khusus (KK)',
    ],
    status: sainsDataVisi.status,
  },
}

// Prinsip pengembangan dari BAB II Kriteria Visi, Misi, Tujuan, dan Sasaran
export const sainsDataPrinsipPengembangan = [
  {
    nomor: 1,
    judul: 'Kejelasan, Kerealistikan, dan Keterkaitan',
    deskripsi: 'Rumusan visi, misi, tujuan, sasaran, dan strategi pencapaian sasaran harus jelas, realistis, dan saling berkaitan. Visi harus berorientasi ke masa depan jangka panjang, menunjukkan keyakinan masa depan yang lebih baik, sesuai norma dan harapan masyarakat, mencerminkan standar keunggulan, mendorong inspirasi dan komitmen pemangku kepentingan, mampu menjadi dasar perubahan dan pengembangan, serta menjadi dasar perumusan misi dan tujuan. Disertai indikator pencapaian visi tertuang dalam RIP, Renstra, dan Renop.',
    referensi: 'BAB II - 2.1.1 Poin 1: Kriteria Visi, Misi, Tujuan, dan Strategi Universitas',
  },
  {
    nomor: 2,
    judul: 'Pemahaman, Komitmen, dan Konsistensi Pengembangan',
    deskripsi: 'Seluruh pemangku kepentingan memahami, berkomitmen, dan konsisten mengembangkan institusi untuk mencapai kinerja dan mutu yang ditargetkan dengan langkah-langkah program yang terencana, efektif, dan terarah dalam menjalankan misi demi terwujudnya visi.',
    referensi: 'BAB II - 2.1.1 Poin 2: Kriteria Visi, Misi, Tujuan, dan Strategi Universitas',
  },
  {
    nomor: 3,
    judul: 'Keterkaitan dengan Visi, Misi, Tujuan, Sasaran Institusi (Hierarki)',
    deskripsi: 'VMTS Fakultas dan Program Studi dijadikan acuan penyusunan dan pengembangan VMTS unit di lingkungan Universitas Saintek Muhammadiyah. Terdapat keterkaitan vertikal: Visi Universitas → Visi Fakultas → Visi Keilmuan Program Studi → Misi → Tujuan → Sasaran → Capaian Pembelajaran Lulusan (CPL).',
    referensi: 'BAB II - 2.1.1 Poin 3 & 2.1.2 (Fakultas) & 2.1.3 (Program Studi)',
  },
  {
    nomor: 4,
    judul: 'Kejelasan, Kerealistikan, dan Keterkaitan Fakultas',
    deskripsi: 'Visi Keilmuan, Misi, Tujuan, Sasaran, dan Strategi Fakultas harus jelas, realistis, saling berkaitan, serta berkaitan dengan VMTS institusi. Fokus pada capaian pembelajaran lulusan dan mutu yang ditargetkan.',
    referensi: 'BAB II - 2.1.2: Kriteria Fakultas (a)',
  },
  {
    nomor: 5,
    judul: 'Kejelasan, Kerealistikan, dan Keterkaitan Program Studi',
    deskripsi: 'Visi Keilmuan, Misi, Tujuan, Sasaran, dan Strategi Program Studi harus jelas, realistis, saling berkaitan, serta berkaitan dengan VMTS Universitas dan VMTS Fakultas, serta keterkaitan dengan Capaian Pembelajaran Lulusan (CPL) yang ditetapkan.',
    referensi: 'BAB II - 2.1.3: Kriteria Program Studi (a)',
  },
  {
    nomor: 6,
    judul: 'Pemahaman, Komitmen, dan Konsistensi Fakultas & Program Studi',
    deskripsi: 'Pengembangan Fakultas dan Program Studi didasarkan pada pemahaman, komitmen, dan konsistensi untuk mencapai visi dan capaian pembelajaran lulusan serta mutu yang ditargetkan dengan langkah-langkah program yang terencana, efektif, dan terarah.',
    referensi: 'BAB II - 2.1.2 (b) Fakultas & 2.1.3 (b) Program Studi',
  },
]

// Tentang Program Studi Sains Data (konten generik disiplin)
export const sainsDataTentang = `Program Studi Sains Data Universitas Saintek Muhammadiyah (USM) berada di bawah Fakultas Ilmu Komputer dan berfokus pada pengembangan ilmu pengetahuan serta teknologi di bidang sains data. Program studi ini dirancang untuk menghasilkan lulusan yang kompeten dalam mengelola, menganalisis, dan memanfaatkan data skala besar guna mendukung pengambilan keputusan berbasis bukti di berbagai sektor.

Ruang lingkup keilmuan Program Studi Sains Data mencakup, namun tidak terbatas pada:

- **Statistika matematika & inferensial** — fondasi analisis data yang rigor
- **Pemrograman komputasional & struktur data** — pengolahan data yang efisien dan skalabel
- **Eksplorasi data, visualisasi, & data storytelling** — mengubah data mentah menjadi wawasan yang dapat ditindaklanjuti
- **Pembelajaran mesin, pembelajaran mendalam, & kecerdasan buatan** — pemodelan prediktif dan preskriptif
- **Penambangan data (data mining) & analisis prediktif** — menemukan pola tersembunyi dalam data besar
- **Big data analytics & komputasi berkinerja tinggi** — menangani volume, velocity, dan variety data
- **Etika data, tata kelola data, & privasi informasi** — aspek hukum, sosial, dan moral dalam pengelolaan data

Program studi mengadopsi pendekatan interdisipilin yang menggabungkan ilmu komputer, statistika, matematika terapan, dan pengetahuan domain untuk memecahkan masalah kompleks berbasis data.`