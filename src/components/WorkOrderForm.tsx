"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2 } from "lucide-react";

const workOrderSchema = z.object({
  vehicleId: z.string().min(1, "Vehículo es requerido"),
  technicianId: z.string().min(1, "Técnico es requerido"),
  services: z.array(z.object({
    name: z.string().min(1, "Nombre del servicio requerido"),
    estimatedHours: z.number().min(0.1),
    price: z.number().min(0),
  })).min(1, "Añade al menos un servicio"),
  notes: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export function WorkOrderForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  
  const { data: vehicles, isLoading: loadingVehicles } = useQuery<any[]>({
    queryKey: ["/api/vehicles"],
    queryFn: () => fetch("/api/vehicles").then(res => res.json()),
  });

  const { data: technicians, isLoading: loadingTechs } = useQuery<any[]>({
    queryKey: ["/api/technicians"],
    queryFn: () => fetch("/api/technicians").then(res => res.json()),
  });

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      services: [{ name: "", estimatedHours: 1, price: 0 }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "services",
    control: form.control,
  });

  const mutation = useMutation({
    mutationFn: async (values: WorkOrderFormValues) => {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Error al crear la orden");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders"] });
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = (values: WorkOrderFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control: form.control,
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehículo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicles?.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control: form.control,
            name="technicianId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Técnico Responsable</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Seleccionar técnico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {technicians?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Servicios</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", estimatedHours: 1, price: 0 })}
              className="h-8 gap-1 text-xs"
            >
              <Plus className="h-3 w-3" /> Añadir Servicio
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-end">
              <div className="flex-1">
                <FormField
                  control: form.control,
                  name={`services.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="P. ej. Cambio de aceite" className="bg-white/5 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-24">
                <FormField
                  control: form.control,
                  name={`services.${index}.estimatedHours`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          placeholder="Hrs"
                          className="bg-white/5 border-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-32">
                <FormField
                  control: form.control,
                  name={`services.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">€</span>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            className="pl-7 bg-white/5 border-white/10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <FormField
          control: form.control,
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Adicionales</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Detalles sobre el vehículo o peticiones del cliente..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 font-bold py-6"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando Orden...
            </>
          ) : (
            "Crear Orden de Trabajo"
          )}
        </Button>
      </form>
    </Form>
  );
}
