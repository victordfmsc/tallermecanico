import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Clock, User, Car, Wrench } from "lucide-react";
import { useState } from "react";

const statusLabels: Record<string, string> = {
  pending: "Pendiente", diagnosis: "Diagnóstico", in_progress: "En Reparación",
  completed: "Listo", delivered: "Entregado",
};
const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  diagnosis: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  delivered: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function WorkOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  const { data: orders = [] } = useQuery<any[]>({ queryKey: ["/api/work-orders"] });

  const filtered = orders.filter((wo: any) => {
    const matchSearch = search === "" ||
      wo.services?.join(" ").toLowerCase().includes(search.toLowerCase()) ||
      wo.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      wo.vehicle?.licensePlate?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || wo.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Órdenes de Trabajo</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="new-work-order"><Plus className="w-4 h-4 mr-1.5" /> Nueva Orden</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva Orden de Trabajo</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Vehículo (Matrícula)</Label><Input placeholder="1234 ABC" data-testid="wo-vehicle" /></div>
              <div><Label>Cliente</Label><Input placeholder="Nombre del cliente" data-testid="wo-client" /></div>
              <div><Label>Servicio</Label><Input placeholder="Descripción del servicio" data-testid="wo-service" /></div>
              <div><Label>Técnico</Label><Input placeholder="Nombre del técnico" data-testid="wo-tech" /></div>
              <Button className="w-full" data-testid="save-wo">Crear Orden</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por servicio, cliente, matrícula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
            data-testid="search-wo"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44" data-testid="status-filter">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">ID</th>
                  <th className="p-3 font-medium">Vehículo</th>
                  <th className="p-3 font-medium">Cliente</th>
                  <th className="p-3 font-medium">Servicio</th>
                  <th className="p-3 font-medium">Técnico</th>
                  <th className="p-3 font-medium">Estado</th>
                  <th className="p-3 font-medium text-right">Importe</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((wo: any) => (
                  <tr
                    key={wo.id}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelected(wo)}
                    data-testid={`wo-row-${wo.id}`}
                  >
                    <td className="p-3 font-mono text-xs">RO-{String(wo.id).padStart(4, "0")}</td>
                    <td className="p-3">
                      {wo.vehicle ? `${wo.vehicle.make} ${wo.vehicle.model}` : "—"}
                      <span className="text-muted-foreground text-xs ml-1">
                        {wo.vehicle?.licensePlate}
                      </span>
                    </td>
                    <td className="p-3">{wo.customer?.name || "—"}</td>
                    <td className="p-3 max-w-[200px] truncate">{wo.services?.[0] || "—"}</td>
                    <td className="p-3">{wo.technician?.name || "—"}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusStyles[wo.status]}`}>
                        {statusLabels[wo.status]}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">€{wo.totalAmount?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>RO-{String(selected.id).padStart(4, "0")}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${statusStyles[selected.status]}`}>
                    {statusLabels[selected.status]}
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">{selected.createdAt}</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {selected.vehicle ? `${selected.vehicle.make} ${selected.vehicle.model} — ${selected.vehicle.licensePlate}` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selected.customer?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selected.technician?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selected.estimatedHours}h estimadas</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-2">Servicios</h4>
                  <ul className="space-y-1.5">
                    {(selected.services || []).map((s: string, i: number) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {selected.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Notas</h4>
                      <p className="text-sm text-muted-foreground">{selected.notes}</p>
                    </div>
                  </>
                )}

                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold">€{selected.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
