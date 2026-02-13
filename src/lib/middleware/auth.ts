import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export interface OrganizerUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: OrganizerUser;
}

export async function authenticateRequest(
  request: NextRequest,
): Promise<{ user: OrganizerUser } | NextResponse> {
  try {
    // Get token from cookies (e.g., 'token' cookie)
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing authentication token" },
        { status: 401 },
      );
    }

    const user = await verifyToken(token);

    if (!user || !user.id || !user.email) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Only id and email are expected
    return { user: { id: user.id, email: user.email } };
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Unauthorized", message: "Authentication failed" },
      { status: 401 },
    );
  }
}

// All logged-in users are organizers, so just check authentication
export async function requireAuth(
  request: NextRequest,
): Promise<{ user: OrganizerUser } | NextResponse> {
  return authenticateRequest(request);
}
