// Analytics helper — client-side only (posthog-js)
// Safe to import from both server and client components — guards all window access

let posthogInstance: any = null;

function getPostHog() {
  if (typeof window === "undefined") return null;
  if (!posthogInstance) {
    // Lazy import to avoid SSR issues
    try {
      const posthog = require("posthog-js").default;
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
      if (key && !posthog.__loaded) {
        posthog.init(key, {
          api_host: host,
          capture_pageview: false,
          persistence: "memory", // avoid localStorage (blocked in some envs)
        });
      }
      posthogInstance = posthog;
    } catch {
      return null;
    }
  }
  return posthogInstance;
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  try {
    const ph = getPostHog();
    ph?.capture(eventName, properties);
  } catch {
    // Silently fail if PostHog is not configured
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  try {
    const ph = getPostHog();
    ph?.identify(userId, properties);
  } catch {
    // Silently fail
  }
};

export const resetPostHog = () => {
  if (typeof window === "undefined") return;
  try {
    const ph = getPostHog();
    ph?.reset();
  } catch {
    // Silently fail
  }
};
