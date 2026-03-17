import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { insertVehicleSchema } from "@/types/schema";
import { getAuthContext, getShopId } from "@/lib/auth-helpers";
import { logAccess } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const { searchParams } = new URL(req.url);
    
    const customerId = searchParams.get("customerId");
    const search = searchParams.get("search");

    const where: any = { shopId };
    if (customerId) where.customerId = customerId;
    if (search) {
      where.OR = [
        { licensePlate: { contains: search, mode: "insensitive" } },
        { vin: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("GET vehicles error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    const body = await req.json();
    const result = insertVehicleSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: { ...result.data, shopId }
    });

    await logAccess(userId, shopId, "CREATE_VEHICLE", { vehicleId: vehicle.id });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("POST vehicles error:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
