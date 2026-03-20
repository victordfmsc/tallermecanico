import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  // Ensure demo shop exists in DB to satisfy foreign key constraints
  try {
    await prisma.shop.upsert({
      where: { id: "demo_shop_id" },
      update: {},
      create: {
        id: "demo_shop_id",
        name: "Taller Demo",
        subscriptionStatus: "ACTIVE",
        subscriptionPlan: "ENTERPRISE",
      }
    });

    // Ensure demo user exists
    await prisma.user.upsert({
      where: { email: "demo@shopflow.app" },
      update: { shopId: "demo_shop_id" },
      create: {
        id: "demo_user_id",
        name: "Usuario Demo",
        email: "demo@shopflow.app",
        shopId: "demo_shop_id",
        role: "OWNER",
      }
    });
  } catch (error) {
    console.error("Failed to seed demo data:", error);
    // Continue anyway, maybe the DB is not ready or Tables missing
  }

  cookieStore.set("shopflow_demo_mode", "true", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
