import { prisma } from "./db";

export async function logAccess(userId: string, shopId: string, action: string, details?: any) {
  try {
    // In a real app, this might go to a dedicated AuditLog table or external service
    console.log(`[AUDIT] ${new Date().toISOString()} | User: ${userId} | Shop: ${shopId} | Action: ${action}`, details);
    
    // Optional: Save to a simple log table if needed
    /*
    await prisma.auditLog.create({
      data: { userId, shopId, action, details: JSON.stringify(details) }
    });
    */
  } catch (err) {
    console.error("Failed to log access:", err);
  }
}
