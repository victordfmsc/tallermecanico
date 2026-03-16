import type {
  Technician, InsertTechnician,
  Customer, InsertCustomer,
  Vehicle, InsertVehicle,
  WorkOrder, InsertWorkOrder,
  Estimate, InsertEstimate,
  Invoice, InsertInvoice,
  Inspection, InsertInspection,
  InventoryItem, InsertInventoryItem,
  Message, InsertMessage,
  MarketingCampaign, InsertCampaign,
  Appointment, InsertAppointment,
} from "@shared/schema";

export interface IStorage {
  // Technicians
  getTechnicians(): Promise<Technician[]>;
  createTechnician(t: InsertTechnician): Promise<Technician>;
  // Customers
  getCustomers(): Promise<Customer[]>;
  createCustomer(c: InsertCustomer): Promise<Customer>;
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  createVehicle(v: InsertVehicle): Promise<Vehicle>;
  // Work Orders
  getWorkOrders(): Promise<WorkOrder[]>;
  createWorkOrder(wo: InsertWorkOrder): Promise<WorkOrder>;
  updateWorkOrder(id: number, data: Partial<WorkOrder>): Promise<WorkOrder | undefined>;
  // Estimates
  getEstimates(): Promise<Estimate[]>;
  createEstimate(e: InsertEstimate): Promise<Estimate>;
  updateEstimate(id: number, data: Partial<Estimate>): Promise<Estimate | undefined>;
  // Invoices
  getInvoices(): Promise<Invoice[]>;
  createInvoice(i: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, data: Partial<Invoice>): Promise<Invoice | undefined>;
  // Inspections
  getInspections(): Promise<Inspection[]>;
  createInspection(i: InsertInspection): Promise<Inspection>;
  // Inventory
  getInventory(): Promise<InventoryItem[]>;
  createInventoryItem(i: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, data: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  // Messages
  getMessages(): Promise<Message[]>;
  createMessage(m: InsertMessage): Promise<Message>;
  // Campaigns
  getCampaigns(): Promise<MarketingCampaign[]>;
  createCampaign(c: InsertCampaign): Promise<MarketingCampaign>;
  // Appointments
  getAppointments(): Promise<Appointment[]>;
  createAppointment(a: InsertAppointment): Promise<Appointment>;
}

export class MemStorage implements IStorage {
  private technicians: Map<number, Technician> = new Map();
  private customers: Map<number, Customer> = new Map();
  private vehicles: Map<number, Vehicle> = new Map();
  private workOrders: Map<number, WorkOrder> = new Map();
  private estimates: Map<number, Estimate> = new Map();
  private invoices: Map<number, Invoice> = new Map();
  private inspections: Map<number, Inspection> = new Map();
  private inventory: Map<number, InventoryItem> = new Map();
  private messages: Map<number, Message> = new Map();
  private campaigns: Map<number, MarketingCampaign> = new Map();
  private appointments: Map<number, Appointment> = new Map();
  private nextId = 1;

  constructor() {
    this.seed();
  }

  private id() { return this.nextId++; }

  private seed() {
    // ─── Technicians ──────────────────────────
    const techs: Omit<Technician, "id">[] = [
      { name: "Carlos Ruiz", specialty: "Motor y Transmisión", avatar: "CR", efficiency: 94, status: "active", activeJobs: 3, hoursToday: 6.5 },
      { name: "Miguel Torres", specialty: "Electricidad y Diagnóstico", avatar: "MT", efficiency: 88, status: "active", activeJobs: 2, hoursToday: 5.0 },
      { name: "Ana García", specialty: "Frenos y Suspensión", avatar: "AG", efficiency: 91, status: "active", activeJobs: 2, hoursToday: 7.0 },
      { name: "Pedro Sánchez", specialty: "Chapa y Pintura", avatar: "PS", efficiency: 85, status: "break", activeJobs: 1, hoursToday: 4.5 },
      { name: "Luis Martínez", specialty: "Neumáticos y Alineación", avatar: "LM", efficiency: 92, status: "active", activeJobs: 2, hoursToday: 6.0 },
      { name: "Elena López", specialty: "Climatización y AC", avatar: "EL", efficiency: 89, status: "active", activeJobs: 1, hoursToday: 3.5 },
    ];
    techs.forEach(t => { const id = this.id(); this.technicians.set(id, { id, ...t }); });

    // ─── Customers ────────────────────────────
    const custs: Omit<Customer, "id">[] = [
      { name: "María Fernández López", email: "maria.fernandez@email.es", phone: "+34 612 345 678", address: "C/ Gran Vía 45, Madrid", totalVisits: 12, totalSpent: 4850, createdAt: "2024-01-15" },
      { name: "Javier García Martín", email: "javier.garcia@email.es", phone: "+34 623 456 789", address: "Av. Diagonal 120, Barcelona", totalVisits: 8, totalSpent: 3200, createdAt: "2024-02-20" },
      { name: "Carmen Rodríguez Silva", email: "carmen.rodriguez@email.es", phone: "+34 634 567 890", address: "C/ Sierpes 22, Sevilla", totalVisits: 15, totalSpent: 6100, createdAt: "2023-11-10" },
      { name: "Antonio López Ruiz", email: "antonio.lopez@email.es", phone: "+34 645 678 901", address: "C/ Colón 8, Valencia", totalVisits: 6, totalSpent: 2100, createdAt: "2024-03-05" },
      { name: "Isabel Martínez Vega", email: "isabel.martinez@email.es", phone: "+34 656 789 012", address: "Av. de la Constitución 15, Granada", totalVisits: 10, totalSpent: 3950, createdAt: "2024-01-22" },
      { name: "Francisco Hernández Díaz", email: "francisco.hernandez@email.es", phone: "+34 667 890 123", address: "C/ Larios 30, Málaga", totalVisits: 4, totalSpent: 1450, createdAt: "2024-05-12" },
      { name: "Laura Sánchez Torres", email: "laura.sanchez@email.es", phone: "+34 678 901 234", address: "Paseo de Gracia 55, Barcelona", totalVisits: 9, totalSpent: 3600, createdAt: "2024-02-08" },
      { name: "David Moreno Castro", email: "david.moreno@email.es", phone: "+34 689 012 345", address: "C/ Mayor 12, Zaragoza", totalVisits: 7, totalSpent: 2800, createdAt: "2024-04-15" },
      { name: "Patricia Gil Navarro", email: "patricia.gil@email.es", phone: "+34 690 123 456", address: "C/ San Fernando 40, Bilbao", totalVisits: 11, totalSpent: 4200, createdAt: "2023-12-20" },
      { name: "Roberto Jiménez Blanco", email: "roberto.jimenez@email.es", phone: "+34 601 234 567", address: "Av. Libertad 78, Valladolid", totalVisits: 5, totalSpent: 1900, createdAt: "2024-06-01" },
      { name: "Sofía Ruiz Pérez", email: "sofia.ruiz@email.es", phone: "+34 612 345 679", address: "C/ Real 23, Santander", totalVisits: 3, totalSpent: 950, createdAt: "2024-07-10" },
      { name: "Alejandro Torres Molina", email: "alejandro.torres@email.es", phone: "+34 623 456 780", address: "C/ Alcalá 156, Madrid", totalVisits: 14, totalSpent: 5400, createdAt: "2023-10-05" },
      { name: "Lucía Navarro Ortiz", email: "lucia.navarro@email.es", phone: "+34 634 567 891", address: "Av. del Puerto 32, Valencia", totalVisits: 8, totalSpent: 3100, createdAt: "2024-03-18" },
      { name: "Andrés Domínguez Vargas", email: "andres.dominguez@email.es", phone: "+34 645 678 902", address: "C/ Uria 47, Oviedo", totalVisits: 6, totalSpent: 2300, createdAt: "2024-04-22" },
      { name: "Elena Castro Fuentes", email: "elena.castro@email.es", phone: "+34 656 789 013", address: "Ronda de Valencia 11, Madrid", totalVisits: 9, totalSpent: 3700, createdAt: "2024-01-30" },
      { name: "Manuel Vega Romero", email: "manuel.vega@email.es", phone: "+34 667 890 124", address: "C/ Recogidas 60, Granada", totalVisits: 7, totalSpent: 2600, createdAt: "2024-05-08" },
      { name: "Rosa Ortiz Delgado", email: "rosa.ortiz@email.es", phone: "+34 678 901 235", address: "Av. de Andalucía 25, Córdoba", totalVisits: 4, totalSpent: 1350, createdAt: "2024-06-20" },
      { name: "Pablo Muñoz Herrera", email: "pablo.munoz@email.es", phone: "+34 689 012 346", address: "C/ San Bernardo 88, Madrid", totalVisits: 11, totalSpent: 4600, createdAt: "2023-09-15" },
    ];
    custs.forEach(c => { const id = this.id(); this.customers.set(id, { id, ...c }); });

    // ─── Vehicles ─────────────────────────────
    const vehs: Omit<Vehicle, "id">[] = [
      { customerId: 7, make: "Volkswagen", model: "Golf", year: 2021, vin: "WVWZZZ1KZAW123456", licensePlate: "1234 ABC", mileage: 45000, color: "Blanco" },
      { customerId: 8, make: "Seat", model: "León", year: 2020, vin: "VSSZZZ5FZLR123456", licensePlate: "5678 DEF", mileage: 62000, color: "Negro" },
      { customerId: 9, make: "BMW", model: "Serie 3", year: 2022, vin: "WBA8E9C50JA123456", licensePlate: "9012 GHI", mileage: 28000, color: "Gris" },
      { customerId: 10, make: "Ford", model: "Focus", year: 2019, vin: "WF0XXXGCDX9123456", licensePlate: "3456 JKL", mileage: 78000, color: "Azul" },
      { customerId: 11, make: "Renault", model: "Clio", year: 2023, vin: "VF1RJA00X67123456", licensePlate: "7890 MNO", mileage: 12000, color: "Rojo" },
      { customerId: 12, make: "Toyota", model: "Corolla", year: 2021, vin: "SB1K33BE10E123456", licensePlate: "2345 PQR", mileage: 35000, color: "Plata" },
      { customerId: 13, make: "Audi", model: "A4", year: 2020, vin: "WAUZZZF45LA123456", licensePlate: "6789 STU", mileage: 55000, color: "Negro" },
      { customerId: 14, make: "Mercedes", model: "Clase C", year: 2022, vin: "WDD2050041R123456", licensePlate: "0123 VWX", mileage: 22000, color: "Blanco" },
      { customerId: 15, make: "Peugeot", model: "308", year: 2021, vin: "VF3LCYHZPLS123456", licensePlate: "4567 YZA", mileage: 41000, color: "Gris" },
      { customerId: 16, make: "Volkswagen", model: "Tiguan", year: 2020, vin: "WVGZZZ5NZLW123456", licensePlate: "8901 BCD", mileage: 68000, color: "Azul" },
      { customerId: 17, make: "Seat", model: "Ibiza", year: 2022, vin: "VSSZZZ6JZNR123456", licensePlate: "2345 EFG", mileage: 19000, color: "Blanco" },
      { customerId: 18, make: "Ford", model: "Kuga", year: 2021, vin: "WF0DXXWPMDMA12345", licensePlate: "6789 HIJ", mileage: 38000, color: "Verde" },
      { customerId: 19, make: "Renault", model: "Mégane", year: 2020, vin: "VF1RFA00X62123456", licensePlate: "0123 KLM", mileage: 72000, color: "Gris" },
      { customerId: 20, make: "Toyota", model: "RAV4", year: 2023, vin: "JTMW43FV50D123456", licensePlate: "4567 NOP", mileage: 8000, color: "Negro" },
      { customerId: 21, make: "BMW", model: "X1", year: 2021, vin: "WBAHS310X0G123456", licensePlate: "8901 QRS", mileage: 42000, color: "Blanco" },
      { customerId: 22, make: "Audi", model: "Q5", year: 2022, vin: "WAUZZZ8R1DA123456", licensePlate: "2345 TUV", mileage: 31000, color: "Plata" },
      { customerId: 23, make: "Citroën", model: "C3", year: 2021, vin: "VF7SXHMZ6LW123456", licensePlate: "6789 WXY", mileage: 47000, color: "Naranja" },
      { customerId: 24, make: "Opel", model: "Corsa", year: 2020, vin: "W0L000000Y2123456", licensePlate: "0123 ZAB", mileage: 58000, color: "Rojo" },
      { customerId: 7, make: "Volkswagen", model: "Passat", year: 2019, vin: "WVWZZZ3CZWE123456", licensePlate: "4567 CDE", mileage: 92000, color: "Negro" },
      { customerId: 9, make: "Mercedes", model: "GLA", year: 2023, vin: "WDC1569431J123456", licensePlate: "8901 FGH", mileage: 15000, color: "Blanco" },
      { customerId: 12, make: "Hyundai", model: "Tucson", year: 2022, vin: "TMAJ3812ALJ123456", licensePlate: "2345 IJK", mileage: 26000, color: "Azul" },
      { customerId: 14, make: "Kia", model: "Sportage", year: 2023, vin: "U5YPH812ALL123456", licensePlate: "6789 LMN", mileage: 11000, color: "Gris" },
      { customerId: 16, make: "Nissan", model: "Qashqai", year: 2021, vin: "SJNFAAJ11U1123456", licensePlate: "0123 OPQ", mileage: 39000, color: "Rojo" },
      { customerId: 18, make: "Fiat", model: "500", year: 2022, vin: "ZFA3120000J123456", licensePlate: "4567 RST", mileage: 18000, color: "Blanco" },
      { customerId: 20, make: "Mazda", model: "CX-5", year: 2021, vin: "JM3KFBCL5M0123456", licensePlate: "8901 UVW", mileage: 44000, color: "Rojo" },
    ];
    vehs.forEach(v => { const id = this.id(); this.vehicles.set(id, { id, ...v }); });

    // ─── Work Orders ──────────────────────────
    const services = [
      ["Cambio de aceite y filtro"], ["Revisión de frenos"], ["Diagnóstico electrónico"],
      ["Cambio de pastillas de freno"], ["Alineación y equilibrado"], ["Cambio de correa de distribución"],
      ["Reparación de aire acondicionado"], ["Cambio de amortiguadores"], ["Revisión general ITV"],
      ["Cambio de batería"], ["Reparación de embrague"], ["Cambio de neumáticos"],
      ["Reparación de carrocería"], ["Cambio de bujías"], ["Revisión sistema eléctrico"],
    ];
    const statuses: WorkOrder["status"][] = ["pending", "diagnosis", "in_progress", "completed", "delivered"];
    const now = new Date("2026-03-16");
    for (let i = 0; i < 35; i++) {
      const id = this.id();
      const vehKeys = Array.from(this.vehicles.keys());
      const vehicleId = vehKeys[i % vehKeys.length];
      const veh = this.vehicles.get(vehicleId)!;
      const techKeys = Array.from(this.technicians.keys());
      const techId = techKeys[i % techKeys.length];
      const daysAgo = Math.floor(Math.random() * 30);
      const created = new Date(now);
      created.setDate(created.getDate() - daysAgo);
      const wo: WorkOrder = {
        id,
        vehicleId,
        customerId: veh.customerId,
        technicianId: techId,
        status: statuses[i % 5],
        services: services[i % services.length],
        totalAmount: Math.round((150 + Math.random() * 1200) * 100) / 100,
        notes: i % 3 === 0 ? "Cliente solicita presupuesto antes de proceder" : "",
        estimatedHours: Math.round((0.5 + Math.random() * 5) * 10) / 10,
        createdAt: created.toISOString().slice(0, 10),
        updatedAt: created.toISOString().slice(0, 10),
      };
      this.workOrders.set(id, wo);
    }

    // ─── Estimates ────────────────────────────
    const estStatuses: Estimate["status"][] = ["draft", "sent", "approved", "rejected"];
    for (let i = 0; i < 12; i++) {
      const id = this.id();
      const custKeys = Array.from(this.customers.keys());
      const custId = custKeys[i % custKeys.length];
      const vehKeys = Array.from(this.vehicles.keys());
      const vehId = vehKeys[i % vehKeys.length];
      const lines = [
        { description: "Mano de obra diagnóstico", type: "service" as const, quantity: 1, unitPrice: 60, approved: true },
        { description: services[i % services.length][0], type: "service" as const, quantity: 1, unitPrice: 80 + Math.round(Math.random() * 200), approved: i % 3 !== 2 },
        { description: "Pieza de repuesto", type: "part" as const, quantity: 1 + Math.floor(Math.random() * 3), unitPrice: 20 + Math.round(Math.random() * 150), approved: i % 4 !== 3 },
      ];
      const total = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
      const est: Estimate = {
        id,
        customerId: custId,
        vehicleId: vehId,
        status: estStatuses[i % 4],
        lines,
        totalAmount: total,
        sentAt: i % 4 >= 1 ? `2026-03-${String(5 + i).padStart(2, "0")}` : null,
        createdAt: `2026-03-${String(1 + i).padStart(2, "0")}`,
      };
      this.estimates.set(id, est);
    }

    // ─── Invoices ─────────────────────────────
    const invStatuses: Invoice["status"][] = ["pending", "paid", "overdue"];
    const woKeys = Array.from(this.workOrders.keys());
    for (let i = 0; i < 20; i++) {
      const id = this.id();
      const woId = woKeys[i % woKeys.length];
      const wo = this.workOrders.get(woId)!;
      const status = invStatuses[i % 3];
      const inv: Invoice = {
        id,
        workOrderId: woId,
        customerId: wo.customerId,
        status,
        totalAmount: wo.totalAmount,
        paidAt: status === "paid" ? `2026-03-${String(10 + (i % 6)).padStart(2, "0")}` : null,
        dueDate: `2026-03-${String(20 + (i % 10)).padStart(2, "0")}`,
        createdAt: `2026-03-${String(1 + (i % 15)).padStart(2, "0")}`,
      };
      this.invoices.set(id, inv);
    }

    // ─── Inspections ──────────────────────────
    const sectionNames = ["Frenos", "Motor", "Neumáticos", "Suspensión", "Eléctrico", "Carrocería"];
    const inspStatuses: ("good" | "warning" | "critical")[] = ["good", "warning", "critical"];
    for (let i = 0; i < 15; i++) {
      const id = this.id();
      const woId = woKeys[i % woKeys.length];
      const wo = this.workOrders.get(woId)!;
      const sections = sectionNames.map((name, j) => ({
        name,
        status: inspStatuses[(i + j) % 3],
        notes: (i + j) % 3 === 0 ? "En buen estado" : (i + j) % 3 === 1 ? "Desgaste moderado, revisar en próxima visita" : "Requiere reemplazo urgente",
        completed: j <= 3 + (i % 3),
      }));
      const completedCount = sections.filter(s => s.completed).length;
      const worstStatus = sections.some(s => s.status === "critical") ? "critical" : sections.some(s => s.status === "warning") ? "warning" : "good";
      const insp: Inspection = {
        id,
        workOrderId: woId,
        vehicleId: wo.vehicleId,
        technicianId: wo.technicianId,
        sections,
        overallStatus: worstStatus,
        progress: Math.round((completedCount / sections.length) * 100),
        completedAt: completedCount === sections.length ? `2026-03-${String(10 + i).padStart(2, "0")}` : null,
        createdAt: `2026-03-${String(1 + i).padStart(2, "0")}`,
      };
      this.inspections.set(id, insp);
    }

    // ─── Inventory ────────────────────────────
    const parts: Omit<InventoryItem, "id">[] = [
      { name: "Filtro de aceite Bosch", sku: "FLT-001", category: "Filtros", quantity: 45, minQuantity: 10, costPrice: 6.50, salePrice: 12.90, supplier: "AutoPartes Pro" },
      { name: "Pastillas de freno Brembo", sku: "FRN-001", category: "Frenos", quantity: 18, minQuantity: 5, costPrice: 28.00, salePrice: 52.50, supplier: "MasterParts" },
      { name: "Aceite motor 5W-30 (5L)", sku: "ACE-001", category: "Aceites", quantity: 32, minQuantity: 10, costPrice: 22.00, salePrice: 38.90, supplier: "QuickStock" },
      { name: "Bujía NGK Iridium", sku: "BUJ-001", category: "Encendido", quantity: 60, minQuantity: 20, costPrice: 8.50, salePrice: 15.90, supplier: "AutoPartes Pro" },
      { name: "Correa de distribución Gates", sku: "CRR-001", category: "Distribución", quantity: 8, minQuantity: 3, costPrice: 45.00, salePrice: 85.00, supplier: "MasterParts" },
      { name: "Amortiguador Monroe", sku: "AMR-001", category: "Suspensión", quantity: 12, minQuantity: 4, costPrice: 55.00, salePrice: 98.50, supplier: "QuickStock" },
      { name: "Batería Varta 60Ah", sku: "BAT-001", category: "Eléctrico", quantity: 6, minQuantity: 3, costPrice: 72.00, salePrice: 129.90, supplier: "AutoPartes Pro" },
      { name: "Filtro de aire Mann", sku: "FLT-002", category: "Filtros", quantity: 35, minQuantity: 10, costPrice: 9.00, salePrice: 18.50, supplier: "MasterParts" },
      { name: "Disco de freno ATE", sku: "FRN-002", category: "Frenos", quantity: 14, minQuantity: 4, costPrice: 32.00, salePrice: 58.90, supplier: "QuickStock" },
      { name: "Kit embrague LUK", sku: "EMB-001", category: "Transmisión", quantity: 3, minQuantity: 2, costPrice: 180.00, salePrice: 320.00, supplier: "AutoPartes Pro" },
      { name: "Neumático Michelin 205/55R16", sku: "NEU-001", category: "Neumáticos", quantity: 20, minQuantity: 8, costPrice: 62.00, salePrice: 95.00, supplier: "MasterParts" },
      { name: "Líquido de frenos DOT4", sku: "LIQ-001", category: "Líquidos", quantity: 28, minQuantity: 10, costPrice: 5.50, salePrice: 11.90, supplier: "QuickStock" },
      { name: "Refrigerante G12 (5L)", sku: "LIQ-002", category: "Líquidos", quantity: 15, minQuantity: 5, costPrice: 12.00, salePrice: 22.50, supplier: "AutoPartes Pro" },
      { name: "Alternador Bosch", sku: "ELC-001", category: "Eléctrico", quantity: 2, minQuantity: 2, costPrice: 145.00, salePrice: 265.00, supplier: "MasterParts" },
      { name: "Bomba de agua SKF", sku: "MOT-001", category: "Motor", quantity: 5, minQuantity: 2, costPrice: 38.00, salePrice: 72.00, supplier: "QuickStock" },
      { name: "Sensor lambda Denso", sku: "ELC-002", category: "Eléctrico", quantity: 7, minQuantity: 3, costPrice: 42.00, salePrice: 78.50, supplier: "AutoPartes Pro" },
      { name: "Junta de culata Elring", sku: "MOT-002", category: "Motor", quantity: 4, minQuantity: 2, costPrice: 35.00, salePrice: 65.00, supplier: "MasterParts" },
      { name: "Compresor AC Denso", sku: "CLI-001", category: "Climatización", quantity: 1, minQuantity: 1, costPrice: 220.00, salePrice: 395.00, supplier: "QuickStock" },
      { name: "Catalizador Walker", sku: "ESC-001", category: "Escape", quantity: 3, minQuantity: 1, costPrice: 190.00, salePrice: 350.00, supplier: "AutoPartes Pro" },
      { name: "Aceite transmisión ATF (1L)", sku: "ACE-002", category: "Aceites", quantity: 18, minQuantity: 5, costPrice: 14.00, salePrice: 25.90, supplier: "MasterParts" },
      { name: "Rótula dirección TRW", sku: "SUS-001", category: "Suspensión", quantity: 9, minQuantity: 3, costPrice: 22.00, salePrice: 42.00, supplier: "QuickStock" },
      { name: "Filtro habitáculo HENGST", sku: "FLT-003", category: "Filtros", quantity: 40, minQuantity: 15, costPrice: 7.00, salePrice: 14.50, supplier: "AutoPartes Pro" },
      { name: "Termostato Wahler", sku: "MOT-003", category: "Motor", quantity: 6, minQuantity: 3, costPrice: 18.00, salePrice: 34.00, supplier: "MasterParts" },
      { name: "Silentblock Lemförder", sku: "SUS-002", category: "Suspensión", quantity: 11, minQuantity: 4, costPrice: 15.00, salePrice: 28.90, supplier: "QuickStock" },
      { name: "Caja fusibles Hella", sku: "ELC-003", category: "Eléctrico", quantity: 8, minQuantity: 3, costPrice: 25.00, salePrice: 48.00, supplier: "AutoPartes Pro" },
    ];
    parts.forEach(p => { const id = this.id(); this.inventory.set(id, { id, ...p }); });

    // ─── Messages (Chat) ──────────────────────
    const chatCustomers = [7, 8, 9, 10, 11, 12];
    const conversations = [
      [
        { dir: "inbound" as const, content: "Hola, ¿puedo llevar el coche mañana para la revisión?" },
        { dir: "outbound" as const, content: "¡Buenos días! Sí, tenemos disponibilidad a las 10:00. ¿Le viene bien?" },
        { dir: "inbound" as const, content: "Perfecto, a las 10 estaré ahí. Gracias." },
        { dir: "outbound" as const, content: "Le esperamos. Recuerde traer la documentación del vehículo." },
      ],
      [
        { dir: "inbound" as const, content: "Me hace un ruido raro al frenar. ¿Podéis mirar?" },
        { dir: "outbound" as const, content: "Claro, puede ser desgaste de pastillas. ¿Puede venir esta semana?" },
        { dir: "inbound" as const, content: "¿El jueves por la tarde es posible?" },
        { dir: "outbound" as const, content: "Sí, le apuntamos para el jueves a las 16:00." },
        { dir: "inbound" as const, content: "Genial, ahí estaré." },
      ],
      [
        { dir: "inbound" as const, content: "¿Cuánto cuesta un cambio de aceite para un BMW Serie 3?" },
        { dir: "outbound" as const, content: "Con aceite sintético y filtro incluido serían 89,90€. ¿Le preparamos una cita?" },
        { dir: "inbound" as const, content: "Sí, por favor. ¿Tenéis hueco el lunes?" },
        { dir: "outbound" as const, content: "Lunes a las 9:00 le va bien? Tardamos aprox. 45 min." },
        { dir: "inbound" as const, content: "Perfecto, confirmado." },
      ],
      [
        { dir: "inbound" as const, content: "He recibido el presupuesto. ¿No se puede ajustar un poco el precio?" },
        { dir: "outbound" as const, content: "Déjeme revisarlo con el jefe de taller. Le respondo en breve." },
        { dir: "outbound" as const, content: "Hemos podido aplicar un 10% de descuento. El total quedaría en 342€." },
        { dir: "inbound" as const, content: "De acuerdo, aprobado. Proceded con la reparación." },
      ],
      [
        { dir: "inbound" as const, content: "¿Ya está listo mi coche? Lo dejé esta mañana." },
        { dir: "outbound" as const, content: "Está en fase final. Le avisamos en 30 minutos cuando esté listo." },
        { dir: "outbound" as const, content: "¡Listo! Puede pasar a recogerlo cuando quiera. Total: 156,80€" },
        { dir: "inbound" as const, content: "Voy para allá. Gracias por la rapidez." },
      ],
    ];
    let msgIdx = 0;
    conversations.forEach((conv, ci) => {
      const custId = chatCustomers[ci % chatCustomers.length];
      conv.forEach((msg, mi) => {
        const id = this.id();
        const created = new Date(now);
        created.setHours(9 + mi, mi * 15, 0);
        created.setDate(created.getDate() - (conversations.length - ci));
        this.messages.set(id, {
          id,
          customerId: custId,
          direction: msg.dir,
          content: msg.content,
          readAt: msg.dir === "outbound" ? created.toISOString() : (mi < conv.length - 1 ? created.toISOString() : null),
          createdAt: created.toISOString(),
        });
        msgIdx++;
      });
    });

    // ─── Campaigns ────────────────────────────
    const camps: Omit<MarketingCampaign, "id">[] = [
      { name: "Revisión de primavera 20% dto", type: "sms", status: "completed", sent: 450, opened: 312, clicked: 89, createdAt: "2026-02-15" },
      { name: "Recordatorio cambio de aceite", type: "email", status: "active", sent: 230, opened: 178, clicked: 52, createdAt: "2026-03-01" },
      { name: "Solicitud reseña Google", type: "review", status: "active", sent: 180, opened: 95, clicked: 42, createdAt: "2026-03-05" },
      { name: "Recordatorio ITV vencida", type: "reminder", status: "active", sent: 85, opened: 72, clicked: 38, createdAt: "2026-03-10" },
      { name: "Oferta neumáticos invierno", type: "sms", status: "completed", sent: 380, opened: 256, clicked: 78, createdAt: "2025-11-10" },
      { name: "Newsletter mensual marzo", type: "email", status: "draft", sent: 0, opened: 0, clicked: 0, createdAt: "2026-03-12" },
      { name: "Campaña fidelización VIP", type: "email", status: "active", sent: 120, opened: 98, clicked: 45, createdAt: "2026-02-28" },
      { name: "Recordatorio revisión 6 meses", type: "reminder", status: "paused", sent: 65, opened: 48, clicked: 22, createdAt: "2026-01-20" },
    ];
    camps.forEach(c => { const id = this.id(); this.campaigns.set(id, { id, ...c }); });

    // ─── Appointments ─────────────────────────
    const apptServices = ["Cambio de aceite", "Revisión frenos", "Diagnóstico", "ITV", "Neumáticos", "Embrague", "AC", "Revisión general"];
    const weekDays = ["2026-03-16", "2026-03-17", "2026-03-18", "2026-03-19", "2026-03-20"];
    const times = [
      ["08:00", "09:30"], ["09:30", "11:00"], ["11:00", "12:30"], ["12:30", "14:00"],
      ["15:00", "16:30"], ["16:30", "18:00"],
    ];
    for (let i = 0; i < 15; i++) {
      const id = this.id();
      const custKeys = Array.from(this.customers.keys());
      const vehKeys = Array.from(this.vehicles.keys());
      const techKeys = Array.from(this.technicians.keys());
      const day = weekDays[i % weekDays.length];
      const time = times[i % times.length];
      this.appointments.set(id, {
        id,
        customerId: custKeys[i % custKeys.length],
        vehicleId: vehKeys[i % vehKeys.length],
        technicianId: techKeys[i % techKeys.length],
        serviceType: apptServices[i % apptServices.length],
        date: day,
        startTime: time[0],
        endTime: time[1],
        notes: i % 4 === 0 ? "Cliente requiere coche de cortesía" : "",
      });
    }
  }

  // ─── Technicians ────────────────────────────
  async getTechnicians() { return Array.from(this.technicians.values()); }
  async createTechnician(t: InsertTechnician) { const id = this.id(); const tech: Technician = { id, hoursToday: 0, ...t }; this.technicians.set(id, tech); return tech; }

  // ─── Customers ──────────────────────────────
  async getCustomers() { return Array.from(this.customers.values()); }
  async createCustomer(c: InsertCustomer) { const id = this.id(); const cust: Customer = { id, createdAt: new Date().toISOString().slice(0, 10), ...c }; this.customers.set(id, cust); return cust; }

  // ─── Vehicles ───────────────────────────────
  async getVehicles() { return Array.from(this.vehicles.values()); }
  async createVehicle(v: InsertVehicle) { const id = this.id(); const veh: Vehicle = { id, ...v }; this.vehicles.set(id, veh); return veh; }

  // ─── Work Orders ────────────────────────────
  async getWorkOrders() { return Array.from(this.workOrders.values()); }
  async createWorkOrder(wo: InsertWorkOrder) {
    const id = this.id();
    const now = new Date().toISOString().slice(0, 10);
    const order: WorkOrder = { id, createdAt: now, updatedAt: now, ...wo };
    this.workOrders.set(id, order);
    return order;
  }
  async updateWorkOrder(id: number, data: Partial<WorkOrder>) {
    const existing = this.workOrders.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString().slice(0, 10) };
    this.workOrders.set(id, updated);
    return updated;
  }

  // ─── Estimates ──────────────────────────────
  async getEstimates() { return Array.from(this.estimates.values()); }
  async createEstimate(e: InsertEstimate) { const id = this.id(); const est: Estimate = { id, sentAt: null, createdAt: new Date().toISOString().slice(0, 10), ...e }; this.estimates.set(id, est); return est; }
  async updateEstimate(id: number, data: Partial<Estimate>) {
    const existing = this.estimates.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.estimates.set(id, updated);
    return updated;
  }

  // ─── Invoices ───────────────────────────────
  async getInvoices() { return Array.from(this.invoices.values()); }
  async createInvoice(i: InsertInvoice) { const id = this.id(); const inv: Invoice = { id, paidAt: null, createdAt: new Date().toISOString().slice(0, 10), ...i }; this.invoices.set(id, inv); return inv; }
  async updateInvoice(id: number, data: Partial<Invoice>) {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.invoices.set(id, updated);
    return updated;
  }

  // ─── Inspections ────────────────────────────
  async getInspections() { return Array.from(this.inspections.values()); }
  async createInspection(i: InsertInspection) { const id = this.id(); const insp: Inspection = { id, completedAt: null, createdAt: new Date().toISOString().slice(0, 10), ...i }; this.inspections.set(id, insp); return insp; }

  // ─── Inventory ──────────────────────────────
  async getInventory() { return Array.from(this.inventory.values()); }
  async createInventoryItem(i: InsertInventoryItem) { const id = this.id(); const item: InventoryItem = { id, ...i }; this.inventory.set(id, item); return item; }
  async updateInventoryItem(id: number, data: Partial<InventoryItem>) {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.inventory.set(id, updated);
    return updated;
  }

  // ─── Messages ───────────────────────────────
  async getMessages() { return Array.from(this.messages.values()); }
  async createMessage(m: InsertMessage) {
    const id = this.id();
    const msg: Message = { id, readAt: null, createdAt: new Date().toISOString(), ...m };
    this.messages.set(id, msg);
    return msg;
  }

  // ─── Campaigns ──────────────────────────────
  async getCampaigns() { return Array.from(this.campaigns.values()); }
  async createCampaign(c: InsertCampaign) { const id = this.id(); const camp: MarketingCampaign = { id, createdAt: new Date().toISOString().slice(0, 10), ...c }; this.campaigns.set(id, camp); return camp; }

  // ─── Appointments ───────────────────────────
  async getAppointments() { return Array.from(this.appointments.values()); }
  async createAppointment(a: InsertAppointment) { const id = this.id(); const appt: Appointment = { id, ...a }; this.appointments.set(id, appt); return appt; }
}

export const storage = new MemStorage();
