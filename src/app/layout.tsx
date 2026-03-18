import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ShopFlow — Auto Shop Management',
  description: 'Complete auto repair shop management platform. Manage work orders, estimates, invoices, inventory, and customer relationships.',
  keywords: ['auto repair', 'shop management', 'work orders', 'automotive', 'SaaS'],
}

import { Providers } from '@/components/Providers'
import { TrialBanner } from '@/components/TrialBanner'
import { PostHogProvider, PostHogPageview } from '@/components/PostHogProvider'
import { Suspense } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Cabinet Grotesk from Fontshare — used for headings and display */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PostHogProvider>
          <Suspense>
            <PostHogPageview />
          </Suspense>
          <Providers>
            <TrialBanner />
            {children}
          </Providers>
        </PostHogProvider>
      </body>
    </html>
  )
}
