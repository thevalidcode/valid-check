import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { createSuccessResponse, handleAPIError, APIError } from "@/lib/errors";
import { prisma } from "../../../../../prisma/client";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  picture: z.string().url().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.organizer.update({
      where: { id: authResult.user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
      },
    });

    return createSuccessResponse(updatedUser, "Profile updated successfully");
  } catch (error) {
    return handleAPIError(error);
  }
}
