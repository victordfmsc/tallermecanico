"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Package, CheckCircle2, Clock, 
  ArrowLeft, ShoppingCart, Loader2,
  ExternalLink, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function PurchaseOrdersPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: orders, isLoading } = useQuery<any[]>({
    queryKey: ["/api/purchase-orders"],
    queryFn: () => fetch("/api/purchase-orders").then(res => res.json()),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`/api/purchase-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating order");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/inventory")}
          className="hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Pedidos a Proveedores
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Historial y recepción de mercancía</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-amber-500">
                {orders?.filter(o => o.status === "pending").length || 0}
              </span>
              <Clock className="h-8 w-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recibidos (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-500">
                {orders?.filter(o => o.status === "received").length || 0}
              </span>
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Inversión Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-primary">
                €{orders?.reduce((acc, o) => acc + (o.quantity * (o.item?.costPrice || 0)), 0).toFixed(2) || "0.00"}
              </span>
              <ShoppingCart className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-[#121212]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground h-12">Fecha</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pieza / Item</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Proveedor</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Cantidad</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estado</TableHead>
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
              ) : orders?.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Truck className="h-8 w-8 opacity-20" />
                      <p>No se han realizado pedidos todavía</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders?.map((order) => (
                  <TableRow key={order.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{order.item?.name}</span>
                        <span className="text-[10px] font-mono text-primary uppercase">{order.item?.sku}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.supplier}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-white/5 text-white border-white/10">
                        {order.quantity} uts.
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        order.status === "received" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" :
                        order.status === "pending" ? "bg-amber-500/20 text-amber-500 border-amber-500/30" :
                        "bg-white/10 text-white"
                      }>
                        {order.status === "received" ? "RECIBIDO" : "PENDIENTE"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.status === "pending" && (
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-2 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 font-bold text-xs"
                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: "received" })}
                            disabled={updateStatusMutation.isPending}
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            Recibido
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
