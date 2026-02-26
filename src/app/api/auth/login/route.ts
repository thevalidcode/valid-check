import { NextRequest } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { loginSchema } from "@/lib/validation/schemas";
import { verifyPassword, signToken } from "@/lib/auth/jwt";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const body = await request.json();
      const validatedData = loginSchema.parse(body);

      // Find organizer by email
      const organizer = await prisma.organizer.findUnique({
        where: { email: validatedData.email },
      });

      if (!organizer || !organizer.passwordHash) {
        throw new APIError(401, "Invalid credentials");
      }

      // Verify password
      const isValidPassword = await verifyPassword(
        validatedData.password,
        organizer.passwordHash,
      );

      if (!isValidPassword) {
        throw new APIError(401, "Invalid credentials");
      }

      // Generate JWT token
      const token = await signToken({
        id: organizer.id,
        email: organizer.email,
      });

      // Set token as httpOnly cookie
      const response = createSuccessResponse({ message: "Login successful" });
      response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
