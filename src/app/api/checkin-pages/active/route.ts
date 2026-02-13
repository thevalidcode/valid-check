import { NextRequest } from "next/server";
import { securityMiddleware } from "@/lib/middleware/security";
import { prisma } from "../../../../../prisma/client";
import { handleAPIError, createSuccessResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  return securityMiddleware(request, async () => {
    try {
      const activePages = await prisma.checkInPage.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          eventDate: true,
          startTime: true,
          endTime: true,
        },
        orderBy: { eventDate: 'desc' }
      });

      return createSuccessResponse(activePages, "Active pages retrieved safely");
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
