import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public endpoint: Fetch estimate by token
export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const estimate = await prisma.estimate.findUnique({
      where: { publicToken: params.token },
      include: {
        customer: true,
        vehicle: true,
      }
    });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    return NextResponse.json(estimate);
  } catch (error) {
    console.error("GET public estimate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Public endpoint: Update estimate status (Approve/Reject)
export async function PATCH(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const estimate = await prisma.estimate.findUnique({
      where: { publicToken: params.token }
    });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    if (["approved", "rejected"].includes(estimate.status)) {
      return NextResponse.json({ error: "Estimate already finalized" }, { status: 400 });
    }

    const updated = await prisma.estimate.update({
      where: { publicToken: params.token },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH public estimate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
