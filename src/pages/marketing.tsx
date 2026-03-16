import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus, Send, Mail, MessageSquare, Star, Bell } from "lucide-react";
import { useState } from "react";

const typeLabels: Record<string, string> = { sms: "SMS", email: "Email", review: "Reseñas", reminder: "Recordatorio" };
const typeIcons: Record<string, any> = { sms: MessageSquare, email: Mail, review: Star, reminder: Bell };
const statusLabels: Record<string, string> = { draft: "Borrador", active: "Activa", completed: "Completada", paused: "Pausada" };
const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function Marketing() {
  const { data: campaigns = [] } = useQuery<any[]>({ queryKey: ["/api/campaigns"] });
  const [dialogOpen, setDialogOpen] = useState(false);

  const smsCredits = { used: 1250, total: 2000 };

  const filterByType = (type: string) => campaigns.filter((c: any) => c.type === type);

  const renderCampaignTable = (items: any[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground bg-muted/30">
            <th className="p-3 font-medium">Campaña</th>
            <th className="p-3 font-medium">Estado</th>
            <th className="p-3 font-medium text-center">Enviados</th>
            <th className="p-3 font-medium text-center">Abiertos</th>
            <th className="p-3 font-medium text-center">Clics</th>
            <th className="p-3 font-medium text-center">Tasa Apertura</th>
            <th className="p-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c: any) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30" data-testid={`camp-row-${c.id}`}>
              <td className="p-3 font-medium">{c.name}</td>
              <td className="p-3">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusStyles[c.status]}`}>
                  {statusLabels[c.status]}
                </span>
              </td>
              <td className="p-3 text-center">{c.sent.toLocaleString("es-ES")}</td>
              <td className="p-3 text-center">{c.opened.toLocaleString("es-ES")}</td>
              <td className="p-3 text-center">{c.clicked}</td>
              <td className="p-3 text-center font-medium">
                {c.sent > 0 ? `${Math.round((c.opened / c.sent) * 100)}%` : "—"}
              </td>
              <td className="p-3 text-muted-foreground">{c.createdAt}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Sin campañas de este tipo</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Marketing</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="new-campaign"><Plus className="w-4 h-4 mr-1.5" /> Nueva Campaña</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Nueva Campaña</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nombre</Label><Input placeholder="Nombre de la campaña" data-testid="camp-name" /></div>
              <div>
                <Label>Tipo</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {(["sms", "email", "review", "reminder"] as const).map(t => {
                    const Icon = typeIcons[t];
                    return (
                      <Button key={t} variant="outline" className="flex-col h-auto py-2" data-testid={`type-${t}`}>
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-[10px]">{typeLabels[t]}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label>Mensaje</Label>
                <Textarea placeholder="Escribe el contenido de tu campaña..." rows={4} data-testid="camp-message" />
              </div>
              <Button className="w-full" onClick={() => setDialogOpen(false)} data-testid="save-campaign">
                Crear Campaña
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* SMS Credits */}
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <MessageSquare className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Créditos SMS</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={(smsCredits.used / smsCredits.total) * 100} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">
                {smsCredits.used}/{smsCredits.total}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sms">
        <TabsList>
          <TabsTrigger value="sms" data-testid="tab-sms">Campañas SMS</TabsTrigger>
          <TabsTrigger value="email" data-testid="tab-email">Campañas Email</TabsTrigger>
          <TabsTrigger value="review" data-testid="tab-review">Reseñas</TabsTrigger>
          <TabsTrigger value="reminder" data-testid="tab-reminder">Recordatorios</TabsTrigger>
        </TabsList>
        {["sms", "email", "review", "reminder"].map(type => (
          <TabsContent key={type} value={type}>
            <Card>
              <CardContent className="p-0">
                {renderCampaignTable(filterByType(type))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
