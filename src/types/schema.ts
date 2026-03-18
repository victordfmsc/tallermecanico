import { z } from "zod";

// ─── Technicians ────────────────────────────────
export interface Technician {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  efficiency: number;
  status: "active" | "break" | "off";
  activeJobs: number;
  hoursToday: number;
}

export const insertTechnicianSchema = z.object({
  name: z.string().min(1),
  specialty: z.string(),
  avatar: z.string(),
  efficiency: z.number().min(0).max(100),
  status: z.enum(["active", "break", "off"]),
  activeJobs: z.number().default(0),
  hoursToday: z.number().default(0),
});
export type InsertTechnician = z.infer<typeof insertTechnicianSchema>;

// ─── Customers ──────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
}

export const insertCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  totalVisits: z.number().default(0),
  totalSpent: z.number().default(0),
});
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// ─── Vehicles ───────────────────────────────────
export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  color: string;
}

export const insertVehicleSchema = z.object({
  customerId: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  vin: z.string(),
  licensePlate: z.string(),
  mileage: z.number(),
  color: z.string(),
});
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

// ─── Work Orders ────────────────────────────────
export type WorkOrderStatus = "pending" | "diagnosis" | "in_progress" | "completed" | "delivered";

export interface WorkOrder {
  id: string;
  vehicleId: string;
  customerId: string;
  technicianId: string;
  status: WorkOrderStatus;
  services: string[];
  totalAmount: number;
  notes: string;
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
}

export const insertWorkOrderSchema = z.object({
  vehicleId: z.string(),
  customerId: z.string(),
  technicianId: z.string(),
  status: z.enum(["pending", "diagnosis", "in_progress", "completed", "delivered"]),
  services: z.array(z.string()),
  totalAmount: z.number(),
  notes: z.string().default(""),
  estimatedHours: z.number().default(1),
});
export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;

// ─── Estimates ──────────────────────────────────
export type EstimateStatus = "draft" | "sent" | "approved" | "rejected";

export interface EstimateLine {
  description: string;
  type: "service" | "part";
  quantity: number;
  unitPrice: number;
  approved: boolean;
}

export interface Estimate {
  id: string;
  customerId: string;
  vehicleId: string;
  status: EstimateStatus;
  lines: EstimateLine[];
  totalAmount: number;
  sentAt: string | null;
  createdAt: string;
}

export const insertEstimateSchema = z.object({
  customerId: z.string(),
  vehicleId: z.string(),
  status: z.enum(["draft", "sent", "approved", "rejected"]),
  lines: z.array(z.object({
    description: z.string(),
    type: z.enum(["service", "part"]),
    quantity: z.number(),
    unitPrice: z.number(),
    approved: z.boolean(),
  })),
  totalAmount: z.number(),
});
export type InsertEstimate = z.infer<typeof insertEstimateSchema>;

// ─── Invoices ───────────────────────────────────
export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface Invoice {
  id: string;
  workOrderId: string;
  customerId: string;
  status: InvoiceStatus;
  totalAmount: number;
  paidAt: string | null;
  dueDate: string;
  createdAt: string;
}

export const insertInvoiceSchema = z.object({
  workOrderId: z.string(),
  customerId: z.string(),
  status: z.enum(["pending", "paid", "overdue"]),
  totalAmount: z.number(),
  dueDate: z.string(),
});
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// ─── Inspections ────────────────────────────────
export type InspectionItemStatus = "good" | "warning" | "critical";

export interface InspectionSection {
  name: string;
  status: InspectionItemStatus;
  notes: string;
  completed: boolean;
}

export interface Inspection {
  id: string;
  workOrderId: string;
  vehicleId: string;
  technicianId: string;
  sections: InspectionSection[];
  overallStatus: InspectionItemStatus;
  progress: number;
  completedAt: string | null;
  createdAt: string;
}

export const insertInspectionSchema = z.object({
  workOrderId: z.string(),
  vehicleId: z.string(),
  technicianId: z.string(),
  sections: z.array(z.object({
    name: z.string(),
    status: z.enum(["good", "warning", "critical"]),
    notes: z.string(),
    completed: z.boolean(),
  })),
  overallStatus: z.enum(["good", "warning", "critical"]),
  progress: z.number(),
});
export type InsertInspection = z.infer<typeof insertInspectionSchema>;

// ─── Inventory Items ────────────────────────────
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  costPrice: number;
  salePrice: number;
  supplier: string;
}

export const insertInventoryItemSchema = z.object({
  name: z.string().min(1),
  sku: z.string(),
  category: z.string(),
  quantity: z.number(),
  minQuantity: z.number(),
  costPrice: z.number(),
  salePrice: z.number(),
  supplier: z.string(),
});
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

// ─── Purchase Orders ────────────────────────────
export type PurchaseOrderStatus = "pending" | "received" | "cancelled";

export interface PurchaseOrder {
  id: string;
  shopId: string;
  itemId: string;
  quantity: number;
  supplier: string;
  status: PurchaseOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export const insertPurchaseOrderSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1),
  supplier: z.string().min(1),
  status: z.enum(["pending", "received", "cancelled"]).default("pending"),
});
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;

// ─── Messages ───────────────────────────────────
export interface Message {
  id: string;
  customerId: string;
  direction: "inbound" | "outbound";
  content: string;
  readAt: string | null;
  createdAt: string;
}

export const insertMessageSchema = z.object({
  customerId: z.string(),
  direction: z.enum(["inbound", "outbound"]),
  content: z.string(),
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// ─── Marketing Campaigns ────────────────────────
export type CampaignType = "sms" | "email" | "review" | "reminder";
export type CampaignStatus = "draft" | "active" | "completed" | "paused";

export interface MarketingCampaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  sent: number;
  opened: number;
  clicked: number;
  createdAt: string;
}

export const insertCampaignSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["sms", "email", "review", "reminder"]),
  status: z.enum(["draft", "active", "completed", "paused"]),
  sent: z.number().default(0),
  opened: z.number().default(0),
  clicked: z.number().default(0),
});
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

// ─── Appointments (for calendar) ────────────────
export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  technicianId: string;
  serviceType: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export const insertAppointmentSchema = z.object({
  customerId: z.string(),
  vehicleId: z.string(),
  technicianId: z.string(),
  serviceType: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().default(""),
});
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// ─── Users ──────────────────────────────────────
export type UserRole = "OWNER" | "ADMIN" | "TECHNICIAN" | "RECEPTIONIST";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  shopId: string | null;
  createdAt: string;
}

export const insertUserSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["OWNER", "ADMIN", "TECHNICIAN", "RECEPTIONIST"]).default("TECHNICIAN"),
  shopId: z.string().nullable(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
