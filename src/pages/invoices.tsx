import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePlus } from "lucide-react";
import { useState } from "react";

const statusLabels: Record<string, string> = { pending: "Pendiente", paid: "Pagada", overdue: "Vencida" };
const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Invoices() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: invoices = [] } = useQuery<any[]>({ queryKey: ["/api/invoices"] });

  const filtered = invoices.filter((i: any) => statusFilter === "all" || i.status === statusFilter);
  const totals = {
    pending: invoices.filter((i: any) => i.status === "pending").reduce((s: number, i: any) => s + i.totalAmount, 0),
    paid: invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + i.totalAmount, 0),
    overdue: invoices.filter((i: any) => i.status === "overdue").reduce((s: number, i: any) => s + i.totalAmount, 0),
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Facturas</h1>
        <Button data-testid="create-invoice"><FilePlus className="w-4 h-4 mr-1.5" /> Crear desde RO</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["pending", "paid", "overdue"] as const).map(s => (
          <Card key={s}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{statusLabels[s]}</p>
                <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  €{totals[s].toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusStyles[s]}`}>
                {invoices.filter((i: any) => i.status === s).length}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44" data-testid="invoice-status-filter">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">Factura</th>
                  <th className="p-3 font-medium">Cliente</th>
                  <th className="p-3 font-medium">Servicios</th>
                  <th className="p-3 font-medium">Estado</th>
                  <th className="p-3 font-medium">Vencimiento</th>
                  <th className="p-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv: any) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30" data-testid={`inv-row-${inv.id}`}>
                    <td className="p-3 font-mono text-xs">FAC-{String(inv.id).padStart(4, "0")}</td>
                    <td className="p-3">{inv.customerName}</td>
                    <td className="p-3 max-w-[200px] truncate text-muted-foreground">
                      {inv.workOrderServices?.join(", ") || "—"}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusStyles[inv.status]}`}>
                        {statusLabels[inv.status]}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{inv.dueDate}</td>
                    <td className="p-3 text-right font-medium">€{inv.totalAmount?.toFixed(2)}</td>
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
