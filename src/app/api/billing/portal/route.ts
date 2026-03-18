import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!stripe) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
    }

    const shopId = (session.user as any).shopId;
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop?.stripeCustomerId) {
      return NextResponse.json({ error: "Stripe customer not found" }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: shop.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
