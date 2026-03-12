/**
 * Simple in-memory rate limiter for server actions and API routes.
 * Tracks request counts per IP/key within a sliding window.
 * 
 * For production with multiple instances, replace with Redis (Upstash).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60_000);
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * Check rate limit for a given key (e.g., IP address, user ID).
 * Returns whether the request should be allowed.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const entry = rateLimitStore.get(key);

  // No existing entry or window expired - allow and start new window
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: now + windowMs,
      retryAfterSeconds: 0,
    };
  }

  // Within window - check count
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      success: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
      retryAfterSeconds: 0,
    };
  }

  // Rate limited
  const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
  return {
    success: false,
    remaining: 0,
    resetAt: entry.resetAt,
    retryAfterSeconds,
  };
}

// Pre-configured rate limiters for common use cases
export const RATE_LIMITS = {
  /** Order submissions: 5 per 10 minutes */
  orderSubmit: { maxRequests: 5, windowSeconds: 600 },
  /** Contact form: 3 per 5 minutes */
  contactForm: { maxRequests: 3, windowSeconds: 300 },
  /** Login attempts: 5 per 15 minutes */
  loginAttempt: { maxRequests: 5, windowSeconds: 900 },
  /** Review submissions: 3 per hour */
  reviewSubmit: { maxRequests: 3, windowSeconds: 3600 },
  /** API general: 60 per minute */
  apiGeneral: { maxRequests: 60, windowSeconds: 60 },
  /** Chat messages: 30 per minute */
  chatMessage: { maxRequests: 30, windowSeconds: 60 },
} as const;

/**
 * Helper to get a rate limit key from request headers.
 * Falls back to a default key if no IP is available.
 */
export function getRateLimitKey(prefix: string, identifier?: string): string {
  return `${prefix}:${identifier || "anonymous"}`;
}
