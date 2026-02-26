import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { signToken } from "@/lib/auth/jwt";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const { sessionCode } = await request.json();

      if (!sessionCode) {
        throw new APIError(400,"Session code is required");
      }

      const session = await prisma.sessionCode.findUnique({
        where: { code: sessionCode },
      });

      if (!session || session.used || session.expiresAt < new Date()) {
        throw new APIError(400,"Invalid or expired session code");
      }

      // Mark session as used
      await prisma.sessionCode.update({
        where: { code: sessionCode },
        data: { used: true },
      });

      const user = await prisma.organizer.findUnique({
        where: { email: session.email },
      });

      if (!user) {
        throw new APIError(404,"User not found");
      }

      const token = await signToken({
        id: user.id,
        email: user.email,
      });

      const response = createSuccessResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
      });

      // Set the authentication cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
