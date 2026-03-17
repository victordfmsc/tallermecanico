import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const shopId = await getShopId();
    const { step, data } = await req.json();

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
        // Here we would ideally send invitations, but for now we'll just create placeholder tech entries
        // associated with the shop
        await prisma.technician.createMany({
          data: techs.map(email => ({
            shopId,
            name: email.split('@')[0], // Placeholder name
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
      // Step 3: Hours (storing in a generic json field or metadata if we had one, 
      // but for now just advance the step)
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
    const shopId = await getShopId();
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { onboardingStep: true, name: true, address: true, phone: true }
    });
    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
