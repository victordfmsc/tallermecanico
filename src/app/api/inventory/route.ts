import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, getShopId } from "@/lib/auth-helpers";
import { insertInventoryItemSchema } from "@/types/schema";
import { logAccess } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = { shopId };
    
    if (category && category !== "all") {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { name: "asc" },
    });
    
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    const body = await req.json();
    
    const result = insertInventoryItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        ...result.data,
        shopId,
      },
    });

    await logAccess(userId, shopId, "CREATE_INVENTORY_ITEM", { itemId: item.id });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST inventory error:", error);
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}
