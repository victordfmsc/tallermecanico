import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";
import * as Sentry from "@sentry/nextjs";
import { trackEvent } from "@/lib/analytics";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shopId = await getShopId();
    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id, shopId },
    });

    if (!inspection) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 });
    }

    return NextResponse.json(inspection);
  } catch (error) {
    console.error("GET inspection error:", error);
    return NextResponse.json({ error: "Failed to fetch inspection" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shopId = await getShopId();
    const { sections, overallStatus } = await req.json();

    // Fetch current inspection to ensure it belongs to the shop
    const currentInspection = await prisma.inspection.findUnique({
      where: { id: params.id, shopId },
    });

    if (!currentInspection) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 });
    }

    // Calculate progress automatically
    // The request states: progress is the percentage of sections with status != null
    const sectionsArray = (sections || currentInspection.sections) as any[];
    const totalSections = sectionsArray.length;
    const completedSections = sectionsArray.filter(s => s.status !== null).length;
    const progress = Math.round((completedSections / totalSections) * 100);

    const updatedInspection = await prisma.inspection.update({
      where: { id: params.id },
      data: {
        sections: sections || currentInspection.sections,
        overallStatus: overallStatus || currentInspection.overallStatus,
        progress,
        updatedAt: new Date(),
      },
    });

    if (progress === 100 && currentInspection.progress !== 100) {
      trackEvent('inspeccion_completada', { 
        inspectionId: params.id, 
        shopId 
      });
    }

    return NextResponse.json(updatedInspection);
  } catch (error) {
    Sentry.captureException(error);
    console.error("PATCH inspection error:", error);
    return NextResponse.json({ error: "Failed to update inspection" }, { status: 500 });
  }
}
