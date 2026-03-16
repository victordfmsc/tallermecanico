import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, X, Truck } from "lucide-react";
import { useState } from "react";

interface CartItem {
  name: string;
  supplier: string;
  price: number;
  qty: number;
}

const suppliers = ["AutoPartes Pro", "MasterParts", "QuickStock"];

export default function PartsOrdering() {
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: inventory = [] } = useQuery<any[]>({ queryKey: ["/api/inventory"] });

  const filtered = inventory.filter((item: any) => {
    const matchSearch = search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchSupplier = supplierFilter === "all" || item.supplier === supplierFilter;
    return matchSearch && matchSupplier;
  });

  const addToCart = (item: any, supplier: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name && c.supplier === supplier);
      if (existing) return prev.map(c => c === existing ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { name: item.name, supplier, price, qty: 1 }];
    });
  };

  const removeFromCart = (i: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== i));
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  // Generate 3-supplier price comparison
  const getPriceForSupplier = (basePrice: number, supplierIdx: number) => {
    const multipliers = [1.0, 0.95, 1.08];
    return Math.round(basePrice * multipliers[supplierIdx] * 100) / 100;
  };

  const getDelivery = (supplierIdx: number) => {
    const days = ["24h", "48h", "24-48h"];
    return days[supplierIdx];
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Pedido de Piezas</h1>

      <div className="flex gap-4">
        {/* Main content */}
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar pieza por nombre o número..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" data-testid="search-parts" />
            </div>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-44" data-testid="supplier-filter">
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {suppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground bg-muted/30">
                      <th className="p-3 font-medium">Pieza</th>
                      {suppliers.map(s => (
                        <th key={s} className="p-3 font-medium text-center">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 15).map((item: any) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30" data-testid={`part-row-${item.id}`}>
                        <td className="p-3">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                        </td>
                        {suppliers.map((supplier, si) => {
                          const price = getPriceForSupplier(item.salePrice, si);
                          return (
                            <td key={supplier} className="p-3 text-center">
                              <p className="font-medium">€{price.toFixed(2)}</p>
                              <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
                                <Truck className="w-2.5 h-2.5" /> {getDelivery(si)}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-1 h-6 text-[10px]"
                                onClick={() => addToCart(item, supplier, price)}
                                data-testid={`add-cart-${item.id}-${si}`}
                              >
                                <ShoppingCart className="w-2.5 h-2.5 mr-0.5" /> Añadir
                              </Button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart sidebar */}
        <div className="w-72 shrink-0 hidden lg:block">
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Carrito
                {cart.length > 0 && <Badge className="ml-auto">{cart.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Carrito vacío</p>
              ) : (
                <>
                  {cart.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/30 text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.supplier} × {item.qty}</p>
                      </div>
                      <span className="font-medium text-xs">€{(item.price * item.qty).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(i)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" size="sm" data-testid="checkout">
                    Realizar Pedido
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
