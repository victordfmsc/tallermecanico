import { z } from "zod";

export const workOrderSchema = z.object({
  vehicleId: z.string().min(1, "Vehículo es requerido"),
  technicianId: z.string().min(1, "Técnico es requerido"),
  services: z.array(z.object({
    name: z.string().min(1),
    hours: z.number().min(0),
    price: z.number().min(0),
  })).min(1, "Al menos un servicio es requerido"),
  notes: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const vehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
  plate: z.string().min(1),
  color: z.string().optional(),
  odometer: z.number().min(0),
  customerId: z.string().min(1),
});

export const inventorySchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  category: z.string().min(1),
  quantity: z.number().min(0),
  minQuantity: z.number().min(0),
  price: z.number().min(0),
  location: z.string().optional(),
});
