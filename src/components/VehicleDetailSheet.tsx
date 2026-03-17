"use client";

import { useQuery } from "@tanstack/react-query";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Car, Gauge, Calendar, Palette, 
  History, User, Fingerprint, Loader2,
  CheckCircle2, Clock
} from "lucide-react";

export function VehicleDetailSheet({ vehicle, onClose }: { vehicle: any; onClose: () => void }) {
  const { data: orders, isLoading: loadingOrders } = useQuery<any[]>({
    queryKey: ["/api/work-orders", { vehicleId: vehicle?.id }],
    queryFn: () => fetch(`/api/work-orders?vehicleId=${vehicle?.id}`).then(res => res.json()),
    enabled: !!vehicle?.id,
  });

  const { data: customer } = useQuery<any>({
    queryKey: ["/api/customers", vehicle?.customerId],
    queryFn: () => fetch(`/api/customers/${vehicle?.customerId}`).then(res => res.json()),
    enabled: !!vehicle?.customerId,
  });

  if (!vehicle) return null;

  return (
    <SheetContent className="w-full sm:max-w-md md:max-w-xl bg-[#0a0a0a] border-white/10 overflow-y-auto">
      <SheetHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[10px] tracking-widest px-3">
            VIN: {vehicle.vin.slice(-8).toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-white border-white/20 uppercase text-[10px] tracking-widest px-3">
            {vehicle.licensePlate}
          </Badge>
        </div>
        <SheetTitle className="text-3xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {vehicle.brand} {vehicle.model}
        </SheetTitle>
        <SheetDescription className="text-muted-foreground flex items-center gap-2">
          <User className="h-4 w-4" />
          Propietario: {customer?.name || vehicle.customerName || "Cargando..."}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-8 space-y-8 pb-32">
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <Calendar className="h-3 w-3" /> Año
            </div>
            <p className="font-bold text-white text-lg">{vehicle.year}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <Palette className="h-3 w-3" /> Color
            </div>
            <p className="font-bold text-white text-lg uppercase">{vehicle.color}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <Gauge className="h-3 w-3" /> Odómetro
            </div>
            <p className="font-bold text-white text-lg">{vehicle.mileage.toLocaleString()} <span className="text-xs font-normal text-muted-foreground ml-1">Km</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <Fingerprint className="h-3 w-3" /> Placa
            </div>
            <p className="font-bold text-white text-lg uppercase tracking-tighter">{vehicle.licensePlate}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Número de Bastidor (VIN)</p>
          <p className="font-mono text-sm text-white break-all">{vehicle.vin}</p>
        </div>

        <Separator className="bg-white/5" />

        {/* Timeline Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <History className="h-4 w-4" /> Línea de Tiempo de Servicios
          </h3>
          
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
            {loadingOrders ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
            ) : orders?.length === 0 ? (
              <p className="text-sm text-muted-foreground italic ml-8">Sin historial de servicios</p>
            ) : (
              orders?.map((wo, i) => (
                <div key={wo.id} className="relative flex items-start gap-4 group">
                  <div className="mt-1.5 shrink-0">
                    <div className="absolute -left-1.5 h-6 w-6 rounded-full bg-[#0a0a0a] border-2 border-primary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-5 px-1.5 border-white/10 text-primary">
                        {new Date(wo.createdAt).toLocaleDateString()}
                      </Badge>
                      <span className="text-sm font-bold text-white font-mono">€{wo.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">#OT-{wo.id.slice(-6).toUpperCase()}</p>
                        {wo.status === "delivered" ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Clock className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                      <p className="text-sm font-bold text-white mb-2">{wo.services?.[0]?.name || "Servicio General"}</p>
                      <ul className="space-y-1">
                        {wo.services?.slice(1, 3).map((s: any, idx: number) => (
                          <li key={idx} className="text-[11px] text-muted-foreground flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-white/20" /> {s.name}
                          </li>
                        ))}
                        {wo.services?.length > 3 && (
                          <li className="text-[10px] text-muted-foreground italic">+ {wo.services.length - 3} servicios más</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </SheetContent>
  );
}
