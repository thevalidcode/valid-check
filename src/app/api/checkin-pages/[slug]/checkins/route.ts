import { NextRequest, NextResponse } from "next/server";
import { securityMiddleware } from "@/lib/middleware/security";
import { requireAuth } from "@/lib/middleware/auth";
import { prisma } from "../../../../../../prisma/client";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return securityMiddleware(request, async () => {
    try {
      const authResult = await requireAuth(request);
      if (authResult instanceof NextResponse) return authResult;

      const { slug } = await params;

      // Ensure the check-in page belongs to the organizer
      const checkInPage = await prisma.checkInPage.findUnique({
        where: { slug },
        select: { id: true, organizerId: true }
      });

      if (!checkInPage || checkInPage.organizerId !== authResult.user.id) {
        throw new APIError(404, "Check-in page not found");
      }

      // Get check-ins for this page with attendee info
      const checkIns = await prisma.checkIn.findMany({
        where: {
          checkInPageId: checkInPage.id
        },
        include: {
          attendee: true
        },
        orderBy: {
          checkedInAt: 'desc'
        }
      });

      return createSuccessResponse(checkIns, "Check-ins fetched successfully");
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
