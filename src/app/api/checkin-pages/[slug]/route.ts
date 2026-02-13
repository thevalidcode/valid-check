import { NextRequest } from "next/server";
import { securityMiddleware } from "@/lib/middleware/security";
import { prisma } from "../../../../../prisma/client";
import { handleAPIError, createSuccessResponse, APIError } from "@/lib/errors";

// GET /api/checkin-pages/[slug] - Public fetch of a check-in page by slug
export async function GET(request: NextRequest, context: any) {
  return securityMiddleware(request, async () => {
    try {
      const slug =
        context?.params?.slug || request.nextUrl?.pathname?.split("/").pop();

      if (!slug) {
        throw new APIError(400, "Missing slug");
      }

      const checkInPage = await prisma.checkInPage.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          eventDate: true,
          startTime: true,
          endTime: true,
          capacity: true,
          isActive: true,
          isRecurring: true,
          recurrencePattern: true,
          recurrenceEnd: true,
          collectPhone: true,
          collectDOB: true,
          allowSelfRegistration: true,
          requireLocation: true,
          latitude: true,
          longitude: true,
          radius: true,
          successMessage: true,
        },
      });

      if (!checkInPage) {
        throw new APIError(404, "Check-in page not found");
      }

      return createSuccessResponse(checkInPage, "Check-in page fetched");
    } catch (error) {
      return handleAPIError(error);
    }
  });
}
