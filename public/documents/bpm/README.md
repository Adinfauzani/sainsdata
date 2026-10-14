# Dokumen BPM (berkas lokal)

Folder ini menampung berkas dokumen BPM yang dihosting sendiri oleh aplikasi.

- Letakkan berkas PDF di subfolder sesuai kategori, misalnya
  `public/documents/bpm/dokumen-spmi/kebijakan-spmi/kebijakan-spmi.pdf`.
- Daftarkan berkas pada registri terpusat di `app/data/bpm.ts` dengan
  `kind: 'file'`, `provider: 'local'`, `mimeType: 'application/pdf'`, dan
  `fileUrl` berupa path relatif aplikasi (contoh
  `/documents/bpm/dokumen-spmi/kebijakan-spmi/kebijakan-spmi.pdf`).
- Dokumen dengan `isPublished: false` tidak akan ditampilkan pada halaman publik.

Saat ini registri hanya memuat tautan folder Google Drive yang terverifikasi dari
situs resmi BPM (https://sites.google.com/view/bpmsaintekmu). Tidak ada berkas PDF
lokal yang dikonfigurasi, sehingga tidak ada viewer PDF yang dapat diuji dengan
berkas nyata sampai berkas ditambahkan di sini.
