import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Search, Mail, MessageSquare, Phone, MapPin, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const { toast } = useToast();
  const { data: customers = [] } = useQuery<any[]>({ queryKey: ["/api/customers"] });
  const { data: vehicles = [] } = useQuery<any[]>({ queryKey: ["/api/vehicles"] });
  const { data: workOrders = [] } = useQuery<any[]>({ queryKey: ["/api/work-orders"] });

  const filtered = customers.filter((c: any) =>
    search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getCustomerVehicles = (customerId: number) =>
    vehicles.filter((v: any) => v.customerId === customerId);
  const getCustomerOrders = (customerId: number) =>
    workOrders.filter((wo: any) => wo.customerId === customerId);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Clientes</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" data-testid="search-customers" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">Cliente</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Teléfono</th>
                  <th className="p-3 font-medium text-center">Visitas</th>
                  <th className="p-3 font-medium text-right">Total Gastado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: any) => (
                  <tr
                    key={c.id}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelected(c)}
                    data-testid={`cust-row-${c.id}`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {c.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.email}</td>
                    <td className="p-3 text-muted-foreground">{c.phone}</td>
                    <td className="p-3 text-center">{c.totalVisits}</td>
                    <td className="p-3 text-right font-medium">€{c.totalSpent.toLocaleString("es-ES")}</td>
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
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> {selected.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> {selected.phone}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {selected.address}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "SMS enviado", description: `SMS enviado a ${selected.phone}` })} data-testid="send-sms">
                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> SMS
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Email enviado", description: `Email enviado a ${selected.email}` })} data-testid="send-email">
                    <Mail className="w-3.5 h-3.5 mr-1" /> Email
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                    <Car className="w-4 h-4" /> Vehículos
                  </h4>
                  <div className="space-y-2">
                    {getCustomerVehicles(selected.id).map((v: any) => (
                      <div key={v.id} className="text-sm p-2 rounded bg-muted/50">
                        <span className="font-medium">{v.make} {v.model}</span>
                        <span className="text-muted-foreground ml-2">{v.licensePlate} · {v.year}</span>
                      </div>
                    ))}
                    {getCustomerVehicles(selected.id).length === 0 && (
                      <p className="text-sm text-muted-foreground">Sin vehículos registrados</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-2">Historial de ROs</h4>
                  <div className="space-y-2">
                    {getCustomerOrders(selected.id).slice(0, 5).map((wo: any) => (
                      <div key={wo.id} className="text-sm p-2 rounded bg-muted/50 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs">RO-{String(wo.id).padStart(4, "0")}</span>
                          <span className="ml-2">{wo.services?.[0]}</span>
                        </div>
                        <span className="font-medium">€{wo.totalAmount?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>{selected.totalVisits} visitas totales</span>
                  <span>€{selected.totalSpent.toLocaleString("es-ES")} gastado</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
