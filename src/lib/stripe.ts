import Stripe from "stripe";

// Stripe is only required server-side. Warn instead of throwing to avoid
// build-time crashes when env vars are not yet configured.
const key = process.env.STRIPE_SECRET_KEY;

if (!key && process.env.NODE_ENV === "production") {
  console.error("⚠️  STRIPE_SECRET_KEY is not defined. Payments will not work.");
}

export const stripe = key
  ? new Stripe(key, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  : null;

// Plan price IDs — configure in your Stripe Dashboard and set in .env
export const STRIPE_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER || "",
  pro: process.env.STRIPE_PRICE_PRO || "",
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || "",
} as const;

// Helper to get plan name from price ID
export function getPlanFromPriceId(priceId: string): string {
  switch (priceId) {
    case STRIPE_PRICES.starter:
      return "Starter — 29€/mes";
    case STRIPE_PRICES.pro:
      return "Professional — 59€/mes";
    case STRIPE_PRICES.enterprise:
      return "Enterprise — 99€/mes";
    default:
      return "Plan desconocido";
  }
}
