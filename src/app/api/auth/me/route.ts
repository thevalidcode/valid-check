import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { createSuccessResponse, handleAPIError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    return createSuccessResponse(authResult.user);
  } catch (error) {
    return handleAPIError(error);
  }
}
