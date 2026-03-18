"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Clock } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  break: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  off: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};
const statusLabels: Record<string, string> = {
  active: "Activo", break: "Descanso", off: "Fuera",
};

export default function TechniciansPage() {
  const { data: technicians = [] } = useQuery<any[]>({ queryKey: ["/api/technicians"] });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Técnicos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((tech: any) => {
            // Mini sparkline data (mock weekly productivity)
            const sparkData = Array.from({ length: 7 }, (_, i) => ({
              day: i,
              value: Math.round(60 + Math.random() * 35),
            }));

            return (
              <Card key={tech.id} data-testid={`tech-card-${tech.id}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {tech.avatar || tech.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{tech.name}</h3>
                      <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                    </div>
                    <Badge className={`text-xs ${statusStyles[tech.status] || statusStyles.off}`}>
                      {statusLabels[tech.status] || statusLabels.off}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Eficiencia</span>
                      <span className="font-semibold">{tech.efficiency}%</span>
                    </div>
                    <Progress value={tech.efficiency} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span className="text-xs">{tech.activeJobs || 0} activos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{tech.hoursToday || 0}h hoy</span>
                    </div>
                  </div>

                  {/* Mini sparkline */}
                  <div className="h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sparkData}>
                        <Bar dataKey="value" fill="hsl(22, 85%, 52%)" radius={[2, 2, 0, 0]} opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
