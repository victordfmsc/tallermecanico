import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const shopId = await getShopId();
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { smsCredits: true }
    });
    return NextResponse.json(shop);
  } catch (error) {
    console.error("GET credits error:", error);
    return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 });
  }
}

// Mock recharge endpoint
export async function POST() {
  try {
    const shopId = await getShopId();
    const updated = await prisma.shop.update({
      where: { id: shopId },
      data: { smsCredits: { increment: 500 } }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to recharge" }, { status: 500 });
  }
}
