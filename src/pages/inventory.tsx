import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { data: items = [] } = useQuery<any[]>({ queryKey: ["/api/inventory"] });

  const categories = [...new Set(items.map((i: any) => i.category))];

  const filtered = items.filter((item: any) => {
    const matchSearch = search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || item.category === category;
    return matchSearch && matchCat;
  });

  const getStockBadge = (item: any) => {
    if (item.quantity === 0) return <Badge variant="destructive" className="text-xs">Sin stock</Badge>;
    if (item.quantity <= item.minQuantity) return <Badge className="text-xs bg-orange-500 hover:bg-orange-600">Bajo stock</Badge>;
    return <Badge variant="secondary" className="text-xs">En stock</Badge>;
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Inventario</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="add-part"><Plus className="w-4 h-4 mr-1.5" /> Añadir Pieza</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Añadir Pieza</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nombre</Label><Input placeholder="Nombre de la pieza" data-testid="part-name" /></div>
              <div><Label>SKU</Label><Input placeholder="SKU-001" data-testid="part-sku" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Cantidad</Label><Input type="number" placeholder="0" data-testid="part-qty" /></div>
                <div><Label>Mín. Stock</Label><Input type="number" placeholder="0" data-testid="part-min" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Precio Coste (€)</Label><Input type="number" placeholder="0.00" data-testid="part-cost" /></div>
                <div><Label>Precio Venta (€)</Label><Input type="number" placeholder="0.00" data-testid="part-sale" /></div>
              </div>
              <div><Label>Proveedor</Label><Input placeholder="Nombre del proveedor" data-testid="part-supplier" /></div>
              <Button className="w-full" data-testid="save-part">Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o SKU..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" data-testid="search-inventory" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44" data-testid="category-filter">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">SKU</th>
                  <th className="p-3 font-medium">Nombre</th>
                  <th className="p-3 font-medium">Categoría</th>
                  <th className="p-3 font-medium text-center">Cantidad</th>
                  <th className="p-3 font-medium">Estado</th>
                  <th className="p-3 font-medium text-right">Coste</th>
                  <th className="p-3 font-medium text-right">PVP</th>
                  <th className="p-3 font-medium">Proveedor</th>
                  <th className="p-3 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any) => (
                  <tr
                    key={item.id}
                    className={`border-b last:border-0 hover:bg-muted/30 ${
                      item.quantity <= item.minQuantity ? "bg-orange-50/50 dark:bg-orange-900/5" : ""
                    }`}
                    data-testid={`inv-row-${item.id}`}
                  >
                    <td className="p-3 font-mono text-xs">{item.sku}</td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-muted-foreground">{item.category}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3">{getStockBadge(item)}</td>
                    <td className="p-3 text-right">€{item.costPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-medium">€{item.salePrice.toFixed(2)}</td>
                    <td className="p-3 text-muted-foreground">{item.supplier}</td>
                    <td className="p-3 text-right">
                      <Button variant="outline" size="sm" data-testid={`order-${item.id}`}>
                        <ShoppingCart className="w-3 h-3 mr-1" /> Pedir
                      </Button>
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
