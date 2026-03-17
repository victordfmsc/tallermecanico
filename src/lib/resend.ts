// Resend — transactional email client
// If RESEND_API_KEY is not configured, the client is null and email functions no-op.

let resendClient: any = null;

const apiKey = process.env.RESEND_API_KEY;

if (apiKey) {
  try {
    const { Resend } = require("resend");
    resendClient = new Resend(apiKey);
  } catch {
    console.warn("[ShopFlow] resend package not available");
  }
} else {
  console.warn("[ShopFlow] RESEND_API_KEY not set — emails will not be sent");
}

export const resend = resendClient;
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "noreply@shopflow.app";

/**
 * Send an email safely — no-ops if Resend is not configured.
 */
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}): Promise<{ id?: string; error?: string }> {
  if (!resendClient) {
    console.warn(`[ShopFlow] Email skipped (Resend not configured): ${subject} → ${to}`);
    return { error: "Email service not configured" };
  }

  try {
    const result = await resendClient.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      react,
    });
    return { id: result.id };
  } catch (err: any) {
    console.error("[ShopFlow] Failed to send email:", err);
    return { error: err.message };
  }
}
