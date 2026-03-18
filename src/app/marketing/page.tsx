"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Send, Mail, MessageSquare, Plus, 
  Users, Calendar, Clock, BarChart3, 
  ChevronRight, Loader2, CreditCard, 
  Zap, AlertCircle, CheckCircle2,
  Phone, AtSign, Filter, Search
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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


export default function MarketingPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"sms" | "email">("sms");

  // Queries
  const { data: campaigns, isLoading } = useQuery<any[]>({
    queryKey: ["/api/campaigns"],
    queryFn: () => fetch("/api/campaigns").then(res => res.json()),
  });

  const { data: shopData } = useQuery<any>({
    queryKey: ["/api/shop/credits"],
    queryFn: () => fetch("/api/shop/credits").then(res => res.json()),
  });

  // Mutations
  const createCampaignMutation = useMutation({
    mutationFn: (newCampaign: any) => fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCampaign),
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setIsNewModalOpen(false);
      toast({ title: "Campaña creada", description: "La campaña se ha guardado como borrador." });
    },
  });

  const sendCampaignMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/campaigns/${id}/send`, { method: "POST" }).then(res => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      if (data.error) {
        toast({ variant: "destructive", title: "Error", description: data.error });
      } else {
        toast({ title: "Envío iniciado", description: "Los mensajes se están enviando en segundo plano." });
      }
    },
  });

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      type: selectedType,
      content: formData.get("content"),
      segment: {
        criteria: formData.get("segment_criteria"),
        value: formData.get("segment_value"),
      },
      scheduledFor: formData.get("scheduled_for") || null,
    };
    createCampaignMutation.mutate(data);
  };

  const rechargeMutation = useMutation({
    mutationFn: () => fetch("/api/shop/credits", { method: "POST" }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop/credits"] });
      toast({ title: "Créditos recargados", description: "Se han añadido 500 créditos SMS a tu cuenta." });
    },
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" } as any}>
            Marketing Automático
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Atrae clientes y aumenta la recurrencia con campañas reales</p>
        </div>
        <div className="flex gap-2">
          <Card className="bg-primary/5 border-primary/20 p-2 px-4 flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Créditos SMS</span>
              <span className="text-xl font-black">{shopData?.smsCredits || 0}</span>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 hover:bg-primary/20 text-primary"
              onClick={() => rechargeMutation.mutate()}
              disabled={rechargeMutation.isPending}
            >
              <Zap className={`h-4 w-4 ${rechargeMutation.isPending ? 'animate-pulse' : ''}`} />
            </Button>
          </Card>
          <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-full">
                <Plus className="h-4 w-4 mr-2" /> Nueva Campaña
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold uppercase tracking-tight">Crear Campaña</DialogTitle>
                <DialogDescription className="text-muted-foreground">Configura el mensaje y el público objetivo para tu campaña.</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateCampaign} className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Nombre de la Campaña</Label>
                      <Input name="name" required className="bg-white/5 border-white/10" placeholder="Promoción Primavera 2026" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Canal de Envío</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          type="button"
                          variant={selectedType === "sms" ? "default" : "outline"}
                          className={selectedType === "sms" ? "bg-primary text-white" : "border-white/10"}
                          onClick={() => setSelectedType("sms")}
                        >
                          <Phone className="h-4 w-4 mr-2" /> SMS
                        </Button>
                        <Button 
                          type="button"
                          variant={selectedType === "email" ? "default" : "outline"}
                          className={selectedType === "email" ? "bg-primary text-white" : "border-white/10"}
                          onClick={() => setSelectedType("email")}
                        >
                          <AtSign className="h-4 w-4 mr-2" /> Email
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Segmentación</Label>
                      <Select name="segment_criteria" defaultValue="all">
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                          <SelectItem value="all">Todos los clientes</SelectItem>
                          <SelectItem value="last_visit">Inactivos (X días)</SelectItem>
                          <SelectItem value="service_type">Por tipo de servicio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Valor Segmento / Días</Label>
                      <Input name="segment_value" className="bg-white/5 border-white/10" placeholder="90 (días) o 'Frenos'..." />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Mensaje</Label>
                      <Textarea 
                        name="content" 
                        required 
                        rows={8}
                        className="bg-white/5 border-white/10 text-sm"
                        placeholder="Hola {{nombre}}, hace tiempo que no vemos tu coche. ¡Pide cita hoy y obtén un 10% de descuento!"
                      />
                      <p className="text-[10px] text-muted-foreground">Variables: <code className="text-primary">{`{{nombre}}`}</code>, <code className="text-primary">{`{{matricula}}`}</code></p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Programar Envío (Opcional)</Label>
                      <Input name="scheduled_for" type="datetime-local" className="bg-white/5 border-white/10" />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-white/5">
                  <Button type="submit" className="w-full bg-primary font-bold uppercase tracking-widest h-12" disabled={createCampaignMutation.isPending}>
                    {createCampaignMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Borrador"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enviados (Total hoy)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-white">
                {campaigns?.reduce((acc, c) => acc + c.sent, 0) || 0}
              </span>
              <Send className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mensajes SMS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-blue-500">
                {campaigns?.filter(c => c.type === "sms").length || 0}
              </span>
              <MessageSquare className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Newsletters Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-500">
                {campaigns?.filter(c => c.type === "email").length || 0}
              </span>
              <Mail className="h-8 w-8 text-emerald-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Conversión Estimada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-orange-500">
                4.2%
              </span>
              <BarChart3 className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full bg-white/5 border border-white/10 rounded-xl" />
          ))
        ) : campaigns?.length === 0 ? (
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <Zap className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">Aún no has creado campañas de marketing.</p>
            <Button variant="link" className="text-primary mt-2" onClick={() => setIsNewModalOpen(true)}>Empieza aquí</Button>
          </div>
        ) : (
          campaigns?.map((campaign) => (
            <Card key={campaign.id} className="bg-[#121212] border-white/10 overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {campaign.type === "sms" ? (
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Mail className="h-4 w-4" />
                      </div>
                    )}
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-white/10">
                      {campaign.type}
                    </Badge>
                  </div>
                  <Badge className={
                    campaign.status === "completed" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" :
                    campaign.status === "active" ? "bg-blue-500/20 text-blue-500 border-blue-500/30 animate-pulse" :
                    "bg-gray-500/20 text-gray-500 border-gray-500/30"
                  }>
                    {campaign.status === "completed" ? "ENVIADA" : campaign.status === "active" ? "ENVIANDO..." : "BORRADOR"}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold mt-4 uppercase tracking-tighter leading-tight">{campaign.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">{campaign.content}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Segmento: <b>{campaign.segment?.criteria || 'all'}</b></span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Progreso de envío</span>
                    <span>{campaign.sent} envíos exitosos</span>
                  </div>
                  <Progress value={campaign.status === 'completed' ? 100 : (campaign.sent > 0 ? 50 : 0)} className="h-1.5 bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {campaign.status === "draft" && (
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-[10px] h-10 tracking-widest"
                      onClick={() => sendCampaignMutation.mutate(campaign.id)}
                      disabled={sendCampaignMutation.isPending}
                    >
                      {sendCampaignMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lanzar Campaña"}
                    </Button>
                  )}
                  <Button variant="outline" className="border-white/10 hover:bg-white/5 uppercase text-[10px] h-10 tracking-widest">
                    Editar Borrador
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
