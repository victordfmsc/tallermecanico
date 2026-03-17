"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, Loader2, FilterX } from "lucide-react";
import { WorkOrderForm } from "@/components/WorkOrderForm";
import { WorkOrderDetailSheet } from "@/components/WorkOrderDetailSheet";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  diagnosis: "Diagnóstico",
  in_progress: "En Reparación",
  completed: "Listo",
  delivered: "Entregado",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  diagnosis: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  delivered: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function WorkOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ["/api/work-orders", page, statusFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/work-orders?${params}`);
      if (!res.ok) throw new Error("Error fetching work orders");
      return res.json();
    },
  });

  const orders = data?.items || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Órdenes de Trabajo
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gestión centralizada del flujo de taller</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" /> Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-[#0a0a0a] border-white/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Alta de Orden de Trabajo
              </DialogTitle>
            </DialogHeader>
            <WorkOrderForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, modelo o cliente..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-56 bg-white/5 border-white/10">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-white/10 bg-[#121212]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-muted-foreground bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">ID / Fecha</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Cliente & Vehículo</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Técnico</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Estado</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FilterX className="h-10 w-10 opacity-20" />
                      <p>No se encontraron órdenes de trabajo</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((wo: any) => (
                  <tr
                    key={wo.id}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                    onClick={() => setSelectedOrder(wo)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-mono font-bold uppercase tracking-tighter">#OT-{wo.id.slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(wo.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{wo.customer?.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">{wo.vehicle?.brand} {wo.vehicle?.model} • {wo.vehicle?.licensePlate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-gray-300">{wo.technician?.name || "Sin asignar"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={`rounded-md font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider ${statusColors[wo.status] || ""}`}>
                        {statusLabels[wo.status] || wo.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-black text-white text-base">€{wo.totalAmount.toFixed(2)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 bg-white/[0.01]">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setPage(p => Math.min(pagination.totalPages, p + 1)); }}
                    className={page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      {/* Detail View */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <WorkOrderDetailSheet order={selectedOrder} onClose={() => { setSelectedOrder(null); refetch(); }} />
      </Sheet>
    </div>
  );
}
