import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Search, Car, Gauge, Calendar, Palette } from "lucide-react";
import { useState } from "react";

export default function Vehicles() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const { data: vehicles = [] } = useQuery<any[]>({ queryKey: ["/api/vehicles"] });
  const { data: workOrders = [] } = useQuery<any[]>({ queryKey: ["/api/work-orders"] });

  const filtered = vehicles.filter((v: any) =>
    search === "" ||
    v.vin.toLowerCase().includes(search.toLowerCase()) ||
    v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
    `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const getVehicleOrders = (vehicleId: number) =>
    workOrders.filter((wo: any) => wo.vehicleId === vehicleId);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Vehículos</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por VIN, matrícula o modelo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" data-testid="search-vehicles" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">Matrícula</th>
                  <th className="p-3 font-medium">Marca / Modelo</th>
                  <th className="p-3 font-medium">Año</th>
                  <th className="p-3 font-medium">Propietario</th>
                  <th className="p-3 font-medium">Color</th>
                  <th className="p-3 font-medium text-right">Kilometraje</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v: any) => (
                  <tr
                    key={v.id}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelected(v)}
                    data-testid={`veh-row-${v.id}`}
                  >
                    <td className="p-3 font-mono text-xs font-semibold">{v.licensePlate}</td>
                    <td className="p-3 font-medium">{v.make} {v.model}</td>
                    <td className="p-3">{v.year}</td>
                    <td className="p-3">{v.customerName || "—"}</td>
                    <td className="p-3 text-muted-foreground">{v.color}</td>
                    <td className="p-3 text-right">{v.mileage.toLocaleString("es-ES")} km</td>
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
                  <Car className="w-5 h-5" />
                  {selected.make} {selected.model}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Matrícula</p>
                    <p className="font-mono font-semibold">{selected.licensePlate}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">Año</p>
                    <p className="font-medium">{selected.year}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kilometraje</p>
                      <p className="font-medium">{selected.mileage.toLocaleString("es-ES")} km</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-medium">{selected.color}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground">VIN</p>
                  <p className="font-mono text-xs">{selected.vin}</p>
                </div>
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground">Propietario</p>
                  <p className="font-medium">{selected.customerName || "—"}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Historial de Servicios</h4>
                  <div className="space-y-3">
                    {getVehicleOrders(selected.id).map((wo: any) => (
                      <div key={wo.id} className="relative pl-5 pb-3 border-l-2 border-primary/30 last:border-0">
                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary" />
                        <div className="text-sm">
                          <p className="font-medium">{wo.services?.[0] || "Servicio"}</p>
                          <p className="text-xs text-muted-foreground">{wo.createdAt} · €{wo.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {getVehicleOrders(selected.id).length === 0 && (
                      <p className="text-sm text-muted-foreground">Sin historial de servicios</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
