"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  BarChart3, Users, Building2, TrendingUp, AlertCircle, 
  ExternalLink, ShieldAlert, CalendarClock, UserCog, UserCircle2,
  MoreVertical, CreditCard
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      const resp = await fetch("/api/admin/dashboard");
      if (!resp.ok) throw new Error("Failed to load admin data");
      return resp.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ shopId, action }: { shopId: string, action: string }) => {
      const resp = await fetch("/api/admin/dashboard", {
        method: "PATCH",
        body: JSON.stringify({ shopId, action })
      });
      if (!resp.ok) throw new Error("Action failed");
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
    }
  });

  if (isLoading) return <AdminSkeleton />;

  const { stats, growthData, shopList, alerts } = data;

  const kpis = [
    { label: "MRR Total", value: `€${stats.mrr.toLocaleString("es-ES")}`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Talleres Activos", value: stats.activeShops, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "En Prueba (Trial)", value: stats.trialShops, icon: CalendarClock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Churn / Cancelados", value: stats.cancelledShops, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const statusColors: any = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    FREE_TRIAL: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    PAST_DUE: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Super Admin Control</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest">ShopFlow Platform Overview (Global)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/5 bg-white/5 font-bold uppercase tracking-widest text-[10px]">
             Exportar CSV 
          </Button>
          <Button className="bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px]">
            Nuevo Mensaje Global
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="bg-[#121212]/50 border-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{kpi.label}</p>
                  <p className="text-3xl font-black mt-2 tracking-tighter italic">{kpi.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <Card className="lg:col-span-2 bg-[#121212]/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-400">Crecimiento de Talleres (Nuevos registros)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E85C1A" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#E85C1A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#555', fontWeight: 800 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#555', fontWeight: 800 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: "#121212", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  />
                  <Bar dataKey="newShops" radius={[4, 4, 0, 0]}>
                    {growthData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Failed Payment Alerts */}
        <Card className="bg-[#121212]/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Alertas de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert: any, i: number) => (
              <div key={i} className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black uppercase text-white">{alert.shopName}</span>
                  <Badge variant="outline" className="text-[8px] bg-red-500/10 text-red-500 border-red-500/20">FALLIDO</Badge>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Suscripción Profesional — Reintento automático en 24h</p>
                <Button size="sm" variant="link" className="p-0 h-auto text-[10px] text-red-500 font-black uppercase">Notificar Owner</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Workshops Table */}
      <Card className="bg-[#121212]/50 border-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-tighter italic">Gestión de Talleres</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-zinc-500">Listado completo de partners y suscripciones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white/5">
                  <th className="px-6 py-4">Taller</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Registrado</th>
                  <th className="px-6 py-4">Core Stats</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shopList.map((shop: any) => (
                  <tr key={shop.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black uppercase italic tracking-tight text-white">{shop.name}</span>
                        <span className="text-[10px] font-medium text-zinc-500">{shop.ownerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black">{shop.plan}</td>
                    <td className="px-6 py-4">
                      <Badge className={`text-[9px] font-black uppercase px-2 py-0 border ${statusColors[shop.status]}`}>
                        {shop.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {format(new Date(shop.createdAt), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-zinc-600 text-[8px] font-black uppercase">Técnicos</span>
                          <span className="text-xs font-black italic">{shop.techCount}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-zinc-600 text-[8px] font-black uppercase">Órdenes</span>
                          <span className="text-xs font-black italic">{shop.woCount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 border-white/10 bg-white/5 font-black uppercase text-[9px] hover:bg-primary hover:text-white"
                          onClick={() => {
                            // Impersonation logic usually involves setting a special cookie or storage key
                            alert(`Entering as ${shop.name} (Simulation)`);
                          }}
                        >
                          <UserCircle2 className="h-3 w-3 mr-2" /> Entrar
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#121212] border-white/10 font-black uppercase text-[10px]">
                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => mutation.mutate({ shopId: shop.id, action: "EXTEND_TRIAL" })}>
                              <CalendarClock className="h-3 w-3" /> Extender Trial 14d
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="text-red-500 gap-2 cursor-pointer" onClick={() => mutation.mutate({ shopId: shop.id, action: "CANCEL_SUBSCRIPTION" })}>
                              <X className="h-3 w-3" /> Cancelar Suscripción
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
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

function AdminSkeleton() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      <div className="h-10 bg-white/5 w-64 rounded" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-[350px] bg-white/5 rounded-xl" />
        <div className="h-[350px] bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
