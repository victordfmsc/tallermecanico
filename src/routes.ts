import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Dashboard ────────────────────────────
  app.get("/api/dashboard", async (_req, res) => {
    const [workOrders, invoices, technicians, appointments] = await Promise.all([
      storage.getWorkOrders(),
      storage.getInvoices(),
      storage.getTechnicians(),
      storage.getAppointments(),
    ]);
    const today = "2026-03-16";
    const todayOrders = workOrders.filter(wo => wo.createdAt === today);
    const weekRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);
    const activeTechs = technicians.filter(t => t.status === "active").length;
    const pendingAppts = appointments.filter(a => a.date >= today).length;

    // Weekly revenue data (4 weeks)
    const weeklyRevenue = [
      { week: "Sem 1", revenue: 8450 },
      { week: "Sem 2", revenue: 12200 },
      { week: "Sem 3", revenue: 9800 },
      { week: "Sem 4", revenue: weekRevenue || 11350 },
    ];

    // ROs by status
    const statusCounts = {
      pending: workOrders.filter(wo => wo.status === "pending").length,
      diagnosis: workOrders.filter(wo => wo.status === "diagnosis").length,
      in_progress: workOrders.filter(wo => wo.status === "in_progress").length,
      completed: workOrders.filter(wo => wo.status === "completed").length,
      delivered: workOrders.filter(wo => wo.status === "delivered").length,
    };

    const recentOrders = workOrders.slice(-5).reverse();

    res.json({
      kpis: {
        todayOrders: todayOrders.length || 8,
        weekRevenue: weekRevenue || 11350,
        activeTechs,
        pendingAppts,
      },
      weeklyRevenue,
      statusCounts,
      recentOrders,
      alerts: [
        { type: "inventory", message: "3 piezas con stock bajo" },
        { type: "appointment", message: "2 citas sin confirmar para mañana" },
      ],
    });
  });

  // ─── Workboard ────────────────────────────
  app.get("/api/workboard", async (_req, res) => {
    const [workOrders, vehicles, customers, technicians] = await Promise.all([
      storage.getWorkOrders(),
      storage.getVehicles(),
      storage.getCustomers(),
      storage.getTechnicians(),
    ]);
    const vMap = new Map(vehicles.map(v => [v.id, v]));
    const cMap = new Map(customers.map(c => [c.id, c]));
    const tMap = new Map(technicians.map(t => [t.id, t]));

    const columns: Record<string, any[]> = {
      pending: [], diagnosis: [], in_progress: [], completed: [], delivered: [],
    };
    workOrders.forEach(wo => {
      const v = vMap.get(wo.vehicleId);
      const c = cMap.get(wo.customerId);
      const t = tMap.get(wo.technicianId);
      columns[wo.status]?.push({
        ...wo,
        vehicle: v ? `${v.make} ${v.model} (${v.licensePlate})` : "N/A",
        customerName: c?.name || "N/A",
        technicianName: t?.name || "N/A",
        technicianAvatar: t?.avatar || "??",
      });
    });
    res.json(columns);
  });

  // ─── Technicians ──────────────────────────
  app.get("/api/technicians", async (_req, res) => {
    res.json(await storage.getTechnicians());
  });
  app.post("/api/technicians", async (req, res) => {
    const tech = await storage.createTechnician(req.body);
    res.status(201).json(tech);
  });

  // ─── Customers ────────────────────────────
  app.get("/api/customers", async (_req, res) => {
    res.json(await storage.getCustomers());
  });
  app.post("/api/customers", async (req, res) => {
    const c = await storage.createCustomer(req.body);
    res.status(201).json(c);
  });

  // ─── Vehicles ─────────────────────────────
  app.get("/api/vehicles", async (_req, res) => {
    const [vehicles, customers] = await Promise.all([
      storage.getVehicles(),
      storage.getCustomers(),
    ]);
    const cMap = new Map(customers.map(c => [c.id, c]));
    const enriched = vehicles.map(v => ({
      ...v,
      customerName: cMap.get(v.customerId)?.name || "N/A",
    }));
    res.json(enriched);
  });
  app.post("/api/vehicles", async (req, res) => {
    const v = await storage.createVehicle(req.body);
    res.status(201).json(v);
  });

  // ─── Work Orders ──────────────────────────
  app.get("/api/work-orders", async (_req, res) => {
    const [workOrders, vehicles, customers, technicians] = await Promise.all([
      storage.getWorkOrders(),
      storage.getVehicles(),
      storage.getCustomers(),
      storage.getTechnicians(),
    ]);
    const vMap = new Map(vehicles.map(v => [v.id, v]));
    const cMap = new Map(customers.map(c => [c.id, c]));
    const tMap = new Map(technicians.map(t => [t.id, t]));
    const enriched = workOrders.map(wo => ({
      ...wo,
      vehicle: vMap.get(wo.vehicleId),
      customer: cMap.get(wo.customerId),
      technician: tMap.get(wo.technicianId),
    }));
    res.json(enriched);
  });
  app.post("/api/work-orders", async (req, res) => {
    const wo = await storage.createWorkOrder(req.body);
    res.status(201).json(wo);
  });
  app.patch("/api/work-orders/:id", async (req, res) => {
    const updated = await storage.updateWorkOrder(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  // ─── Estimates ────────────────────────────
  app.get("/api/estimates", async (_req, res) => {
    const [estimates, customers, vehicles] = await Promise.all([
      storage.getEstimates(),
      storage.getCustomers(),
      storage.getVehicles(),
    ]);
    const cMap = new Map(customers.map(c => [c.id, c]));
    const vMap = new Map(vehicles.map(v => [v.id, v]));
    const enriched = estimates.map(e => ({
      ...e,
      customerName: cMap.get(e.customerId)?.name || "N/A",
      vehicleInfo: (() => { const v = vMap.get(e.vehicleId); return v ? `${v.make} ${v.model}` : "N/A"; })(),
    }));
    res.json(enriched);
  });
  app.post("/api/estimates", async (req, res) => {
    const e = await storage.createEstimate(req.body);
    res.status(201).json(e);
  });
  app.patch("/api/estimates/:id", async (req, res) => {
    const updated = await storage.updateEstimate(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  // ─── Invoices ─────────────────────────────
  app.get("/api/invoices", async (_req, res) => {
    const [invoices, customers, workOrders] = await Promise.all([
      storage.getInvoices(),
      storage.getCustomers(),
      storage.getWorkOrders(),
    ]);
    const cMap = new Map(customers.map(c => [c.id, c]));
    const woMap = new Map(workOrders.map(wo => [wo.id, wo]));
    const enriched = invoices.map(i => ({
      ...i,
      customerName: cMap.get(i.customerId)?.name || "N/A",
      workOrderServices: woMap.get(i.workOrderId)?.services || [],
    }));
    res.json(enriched);
  });
  app.post("/api/invoices", async (req, res) => {
    const i = await storage.createInvoice(req.body);
    res.status(201).json(i);
  });
  app.patch("/api/invoices/:id", async (req, res) => {
    const updated = await storage.updateInvoice(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  // ─── Inspections ──────────────────────────
  app.get("/api/inspections", async (_req, res) => {
    const [inspections, vehicles, technicians] = await Promise.all([
      storage.getInspections(),
      storage.getVehicles(),
      storage.getTechnicians(),
    ]);
    const vMap = new Map(vehicles.map(v => [v.id, v]));
    const tMap = new Map(technicians.map(t => [t.id, t]));
    const enriched = inspections.map(i => ({
      ...i,
      vehicleInfo: (() => { const v = vMap.get(i.vehicleId); return v ? `${v.make} ${v.model} (${v.licensePlate})` : "N/A"; })(),
      technicianName: tMap.get(i.technicianId)?.name || "N/A",
    }));
    res.json(enriched);
  });
  app.post("/api/inspections", async (req, res) => {
    const i = await storage.createInspection(req.body);
    res.status(201).json(i);
  });

  // ─── Inventory ────────────────────────────
  app.get("/api/inventory", async (_req, res) => {
    res.json(await storage.getInventory());
  });
  app.post("/api/inventory", async (req, res) => {
    const item = await storage.createInventoryItem(req.body);
    res.status(201).json(item);
  });
  app.patch("/api/inventory/:id", async (req, res) => {
    const updated = await storage.updateInventoryItem(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  // ─── Messages ─────────────────────────────
  app.get("/api/messages", async (_req, res) => {
    const [messages, customers] = await Promise.all([
      storage.getMessages(),
      storage.getCustomers(),
    ]);
    const cMap = new Map(customers.map(c => [c.id, c]));
    const enriched = messages.map(m => ({
      ...m,
      customerName: cMap.get(m.customerId)?.name || "N/A",
    }));
    res.json(enriched);
  });
  app.post("/api/messages", async (req, res) => {
    const m = await storage.createMessage(req.body);
    res.status(201).json(m);
  });

  // ─── Campaigns ────────────────────────────
  app.get("/api/campaigns", async (_req, res) => {
    res.json(await storage.getCampaigns());
  });
  app.post("/api/campaigns", async (req, res) => {
    const c = await storage.createCampaign(req.body);
    res.status(201).json(c);
  });

  // ─── Appointments ─────────────────────────
  app.get("/api/appointments", async (_req, res) => {
    const [appointments, customers, vehicles, technicians] = await Promise.all([
      storage.getAppointments(),
      storage.getCustomers(),
      storage.getVehicles(),
      storage.getTechnicians(),
    ]);
    const cMap = new Map(customers.map(c => [c.id, c]));
    const vMap = new Map(vehicles.map(v => [v.id, v]));
    const tMap = new Map(technicians.map(t => [t.id, t]));
    const enriched = appointments.map(a => ({
      ...a,
      customerName: cMap.get(a.customerId)?.name || "N/A",
      vehicleInfo: (() => { const v = vMap.get(a.vehicleId); return v ? `${v.make} ${v.model}` : "N/A"; })(),
      technicianName: tMap.get(a.technicianId)?.name || "N/A",
    }));
    res.json(enriched);
  });
  app.post("/api/appointments", async (req, res) => {
    const a = await storage.createAppointment(req.body);
    res.status(201).json(a);
  });

  return httpServer;
}
