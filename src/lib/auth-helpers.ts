import { auth } from "@/auth";
import { cookies } from "next/headers";

const DEMO_SHOP_ID = "demo_shop_id";
const DEMO_USER_ID = "demo_user_id";

export async function getAuthContext() {
  const cookieStore = cookies();
  const isDemoMode = cookieStore.get("shopflow_demo_mode")?.value === "true";

  if (isDemoMode) {
    return { shopId: DEMO_SHOP_ID, userId: DEMO_USER_ID, isDemo: true };
  }

  const session = await auth();
  const shopId = (session?.user as any)?.shopId;
  const userId = (session?.user as any)?.id;
  
  if (!shopId || !userId) {
    throw new Error("Unauthorized: Missing shop or user context");
  }
  
  return { shopId, userId, isDemo: false };
}

export async function getShopId() {
  const { shopId } = await getAuthContext();
  return shopId;
}
