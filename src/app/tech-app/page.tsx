"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, CheckCircle, Camera, Clock } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function TechAppPage() {
  const { data: workOrders = [] } = useQuery<any[]>({
    queryKey: ["/api/work-orders"],
    queryFn: () => fetch("/api/work-orders").then(res => res.json())
  });
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Set<number>>(new Set());

  // Simulated technician's jobs for today
  const todayJobs = workOrders
    .filter((wo: any) => wo.status === "in_progress" || wo.status === "diagnosis")
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" } as any}>App Técnico</h1>

        <div className="flex justify-center">
          {/* Phone mockup */}
          <div className="w-[375px] h-[780px] bg-card border-2 border-border rounded-[2.5rem] overflow-hidden shadow-xl relative">
            {/* Phone status bar */}
            <div className="h-12 bg-foreground/5 flex items-center justify-center">
              <div className="w-24 h-5 bg-foreground/10 rounded-full" />
            </div>

            {/* App header */}
            <div className="px-4 py-3 bg-primary text-primary-foreground">
              <p className="text-[11px] opacity-80">Lunes, 16 de Marzo</p>
              <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-display)" } as any}>
                Mis Trabajos de Hoy
              </h2>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span>{todayJobs.length} tareas</span>
                <span>·</span>
                <span>{completedJobs.size} completadas</span>
              </div>
            </div>

            {/* Progress */}
            <div className="px-4 py-2 border-b">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>Progreso del día</span>
                <span className="ml-auto font-medium">
                  {todayJobs.length > 0
                    ? Math.round((completedJobs.size / todayJobs.length) * 100)
                    : 0}%
                </span>
              </div>
              <Progress
                value={todayJobs.length > 0 ? (completedJobs.size / todayJobs.length) * 100 : 0}
                className="h-2"
              />
            </div>

            {/* Job list */}
            <div className="overflow-y-auto max-h-[520px] px-4 py-2 space-y-2">
              {todayJobs.map((job: any, i: number) => {
                const isActive = activeTimer === job.id;
                const isDone = completedJobs.has(job.id);

                return (
                  <div
                    key={job.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      isActive ? "border-primary bg-primary/5" : isDone ? "border-green-500/30 bg-green-50 dark:bg-green-900/10" : "border-border"
                    }`}
                    data-testid={`tech-job-${job.id}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono text-muted-foreground">
                        RO-{String(job.id).padStart(4, "0")}
                      </span>
                      {isDone ? (
                        <Badge className="bg-green-500 text-white text-[10px]">Completado</Badge>
                      ) : isActive ? (
                        <Badge className="bg-primary text-primary-foreground text-[10px] animate-pulse">En progreso</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">Pendiente</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{job.services?.[0] || "Servicio"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.estimatedHours || 1}h estimadas
                    </p>

                    {!isDone && (
                      <div className="flex gap-2 mt-2">
                        {!isActive ? (
                          <Button
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => setActiveTimer(job.id)}
                            data-testid={`start-${job.id}`}
                          >
                            <Play className="w-3 h-3 mr-1" /> Iniciar
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8 text-xs"
                              onClick={() => setActiveTimer(null)}
                              data-testid={`pause-${job.id}`}
                            >
                              <Pause className="w-3 h-3 mr-1" /> Pausar
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setCompletedJobs(prev => new Set([...Array.from(prev), job.id]));
                                setActiveTimer(null);
                              }}
                              data-testid={`complete-${job.id}`}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> Completar
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Photo upload section */}
              <div className="p-3 rounded-lg border border-dashed border-border text-center mt-4">
                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Subir Foto de Inspección</p>
                <p className="text-xs text-muted-foreground mb-2">Toca para abrir la cámara</p>
                <Button variant="outline" size="sm" data-testid="upload-photo">
                  <Camera className="w-3.5 h-3.5 mr-1" /> Tomar Foto
                </Button>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-card border-t flex items-center justify-around px-6">
              <div className="text-center text-primary">
                <ClipboardListIcon className="w-5 h-5 mx-auto" />
                <span className="text-[10px] font-medium">Tareas</span>
              </div>
              <div className="text-center text-muted-foreground">
                <Clock className="w-5 h-5 mx-auto" />
                <span className="text-[10px]">Tiempos</span>
              </div>
              <div className="text-center text-muted-foreground">
                <Camera className="w-5 h-5 mx-auto" />
                <span className="text-[10px]">Fotos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ClipboardListIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
    </svg>
  );
}
