// Rate limiting via Upstash Redis
// If Upstash is not configured, exports a no-op limiter so the app still builds and runs.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// No-op fallback — always allows when Upstash is not configured
const noopLimiter = {
  limit: async (_identifier: string) => ({
    success: true as const,
    limit: 999,
    reset: 0,
    remaining: 999,
  }),
};

function createRateLimiter() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return noopLimiter;
  }

  try {
    const { Ratelimit } = require("@upstash/ratelimit");
    const { Redis } = require("@upstash/redis");

    return new Ratelimit({
      redis: new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN }),
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "@shopflow/ratelimit/auth",
    });
  } catch {
    console.warn("[ShopFlow] Upstash rate limiter unavailable — using no-op fallback");
    return noopLimiter;
  }
}

export const authRateLimiter = createRateLimiter();
