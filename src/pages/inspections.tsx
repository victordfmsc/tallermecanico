import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Camera, ArrowLeft } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  good: "bg-green-500", warning: "bg-amber-500", critical: "bg-red-500",
};
const statusLabels: Record<string, string> = {
  good: "Bien", warning: "Atención", critical: "Urgente",
};
const statusBadge: Record<string, string> = {
  good: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Inspections() {
  const { data: inspections = [] } = useQuery<any[]>({ queryKey: ["/api/inspections"] });
  const [selected, setSelected] = useState<any>(null);

  if (selected) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelected(null)} data-testid="back-inspections">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Inspección — {selected.vehicleInfo}
          </h1>
          <span className={`ml-auto inline-flex px-2.5 py-1 rounded text-xs font-medium ${statusBadge[selected.overallStatus]}`}>
            {statusLabels[selected.overallStatus]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Progreso</span>
          <Progress value={selected.progress} className="flex-1 h-2.5" />
          <span className="text-sm font-medium">{selected.progress}%</span>
        </div>

        <Accordion type="multiple" defaultValue={selected.sections?.map((_: any, i: number) => String(i))}>
          {(selected.sections || []).map((section: any, i: number) => (
            <AccordionItem key={i} value={String(i)} data-testid={`section-${section.name}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${statusColors[section.status]}`} />
                  <span className="font-medium">{section.name}</span>
                  <span className={`ml-auto mr-3 inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${statusBadge[section.status]}`}>
                    {statusLabels[section.status]}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6 space-y-2">
                  <p className="text-sm text-muted-foreground">{section.notes}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={section.completed ? "default" : "secondary"} className="text-xs">
                      {section.completed ? "Completado" : "Pendiente"}
                    </Badge>
                    <Button variant="outline" size="sm" className="ml-auto" data-testid={`add-photo-${i}`}>
                      <Camera className="w-3.5 h-3.5 mr-1" /> Añadir Foto
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-sm text-muted-foreground">
          Técnico: {selected.technicianName} · Creada: {selected.createdAt}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Inspecciones Digitales (DVI)</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">ID</th>
                  <th className="p-3 font-medium">Vehículo</th>
                  <th className="p-3 font-medium">Técnico</th>
                  <th className="p-3 font-medium">Estado</th>
                  <th className="p-3 font-medium">Progreso</th>
                  <th className="p-3 font-medium">Secciones</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((insp: any) => (
                  <tr
                    key={insp.id}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelected(insp)}
                    data-testid={`insp-row-${insp.id}`}
                  >
                    <td className="p-3 font-mono text-xs">DVI-{String(insp.id).padStart(4, "0")}</td>
                    <td className="p-3">{insp.vehicleInfo}</td>
                    <td className="p-3">{insp.technicianName}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusBadge[insp.overallStatus]}`}>
                        {statusLabels[insp.overallStatus]}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={insp.progress} className="h-1.5 w-20" />
                        <span className="text-xs">{insp.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-0.5">
                        {(insp.sections || []).map((s: any, i: number) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-full ${statusColors[s.status]}`} title={s.name} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
