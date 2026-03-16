import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Euro, Users, CalendarDays, AlertTriangle, Package } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
      </div>
    );
  }

  const { kpis, weeklyRevenue, statusCounts, recentOrders, alerts } = data || {
    kpis: { todayOrders: 0, weekRevenue: 0, activeTechs: 0, pendingAppts: 0 },
    weeklyRevenue: [],
    statusCounts: {},
    recentOrders: [],
    alerts: [],
  };

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
      <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(kpi => (
          <Card key={kpi.label} data-testid={`kpi-${kpi.label}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                    {kpi.value}
                  </p>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Ingresos Semanales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`€${value.toLocaleString("es-ES")}`, "Ingresos"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(22, 85%, 52%)"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(22, 85%, 52%)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Órdenes por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Últimas Órdenes de Trabajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium">Servicio</th>
                    <th className="pb-2 font-medium">Estado</th>
                    <th className="pb-2 font-medium text-right">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentOrders || []).map((wo: any) => (
                    <tr key={wo.id} className="border-b last:border-0" data-testid={`recent-wo-${wo.id}`}>
                      <td className="py-2.5 font-mono text-xs">RO-{String(wo.id).padStart(4, "0")}</td>
                      <td className="py-2.5">{wo.services?.[0] || "—"}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColors[wo.status] || ""}`}>
                          {statusLabels[wo.status] || wo.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium">€{wo.totalAmount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Alertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(alerts || []).map((alert: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-sm"
                data-testid={`alert-${i}`}
              >
                {alert.type === "inventory" ? (
                  <Package className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                )}
                <span className="text-amber-800 dark:text-amber-300">{alert.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
