import { prisma } from "@/lib/db";

export async function checkSubscriptionAccess(shopId: string): Promise<boolean> {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: {
      subscriptionStatus: true,
      trialEndsAt: true,
    },
  });

  if (!shop) return false;

  // Basic access: ACTIVE status
  if (shop.subscriptionStatus === "ACTIVE") return true;

  // Access if still in FREE_TRIAL
  if (shop.subscriptionStatus === "FREE_TRIAL") {
    if (!shop.trialEndsAt) return true; // Assuming trial started but end date not yet set is okay
    return shop.trialEndsAt > new Date();
  }

  // Otherwise, blocked (PAST_DUE, CANCELLED, etc.)
  return false;
}
