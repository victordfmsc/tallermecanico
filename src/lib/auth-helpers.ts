import { auth } from "@/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const DEMO_SHOP_ID = "demo_shop_id";
const DEMO_USER_ID = "demo_user_id";

export async function getAuthContext() {
  const cookieStore = cookies();
  const isDemoMode = cookieStore.get("shopflow_demo_mode")?.value === "true";

  if (isDemoMode) {
    return { shopId: DEMO_SHOP_ID, userId: DEMO_USER_ID, isDemo: true };
  }

  const session = await auth();
  let shopId = (session?.user as any)?.shopId;
  const userId = (session?.user as any)?.id;
  const email = session?.user?.email;
  
  // Robust Fallback: If shopId is missing in session (stale JWT), fetch from DB
  if (!shopId && email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { shopId: true }
    });
    shopId = user?.shopId;
  }

  if (!shopId || !userId) {
    throw new Error("Unauthorized: Missing shop or user context");
  }
  
  return { shopId, userId, isDemo: false };
}

export async function getShopId() {
  const { shopId } = await getAuthContext();
  return shopId;
}
