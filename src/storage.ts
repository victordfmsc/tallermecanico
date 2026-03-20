import { prisma } from "./lib/db";

export interface IStorage {
  // Technicians
  getTechnicians(shopId: string): Promise<any[]>;
  createTechnician(shopId: string, t: any): Promise<any>;
  // Customers
  getCustomers(shopId: string): Promise<any[]>;
  createCustomer(shopId: string, c: any): Promise<any>;
  // Vehicles
  getVehicles(shopId: string): Promise<any[]>;
  createVehicle(shopId: string, v: any): Promise<any>;
  // Work Orders
  getWorkOrders(shopId: string): Promise<any[]>;
  createWorkOrder(shopId: string, wo: any): Promise<any>;
  updateWorkOrder(shopId: string, id: string, data: any): Promise<any>;
  // Estimates
  getEstimates(shopId: string): Promise<any[]>;
  createEstimate(shopId: string, e: any): Promise<any>;
  updateEstimate(shopId: string, id: string, data: any): Promise<any>;
  // Invoices
  getInvoices(shopId: string): Promise<any[]>;
  createInvoice(shopId: string, i: any): Promise<any>;
  updateInvoice(shopId: string, id: string, data: any): Promise<any>;
  // Inspections
  getInspections(shopId: string): Promise<any[]>;
  createInspection(shopId: string, i: any): Promise<any>;
  // Inventory
  getInventory(shopId: string): Promise<any[]>;
  createInventoryItem(shopId: string, i: any): Promise<any>;
  updateInventoryItem(shopId: string, id: string, data: any): Promise<any>;
  // Messages
  getMessages(shopId: string): Promise<any[]>;
  createMessage(shopId: string, m: any): Promise<any>;
  // Campaigns
  getCampaigns(shopId: string): Promise<any[]>;
  createCampaign(shopId: string, c: any): Promise<any>;
  // Appointments (Simulated via WorkOrder or similar if model missing)
  getAppointments(shopId: string): Promise<any[]>;
  createAppointment(shopId: string, a: any): Promise<any>;
}

export class PrismaStorage implements IStorage {
  // Technicians
  async getTechnicians(shopId: string) {
    return await prisma.technician.findMany({ where: { shopId } });
  }
  async createTechnician(shopId: string, t: any) {
    return await prisma.technician.create({ data: { ...t, shopId } });
  }

  // Customers
  async getCustomers(shopId: string) {
    return await prisma.customer.findMany({ where: { shopId } });
  }
  async createCustomer(shopId: string, c: any) {
    return await prisma.customer.create({ data: { ...c, shopId } });
  }

  // Vehicles
  async getVehicles(shopId: string) {
    return await prisma.vehicle.findMany({ where: { shopId } });
  }
  async createVehicle(shopId: string, v: any) {
    return await prisma.vehicle.create({ data: { ...v, shopId } });
  }

  // Work Orders
  async getWorkOrders(shopId: string) {
    return await prisma.workOrder.findMany({ where: { shopId } });
  }
  async createWorkOrder(shopId: string, wo: any) {
    return await prisma.workOrder.create({ 
      data: {
        ...wo,
        shopId,
        services: wo.services || [],
      } 
    });
  }
  async updateWorkOrder(shopId: string, id: string, data: any) {
    return await prisma.workOrder.update({
      where: { id, shopId },
      data,
    });
  }

  // Estimates
  async getEstimates(shopId: string) {
    return await prisma.estimate.findMany({ 
      where: { shopId },
      include: {
        customer: true,
        vehicle: true,
        workOrder: {
          include: {
            inspections: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      } as any,
      orderBy: { createdAt: 'desc' }
    });
  }
  async createEstimate(shopId: string, e: any) {
    return await prisma.estimate.create({ 
      data: {
        ...e,
        shopId,
        lines: e.lines || [],
        publicToken: Math.random().toString(36).substring(2, 15),
      } 
    });
  }
  async updateEstimate(shopId: string, id: string, data: any) {
    return await prisma.estimate.update({
      where: { id, shopId },
      data,
    });
  }

  // Invoices
  async getInvoices(shopId: string) {
    return await prisma.invoice.findMany({ where: { shopId } });
  }
  async createInvoice(shopId: string, i: any) {
    return await prisma.invoice.create({ data: { ...i, shopId } });
  }
  async updateInvoice(shopId: string, id: string, data: any) {
    return await prisma.invoice.update({
      where: { id, shopId },
      data,
    });
  }

  // Inspections
  async getInspections(shopId: string) {
    return await prisma.inspection.findMany({ where: { shopId } });
  }
  async createInspection(shopId: string, i: any) {
    return await prisma.inspection.create({ 
      data: {
        ...i,
        shopId,
        sections: i.sections || [],
      } 
    });
  }

  // Inventory
  async getInventory(shopId: string) {
    return await prisma.inventoryItem.findMany({ where: { shopId } });
  }
  async createInventoryItem(shopId: string, i: any) {
    return await prisma.inventoryItem.create({ data: { ...i, shopId } });
  }
  async updateInventoryItem(shopId: string, id: string, data: any) {
    return await prisma.inventoryItem.update({
      where: { id, shopId },
      data,
    });
  }

  // Messages
  async getMessages(shopId: string) {
    return await prisma.message.findMany({ where: { shopId } });
  }
  async createMessage(shopId: string, m: any) {
    return await prisma.message.create({ data: { ...m, shopId } });
  }

  // Campaigns
  async getCampaigns(shopId: string) {
    return await prisma.marketingCampaign.findMany({ where: { shopId } });
  }
  async createCampaign(shopId: string, c: any) {
    return await prisma.marketingCampaign.create({ data: { ...c, shopId } });
  }

  // Appointments (Simulated)
  async getAppointments(shopId: string) {
    return []; 
  }
  async createAppointment(shopId: string, a: any) {
    return null;
  }
}

export const storage = new PrismaStorage();
