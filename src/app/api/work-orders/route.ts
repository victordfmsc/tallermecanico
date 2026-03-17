import { getAuthContext, getShopId } from "@/lib/auth-helpers";
import { logAccess } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";
import { trackEvent } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { insertWorkOrderSchema } from "@/types/schema";

export async function GET(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = { shopId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { vehicle: { brand: { contains: search, mode: "insensitive" } } },
        { vehicle: { model: { contains: search, mode: "insensitive" } } },
        { vehicle: { licensePlate: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.workOrder.count({ where }),
      prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          vehicle: true,
          technician: true,
        },
      }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("GET work-orders error:", error);
    return NextResponse.json({ error: "Failed to fetch work orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    const body = await req.json();
    
    // Validate with Zod
    const result = insertWorkOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const data = result.data;

    // Fetch customerId from vehicle if not explicitly provided
    let customerId = (data as any).customerId;
    if (!customerId && data.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId, shopId },
      });
      if (vehicle) {
        customerId = vehicle.customerId;
      }
    }

    if (!customerId) {
      return NextResponse.json({ error: "Customer not found for this vehicle" }, { status: 400 });
    }

    // Calculate total from services
    const services = (data.services as any[]) || [];
    const totalAmount = services.reduce((sum, s) => sum + (s.price || 0), 0);

    const wo = await prisma.workOrder.create({
      data: {
        ...data,
        shopId,
        customerId,
        totalAmount,
      },
      include: {
        customer: true,
        vehicle: true,
        technician: true,
      }
    });

    trackEvent('orden_trabajo_creada', { 
      woId: wo.id, 
      shopId,
      customerId: wo.customerId,
      totalAmount: wo.totalAmount
    });

    await logAccess(userId, shopId, "CREATE_WORK_ORDER", { woId: wo.id, customerId });

    return NextResponse.json(wo, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    console.error("POST work-orders error:", error);
    return NextResponse.json({ error: "Failed to create work order" }, { status: 500 });
  }
}
