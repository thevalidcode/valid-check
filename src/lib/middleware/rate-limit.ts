import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting store
// In production, use Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return null;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    const resetTime = new Date(userLimit.resetTime);
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        resetTime: resetTime.toISOString(),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetTime.toISOString(),
          "Retry-After": Math.ceil(
            (userLimit.resetTime - now) / 1000,
          ).toString(),
        },
      },
    );
  }

  userLimit.count++;
  return null;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000); // Clean up every minute
