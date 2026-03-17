"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardCheck, Search, FilterX, 
  ChevronRight, Calendar, Loader2,
  CheckCircle2, AlertTriangle, AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

const statusIcons: Record<string, any> = {
  good: CheckCircle2,
  attention: AlertTriangle,
  urgent: AlertCircle,
};

const statusColors: Record<string, string> = {
  good: "text-emerald-500",
  attention: "text-amber-500",
  urgent: "text-red-500",
};

export default function InspectionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: inspections, isLoading } = useQuery<any[]>({
    queryKey: ["/api/inspections", debouncedSearch],
    queryFn: () => fetch("/api/inspections").then(res => res.json()),
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Inspecciones (DVI)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Control de calidad y diagnóstico preventivo</p>
        </div>
      </div>

      {/* Search & Filter */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID de orden o vehículo..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : inspections?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
          <FilterX className="h-12 w-12 opacity-20" />
          <p>No se encontraron inspecciones</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inspections?.map((inspection) => {
            const StatusIcon = statusIcons[inspection.overallStatus] || CheckCircle2;
            return (
              <Card
                key={inspection.id}
                className="group border-white/10 bg-[#121212]/50 hover:bg-white/[0.05] transition-all cursor-pointer overflow-hidden"
                onClick={() => router.push(`/inspections/${inspection.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-6 gap-6">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-white/5 ${statusColors[inspection.overallStatus]}`}>
                      <StatusIcon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-primary uppercase tracking-tighter">#OT-{inspection.workOrderId.slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-muted-foreground">• {new Date(inspection.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase truncate group-hover:text-primary transition-colors">
                        Inspección General
                      </h3>
                    </div>

                    <div className="hidden md:block w-48 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Progreso</span>
                        <span>{inspection.progress}%</span>
                      </div>
                      <Progress value={inspection.progress} className="h-1.5 bg-white/10" />
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
