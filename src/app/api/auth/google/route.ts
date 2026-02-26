import { NextRequest, NextResponse } from "next/server";
import { securityMiddleware } from "@/lib/middleware/security";
import { handleAPIError } from "@/lib/errors";
import { env } from "@/config/env";

export async function GET(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const searchParams = request.nextUrl.searchParams;
      const type = searchParams.get("type") || "organizer";
      const slug = searchParams.get("slug") || "";

      // Encode state to pass through OAuth flow
      const state = encodeURIComponent(JSON.stringify({ type, slug }));

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${env.GOOGLE_CLIENT_ID}` +
        `&response_type=code` +
        `&scope=openid%20email%20profile` +
        `&state=${state}` +
        `&redirect_uri=${encodeURIComponent(
          `${env.FRONTEND_URL}/api/auth/google/callback`,
        )}`;

      return NextResponse.redirect(authUrl);
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
