import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, getShopId } from "@/lib/auth-helpers";
import { logAccess } from "@/lib/logger";

export async function GET() {
  try {
    const shopId = await getShopId();
    const campaigns = await prisma.marketingCampaign.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("GET campaigns error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    const body = await req.json();
    
    // Direct creation via Prisma for flexibility with new fields
    const campaign = await prisma.marketingCampaign.create({
      data: { ...body, shopId }
    });

    await logAccess(userId, shopId, "CREATE_MARKETING_CAMPAIGN", { campaignId: campaign.id });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("POST campaigns error:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
