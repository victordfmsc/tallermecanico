import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable App Router (default in Next.js 14)
  reactStrictMode: true,
  // Image optimization
  images: {
    domains: [],
  },
  // API routes are in src/app/api/
  // The demo version uses in-memory storage (storage.ts)
  // For production: replace with Prisma + PostgreSQL
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

export default nextConfig
