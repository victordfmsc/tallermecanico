import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shopId = await getShopId();
    const { status } = await req.json();

    if (status !== "received") {
      return NextResponse.json({ error: "Only 'received' status is supported for updates currently" }, { status: 400 });
    }

    // Use a transaction to ensure both PO update and stock increment happen together
    const updatedPo = await prisma.$transaction(async (tx: any) => {
      const po = await tx.purchaseOrder.findUnique({
        where: { id: params.id, shopId },
      });

      if (!po) throw new Error("Purchase order not found");
      if (po.status === "received") throw new Error("Purchase order already received");

      // Update PO status
      const updated = await tx.purchaseOrder.update({
        where: { id: params.id },
        data: { status: "received", updatedAt: new Date() },
      });

      // Increment inventory item quantity
      await tx.inventoryItem.update({
        where: { id: po.itemId },
        data: {
          quantity: { increment: po.quantity },
        },
      });

      return updated;
    });

    return NextResponse.json(updatedPo);
  } catch (error: any) {
    console.error("PATCH purchase order error:", error);
    return NextResponse.json({ error: error.message || "Failed to update purchase order" }, { status: 500 });
  }
}
