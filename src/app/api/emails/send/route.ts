import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { InspectionEmail } from "@/emails/InspectionEmail";
import { EstimateEmail } from "@/emails/EstimateEmail";
import { InvoiceEmail } from "@/emails/InvoiceEmail";
import { AppointmentReminderEmail } from "@/emails/AppointmentReminderEmail";
import { ReactElement } from "react";
import { getShopId } from "@/lib/auth-helpers";

// Unified email sending route
export async function POST(req: NextRequest) {
  try {
    const shopId = await getShopId();
    const { type, payload } = await req.json();

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    let reactElement: ReactElement | null = null;
    let subject = "";

    switch (type) {
      case "welcome":
        reactElement = WelcomeEmail(payload) as ReactElement;
        subject = `¡Bienvenido a ShopFlow, ${payload.userName}!`;
        break;
      case "inspection":
        reactElement = InspectionEmail(payload) as ReactElement;
        subject = `Inspección terminada: ${payload.vehicleName}`;
        break;
      case "estimate":
        reactElement = EstimateEmail(payload) as ReactElement;
        subject = `Presupuesto disponible para su ${payload.vehicleName}`;
        break;
      case "invoice":
        reactElement = InvoiceEmail(payload) as ReactElement;
        subject = `Factura ${payload.invoiceId} generada`;
        break;
      case "reminder":
        reactElement = AppointmentReminderEmail(payload) as ReactElement;
        subject = `Recordatorio: Cita para tu ${payload.vehicleName} mañana`;
        break;
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: payload.to,
      subject,
      react: reactElement,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("POST send email error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
