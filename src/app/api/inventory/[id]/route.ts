import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/storage";
import { getShopId } from "@/lib/auth-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = await getShopId();
    const id = params.id;
    const body = await req.json();
    
    const updated = await storage.updateInventoryItem(shopId, id, body);
    if (!updated) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 });
  }
}
