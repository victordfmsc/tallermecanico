"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail, MessageSquare, Phone, MapPin, Car, 
  History, CreditCard, ChevronRight, Loader2
} from "lucide-react";
import { MessagingModal } from "./MessagingModal";

export function CustomerDetailSheet({ customer, onClose }: { customer: any; onClose: () => void }) {
  const [messaging, setMessaging] = useState<{ type: "sms" | "email"; isOpen: boolean } | null>(null);

  const { data: vehicles, isLoading: loadingVehicles } = useQuery<any[]>({
    queryKey: ["/api/vehicles", { customerId: customer?.id }],
    queryFn: () => fetch(`/api/vehicles?customerId=${customer?.id}`).then(res => res.json()),
    enabled: !!customer?.id,
  });

  const { data: orders, isLoading: loadingOrders } = useQuery<any[]>({
    queryKey: ["/api/work-orders", { customerId: customer?.id }],
    queryFn: () => fetch(`/api/work-orders?customerId=${customer?.id}`).then(res => res.json()),
    enabled: !!customer?.id,
  });

  if (!customer) return null;

  return (
    <SheetContent className="w-full sm:max-w-md md:max-w-xl bg-[#0a0a0a] border-white/10 overflow-y-auto">
      <SheetHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[10px] tracking-widest px-3">
            Cliente ID: {customer.id.slice(-6).toUpperCase()}
          </Badge>
        </div>
        <SheetTitle className="text-3xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {customer.name}
        </SheetTitle>
        <SheetDescription className="text-muted-foreground flex flex-col gap-2">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {customer.email}</div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {customer.phone}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {customer.address}</div>
        </SheetDescription>
      </SheetHeader>

      <div className="mt-8 space-y-8 pb-32">
        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 border-white/10 hover:bg-white/10 text-white gap-2 font-medium"
            onClick={() => setMessaging({ type: "sms", isOpen: true })}
          >
            <MessageSquare className="h-4 w-4" /> SMS
          </Button>
          <Button
            variant="outline"
            className="h-12 border-white/10 hover:bg-white/10 text-white gap-2 font-medium"
            onClick={() => setMessaging({ type: "email", isOpen: true })}
          >
            <Mail className="h-4 w-4" /> Email
          </Button>
        </div>

        <Separator className="bg-white/5" />

        {/* Vehicles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Car className="h-4 w-4" /> Vehículos Registrados
            </h3>
            <Badge variant="outline" className="text-[10px] border-white/10">
              {vehicles?.length || 0}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {loadingVehicles ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
            ) : vehicles?.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Sin vehículos asociados</p>
            ) : (
              vehicles?.map((v) => (
                <div key={v.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-colors cursor-pointer">
                  <div>
                    <p className="font-bold text-white uppercase">{v.brand} {v.model}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{v.licensePlate} • {v.year}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))
            )}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Work Order History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <History className="h-4 w-4" /> Historial de Servicios
            </h3>
          </div>
          <div className="space-y-3">
            {loadingOrders ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
            ) : orders?.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Sin órdenes previas</p>
            ) : (
              orders?.map((wo) => (
                <div key={wo.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-primary uppercase">#OT-{wo.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(wo.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-white truncate max-w-[200px]">{wo.services?.[0]?.name || "Servicio General"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white font-mono">€{wo.totalAmount.toFixed(2)}</p>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-4 px-1 border-white/10 text-muted-foreground">
                      {wo.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Total Invertido</p>
            <p className="text-3xl font-black text-white tracking-tighter">€{customer.totalSpent?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </div>

      {messaging && (
        <MessagingModal
          isOpen={messaging.isOpen}
          onClose={() => setMessaging(null)}
          customerId={customer.id}
          customerName={customer.name}
          type={messaging.type}
        />
      )}
    </SheetContent>
  );
}
