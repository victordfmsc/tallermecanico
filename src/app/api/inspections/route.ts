import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, getShopId } from "@/lib/auth-helpers";
import { logAccess } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    const { searchParams } = new URL(req.url);
    const workOrderId = searchParams.get("workOrderId");

    const where: any = { shopId };
    if (workOrderId) where.workOrderId = workOrderId;

    const inspections = await prisma.inspection.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    await logAccess(userId, shopId, "READ_INSPECTIONS", { workOrderId: workOrderId || "all" });

    return NextResponse.json(inspections);
  } catch (error) {
    console.error("GET inspections error:", error);
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    const body = await req.json();

    if (!body.workOrderId || !body.vehicleId) {
      return NextResponse.json({ error: "workOrderId and vehicleId are required" }, { status: 400 });
    }

    const defaultSections = [
      { name: "Frenos", status: null, notes: "", photos: [] },
      { name: "Motor", status: null, notes: "", photos: [] },
      { name: "Neumáticos", status: null, notes: "", photos: [] },
      { name: "Suspensión", status: null, notes: "", photos: [] },
      { name: "Eléctrico", status: null, notes: "", photos: [] },
      { name: "Carrocería", status: null, notes: "", photos: [] },
    ];

    const inspection = await prisma.inspection.create({
      data: {
        shopId,
        workOrderId: body.workOrderId,
        vehicleId: body.vehicleId,
        sections: defaultSections,
        progress: 0,
        overallStatus: "good",
      },
    });

    return NextResponse.json(inspection, { status: 201 });
  } catch (error) {
    console.error("POST inspections error:", error);
    return NextResponse.json({ error: "Failed to create inspection" }, { status: 500 });
  }
}
