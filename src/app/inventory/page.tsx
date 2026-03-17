"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Search, Filter, AlertTriangle, 
  ShoppingCart, Package, ArrowRight, Loader2,
  Trash2, Edit2, ChevronRight, MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Queries
  const { data: items, isLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory", categoryFilter, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (searchTerm) params.append("search", searchTerm);
      return fetch(`/api/inventory?${params.toString()}`).then(res => res.json());
    },
  });

  const categories = ["all", ...new Set(items?.map(i => i.category) || [])];

  // Mutations
  const addItemMutation = useMutation({
    mutationFn: (newItem: any) => fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setIsAddModalOpen(false);
    },
  });

  const createPOMutation = useMutation({
    mutationFn: (order: any) => fetch("/api/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
      setIsOrderModalOpen(false);
      router.push("/inventory/purchase-orders");
    },
  });

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      category: formData.get("category"),
      quantity: parseInt(formData.get("quantity") as string),
      minQuantity: parseInt(formData.get("minQuantity") as string),
      costPrice: parseFloat(formData.get("costPrice") as string),
      salePrice: parseFloat(formData.get("salePrice") as string),
      supplier: formData.get("supplier"),
    };
    addItemMutation.mutate(data);
  };

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      itemId: selectedItem.id,
      quantity: parseInt(formData.get("quantity") as string),
      supplier: formData.get("supplier"),
    };
    createPOMutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Inventario
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gestión de stock, repuestos y consumibles</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-white/10 hover:bg-white/5"
            onClick={() => router.push("/inventory/purchase-orders")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Historial de Pedidos
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                <Plus className="h-4 w-4 mr-2" /> Añadir Pieza
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold uppercase tracking-tight">Nueva Pieza en Stock</DialogTitle>
                <DialogDescription className="text-muted-foreground">Regista una nueva pieza o consumible en el sistema.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground">Nombre de la Pieza</Label>
                    <Input id="name" name="name" required className="bg-white/5 border-white/10" placeholder="Filtro de Aceite Bosch X123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-xs uppercase font-bold text-muted-foreground">SKU / Referencia</Label>
                    <Input id="sku" name="sku" required className="bg-white/5 border-white/10" placeholder="BSH-12345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs uppercase font-bold text-muted-foreground">Categoría</Label>
                    <Input id="category" name="category" required className="bg-white/5 border-white/10" placeholder="Filtros" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-xs uppercase font-bold text-muted-foreground">Stock Actual</Label>
                    <Input id="quantity" name="quantity" type="number" required className="bg-white/5 border-white/10" defaultValue="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minQuantity" className="text-xs uppercase font-bold text-muted-foreground">Mínimo (Alerta)</Label>
                    <Input id="minQuantity" name="minQuantity" type="number" required className="bg-white/5 border-white/10" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice" className="text-xs uppercase font-bold text-muted-foreground">Precio Coste (€)</Label>
                    <Input id="costPrice" name="costPrice" type="number" step="0.01" required className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salePrice" className="text-xs uppercase font-bold text-muted-foreground">Precio Venta (€)</Label>
                    <Input id="salePrice" name="salePrice" type="number" step="0.01" required className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="supplier" className="text-xs uppercase font-bold text-muted-foreground">Proveedor Habitual</Label>
                    <Input id="supplier" name="supplier" required className="bg-white/5 border-white/10" placeholder="Recambios S.L." />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-primary font-bold" disabled={addItemMutation.isPending}>
                    {addItemMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Item"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-64 h-12 bg-white/5 border-white/10">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat === "all" ? "Todas las categorías" : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-white/10 bg-[#121212]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground h-12">Referencia / SKU</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pieza / Descripción</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categoría</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Stock</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Precio Venta</TableHead>
                <TableHead className="h-12 w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/10 animate-pulse">
                    <TableCell colSpan={6} className="h-16 bg-white/5"></TableCell>
                  </TableRow>
                ))
              ) : items?.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 opacity-20" />
                      <p>No hay items en el inventario</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items?.map((item) => {
                  const isLowStock = item.quantity <= item.minQuantity && item.quantity > 0;
                  const isOutStock = item.quantity === 0;

                  return (
                    <TableRow 
                      key={item.id} 
                      className={`border-white/10 group transition-colors ${
                        isOutStock ? 'bg-red-500/5 hover:bg-red-500/10' : 
                        isLowStock ? 'bg-amber-500/5 hover:bg-amber-500/10' : 
                        'hover:bg-white/5'
                      }`}
                    >
                      <TableCell className="font-mono text-xs text-primary">{item.sku}</TableCell>
                      <TableCell className="font-bold">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-normal text-muted-foreground uppercase">{item.supplier}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase border-white/10">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-lg font-black ${
                            isOutStock ? 'text-red-500' : 
                            isLowStock ? 'text-amber-500' : 
                            'text-white'
                          }`}>
                            {item.quantity}
                          </span>
                          <span className="text-[9px] text-muted-foreground uppercase">Min: {item.minQuantity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-black text-primary">€{item.salePrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:bg-primary/20"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsOrderModalOpen(true);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Order Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">Solicitar Repuesto</DialogTitle>
            <DialogDescription className="text-muted-foreground">Crea un pedido para reposición de stock.</DialogDescription>
          </DialogHeader>
          <div className="py-2 text-center">
            <p className="text-xs text-muted-foreground uppercase font-black">{selectedItem?.sku}</p>
            <h3 className="text-lg font-bold">{selectedItem?.name}</h3>
          </div>
          <form onSubmit={handleCreateOrder} className="space-y-4 pt-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="order-quantity" className="text-xs uppercase font-bold text-muted-foreground">Cantidad a pedir</Label>
              <Input id="order-quantity" name="quantity" type="number" required className="bg-white/5 border-white/10" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-supplier" className="text-xs uppercase font-bold text-muted-foreground">Proveedor</Label>
              <Input id="order-supplier" name="supplier" required className="bg-white/5 border-white/10" defaultValue={selectedItem?.supplier || ""} />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold" disabled={createPOMutation.isPending}>
                {createPOMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Pedido"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
