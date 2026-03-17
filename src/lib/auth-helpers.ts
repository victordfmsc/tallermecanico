import { auth } from "@/auth";

export async function getAuthContext() {
  const session = await auth();
  const shopId = (session?.user as any)?.shopId;
  const userId = (session?.user as any)?.id;
  
  if (!shopId || !userId) {
    throw new Error("Unauthorized: Missing shop or user context");
  }
  
  return { shopId, userId };
}

export async function getShopId() {
  const { shopId } = await getAuthContext();
  return shopId;
}
