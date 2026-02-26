import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { createSuccessResponse, handleAPIError, APIError } from "@/lib/errors";
import { prisma } from "../../../../../prisma/client";
import { verifyPassword, hashPassword } from "@/lib/auth/jwt";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    const user = await prisma.organizer.findUnique({
      where: { id: authResult.user.id },
    });

    if (!user) {
      throw new APIError(404, "User not found");
    }

    // If user already has a password, they must provide the correct current password
    if (user.passwordHash) {
      if (!currentPassword) {
        throw new APIError(400, "Current password is required to change password");
      }
      const isCorrect = await verifyPassword(currentPassword, user.passwordHash);
      if (!isCorrect) {
        throw new APIError(401, "Current password is incorrect");
      }
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.organizer.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    return createSuccessResponse(null, "Password changed successfully");
  } catch (error) {
    return handleAPIError(error);
  }
}
