import bcrypt from "bcryptjs";
import { insertUserSchema } from "@/types/schema";
import * as Sentry from "@sentry/nextjs";
import { trackEvent } from "@/lib/analytics";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, shopName } = body;

    if (!email || !password || !shopName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const shop = await tx.shop.create({
        data: {
          name: shopName,
          subscriptionStatus: "FREE_TRIAL",
          trialEndsAt,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "OWNER",
          shopId: shop.id,
        },
      });

      return { user, shop };
    });

    trackEvent('nuevo_taller_registrado', { 
      shopName, 
      email,
      shopId: result.shop.id 
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: result.user.id },
      { status: 201 }
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
