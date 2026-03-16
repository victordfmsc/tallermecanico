import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";

const hours = Array.from({ length: 11 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`);
const days = [
  { label: "Lun 16", date: "2026-03-16" },
  { label: "Mar 17", date: "2026-03-17" },
  { label: "Mié 18", date: "2026-03-18" },
  { label: "Jue 19", date: "2026-03-19" },
  { label: "Vie 20", date: "2026-03-20" },
  { label: "Sáb 21", date: "2026-03-21" },
  { label: "Dom 22", date: "2026-03-22" },
];

const serviceColors: Record<string, string> = {
  "Cambio de aceite": "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400",
  "Revisión frenos": "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400",
  "Diagnóstico": "bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-400",
  "ITV": "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400",
  "Neumáticos": "bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-400",
  "Embrague": "bg-orange-500/20 border-orange-500 text-orange-700 dark:text-orange-400",
  "AC": "bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-400",
  "Revisión general": "bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-400",
};

export default function CalendarPage() {
  const { data: appointments } = useQuery<any[]>({
    queryKey: ["/api/appointments"],
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const getApptForSlot = (date: string, hour: string) => {
    return (appointments || []).filter(a => a.date === date && a.startTime === hour);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Calendario</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="new-appointment">
              <Plus className="w-4 h-4 mr-1.5" /> Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Cita</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Cliente</Label>
                <Input placeholder="Nombre del cliente" data-testid="appt-client" />
              </div>
              <div>
                <Label>Vehículo</Label>
                <Input placeholder="Matrícula o modelo" data-testid="appt-vehicle" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Fecha</Label>
                  <Input type="date" defaultValue="2026-03-16" data-testid="appt-date" />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input type="time" defaultValue="09:00" data-testid="appt-time" />
                </div>
              </div>
              <div>
                <Label>Servicio</Label>
                <Input placeholder="Tipo de servicio" data-testid="appt-service" />
              </div>
              <Button className="w-full" onClick={() => setDialogOpen(false)} data-testid="save-appointment">
                Guardar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header row */}
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 text-xs text-muted-foreground font-medium border-r">Hora</div>
              {days.map(d => (
                <div
                  key={d.date}
                  className={`p-2 text-xs font-medium text-center border-r last:border-r-0 ${
                    d.date === "2026-03-16" ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  {d.label}
                </div>
              ))}
            </div>
            {/* Time rows */}
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-[56px]">
                <div className="p-2 text-xs text-muted-foreground border-r flex items-start">
                  {hour}
                </div>
                {days.map(d => {
                  const appts = getApptForSlot(d.date, hour);
                  return (
                    <div key={d.date} className="p-1 border-r last:border-r-0 relative">
                      {appts.map((a: any) => {
                        const colorClass = serviceColors[a.serviceType] || "bg-gray-200/50 border-gray-400 text-gray-700 dark:text-gray-300";
                        return (
                          <div
                            key={a.id}
                            className={`text-[10px] p-1 rounded border-l-2 mb-0.5 ${colorClass}`}
                            data-testid={`appt-${a.id}`}
                          >
                            <div className="font-medium truncate">{a.serviceType}</div>
                            <div className="truncate opacity-75">{a.customerName}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
