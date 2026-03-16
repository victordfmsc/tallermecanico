# ShopFlow — Auto Repair Shop Management SaaS

A complete, production-ready auto repair shop management platform built with **Next.js 14 + TypeScript**.

## Features

### Principal
- **Dashboard** — KPIs en tiempo real, gráficas de ingresos y órdenes por estado
- **Workboard** — Kanban visual de órdenes de trabajo (Pendiente → Diagnóstico → En Reparación → Listo → Entregado)
- **Calendario** — Programación de citas con vista semanal por técnico y bahía

### Taller
- **Órdenes de Trabajo** — Gestión completa del ciclo de vida de reparaciones
- **Presupuestos Digitales** — Creación, envío y aprobación digital de presupuestos
- **Facturas** — Facturación con 1 clic desde la orden de trabajo
- **Inspecciones Digitales (DVI)** — Inspecciones con fotos, videos y notas por sección
- **Inventario** — Control de stock con alertas de bajo inventario y pedido automático

### Clientes
- **CRM de Clientes** — Historial completo, comunicación SMS/Email integrada
- **Gestión de Vehículos** — Base de datos con VIN lookup y historial de servicio
- **Chat en Vivo** — Mensajería directa con clientes desde el taller

### Equipo
- **Técnicos** — Gestión de productividad, eficiencia y asignación de trabajos
- **App Técnico** — Interfaz móvil para técnicos: inspecciones, tiempo, fotos

### Negocio
- **Pedido de Piezas** — Comparativa multi-proveedor con carrito integrado
- **Marketing** — Campañas SMS/Email, solicitudes de reseñas, recordatorios
- **Informes** — KPIs de rentabilidad, productividad técnica, análisis de ingresos

### Configuración
- Información del taller, usuarios y roles, integraciones (QuickBooks, Stripe, CARFAX, PartsTech)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui |
| State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Database | PostgreSQL + Prisma ORM |
| Icons | Lucide React |
| Fonts | Cabinet Grotesk (Fontshare) + Inter |

---

## Quick Start (Demo — In-Memory)

```bash
# 1. Install dependencies
npm install

# 2. Start the demo server (uses in-memory storage, no DB needed)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The demo uses `src/storage.ts` with mock data — no database required.

---

## Production Setup (with PostgreSQL)

```bash
# 1. Clone and install
git clone https://github.com/your-user/shopflow.git
cd shopflow
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and other keys

# 3. Set up database
npx prisma generate
npx prisma db push

# 4. Run development server
npm run dev

# 5. Build for production
npm run build
npm start
```

---

## Project Structure

```
shopflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Root → redirects to /dashboard
│   │   ├── api/                # API Route Handlers (Next.js)
│   │   │   └── README.md       # Migration guide from Express routes
│   │   ├── dashboard/          # Each route gets its own directory
│   │   ├── workboard/
│   │   ├── work-orders/
│   │   └── ...
│   │
│   ├── pages/                  # Page components (from demo version)
│   │   ├── dashboard.tsx       # → Move to app/dashboard/page.tsx
│   │   ├── workboard.tsx       # → Move to app/workboard/page.tsx
│   │   ├── calendar.tsx
│   │   ├── work-orders.tsx
│   │   ├── estimates.tsx
│   │   ├── invoices.tsx
│   │   ├── inspections.tsx
│   │   ├── inventory.tsx
│   │   ├── customers.tsx
│   │   ├── vehicles.tsx
│   │   ├── live-chat.tsx
│   │   ├── technicians.tsx
│   │   ├── tech-app.tsx
│   │   ├── parts-ordering.tsx
│   │   ├── marketing.tsx
│   │   ├── reports.tsx
│   │   └── settings.tsx
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (Button, Card, Table...)
│   │   ├── layout/             # AppShell, Sidebar, Header, ThemeProvider
│   │   └── features/           # Feature-specific components
│   │
│   ├── lib/
│   │   ├── queryClient.ts      # TanStack Query client + apiRequest helper
│   │   └── utils.ts            # cn() utility, formatters
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile breakpoint detection
│   │   └── use-toast.ts        # Toast notifications
│   │
│   ├── types/
│   │   └── schema.ts           # Zod schemas + TypeScript types (Drizzle-derived)
│   │
│   ├── routes.ts               # Express API routes (demo) → migrate to app/api/
│   ├── storage.ts              # In-memory storage (demo) → replace with Prisma
│   ├── App.tsx                 # Root component with routing (demo version)
│   └── index.css               # Global styles + CSS variables (Tailwind)
│
├── prisma/
│   └── schema.prisma           # Production database schema
│
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Migration: Demo → Production Next.js

The demo version runs with Vite + Express. To convert to full Next.js:

### 1. Move pages to App Router

```bash
# For each page:
mkdir -p src/app/dashboard
cp src/pages/dashboard.tsx src/app/dashboard/page.tsx
# Add 'use client' directive at the top of each page
```

### 2. Convert API routes

See `src/app/api/README.md` for the full guide on converting Express routes to Next.js Route Handlers.

### 3. Replace storage

```typescript
// src/storage.ts — replace MemStorage with:
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const storage = {
  getTechnicians: () => prisma.technician.findMany(),
  // ... etc
}
```

### 4. Add 'use client' where needed

Pages that use React hooks (useState, useEffect, useQuery) need the `'use client'` directive at the top.

---

## Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| QuickBooks Online | Accounting sync | Ready to connect |
| Stripe | Payment processing | Ready to connect |
| CARFAX | Vehicle history | Ready to connect |
| PartsTech | Parts ordering | Ready to connect |
| Twilio | SMS campaigns | Configure in .env |
| SendGrid | Email campaigns | Configure in .env |

---

## Design System

- **Primary color**: Orange `#E85C1A` (HSL: `22 85% 52%`)
- **Font display**: Cabinet Grotesk (Fontshare)
- **Font body**: Inter (Google Fonts)
- **Dark mode**: Class-based (`dark:` Tailwind utilities)
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

---

## License

MIT — free to use and modify for any purpose.
