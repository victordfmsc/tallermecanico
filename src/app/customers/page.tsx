"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Loader2, FilterX, Users } from "lucide-react";
import { CustomerForm } from "@/components/CustomerForm";
import { CustomerDetailSheet } from "@/components/CustomerDetailSheet";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: customers, isLoading } = useQuery<any[]>({
    queryKey: ["/api/customers", debouncedSearch],
    queryFn: async () => {
      const url = debouncedSearch 
        ? `/api/customers?search=${encodeURIComponent(debouncedSearch)}`
        : "/api/customers";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error fetching customers");
      return res.json();
    },
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Clientes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Directorio de clientes y fidelización</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" /> Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-[#0a0a0a] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Registro de Cliente
              </DialogTitle>
            </DialogHeader>
            <CustomerForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
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
            <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : customers?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
          <FilterX className="h-12 w-12 opacity-20" />
          <p>No se encontraron clientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers?.map((customer) => (
            <Card
              key={customer.id}
              className="group border-white/10 bg-[#121212]/50 hover:bg-white/[0.05] transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setSelectedCustomer(customer)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border border-white/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {customer.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">
                      {customer.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{customer.phone}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2 pt-6 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Visitas</p>
                    <p className="text-lg font-black text-white">{customer.totalVisits || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Invertido</p>
                    <p className="text-lg font-black text-primary">€{customer.totalSpent?.toFixed(0) || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail View */}
      <Sheet open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <CustomerDetailSheet customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      </Sheet>
    </div>
  );
}
