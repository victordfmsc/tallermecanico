import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'shopflow.app' },
      { protocol: 'https', hostname: 'getshopflow.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'shopflow.app', 'getshopflow.com'],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.fontshare.com",
              "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://api.fontshare.com",
              "connect-src 'self' https:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

// Only wrap with Sentry if DSN is configured — avoids build errors without credentials
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  const { withSentryConfig } = require('@sentry/nextjs');
  module.exports = withSentryConfig(
    nextConfig,
    {
      silent: true,
      org: process.env.SENTRY_ORG || 'shopflow',
      project: process.env.SENTRY_PROJECT || 'shop-management',
    },
    {
      widenClientFileUpload: true,
      transpileClientSDK: true,
      tunnelRoute: '/monitoring',
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    }
  );
} else {
  module.exports = nextConfig;
}
