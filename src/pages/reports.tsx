import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Euro, TrendingUp, Wrench, Users } from "lucide-react";

const monthlyRevenue = [
  { month: "Abr", revenue: 28500 }, { month: "May", revenue: 32100 },
  { month: "Jun", revenue: 29800 }, { month: "Jul", revenue: 34200 },
  { month: "Ago", revenue: 26400 }, { month: "Sep", revenue: 31500 },
  { month: "Oct", revenue: 35800 }, { month: "Nov", revenue: 38200 },
  { month: "Dic", revenue: 29100 }, { month: "Ene", revenue: 33400 },
  { month: "Feb", revenue: 36700 }, { month: "Mar", revenue: 41200 },
];

const serviceProfitability = [
  { name: "Mecánica", value: 38, fill: "hsl(22, 85%, 52%)" },
  { name: "Frenos", value: 22, fill: "hsl(201, 83%, 45%)" },
  { name: "Eléctrica", value: 15, fill: "hsl(262, 55%, 52%)" },
  { name: "Neumáticos", value: 12, fill: "hsl(173, 58%, 39%)" },
  { name: "Otros", value: 13, fill: "hsl(43, 74%, 49%)" },
];

export default function Reports() {
  const { data: technicians = [] } = useQuery<any[]>({ queryKey: ["/api/technicians"] });

  const kpis = [
    { label: "Ingresos Anuales", value: "€396.900", icon: Euro, color: "text-emerald-500", change: "+12.4%" },
    { label: "Margen Medio", value: "42%", icon: TrendingUp, color: "text-blue-500", change: "+3.2%" },
    { label: "ROs Completadas/Mes", value: "147", icon: Wrench, color: "text-primary", change: "+8%" },
    { label: "Clientes Activos", value: "324", icon: Users, color: "text-purple-500", change: "+15" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Informes</h1>
        <div className="flex items-center gap-2">
          <div>
            <Label className="text-xs">Desde</Label>
            <Input type="date" defaultValue="2025-04-01" className="h-8 text-xs" data-testid="date-from" />
          </div>
          <div>
            <Label className="text-xs">Hasta</Label>
            <Input type="date" defaultValue="2026-03-16" className="h-8 text-xs" data-testid="date-to" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                    {kpi.value}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{kpi.change}</p>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Ingresos Mensuales (12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`€${value.toLocaleString("es-ES")}`, "Ingresos"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(22, 85%, 52%)" strokeWidth={2.5} dot={{ fill: "hsl(22, 85%, 52%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Rentabilidad por Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceProfitability}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {serviceProfitability.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`${value}%`, "Porcentaje"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Technician Productivity Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Productividad por Técnico</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">Técnico</th>
                  <th className="p-3 font-medium">Especialidad</th>
                  <th className="p-3 font-medium text-center">Eficiencia</th>
                  <th className="p-3 font-medium text-center">ROs Completadas</th>
                  <th className="p-3 font-medium text-center">Horas Productivas</th>
                  <th className="p-3 font-medium text-right">Ingresos Generados</th>
                </tr>
              </thead>
              <tbody>
                {technicians.map((tech: any, i: number) => (
                  <tr key={tech.id} className="border-b last:border-0" data-testid={`tech-report-${tech.id}`}>
                    <td className="p-3 font-medium">{tech.name}</td>
                    <td className="p-3 text-muted-foreground">{tech.specialty}</td>
                    <td className="p-3 text-center">
                      <span className={`font-semibold ${tech.efficiency >= 90 ? "text-green-600" : tech.efficiency >= 80 ? "text-amber-600" : "text-red-600"}`}>
                        {tech.efficiency}%
                      </span>
                    </td>
                    <td className="p-3 text-center">{42 + i * 7}</td>
                    <td className="p-3 text-center">{(120 + i * 15).toFixed(0)}h</td>
                    <td className="p-3 text-right font-medium">€{(18500 + i * 3200).toLocaleString("es-ES")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
