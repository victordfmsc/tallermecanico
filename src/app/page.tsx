/**
 * ShopFlow — Root page
 * Redirects to /dashboard
 * 
 * In the demo version (Vite + Express), routing is handled by wouter with hash routing.
 * In the Next.js version, use Next.js App Router with proper page files in each route directory.
 * 
 * Each page in src/pages/ corresponds to a Next.js route:
 *   src/pages/dashboard.tsx     → src/app/dashboard/page.tsx
 *   src/pages/workboard.tsx     → src/app/workboard/page.tsx
 *   src/pages/work-orders.tsx   → src/app/work-orders/page.tsx
 *   ... etc
 */

import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
