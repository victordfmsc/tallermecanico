import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";
import * as Sentry from "@sentry/nextjs";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const { workOrderId } = await req.json();

    if (!workOrderId) {
      return NextResponse.json({ error: "Work order ID is required" }, { status: 400 });
    }

    // Fetch work order to get total amount and customerId
    const wo = await prisma.workOrder.findUnique({
      where: { id: workOrderId, shopId },
    });

    if (!wo) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 });
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        shopId,
        workOrderId,
        customerId: wo.customerId,
        totalAmount: wo.totalAmount,
        status: "pending",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      include: {
        customer: true,
        workOrder: true,
      }
    });

    trackEvent('factura_generada', { 
      invoiceId: invoice.id, 
      shopId,
      totalAmount: invoice.totalAmount 
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    Sentry.captureException(error);
    console.error("POST invoices error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
