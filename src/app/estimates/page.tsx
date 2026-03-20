"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Send, FileText, MessageCircle } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const statusLabels: Record<string, string> = {
  draft: "Borrador", sent: "Enviado", approved: "Aprobado", rejected: "Rechazado",
};
const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function EstimatesPage() {
  const [selected, setSelected] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: estimates = [] } = useQuery<any[]>({ queryKey: ["/api/estimates"] });

  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/estimates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sent", sentAt: new Date().toISOString().slice(0, 10) }),
      });
      if (!res.ok) throw new Error("Error al enviar el presupuesto");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/estimates"] });
      toast({ title: "Presupuesto enviado", description: "El cliente ha recibido el presupuesto por email." });
    },
  });
  
  const handleWhatsApp = (est: any) => {
    const origin = window.location.origin;
    const estimateLink = `${origin}/public/estimates/${est.publicToken}`;
    const inspectionId = est.workOrder?.inspections?.[0]?.id;
    const inspectionLink = inspectionId ? `${origin}/public/inspections/${inspectionId}` : "";
    
    let message = `Hola ${est.customer?.name || est.customerName}, aquí tienes el presupuesto para tu vehículo ${est.vehicleInfo || (est.vehicle?.make + " " + est.vehicle?.model)}: ${estimateLink}`;
    
    if (inspectionLink) {
      message += `\n\nTambién puedes revisar el informe de inspección digital aquí: ${inspectionLink}`;
    }
    
    message += `\n\n¿Damos el visto bueno para comenzar? Un saludo de ${est.shop?.name || "tu taller"}.`;
    
    const encodedMessage = encodeURIComponent(message);
    const phone = est.customer?.phone || "";
    const cleanPhone = phone.replace(/\D/g, "");
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Presupuestos Digitales</h1>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground bg-muted/30">
                    <th className="p-3 font-medium">ID</th>
                    <th className="p-3 font-medium">Cliente</th>
                    <th className="p-3 font-medium">Vehículo</th>
                    <th className="p-3 font-medium">Estado</th>
                    <th className="p-3 font-medium">Fecha</th>
                    <th className="p-3 font-medium text-right">Total</th>
                    <th className="p-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((est: any) => (
                    <tr
                      key={est.id}
                      className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelected(est)}
                      data-testid={`est-row-${est.id}`}
                    >
                      <td className="p-3 font-mono text-xs">PRE-{String(est.id).padStart(4, "0")}</td>
                      <td className="p-3">{est.customerName}</td>
                      <td className="p-3">{est.vehicleInfo}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusStyles[est.status]}`}>
                          {statusLabels[est.status]}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{est.createdAt}</td>
                      <td className="p-3 text-right font-medium">€{est.totalAmount?.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                            onClick={e => { e.stopPropagation(); handleWhatsApp(est); }}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          {est.status === "draft" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={e => { e.stopPropagation(); sendMutation.mutate(est.id); }}
                              data-testid={`send-est-${est.id}`}
                            >
                              <Send className="w-3 h-3 mr-1" /> Enviar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selected && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    PRE-{String(selected.id).padStart(4, "0")}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${statusStyles[selected.status]}`}>
                      {statusLabels[selected.status]}
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">{selected.createdAt}</span>
                  </div>
                  <div className="text-sm">
                    <p><span className="text-muted-foreground">Cliente:</span> {selected.customerName}</p>
                    <p><span className="text-muted-foreground">Vehículo:</span> {selected.vehicleInfo}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Líneas del Presupuesto</h4>
                    <div className="space-y-2">
                      {(selected.lines || []).map((line: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{line.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {line.type === "service" ? "Servicio" : "Pieza"} × {line.quantity} — €{line.unitPrice.toFixed(2)}/ud
                            </p>
                          </div>
                          <span className="text-sm font-medium">€{(line.quantity * line.unitPrice).toFixed(2)}</span>
                          <Switch checked={line.approved} data-testid={`line-toggle-${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-bold">€{selected.totalAmount?.toFixed(2)}</span>
                  </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => { sendMutation.mutate(selected.id); setSelected(null); }}
                        data-testid="send-estimate-detail"
                      >
                        <Send className="w-4 h-4 mr-1.5" /> Enviar Email
                      </Button>
                      <Button
                        variant="outline"
                        className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 gap-2"
                        onClick={() => handleWhatsApp(selected)}
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </Button>
                    </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
