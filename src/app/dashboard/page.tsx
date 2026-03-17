"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, Euro, Users, CalendarDays, 
  AlertTriangle, Package, RefreshCcw, FileText
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery<any>({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      const resp = await fetch("/api/dashboard");
      if (!resp.ok) throw new Error("Failed to fetch dashboard data");
      return resp.json();
    }
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Error al cargar el Dashboard</h2>
          <p className="text-muted-foreground mt-1">No hemos podido conectar con el servidor.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Reintentar
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const { kpis, weeklyRevenue, statusCounts, recentOrders, alerts } = data;

  const kpiCards = [
    { label: "ROs Hoy", value: kpis.todayOrders, icon: ClipboardList, color: "text-primary" },
    { label: "Facturación Semana", value: `€${kpis.weekRevenue.toLocaleString("es-ES")}`, icon: Euro, color: "text-emerald-500" },
    { label: "Técnicos Activos", value: kpis.activeTechs, icon: Users, color: "text-blue-500" },
    { label: "Citas Pendientes", value: kpis.pendingAppts, icon: CalendarDays, color: "text-amber-500" },
  ];

  const barData = [
    { name: "Pendiente", count: statusCounts.pending || 0, fill: "hsl(220, 9%, 46%)" },
    { name: "Diagnóstico", count: statusCounts.diagnosis || 0, fill: "hsl(43, 74%, 49%)" },
    { name: "En Reparación", count: statusCounts.in_progress || 0, fill: "hsl(22, 85%, 52%)" },
    { name: "Listo", count: statusCounts.completed || 0, fill: "hsl(142, 71%, 45%)" },
    { name: "Entregado", count: statusCounts.delivered || 0, fill: "hsl(201, 83%, 45%)" },
  ];

  const statusLabels: Record<string, string> = {
    pending: "Pendiente",
    diagnosis: "Diagnóstico",
    in_progress: "En Reparación",
    completed: "Listo",
    delivered: "Entregado",
  };
  
  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    diagnosis: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    in_progress: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    delivered: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
          Dashboard
        </h1>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs gap-2">
          <RefreshCcw className="h-3 w-3" /> Actualizar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(kpi => (
          <Card key={kpi.label} className="border-border/50 bg-[#121212]/50 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-3xl font-bold mt-1 text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {kpi.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-opacity-10 ${kpi.color.replace('text-', 'bg-')}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-[#121212]/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-white">Tendencia de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(val) => `€${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                  formatter={(value: number) => [`€${value.toLocaleString("es-ES")}`, "Ingresos"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4, stroke: "#121212" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-[#121212]/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-white">Órdenes por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                  {barData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 bg-[#121212]/50">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-white">Últimas Órdenes de Trabajo</CardTitle>
              <Button variant="ghost" className="text-xs text-primary">Ver todas</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-muted-foreground bg-white/5 border-b border-border/50">
                    <th className="px-6 py-3 font-medium">Orden</th>
                    <th className="px-6 py-3 font-medium">Cliente & Vehículo</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium text-right font-mono">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.map((wo: any) => (
                    <tr key={wo.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white uppercase">#{String(wo.id).slice(-4)}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(wo.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{wo.customer?.name}</span>
                          <span className="text-xs text-muted-foreground uppercase">{wo.vehicle?.brand} {wo.vehicle?.model} • {wo.vehicle?.plate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`rounded-md font-medium px-2 py-0.5 text-[10px] uppercase ${statusColors[wo.status] || ""}`}>
                          {statusLabels[wo.status] || wo.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-white tracking-tight">€{wo.totalAmount.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-[#121212]/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-white">Panel de Alertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                data-testid={`alert-${i}`}
              >
                <div className={`p-2 rounded-lg ${alert.type === 'inventory' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                  {alert.type === "inventory" ? (
                    <Package className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white uppercase">{alert.type === 'inventory' ? 'Inventario' : 'Cita'}</span>
                  <p className="text-sm text-gray-300 leading-tight">{alert.message}</p>
                </div>
              </div>
            ))}
            
            <Button variant="ghost" className="w-full mt-2 text-xs text-muted-foreground hover:text-white">
              Cargar más notificaciones
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="border-border/50 bg-[#121212]/50">
            <CardContent className="p-5">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-[#121212]/50">
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-[240px] w-full" /></CardContent>
        </Card>
        <Card className="border-border/50 bg-[#121212]/50">
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-[240px] w-full" /></CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 bg-[#121212]/50 p-6"><Skeleton className="h-64 w-full" /></Card>
        <Card className="border-border/50 bg-[#121212]/50 p-6"><Skeleton className="h-64 w-full" /></Card>
      </div>
    </div>
  );
}
