import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";
import { insertPurchaseOrderSchema } from "@/types/schema";

export async function GET(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: { shopId },
      include: { item: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(purchaseOrders);
  } catch (error) {
    console.error("GET purchase orders error:", error);
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const body = await req.json();
    
    const result = insertPurchaseOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const po = await prisma.purchaseOrder.create({
      data: {
        ...result.data,
        shopId,
      },
    });

    return NextResponse.json(po, { status: 201 });
  } catch (error) {
    console.error("POST purchase order error:", error);
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 });
  }
}
