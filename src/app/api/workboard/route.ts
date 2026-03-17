import { NextResponse } from "next/server";
import { storage } from "@/storage";
import { getShopId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const shopId = await getShopId();
    const workOrders = await storage.getWorkOrders(shopId);
    
    // Group work orders by status for the workboard
    const lanes = {
      pending: workOrders.filter(wo => wo.status === "pending"),
      diagnosis: workOrders.filter(wo => wo.status === "diagnosis"),
      in_progress: workOrders.filter(wo => wo.status === "in_progress"),
      ready: workOrders.filter(wo => wo.status === "ready"),
      delivered: workOrders.filter(wo => wo.status === "delivered"),
    };

    return NextResponse.json(lanes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch workboard data" }, { status: 500 });
  }
}
