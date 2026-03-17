import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { insertMessageSchema } from "@/types/schema";
import { getShopId } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
       return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { shopId, customerId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const body = await req.json();
    const result = insertMessageSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: { ...result.data, shopId }
    });
    
    // In a real app, we would trigger the actual SMS/Email sending service here.
    
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("POST messages error:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
