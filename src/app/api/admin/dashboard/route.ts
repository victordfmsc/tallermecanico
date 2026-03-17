import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const GET = auth(async (req) => {
  if (!req.auth?.user?.isSuperAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1. KPI Statistics
    const totalShops = await prisma.shop.count();
    const activeShops = await prisma.shop.count({ where: { subscriptionStatus: "ACTIVE" } });
    const trialShops = await prisma.shop.count({ where: { subscriptionStatus: "FREE_TRIAL" } });
    const cancelledShops = await prisma.shop.count({ where: { subscriptionStatus: "CANCELLED" } });

    // 2. MRR Calculation (Simulated based on plans)
    const planPrices: Record<string, number> = {
      STARTER: 29,
      PROFESSIONAL: 59,
      ENTERPRISE: 99
    };
    
    const activeSubscriptions = await prisma.shop.findMany({
      where: { subscriptionStatus: "ACTIVE" },
      select: { subscriptionPlan: true }
    });

    const mrr = activeSubscriptions.reduce((acc, shop) => {
      return acc + (planPrices[shop.subscriptionPlan] || 0);
    }, 0);

    // 3. Shops Growth (Last 6 months)
    const growthData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const count = await prisma.shop.count({
        where: {
          createdAt: { gte: start, lte: end }
        }
      });
      
      growthData.push({
        month: format(monthDate, "MMM"),
        newShops: count
      });
    }

    // 4. Detailed Shops List
    const shops = await prisma.shop.findMany({
      include: {
        _count: {
          select: { technicians: true, workOrders: true }
        },
        users: {
          where: { role: "OWNER" },
          select: { email: true },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const shopList = shops.map(s => ({
      id: s.id,
      name: s.name,
      ownerEmail: s.users[0]?.email || "N/A",
      plan: s.subscriptionPlan,
      status: s.subscriptionStatus,
      createdAt: s.createdAt,
      techCount: s._count.technicians,
      woCount: s._count.workOrders,
    }));

    // 5. Simulated Failed Payments (In a real app, this would come from a Payment/Stripe table)
    const alerts = [
      { shopName: "Taller Automotivo", type: "PAYMENT_FAILED", date: new Date() }
    ];

    return NextResponse.json({
      stats: { totalShops, activeShops, trialShops, cancelledShops, mrr },
      growthData,
      shopList,
      alerts
    });
  } catch (error) {
    console.error("ADMIN_DASHBOARD_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
});

export const PATCH = auth(async (req) => {
  if (!req.auth?.user?.isSuperAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { shopId, action, payload } = await req.json();

  try {
    switch (action) {
      case "EXTEND_TRIAL":
        await prisma.shop.update({
          where: { id: shopId },
          data: { trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
        });
        break;
      case "CANCEL_SUBSCRIPTION":
        await prisma.shop.update({
          where: { id: shopId },
          data: { subscriptionStatus: "CANCELLED" }
        });
        break;
      default:
        return new NextResponse("Invalid action", { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
});
