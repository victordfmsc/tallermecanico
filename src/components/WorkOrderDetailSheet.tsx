"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, FileText, ClipboardCheck, 
  User, Car, Calendar, CreditCard, Loader2, AlertCircle,
  Settings2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Service {
  name: string;
  estimatedHours: number;
  price: number;
}

const statusOrder = ["pending", "diagnosis", "in_progress", "completed", "delivered"];
const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  diagnosis: "Diagnóstico",
  in_progress: "En Reparación",
  completed: "Listo",
  delivered: "Entregado",
};

export function WorkOrderDetailSheet({ order, onClose }: { order: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const res = await fetch(`/api/work-orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders"] });
      onClose();
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOrderId: order.id }),
      });
      if (!res.ok) throw new Error("Error al generar factura");
      return res.json();
    },
    onSuccess: () => {
      alert("Factura generada con éxito");
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
  });

  const createInspectionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/inspections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          workOrderId: order.id, 
          vehicleId: order.vehicleId 
        }),
      });
      if (!res.ok) throw new Error("Error al crear inspección");
      return res.json();
    },
    onSuccess: (data) => {
      router.push(`/inspections/${data.id}`);
    },
  });

  if (!order) return null;

  const currentIdx = statusOrder.indexOf(order.status);
  const nextStatus = statusOrder[currentIdx + 1];

  return (
    <SheetContent className="w-full sm:max-w-md md:max-w-xl bg-[#0a0a0a] border-white/10 overflow-y-auto">
      <SheetHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase text-[10px] tracking-widest px-3">
            OT-{order.id.slice(-6).toUpperCase()}
          </Badge>
          <Badge className="bg-white/10 text-white border-white/20 uppercase text-[10px] tracking-widest px-3">
            {statusLabels[order.status] || order.status}
          </Badge>
        </div>
        <SheetTitle className="text-2xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Detalles de Orden
        </SheetTitle>
        <SheetDescription className="text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Ingresado el {new Date(order.createdAt).toLocaleDateString()}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-8 space-y-8 pb-32">
        {/* Customer & Vehicle Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <User className="h-3 w-3" /> Cliente
            </div>
            <p className="font-bold text-white">{order.customer?.name}</p>
            <p className="text-xs text-muted-foreground">{order.customer?.phone}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Car className="h-3 w-3" /> Vehículo
            </div>
            <p className="font-bold text-white uppercase">{order.vehicle?.brand} {order.vehicle?.model}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-tighter">{order.vehicle?.licensePlate} • {order.vehicle?.color}</p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Servicios Contratados</h3>
          <div className="divide-y divide-white/10">
            {order.services?.map((service: Service, i: number) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.estimatedHours} horas estimadas</p>
                </div>
                <p className="font-bold text-white tracking-tight">€{service.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-sm font-bold text-white uppercase">Total Estimado</span>
            <span className="text-xl font-black text-primary">€{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-500 uppercase tracking-wider font-bold">
              <AlertCircle className="h-3 w-3" /> Observaciones
            </div>
            <p className="text-sm text-gray-300 leading-relaxed italic">"{order.notes}"</p>
          </div>
        )}

        {/* Workflow Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <Settings2 className="h-3 w-3" /> Control de Estado
            </div>
            
            <Select
              value={order.status}
              onValueChange={(newStatus) => updateStatusMutation.mutate(newStatus)}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 text-white font-bold">
                {updateStatusMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Actualizando...
                  </div>
                ) : (
                  <SelectValue placeholder="Cambiar estado" />
                )}
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="focus:bg-primary/20 focus:text-white">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {nextStatus && (
              <Button
                variant="ghost"
                className="w-full h-10 text-primary hover:text-primary hover:bg-primary/10 font-bold gap-2 text-sm justify-between group"
                onClick={() => updateStatusMutation.mutate(nextStatus)}
                disabled={updateStatusMutation.isPending}
              >
                Sugerencia: Pasar a {statusLabels[nextStatus]}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 border-white/10 hover:bg-white/10 text-white gap-2 font-medium"
              onClick={() => createInvoiceMutation.mutate()}
              disabled={createInvoiceMutation.isPending}
            >
              <CreditCard className="h-4 w-4" /> Facturar
            </Button>
            <Button
              variant="outline"
              className="h-12 border-white/10 hover:bg-white/10 text-white gap-2 font-medium"
              onClick={() => createInspectionMutation.mutate()}
              disabled={createInspectionMutation.isPending}
            >
              {createInspectionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ClipboardCheck className="h-4 w-4" /> Inspección
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}
