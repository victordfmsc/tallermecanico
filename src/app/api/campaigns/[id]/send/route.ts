import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getShopId } from "@/lib/auth-helpers";
import { twilioClient, TWILIO_FROM } from "@/lib/twilio";
import { resend, EMAIL_FROM } from "@/lib/resend";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shopId = await getShopId();
    const campaign = await prisma.marketingCampaign.findUnique({
      where: { id: params.id, shopId },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status === "completed") {
      return NextResponse.json({ error: "Campaign already sent" }, { status: 400 });
    }

    const segment = campaign.segment as any;
    let customers: any[] = [];

    // Segmentation Logic
    if (segment?.criteria === "all") {
      customers = await prisma.customer.findMany({ where: { shopId } });
    } else if (segment?.criteria === "last_visit") {
      const days = parseInt(segment.value);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      customers = await prisma.customer.findMany({
        where: {
          shopId,
          workOrders: {
            some: {
              createdAt: { lte: cutoffDate }
            }
          }
        }
      });
    } else if (segment?.criteria === "service_type") {
      customers = await prisma.customer.findMany({
        where: {
          shopId,
          workOrders: {
            some: {
              services: {
                array_contains: segment.value // Note: This depends on DB support for Json array search, using string match as fallback if needed
              }
            }
          }
        }
      });
    }

    if (customers.length === 0) {
      return NextResponse.json({ error: "No customers found for this segment" }, { status: 400 });
    }

    // Check SMS credits if type is SMS
    if (campaign.type === "sms") {
      const shop = await prisma.shop.findUnique({ where: { id: shopId } });
      if ((shop?.smsCredits || 0) < customers.length) {
        return NextResponse.json({ error: "Insufficient SMS credits" }, { status: 400 });
      }
    }

    // Mark as active
    await prisma.marketingCampaign.update({
      where: { id: campaign.id },
      data: { status: "active" },
    });

    // Fire and forget (or handle in background if platform supports)
    // For this implementation, we'll do it in the request but it's better as a background job
    (async () => {
      let sentCount = 0;
      
      if (campaign.type === "sms" && twilioClient) {
        for (const customer of customers) {
          try {
            const message = campaign.content
              ?.replace("{{nombre}}", customer.name)
              .replace("{{telefono}}", customer.phone);
            
            await twilioClient.messages.create({
              body: message || "",
              from: TWILIO_FROM,
              to: customer.phone,
            });
            
            sentCount++;
            await prisma.marketingCampaign.update({
              where: { id: campaign.id },
              data: { sent: sentCount },
            });
            
            // Deduct credit
            await prisma.shop.update({
              where: { id: shopId },
              data: { smsCredits: { decrement: 1 } },
            });

            // Rate limit: 1 sec
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (err) {
            console.error(`Failed to send SMS to ${customer.phone}:`, err);
          }
        }
      } else if (campaign.type === "email" && resend) {
        // Resend batch sending
        const emails = customers.map(customer => ({
          from: EMAIL_FROM,
          to: customer.email,
          subject: campaign.name,
          html: campaign.content?.replace("{{nombre}}", customer.name) || "",
        }));

        // Batch send in chunks of 50 (Resend limit)
        for (let i = 0; i < emails.length; i += 50) {
          const chunk = emails.slice(i, i + 50);
          try {
            const { data, error } = await resend.batches.send(chunk);
            if (error) throw error;
            
            sentCount += chunk.length;
            await prisma.marketingCampaign.update({
              where: { id: campaign.id },
              data: { sent: sentCount },
            });
          } catch (err) {
            console.error("Failed to send email batch:", err);
          }
        }
      }

      // Mark as completed
      await prisma.marketingCampaign.update({
        where: { id: campaign.id },
        data: { status: "completed" },
      });
    })();

    return NextResponse.json({ message: "Campaign sending started" });
  } catch (error) {
    console.error("POST campaign send error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
