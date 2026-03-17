import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const shopId = await getShopId();
    const now = new Date();
    
    // Today boundary
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Week boundary (last 7 days)
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);

    // Last 4 weeks boundaries for trends
    const weekBoundaries = Array.from({ length: 4 }).map((_, i) => {
      const end = new Date(now);
      end.setDate(end.getDate() - (i * 7));
      const start = new Date(now);
      start.setDate(start.getDate() - ((i + 1) * 7));
      return { start, end, label: `Sem ${4 - i}` };
    }).reverse();

    const [
      todayOrders,
      last7DaysInvoices,
      activeTechs,
      pendingOrders,
      weeklyRevenues,
      statusCounts,
      recentOrders,
    ] = await Promise.all([
      // ROs today
      prisma.workOrder.count({
        where: { shopId, createdAt: { gte: today } }
      }),
      // Revenue last 7 days (paid invoices)
      prisma.invoice.findMany({
        where: { 
          shopId, 
          status: "paid",
          updatedAt: { gte: last7Days }
        },
        select: { totalAmount: true }
      }),
      // Active techs
      prisma.technician.count({
        where: { shopId, status: "active" }
      }),
      // Pending work orders (appointments/upcoming)
      prisma.workOrder.count({
        where: { shopId, status: "pending" }
      }),
      // Weekly revenue trends
      Promise.all(weekBoundaries.map(async (wb) => {
        const invoices = await prisma.invoice.findMany({
          where: {
            shopId,
            status: "paid",
            updatedAt: { gte: wb.start, lte: wb.end }
          },
          select: { totalAmount: true }
        });
        return {
          week: wb.label,
          revenue: invoices.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0)
        };
      })),
      // Status grouping
      prisma.workOrder.groupBy({
        by: ['status'],
        where: { shopId },
        _count: { id: true }
      }),
      // Recent orders
      prisma.workOrder.findMany({
        where: { shopId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: true,
          customer: true
        }
      })
    ]);

    const weekRevenueTotal = last7DaysInvoices.reduce((s: number, i: any) => s + i.totalAmount, 0);

    const formattedStatusCounts = {
      pending: statusCounts.find(s => s.status === "pending")?._count.id || 0,
      diagnosis: statusCounts.find(s => s.status === "diagnosis")?._count.id || 0,
      in_progress: statusCounts.find(s => s.status === "in_progress")?._count.id || 0,
      completed: statusCounts.find(s => s.status === "completed")?._count.id || 0,
      delivered: statusCounts.find(s => s.status === "delivered")?._count.id || 0,
    };

    const lowStockItems = await prisma.inventoryItem.findMany({
      where: { shopId },
    });
    
    const inventoryAlerts = lowStockItems
      .filter((item: any) => item.quantity <= item.minQuantity)
      .map((item: any) => ({
        type: "inventory",
        message: `${item.name} tiene poco stock (${item.quantity} uds.)`
      }));

    return NextResponse.json({
      kpis: {
        todayOrders,
        weekRevenue: weekRevenueTotal,
        activeTechs,
        pendingAppts: pendingOrders,
      },
      weeklyRevenue: weeklyRevenues,
      statusCounts: formattedStatusCounts,
      recentOrders,
      alerts: [
        ...inventoryAlerts,
        { type: "appointment", message: "2 citas sin confirmar para mañana" },
      ],
    });
  } catch (error) {
    console.error("Dashboard KPI Error:", error);
    if (error instanceof Error && error.message === "No shop ID found in session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
