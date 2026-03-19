import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const diagnosticResults: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    },
    database: null,
  };

  try {
    // Attempt a simple query
    const userCount = await prisma.user.count();
    diagnosticResults.database = {
      status: "connected",
      userCount,
    };
  } catch (error: any) {
    diagnosticResults.database = {
      status: "error",
      message: error.message,
      stack: error.stack,
      code: error.code, // Prisma error code
    };
  }

  return NextResponse.json(diagnosticResults);
}
