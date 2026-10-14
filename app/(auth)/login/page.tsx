import type { Metadata } from 'next'
import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = {
  title: 'Masuk | Sains Data - Universitas Saintek Muhammadiyah',
  description: 'Masuk ke dasbor akreditasi menggunakan email atau akun GitHub.',
}

const oauthErrors: Record<string, string> = {
  oauth_state: 'Sesi login GitHub tidak valid atau kedaluwarsa. Silakan coba lagi.',
  oauth_token: 'Gagal menukar kode otorisasi GitHub. Silakan coba lagi.',
  oauth_profile: 'Gagal mengambil profil dari GitHub. Silakan coba lagi.',
  oauth_email: 'Email GitHub tidak tersedia. Pastikan email utama akun GitHub Anda sudah terverifikasi.',
  oauth_inactive: 'Akun Anda tidak aktif. Hubungi administrator.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const oauthError = error
    ? (oauthErrors[error] ?? 'Login dengan GitHub gagal. Silakan coba lagi.')
    : null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm oauthError={oauthError} />
      </div>
    </div>
  )
}
