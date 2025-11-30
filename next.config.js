/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'bongao.firebasestorage.app',
      },
      {
        protocol: 'https',
        hostname: 'tawi-tawi.gov.ph',
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
}

module.exports = nextConfig
