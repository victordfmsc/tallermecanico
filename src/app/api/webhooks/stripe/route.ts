import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { trackEvent } from "@/lib/analytics";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  if (!stripe) {
    return new NextResponse("Stripe configuration missing", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const shopId = session.metadata?.shopId;

        if (shopId) {
          await prisma.shop.update({
            where: { id: shopId },
            data: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: "ACTIVE",
            },
          });
          trackEvent('suscripcion_activada', { 
            shopId, 
            customer: session.customer as string 
          });
          console.log(`[Webhook] Shop ${shopId} upgraded to ACTIVE via checkout.`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await prisma.shop.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: "ACTIVE" },
          });
          console.log(`[Webhook] Subscription ${subscriptionId} payment succeeded.`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const shop = await prisma.shop.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
            include: { users: { where: { role: "OWNER" } } }
          });

          if (shop) {
            await prisma.shop.update({
              where: { id: shop.id },
              data: { subscriptionStatus: "PAST_DUE" },
            });

            // Handle notification (placeholder)
            console.warn(`[Webhook] PAYMENT FAILED for shop ${shop.name}. Notification would be sent to ${shop.users[0]?.email}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        await prisma.shop.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { subscriptionStatus: "CANCELLED" },
        });
        trackEvent('suscripcion_cancelada', { 
          subscriptionId 
        });
        console.log(`[Webhook] Subscription ${subscriptionId} was deleted/cancelled.`);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
