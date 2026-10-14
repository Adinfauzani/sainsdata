import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Stable since Next.js 16 (previously `experimental.reactCompiler`).
  reactCompiler: true,
  async redirects() {
    return [
      // The reference site (and older links) misspell "akreditasi" as
      // "akreditai". Keep the legacy path working with a permanent redirect.
      {
        source: '/bpm/spme/data-akreditai-institusi',
        destination: '/bpm/spme/data-akreditasi-institusi',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
