"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, Car, User, FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function PublicEstimatePage({ params }: { params: { token: string } }) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: estimate, isLoading, error } = useQuery<any>({
    queryKey: ["/api/public/estimates", params.token],
    queryFn: () => fetch(`/api/api/public/estimates/${params.token}`).then(res => {
      if (!res.ok) throw new Error("Presupuesto no encontrado");
      return res.json();
    }),
    enabled: !!params.token,
  });

  const actionMutation = useMutation({
    mutationFn: (status: "approved" | "rejected") => fetch(`/api/api/public/estimates/${params.token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(res => res.json()),
    onSuccess: (data) => {
      if (data.error) {
        toast({ variant: "destructive", title: "Error", description: data.error });
      } else {
        toast({ title: "Estado actualizado", description: "Muchas gracias por tu confirmación." });
      }
    },
  });

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#E85C1A] animate-spin" />
      </div>
    );
  }

  if (error || !estimate) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="max-w-md bg-[#121212] border-white/10 text-center py-10">
          <CardContent className="space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Enlace expirado</h1>
            <p className="text-muted-foreground">Este presupuesto ya no está disponible o el enlace es incorrecto. Por favor, contacta con tu taller.</p>
            <Button variant="outline" className="border-white/10" onClick={() => window.location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFinalized = ["approved", "rejected"].includes(estimate.status);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#E85C1A]">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">ShopFlow Digital</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
              Presupuesto <span className="text-transparent border-white/20" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' } as any}>#{estimate.id.slice(-4)}</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">Revisa y autoriza la reparación de tu vehículo</p>
          </div>
          <div className="flex flex-col items-end">
             <Badge className={
               estimate.status === 'approved' ? 'bg-green-500 text-white' :
               estimate.status === 'rejected' ? 'bg-red-500 text-white' :
               'bg-[#E85C1A] text-white'
             }>
               {estimate.status.toUpperCase()}
             </Badge>
             <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{new Date(estimate.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-[#121212] border-white/10 overflow-hidden">
               <CardHeader className="bg-white/5 border-b border-white/10">
                 <div className="flex items-center gap-2 text-[#E85C1A]">
                   <FileText className="h-4 w-4" />
                   <CardTitle className="text-xs font-bold uppercase tracking-widest">Detalle de Servicios</CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {estimate.lines.map((service: any, idx: number) => (
                      <div key={idx} className="p-6 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                        <div>
                          <p className="font-bold text-lg uppercase tracking-tight">{service.name || service.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{service.hours}h de mano de obra estimada</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black">{service.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-8 bg-[#E85C1A]/10 flex flex-col items-end">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Total Estimado (IVA Inc.)</span>
                    <span className="text-5xl font-black text-[#E85C1A]">{estimate.totalAmount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
                 </div>
               </CardContent>
            </Card>

            {!isFinalized && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  className="h-16 text-lg font-black uppercase tracking-widest bg-green-600 hover:bg-green-500 text-white group"
                  onClick={() => actionMutation.mutate("approved")}
                  disabled={actionMutation.isPending}
                >
                  <CheckCircle2 className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                  Aprobar Reparación
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 text-lg font-bold uppercase tracking-widest border-white/10 hover:bg-red-950/20 hover:text-red-500 hover:border-red-500/50 group"
                  onClick={() => actionMutation.mutate("rejected")}
                  disabled={actionMutation.isPending}
                >
                  <XCircle className="mr-2 h-6 w-6 group-hover:shake" />
                  Rechazar
                </Button>
              </div>
            )}

            {isFinalized && (
              <div className={`p-8 rounded-xl border-2 text-center space-y-2 ${
                estimate.status === 'approved' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
              }`}>
                <p className="text-2xl font-black uppercase tracking-tighter">
                  {estimate.status === 'approved' ? '¡Confirmado!' : 'Presupuesto Rechazado'}
                </p>
                <p className="text-muted-foreground">Tu taller ha sido notificado y procederá según tu elección.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-[#121212] border-white/10">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-[#E85C1A]">Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                   <div className="p-3 bg-white/5 rounded-lg h-fit"><Car className="h-5 w-5 text-muted-foreground" /></div>
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Vehículo</p>
                     <p className="font-bold text-white uppercase italic">{estimate.vehicle.make} {estimate.vehicle.model}</p>
                     <p className="text-xs text-muted-foreground">{estimate.vehicle.licensePlate}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="p-3 bg-white/5 rounded-lg h-fit"><User className="h-5 w-5 text-muted-foreground" /></div>
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Propietario</p>
                     <p className="font-bold text-white uppercase">{estimate.customer.name}</p>
                     <p className="text-xs text-muted-foreground">{estimate.customer.phone}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="p-3 bg-white/5 rounded-lg h-fit"><Clock className="h-5 w-5 text-muted-foreground" /></div>
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Estado actual</p>
                     <p className="font-bold text-white uppercase">{estimate.status}</p>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-[#E85C1A]/5 border border-[#E85C1A]/20 rounded-xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E85C1A]">¿Tienes dudas?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Puedes contactar directamente con el taller respondiendo a este correo o llamando al teléfono que aparece arriba.</p>
              <Button variant="link" className="p-0 h-auto text-[#E85C1A] text-xs font-bold">LLAMAR AHORA</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
