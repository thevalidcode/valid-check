import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { securityMiddleware } from "@/lib/middleware/security";
import { createOrganizerSchema } from "@/lib/validation/schemas";
import { hashPassword, signToken } from "@/lib/auth/jwt";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const body = await request.json();
      const validatedData = createOrganizerSchema.parse(body);

      // Check if email already exists
      const existingOrganizer = await prisma.organizer.findUnique({
        where: { email: validatedData.email },
      });

      if (existingOrganizer) {
        throw new APIError(409, "Email already registered");
      }

      // Hash password
      const passwordHash = await hashPassword(validatedData.password);

      // Create organizer
      const organizer = await prisma.organizer.create({
        data: {
          email: validatedData.email,
          passwordHash,
          // role removed, all are organizers
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = await signToken({
        id: organizer.id,
        email: organizer.email,
      });

      // Log the registration
      await prisma.auditLog.create({
        data: {
          organizerId: organizer.id,
          action: "REGISTER",
          metadata: {
            ipAddress: request.headers.get("x-forwarded-for"),
            userAgent: request.headers.get("user-agent"),
          },
        },
      });
      const response = createSuccessResponse(
        {
          token,
          user: organizer,
        },
        "Registration successful",
      );

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
