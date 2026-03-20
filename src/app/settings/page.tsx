"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Building2, MapPin, Phone, 
  FileText, ImageIcon, Save,
  Loader2, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const settingsSchema = z.object({
  name: z.string().min(1, "Nombre del taller es requerido"),
  nif: z.string().min(1, "NIF/CIF es requerido"),
  address: z.string().min(1, "Dirección es requerida"),
  phone: z.string().min(1, "Teléfono es requerido"),
  logo: z.string().url("Debe ser una URL válida").or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: shop, isLoading } = useQuery({
    queryKey: ["/api/shop"],
    queryFn: () => fetch("/api/shop").then(res => res.json()),
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: {
      name: shop?.name || "",
      nif: shop?.nif || "",
      address: shop?.address || "",
      phone: shop?.phone || "",
      logo: shop?.logo || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      const res = await fetch("/api/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Error al guardar configuración");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop"] });
      toast.success("Configuración guardada correctamente");
    },
    onError: () => {
      toast.error("Hubo un problema al guardar los cambios");
    }
  });

  const onSubmit = (values: SettingsFormValues) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 bg-[#0a0a0a] min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" } as any}>
          Configuración del Taller
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Personaliza la identidad de tu negocio y datos fiscales para facturación</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Datos Generales
              </CardTitle>
              <CardDescription>Información básica que aparecerá en el encabezado de tus documentos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Nombre Comercial</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Mi Taller S.L." className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground">NIF / CIF</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="B12345678" className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Dirección Física</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input {...field} className="pl-10 bg-white/5 border-white/10" placeholder="Calle Ejemplo 123, Madrid" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground">Teléfono de Contacto</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input {...field} className="pl-10 bg-white/5 border-white/10" placeholder="+34 600 000 000" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" /> Identidad Visual
              </CardTitle>
              <CardDescription>Sube tu logo para que aparezca en presupuestos e inspecciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-muted-foreground">URL del Logo (PNG/SVG)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://mi-servidor.com/logo.png" className="bg-white/5 border-white/10" />
                    </FormControl>
                    {field.value && (
                      <div className="mt-4 p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-center">
                        <img src={field.value} alt="Preview" className="h-20 object-contain" onError={(e) => (e.currentTarget.src = "")} />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 gap-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" /> Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
