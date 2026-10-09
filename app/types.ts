export type DocumentStatus = 'Berlaku' | 'Revisi' | 'Draft'
export type StandardStatus = 'Tercapai' | 'Sesuai' | 'Dalam Evaluasi'
export type UserRole = 'sudo' | 'admin' | 'user'

export interface TreeNode {
  id: string
  label: string
  meta?: string
  href?: string
  children?: TreeNode[]
}

export interface Institution {
  nama: string
  singkatan: string
  statusAkreditasi: string
  statusAkreditasiSk: string
  statusAkreditasiBerlaku: string
  tahunBerdiri: number
  alamat: string
  mapsUrl: string
  website: string
  email: string
  telepon: string
  jamLayanan: string
  tentang: string
  visi: string
  misi: string[]
  tujuan: string[]
}

export interface ProgramStudi {
  id: string
  nama: string
  jenjang: 'S1' | 'S2'
  fakultas: string
  akreditasi: string
  tahunAkreditasi: number
  skAkreditasi: string
}

export interface OrgNode {
  id: string
  jabatan: string
  nama: string
  children?: OrgNode[]
}

export interface SupportingDocument {
  id: string
  judul: string
  deskripsi: string
  tahun: number
  nomor: string
  status: DocumentStatus
  jenis: string
  fileType: string
}

export interface SpmiCategory {
  id: string
  nama: string
  deskripsi: string
}

export interface SpmiDocument extends SupportingDocument {
  categoryId: string
}

export interface StandardIndicator {
  id: string
  pernyataan: string
  capaian: string
}

export interface Standard {
  id: string
  groupId: string
  kode: string
  nama: string
  deskripsi: string
  tujuan: string
  ruangLingkup: string[]
  indikator: StandardIndicator[]
  documentIds: string[]
  tahun: number
  status: StandardStatus
}

export interface StandardGroup {
  id: string
  nama: string
  deskripsi: string
}

export interface DokumenUpload {
  kriteria: string
  subKriteria: string
  indikator: string
  namaFile: string
  deskripsi: string
  link: string
}

export interface InstrumenChild {
  no: number
  subKriteria: string
  indikator: string
  doc?: DokumenUpload
  fileName?: string
  fileUrl?: string
}

export interface InstrumenRow {
  no: number
  id: string
  subKriteria: string
  indikator: string
  penjelasanProdi?: string
  children?: InstrumenChild[]
}

export interface InstrumenSection {
  no: number
  nama: string
  rows: InstrumenRow[]
}

export interface User {
  id: number
  email: string
  username: string
  role: UserRole
  created_at: string
}

export interface AuthUser {
  id: number
  email: string
  username: string
  role: UserRole
}
