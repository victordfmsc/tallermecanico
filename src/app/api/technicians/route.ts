import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/storage";
import { insertTechnicianSchema } from "@/types/schema";
import { getShopId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const shopId = await getShopId();
    const technicians = await storage.getTechnicians(shopId);
    return NextResponse.json(technicians);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch technicians" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const body = await req.json();
    const result = insertTechnicianSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const tech = await storage.createTechnician(shopId, result.data);
    return NextResponse.json(tech, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create technician" }, { status: 500 });
  }
}
