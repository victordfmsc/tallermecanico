import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { insertCustomerSchema } from "@/types/schema";
import { getAuthContext, getShopId } from "@/lib/auth-helpers";
import { logAccess } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where: any = { shopId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET customers error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { shopId, userId } = await getAuthContext();
    const body = await req.json();
    const result = insertCustomerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: { ...result.data, shopId }
    });

    await logAccess(userId, shopId, "CREATE_CUSTOMER", { customerId: customer.id });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("POST customers error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
