import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Send, FileText } from "lucide-react";
import { useState } from "react";

const statusLabels: Record<string, string> = {
  draft: "Borrador", sent: "Enviado", approved: "Aprobado", rejected: "Rechazado",
};
const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Estimates() {
  const [selected, setSelected] = useState<any>(null);
  const { toast } = useToast();
  const { data: estimates = [] } = useQuery<any[]>({ queryKey: ["/api/estimates"] });

  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/estimates/${id}`, { status: "sent", sentAt: new Date().toISOString().slice(0, 10) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/estimates"] });
      toast({ title: "Presupuesto enviado", description: "El cliente ha recibido el presupuesto por email." });
    },
  });

  return (
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

                {selected.status === "draft" && (
                  <Button
                    className="w-full"
                    onClick={() => { sendMutation.mutate(selected.id); setSelected(null); }}
                    data-testid="send-estimate-detail"
                  >
                    <Send className="w-4 h-4 mr-1.5" /> Enviar al Cliente
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
