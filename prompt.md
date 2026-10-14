# Prompt: Lanjutkan pengerjaan struktur BPM halaman dan fitur view dokumen

Konteks:
- Repo: Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui
- Folder public BPM sudah ada: /app/(public)/bpm/profile/page.tsx (berisi konten Profil BPM)
- User ingin struktur route seperti: /bpm/spmi/pedoman-ami, /bpm/spmi/ami-program-studi, /bpm/spmi/ami-unit-kerja, /bpm/spmi/survei-kepuasan-mahasiswa, /bpm/spmi/evaluasi-pmb, /bpm/spmi/monev-pembelajaran, /bpm/spmi/evaluasi-ketercapaian-standar, /bpm/spmi/rtm-dan-rtl, /bpm/ppepp/*, /bpm/dokumen-spmi/*, /bpm/dokumen-bpm/*, /bpm/spme, /bpm/spme/peraturan-akreditasi, /bpm/spme/data-akreditai-institusi, /bpm/spme/data-akreditasi-program-studi
- Navbar dropdown BPM sudah mengarah ke route tersebut
- Ingin halaman-halamannya dibuat rapi (UI/UX) dan bisa link/view dokumen (PDF) di dalam web

Yang harus dikerjakan:
1. Buat halaman kosong/rapi untuk semua route BPM yang sudah dibuat folder-nya (setiap page.tsx berisi komponen konsisten: PageHeader, judul, deskripsi, card grid untuk dokumen, tombol "Lihat Dokumen"/"Unduh", kalau link PDF bisa dibuka inline/modal/lightbox)
2. Tambahkan data mapping sederhana (mis. app/data/bpm.ts atau per-kategori) berisi daftar dokumen: { id, title, kategori, fileUrl, description }
3. Buat komponen reusable: DocumentCard, DocumentGrid, PdfViewer (opsional modal) untuk menampilkan/view dokumen
4. Update treeNodes/BPM nav jika ada yang perlu disesuaikan
5. Konsisten styling dengan shadcn, responsif, minimal
6. Lint + build aman
