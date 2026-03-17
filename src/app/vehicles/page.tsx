"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Loader2, FilterX, Car, Gauge } from "lucide-react";
import { VehicleForm } from "@/components/VehicleForm";
import { VehicleDetailSheet } from "@/components/VehicleDetailSheet";

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: vehicles, isLoading } = useQuery<any[]>({
    queryKey: ["/api/vehicles", debouncedSearch],
    queryFn: async () => {
      const url = debouncedSearch 
        ? `/api/vehicles?search=${encodeURIComponent(debouncedSearch)}`
        : "/api/vehicles";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error fetching vehicles");
      return res.json();
    },
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Vehículos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Inventario de flota y seguimiento de servicios</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" /> Nuevo Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-[#0a0a0a] border-white/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Alta de Vehículo
              </DialogTitle>
            </DialogHeader>
            <VehicleForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por matrícula, VIN o modelo..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : vehicles?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
          <FilterX className="h-12 w-12 opacity-20" />
          <p>No se encontraron vehículos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles?.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="group border-white/10 bg-[#121212]/50 hover:bg-white/[0.05] transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Car className="h-16 w-16 text-white" />
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-1 relative">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-primary/30 text-primary">
                    {vehicle.licensePlate}
                  </Badge>
                  <h3 className="text-xl font-bold text-white uppercase group-hover:text-primary transition-colors">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-tighter">
                    VIN: {vehicle.vin.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Kilometraje</p>
                      <p className="text-sm font-bold text-white">{vehicle.mileage.toLocaleString()} Km</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Año</p>
                    <p className="text-sm font-bold text-white">{vehicle.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail View */}
      <Sheet open={!!selectedVehicle} onOpenChange={(open) => !open && setSelectedVehicle(null)}>
        <VehicleDetailSheet vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      </Sheet>
    </div>
  );
}
