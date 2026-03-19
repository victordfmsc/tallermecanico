import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const { step, data } = await req.json();

    if (step === 0) {
      // Step 0: Create new Shop (for Google users or missing shop)
      const session = await auth();
      const userId = (session?.user as any)?.id;

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const shop = await prisma.shop.create({
        data: {
          name: data.name || "Nuevo Taller",
          subscriptionStatus: "FREE_TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          onboardingStep: 1,
          users: {
            connect: { id: userId }
          }
        }
      });
      return NextResponse.json({ success: true, shopId: shop.id });
    }

    // For other steps, we need shopId. If not in session, try to find it in DB.
    const session = await auth();
    let shopId = (session?.user as any)?.shopId;
    const userId = (session?.user as any)?.id;

    if (!shopId && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { shopId: true }
      });
      shopId = user?.shopId;
    }

    if (!shopId) {
      return NextResponse.json({ error: "No shop associated" }, { status: 400 });
    }

    if (step === 1) {
      // Step 1: Shop Data
      await prisma.shop.update({
        where: { id: shopId },
        data: {
          address: data.address,
          phone: data.phone,
          logo: data.logo,
          onboardingStep: 2,
        },
      });
    } else if (step === 2) {
      // Step 2: Invite Technicians
      const techs = data.technicians as string[];
      if (techs && techs.length > 0) {
        await prisma.technician.createMany({
          data: techs.map(email => ({
            shopId,
            name: email.split('@')[0],
            specialty: "General",
            status: "active",
          }))
        });
      }
      await prisma.shop.update({
        where: { id: shopId },
        data: { onboardingStep: 3 },
      });
    } else if (step === 3) {
      await prisma.shop.update({
        where: { id: shopId },
        data: { onboardingStep: 4 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    const shopId = (session?.user as any)?.shopId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!shopId) {
      // User is authenticated but has no shop associated yet (Step 0)
      return NextResponse.json({ onboardingStep: 0 });
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { onboardingStep: true, name: true, address: true, phone: true }
    });
    
    if (!shop) {
      return NextResponse.json({ onboardingStep: 0 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("GET Onboarding error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
