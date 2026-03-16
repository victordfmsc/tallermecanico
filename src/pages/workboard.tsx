import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Wrench } from "lucide-react";
import { useState } from "react";

const columnLabels: Record<string, string> = {
  pending: "Pendiente",
  diagnosis: "Diagnóstico",
  in_progress: "En Reparación",
  completed: "Listo",
  delivered: "Entregado",
};
const columnColors: Record<string, string> = {
  pending: "bg-gray-400",
  diagnosis: "bg-amber-500",
  in_progress: "bg-orange-500",
  completed: "bg-green-500",
  delivered: "bg-blue-500",
};

export default function Workboard() {
  const [techFilter, setTechFilter] = useState("all");
  const { data: columns, isLoading } = useQuery<Record<string, any[]>>({
    queryKey: ["/api/workboard"],
  });
  const { data: technicians } = useQuery<any[]>({
    queryKey: ["/api/technicians"],
  });

  const moveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/work-orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workboard"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="min-w-[260px] h-96 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const statusOrder = ["pending", "diagnosis", "in_progress", "completed", "delivered"];

  const moveCard = (cardId: number, currentStatus: string) => {
    const currentIdx = statusOrder.indexOf(currentStatus);
    if (currentIdx < statusOrder.length - 1) {
      moveMutation.mutate({ id: cardId, status: statusOrder[currentIdx + 1] });
    }
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Workboard</h1>
        <Select value={techFilter} onValueChange={setTechFilter}>
          <SelectTrigger className="w-48" data-testid="tech-filter">
            <SelectValue placeholder="Filtrar por técnico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los técnicos</SelectItem>
            {(technicians || []).map((t: any) => (
              <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 overflow-x-auto flex-1 pb-4">
        {statusOrder.map(status => {
          let cards = columns?.[status] || [];
          if (techFilter !== "all") {
            cards = cards.filter((c: any) => String(c.technicianId) === techFilter);
          }
          return (
            <div key={status} className="min-w-[260px] w-[260px] flex flex-col" data-testid={`column-${status}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${columnColors[status]}`} />
                <span className="text-sm font-semibold">{columnLabels[status]}</span>
                <Badge variant="secondary" className="ml-auto text-xs">{cards.length}</Badge>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {cards.map((card: any) => (
                  <Card
                    key={card.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => moveCard(card.id, status)}
                    data-testid={`wo-card-${card.id}`}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">
                          RO-{String(card.id).padStart(4, "0")}
                        </span>
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {card.technicianAvatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="text-sm font-medium leading-tight">{card.vehicle}</p>
                      <p className="text-xs text-muted-foreground">{card.customerName}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          {card.services?.[0]?.substring(0, 20) || "Servicio"}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <Clock className="w-3 h-3" />
                          {card.estimatedHours}h
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
