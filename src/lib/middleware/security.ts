import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./rate-limit";
import { handleAPIError } from "@/lib/errors";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Will be overridden for specific origins
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours
};

export function handleCORS(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const origin = request.headers.get("origin");

    if (origin && allowedOrigins.includes(origin)) {
      const res = new NextResponse(null, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Origin": origin,
        },
      });
      return res;
    }

    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  return null;
}

export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // CORS headers for actual requests
  const origin = response.headers.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  return response;
}

export async function securityMiddleware(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  // Handle CORS preflight
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    // Ensure origin is preserved so applySecurityHeaders can set proper CORS headers
    const origin = request.headers.get("origin");
    if (origin) corsResponse.headers.set("origin", origin);
    return applySecurityHeaders(corsResponse);
  }

  // Apply rate limiting
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    const origin = request.headers.get("origin");
    if (origin) rateLimitResponse.headers.set("origin", origin);
    return applySecurityHeaders(rateLimitResponse);
  }

  // Execute the handler
  try {
    const response = await handler();
    const origin = request.headers.get("origin");
    if (origin) response.headers.set("origin", origin);
    return applySecurityHeaders(response);
  } catch (error) {
    // Log and convert to a proper API response
    console.error("Security middleware caught error:", error);
    const errorResponse = handleAPIError(error);
    const origin = request.headers.get("origin");
    if (origin) errorResponse.headers.set("origin", origin);
    return applySecurityHeaders(errorResponse);
  }
}
