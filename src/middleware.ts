import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth(async (req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/login", "/register", "/landing"].includes(nextUrl.pathname) || 
                       nextUrl.pathname.startsWith("/public/");

  // Rate Limiting for Auth
  if (isApiAuthRoute && !nextUrl.pathname.endsWith("/session")) {
    const ip = req.ip ?? "127.0.0.1";
    try {
      const { authRateLimiter } = await import("@/lib/ratelimit");
      const { success, limit, reset, remaining } = await authRateLimiter.limit(ip);
      
      if (!success) {
        return new NextResponse("Demasiados intentos de acceso. Bloqueo temporal (15 min).", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    } catch (e) {
      // Fallback if Upstash is not configured or fails
      console.error("Rate limit error:", e);
    }
    return NextResponse.next();
  }

  if (isApiAuthRoute) return NextResponse.next();

  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Check for shopId if authenticated
  const hasShop = !!req.auth?.user?.shopId;
  const isSuperAdmin = !!req.auth?.user?.isSuperAdmin;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isOnboarding = nextUrl.pathname === "/onboarding";
  const isBilling = nextUrl.pathname === "/billing" || nextUrl.pathname.startsWith("/api/billing");

  // Protect Admin routes
  if (isAdminRoute) {
    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Super admins bypass all other locks to allow platform management
  if (isSuperAdmin) return NextResponse.next();

  if (!hasShop && !isOnboarding && !isBilling) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  // Subscription Enforcement
  if (hasShop && !isOnboarding && !isBilling && nextUrl.pathname !== "/trial-expired") {
    const status = req.auth?.user?.subscriptionStatus;
    const trialEndsAt = req.auth?.user?.trialEndsAt;
    
    const isTrial = status === "FREE_TRIAL";
    const isTrialExpired = isTrial && trialEndsAt && new Date(trialEndsAt) <= new Date();
    const isActive = status === "ACTIVE";

    if (isTrialExpired) {
      return NextResponse.redirect(new URL("/trial-expired", nextUrl));
    }

    if (!isActive && !isTrial) {
      return NextResponse.redirect(new URL("/billing", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
