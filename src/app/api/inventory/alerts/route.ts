import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const shopId = await getShopId();
    
    const lowStockItems = await prisma.inventoryItem.findMany({
      where: {
        shopId,
        quantity: {
          lte: prisma.inventoryItem.fields.minQuantity as any // Prisma doesn't directly support field comparison in where easily without raw or specific patterns
        }
      }
    });
    
    // Fallback: If Prisma fields comparison is tricky in this version, use a different approach or manual filter if list is small, 
    // but better to use a proper query if possible.
    // Actually, Prisma doesn't support field vs field comparison in `where` directly in all versions.
    // Let's use a simpler approach or fetch all and filter if necessary, but for now I'll use raw for precision or manual filter.
    
    const allItems = await prisma.inventoryItem.findMany({ where: { shopId } });
    const alerts = allItems.filter((item: any) => item.quantity <= item.minQuantity);

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("GET inventory alerts error:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
