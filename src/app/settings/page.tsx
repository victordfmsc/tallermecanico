"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building, Users, Plug, Bell } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const integrations = [
  { name: "QuickBooks", description: "Sincronización contable automática", connected: true },
  { name: "Stripe", description: "Procesamiento de pagos online", connected: true },
  { name: "CARFAX", description: "Informes de historial vehicular", connected: false },
  { name: "PartsTech", description: "Catálogo de piezas multi-proveedor", connected: true },
];

const users = [
  { name: "Víctor Díaz", email: "victor@shopflow.es", role: "Admin", avatar: "VD" },
  { name: "Carlos Ruiz", email: "carlos@shopflow.es", role: "Técnico", avatar: "CR" },
  { name: "Ana García", email: "ana@shopflow.es", role: "Técnico", avatar: "AG" },
  { name: "Laura Sánchez", email: "laura@shopflow.es", role: "Recepcionista", avatar: "LS" },
  { name: "Miguel Torres", email: "miguel@shopflow.es", role: "Técnico", avatar: "MT" },
];

const roleStyles: Record<string, string> = {
  Admin: "bg-primary/10 text-primary",
  Técnico: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Recepcionista: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Configuración</h1>

        <Tabs defaultValue="shop">
          <TabsList>
            <TabsTrigger value="shop" data-testid="tab-shop"><Building className="w-3.5 h-3.5 mr-1.5" /> Taller</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users"><Users className="w-3.5 h-3.5 mr-1.5" /> Usuarios</TabsTrigger>
            <TabsTrigger value="integrations" data-testid="tab-integrations"><Plug className="w-3.5 h-3.5 mr-1.5" /> Integraciones</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications"><Bell className="w-3.5 h-3.5 mr-1.5" /> Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="shop">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Información del Taller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Nombre del Taller</Label><Input defaultValue="Taller Mecánico Central" data-testid="shop-name" /></div>
                  <div><Label>CIF/NIF</Label><Input defaultValue="B12345678" data-testid="shop-cif" /></div>
                  <div><Label>Teléfono</Label><Input defaultValue="+34 912 345 678" data-testid="shop-phone" /></div>
                  <div><Label>Email</Label><Input defaultValue="info@tallercentral.es" data-testid="shop-email" /></div>
                  <div className="md:col-span-2"><Label>Dirección</Label><Input defaultValue="Av. de la Industria 25, 28108 Alcobendas, Madrid" data-testid="shop-address" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label>Bahías de Trabajo</Label><Input type="number" defaultValue="6" data-testid="shop-bays" /></div>
                  <div><Label>Horario</Label><Input defaultValue="Lun-Vie 8:00-18:00" data-testid="shop-hours" /></div>
                  <div><Label>Moneda</Label><Input defaultValue="EUR (€)" data-testid="shop-currency" /></div>
                </div>
                <Button data-testid="save-shop">Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Usuarios y Roles</CardTitle>
                <Button size="sm" data-testid="add-user">Añadir Usuario</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground bg-muted/30">
                        <th className="p-3 font-medium">Usuario</th>
                        <th className="p-3 font-medium">Email</th>
                        <th className="p-3 font-medium">Rol</th>
                        <th className="p-3 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <tr key={i} className="border-b last:border-0" data-testid={`user-row-${i}`}>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="w-7 h-7">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{user.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">{user.email}</td>
                          <td className="p-3">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${roleStyles[user.role]}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" className="text-xs">Editar</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((int, i) => (
                <Card key={i} data-testid={`integration-${int.name}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      int.connected ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                    }`}>
                      {int.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{int.name}</p>
                      <p className="text-xs text-muted-foreground">{int.description}</p>
                    </div>
                    <Switch checked={int.connected} data-testid={`toggle-${int.name}`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preferencias de Notificación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Nuevo presupuesto aprobado", desc: "Recibir notificación cuando un cliente aprueba un presupuesto", on: true },
                  { label: "Stock bajo", desc: "Alertar cuando una pieza llegue al mínimo de stock", on: true },
                  { label: "Cita próxima", desc: "Recordatorio 1 hora antes de cada cita", on: true },
                  { label: "Orden completada", desc: "Notificar al completar una orden de trabajo", on: false },
                  { label: "Nuevo mensaje de chat", desc: "Alertar cuando un cliente envía un mensaje", on: true },
                  { label: "Factura vencida", desc: "Recordatorio de facturas sin pagar", on: true },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.desc}</p>
                    </div>
                    <Switch defaultChecked={pref.on} data-testid={`notif-toggle-${i}`} />
                  </div>
                ))}
                <Separator />
                <Button data-testid="save-notifications">Guardar Preferencias</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
