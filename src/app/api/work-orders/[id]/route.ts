import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = await getShopId();
    const id = params.id;
    const body = await req.json();
    
    // Check if work order exists for this shop
    const existing = await prisma.workOrder.findUnique({
      where: { id, shopId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 });
    }

    const updated = await prisma.workOrder.update({
      where: { id, shopId },
      data: body,
      include: {
        customer: true,
        vehicle: true,
        technician: true,
      }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH work-order error:", error);
    return NextResponse.json({ error: "Failed to update work order" }, { status: 500 });
  }
}
