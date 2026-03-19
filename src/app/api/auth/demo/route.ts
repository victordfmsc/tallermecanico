import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  
  cookieStore.set("shopflow_demo_mode", "true", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
