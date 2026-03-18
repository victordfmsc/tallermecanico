/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;

// Sentry configuration is typically handled via sentry.server.config.js etc.
// For Next.js 14 with ESM, we wrap the export if needed.
// However, to keep it simple and avoid build errors without credentials,
// we'll let the user decide if they want to wrap it with withSentryConfig later.
// Note: next.config.mjs doesn't easily support the conditional require/module.exports pattern used in the .ts version.
