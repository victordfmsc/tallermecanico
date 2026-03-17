import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/storage";
import { insertAppointmentSchema } from "@/types/schema";
import { getShopId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const shopId = await getShopId();
    const appointments = await storage.getAppointments(shopId);
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const body = await req.json();
    const result = insertAppointmentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const appt = await storage.createAppointment(shopId, result.data);
    return NextResponse.json(appt, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
