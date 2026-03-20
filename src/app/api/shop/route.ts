import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId, getAuthContext } from "@/lib/auth-helpers";
import { logAccess } from "@/lib/logger";

export async function GET() {
  try {
    const shopId = await getShopId();
    if (!shopId) return NextResponse.json({ error: "No shop ID found" }, { status: 400 });

    const shop = await prisma.shop.findUnique({
      where: { id: shopId }
    });

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shop settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    if (!shopId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    // Whitelist fields to update
    const { name, address, phone, nif, logo } = body;

    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(nif !== undefined && { nif }),
        ...(logo !== undefined && { logo }),
      }
    });

    await logAccess(userId, shopId, "UPDATE_SHOP_SETTINGS", { fields: Object.keys(body) });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error("PATCH shop error:", error);
    return NextResponse.json({ error: "Failed to update shop settings" }, { status: 500 });
  }
}
