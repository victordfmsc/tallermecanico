import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/storage";
import { insertEstimateSchema } from "@/types/schema";
import { getShopId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const shopId = await getShopId();
    const estimates = await storage.getEstimates(shopId);
    return NextResponse.json(estimates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch estimates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const body = await req.json();
    const result = insertEstimateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const estimate = await storage.createEstimate(shopId, result.data);
    return NextResponse.json(estimate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create estimate" }, { status: 500 });
  }
}
