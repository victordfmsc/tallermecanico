# API Routes (Next.js App Router)

In the Next.js version, backend routes are placed here as Route Handlers.

Each file in `src/app/api/` corresponds to an Express route in `src/routes.ts`.

## Migration Guide

Convert each Express route to a Next.js Route Handler:

```
Express (src/routes.ts)         →   Next.js (src/app/api/)
─────────────────────────────────────────────────────────
GET  /api/dashboard             →   src/app/api/dashboard/route.ts
GET  /api/technicians           →   src/app/api/technicians/route.ts
POST /api/technicians           →   src/app/api/technicians/route.ts (same file)
GET  /api/customers             →   src/app/api/customers/route.ts
POST /api/customers             →   src/app/api/customers/route.ts
GET  /api/work-orders           →   src/app/api/work-orders/route.ts
POST /api/work-orders           →   src/app/api/work-orders/route.ts
PATCH /api/work-orders/:id      →   src/app/api/work-orders/[id]/route.ts
GET  /api/estimates             →   src/app/api/estimates/route.ts
GET  /api/invoices              →   src/app/api/invoices/route.ts
GET  /api/inspections           →   src/app/api/inspections/route.ts
GET  /api/inventory             →   src/app/api/inventory/route.ts
GET  /api/messages              →   src/app/api/messages/route.ts
GET  /api/campaigns             →   src/app/api/campaigns/route.ts
GET  /api/vehicles              →   src/app/api/vehicles/route.ts
GET  /api/workboard             →   src/app/api/workboard/route.ts
```

## Example Route Handler

```typescript
// src/app/api/technicians/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/storage'

export async function GET(request: NextRequest) {
  const technicians = await storage.getTechnicians()
  return NextResponse.json(technicians)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const technician = await storage.createTechnician(body)
  return NextResponse.json(technician, { status: 201 })
}
```

## Database

The demo uses in-memory storage (`src/storage.ts`).
For production, replace with Prisma + PostgreSQL:

1. Set up `DATABASE_URL` in `.env.local`
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. Replace MemStorage with PrismaStorage in `src/storage.ts`

See `prisma/schema.prisma` for the database schema.
