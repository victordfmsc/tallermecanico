import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("Resend API key missing in .env");
}

export const resend = apiKey ? new Resend(apiKey) : null;
export const EMAIL_FROM = process.env.SENDGRID_FROM_EMAIL || "info@shopflow.auto"; // Using existing var or default
